const prisma = require('../config/db');

// Send a message (USER to HEAD or HEAD to USER)
const sendMessage = async (req, res) => {
  try {
    const { content, receiverId, projectId } = req.body;
    const senderId = req.user.userId;

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required',
      });
    }

    if (!receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Receiver ID is required',
      });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
    });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found',
      });
    }

    // Verify sender and receiver have appropriate roles (USER and HEAD)
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
    });

    if (!sender) {
      return res.status(404).json({
        success: false,
        message: 'Sender not found',
      });
    }

    // Only allow messages between USER and HEAD
    const validRoles = ['USER', 'HEAD'];
    if (!validRoles.includes(sender.role) || !validRoles.includes(receiver.role)) {
      return res.status(400).json({
        success: false,
        message: 'Messages can only be sent between clients and admins',
      });
    }

    // Verify project exists if projectId is provided
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });

      if (!project) {
        return res.status(404).json({
          success: false,
          message: 'Project not found',
        });
      }
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content: content.trim(),
        senderId,
        receiverId,
        projectId: projectId || null,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      data: { message },
    });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send message',
    });
  }
};

// Get messages between current user and another user
const getMessages = async (req, res) => {
  try {
    const { otherUserId } = req.query;
    const currentUserId = req.user.userId;

    if (!otherUserId) {
      return res.status(400).json({
        success: false,
        message: 'Other user ID is required',
      });
    }

    // Get all messages between current user and other user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: currentUserId,
            receiverId: otherUserId,
          },
          {
            senderId: otherUserId,
            receiverId: currentUserId,
          },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Mark messages as read if current user is the receiver
    await prisma.message.updateMany({
      where: {
        receiverId: currentUserId,
        senderId: otherUserId,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return res.status(200).json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
    });
  }
};

// Get conversation list (for USER: get HEAD, for HEAD: get all USERs they've messaged)
const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const currentUser = await prisma.user.findUnique({
      where: { id: currentUserId },
    });

    let conversations = [];

    if (currentUser.role === 'USER') {
      // For USER, get the HEAD (admin)
      const head = await prisma.user.findFirst({
        where: { role: 'HEAD' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      if (head) {
        // Get last message between USER and HEAD
        const lastMessage = await prisma.message.findFirst({
          where: {
            OR: [
              { senderId: currentUserId, receiverId: head.id },
              { senderId: head.id, receiverId: currentUserId },
            ],
          },
          orderBy: { createdAt: 'desc' },
        });

        // Get unread count
        const unreadCount = await prisma.message.count({
          where: {
            senderId: head.id,
            receiverId: currentUserId,
            isRead: false,
          },
        });

        conversations = [{
          user: head,
          lastMessage,
          unreadCount,
        }];
      }
    } else if (currentUser.role === 'HEAD') {
      // For HEAD, get all USERs they've messaged with
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: currentUserId },
            { receiverId: currentUserId },
          ],
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          receiver: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Get unique users
      const userIds = new Set();
      messages.forEach((msg) => {
        if (msg.sender.role === 'USER' && msg.sender.id !== currentUserId) {
          userIds.add(msg.sender.id);
        }
        if (msg.receiver.role === 'USER' && msg.receiver.id !== currentUserId) {
          userIds.add(msg.receiver.id);
        }
      });

      // Get conversation details for each user
      conversations = await Promise.all(
        Array.from(userIds).map(async (userId) => {
          const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          });

          const lastMessage = await prisma.message.findFirst({
            where: {
              OR: [
                { senderId: currentUserId, receiverId: userId },
                { senderId: userId, receiverId: currentUserId },
              ],
            },
            orderBy: { createdAt: 'desc' },
          });

          const unreadCount = await prisma.message.count({
            where: {
              senderId: userId,
              receiverId: currentUserId,
              isRead: false,
            },
          });

          return {
            user,
            lastMessage,
            unreadCount,
          };
        })
      );
    }

    return res.status(200).json({
      success: true,
      data: { conversations },
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations',
    });
  }
};

// Get admin user (for USER role)
const getAdminUser = async (req, res) => {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: 'HEAD' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: { admin },
    });
  } catch (error) {
    console.error('Get admin user error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin user',
    });
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations,
  getAdminUser,
};

