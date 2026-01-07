const prisma = require('../config/db');

// Add payment
const addPayment = async (req, res) => {
  try {
    const { projectId, amount, type } = req.body;

    // Validation
    if (!projectId || !amount || !type) {
      return res.status(400).json({
        success: false,
        message: 'Project ID, amount, and payment type are required',
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0',
      });
    }

    if (!['RECEIVED', 'PENDING'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Payment type must be RECEIVED or PENDING',
      });
    }

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        projectId,
        amount,
        type,
        date: new Date(),
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Update project received amount if payment is RECEIVED
    if (type === 'RECEIVED') {
      await prisma.project.update({
        where: { id: projectId },
        data: {
          receivedAmount: {
            increment: amount,
          },
        },
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: { payment },
    });
  } catch (error) {
    console.error('Add payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to record payment',
    });
  }
};

// Get all payments for a project
const getProjectPayments = async (req, res) => {
  try {
    const { projectId } = req.params;

    const payments = await prisma.payment.findMany({
      where: { projectId },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            dealAmount: true,
            receivedAmount: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate totals
    const totalReceived = payments
      .filter((p) => p.type === 'RECEIVED')
      .reduce((sum, p) => sum + p.amount, 0);
    const totalPending = payments
      .filter((p) => p.type === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    return res.status(200).json({
      success: true,
      data: {
        payments,
        summary: {
          totalReceived,
          totalPending,
          totalPayments: payments.length,
        },
      },
    });
  } catch (error) {
    console.error('Get project payments error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
    });
  }
};

// Get payment summary for all projects
const getPaymentSummary = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        payments: true,
      },
    });

    const summary = projects.map((project) => {
      const receivedPayments = project.payments.filter(
        (p) => p.type === 'RECEIVED'
      );
      const pendingPayments = project.payments.filter(
        (p) => p.type === 'PENDING'
      );

      const totalReceived = receivedPayments.reduce(
        (sum, p) => sum + p.amount,
        0
      );
      const totalPending = pendingPayments.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      return {
        projectId: project.id,
        projectName: project.name,
        dealAmount: project.dealAmount,
        receivedAmount: project.receivedAmount,
        pendingAmount: project.dealAmount - project.receivedAmount,
        totalReceived,
        totalPending,
        paymentCount: project.payments.length,
      };
    });

    // Overall totals
    const overallTotals = {
      totalDealAmount: summary.reduce((sum, s) => sum + s.dealAmount, 0),
      totalReceivedAmount: summary.reduce((sum, s) => sum + s.receivedAmount, 0),
      totalPendingAmount: summary.reduce(
        (sum, s) => sum + s.pendingAmount,
        0
      ),
    };

    return res.status(200).json({
      success: true,
      data: {
        projects: summary,
        overallTotals,
      },
    });
  } catch (error) {
    console.error('Get payment summary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch payment summary',
    });
  }
};

// Update payment
const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, type } = req.body;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    const updateData = {};
    if (amount !== undefined) {
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than 0',
        });
      }
      updateData.amount = amount;
    }

    if (type !== undefined) {
      if (!['RECEIVED', 'PENDING'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Payment type must be RECEIVED or PENDING',
        });
      }
      updateData.type = type;
    }

    // If changing from PENDING to RECEIVED, update project receivedAmount
    if (payment.type === 'PENDING' && type === 'RECEIVED') {
      const amountToAdd = updateData.amount || payment.amount;
      await prisma.project.update({
        where: { id: payment.projectId },
        data: {
          receivedAmount: {
            increment: amountToAdd,
          },
        },
      });
    }

    // If changing from RECEIVED to PENDING, subtract from receivedAmount
    if (payment.type === 'RECEIVED' && type === 'PENDING') {
      const amountToSubtract = updateData.amount || payment.amount;
      await prisma.project.update({
        where: { id: payment.projectId },
        data: {
          receivedAmount: {
            decrement: amountToSubtract,
          },
        },
      });
    }

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Payment updated successfully',
      data: { payment: updatedPayment },
    });
  } catch (error) {
    console.error('Update payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update payment',
    });
  }
};

// Delete payment
const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      });
    }

    // If payment was RECEIVED, subtract from project receivedAmount
    if (payment.type === 'RECEIVED') {
      await prisma.project.update({
        where: { id: payment.projectId },
        data: {
          receivedAmount: {
            decrement: payment.amount,
          },
        },
      });
    }

    await prisma.payment.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: 'Payment deleted successfully',
    });
  } catch (error) {
    console.error('Delete payment error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete payment',
    });
  }
};

module.exports = {
  addPayment,
  getProjectPayments,
  getPaymentSummary,
  updatePayment,
  deletePayment,
};



