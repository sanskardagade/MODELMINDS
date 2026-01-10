# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected routes require authentication via JWT token stored in HTTP-only cookies.

## Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": { ... }
}
```

---

## Authentication Routes

### POST /api/auth/login
Login user and receive JWT token in HTTP-only cookie.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "name": "User Name",
      "email": "user@example.com",
      "role": "HEAD|EMPLOYEE|USER"
    }
  }
}
```

### POST /api/auth/logout
Logout user (clears cookie).

### GET /api/auth/me
Get current authenticated user (Protected).

---

## Project Routes (HEAD Only)

### POST /api/projects
Create a new project.

**Request:**
```json
{
  "name": "Project Name",
  "description": "Project description",
  "dealAmount": 100000,
  "userId": "optional-user-uuid"
}
```

### GET /api/projects
Get all projects.

### GET /api/projects/:id
Get project by ID.

### PUT /api/projects/:id/assign-user
Assign project to a USER.

**Request:**
```json
{
  "userId": "user-uuid"
}
```

### PUT /api/projects/:id/progress
Update project progress percentage.

**Request:**
```json
{
  "progressPercent": 75
}
```

### PUT /api/projects/:id/amounts
Update deal amount and/or received amount.

**Request:**
```json
{
  "dealAmount": 100000,
  "receivedAmount": 50000
}
```

### DELETE /api/projects/:id
Delete a project.

---

## Project Image Routes

### POST /api/project-images/:projectId/upload (HEAD Only)
Upload 6-10 images for a project.

**Request:** Multipart form data with `images` field (array of files).

### GET /api/project-images/:projectId
Get all images for a project (All authenticated users).

### DELETE /api/project-images/:id (HEAD Only)
Delete a project image.

---

## Employee Routes (EMPLOYEE Only)

### GET /api/employee/projects
Get all projects assigned to the employee.

### GET /api/employee/work-logs
Get all work logs by the employee.

### GET /api/employee/work-logs/:projectId
Get work logs for a specific project.

### POST /api/employee/work-logs
Add a new work log.

**Request:**
```json
{
  "projectId": "project-uuid",
  "workDone": "Completed task description",
  "percentage": 25
}
```

### PUT /api/employee/work-logs/:id
Update a work log.

---

## User Routes (USER Only)

### GET /api/user/projects
Get all projects assigned to the user.

### GET /api/user/projects/:id
Get detailed project information.

### GET /api/user/projects/:id/progress
Get project progress with work logs.

### GET /api/user/projects/:id/images
Get all images for a project.

### GET /api/user/projects/:id/payments
Get payment status and history.

---

## Payment Routes (HEAD Only)

### POST /api/payments
Add a payment record.

**Request:**
```json
{
  "projectId": "project-uuid",
  "amount": 10000,
  "type": "RECEIVED|PENDING"
}
```

### GET /api/payments/summary
Get payment summary for all projects.

### GET /api/payments/:projectId
Get all payments for a project.

### PUT /api/payments/:id
Update a payment record.

### DELETE /api/payments/:id
Delete a payment record.

---

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Role-Based Access

- **HEAD**: Full access to all project management, payments, and image uploads
- **EMPLOYEE**: Can view assigned projects and manage work logs
- **USER**: Can view assigned projects, progress, images, and payment status




