# Backend Integration Guide

## Overview

This civic grievance system frontend is designed to work with a RESTful backend API. The current implementation includes a mock API service for demonstration purposes, but can be easily connected to your actual backend.

## Quick Demo

The system currently runs with **mock data** for testing. You can:

1. **Login with demo accounts:**
   - **Citizen:** `citizen@demo.com` / `password123`
   - **Admin:** `admin@demo.com` / `password123`
   - **Department:** `dept@demo.com` / `password123`

2. **Test all features:**
   - Submit new grievances
   - View grievance listings
   - Track status updates
   - View analytics (admin only)

## Switching to Real Backend

### Environment Configuration

Create a `.env` file in your project root:

```env
# Set to your actual backend URL
REACT_APP_API_URL=http://localhost:3001/api

# Set to false to use real API instead of mock
REACT_APP_USE_MOCK_API=false
```

### Required Backend API Endpoints

Your backend should implement these REST endpoints:

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

#### Grievances
- `GET /api/grievances` - List grievances (with query parameters)
- `GET /api/grievances/:id` - Get specific grievance
- `POST /api/grievances` - Create new grievance
- `PUT /api/grievances/:id/status` - Update grievance status
- `PUT /api/grievances/:id/assign` - Assign grievance to officer
- `POST /api/grievances/:id/comments` - Add comment to grievance

#### Departments
- `GET /api/departments` - List all departments

#### File Upload
- `POST /api/upload` - Upload file attachments

#### Analytics (Admin only)
- `GET /api/analytics` - Get system analytics

### Data Models

#### User Model
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'citizen' | 'admin' | 'department';
  department?: string; // for department users
}
```

#### Grievance Model
```typescript
interface Grievance {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'resolved' | 'rejected';
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  citizenPhone: string;
  attachments?: string[];
  location?: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  assignedTo?: string;
  comments: GrievanceComment[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}
```

#### Comment Model
```typescript
interface GrievanceComment {
  id: string;
  grievanceId: string;
  userId: string;
  userName: string;
  userRole: string;
  message: string;
  isInternal: boolean;
  createdAt: string;
}
```

### API Response Format

All API endpoints should return responses in this format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
```

### Authentication

The frontend expects JWT tokens for authentication:

1. Login endpoint returns: `{ user: User, token: string }`
2. Token is stored in localStorage as 'authToken'
3. All subsequent requests include: `Authorization: Bearer <token>`

### Query Parameters for Grievances

The `GET /api/grievances` endpoint should support these query parameters:

- `status` - Filter by status
- `category` - Filter by category  
- `department` - Filter by department
- `citizenId` - Filter by citizen (for user's own grievances)
- `page` - Page number for pagination
- `limit` - Items per page

Response format:
```typescript
{
  success: true,
  data: {
    grievances: Grievance[],
    total: number,
    page: number,
    totalPages: number
  }
}
```

## Recommended Backend Technologies

### Node.js/Express Stack
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **Bcrypt** - Password hashing

### Example Backend Structure
```
backend/
├── models/
│   ├── User.js
│   ├── Grievance.js
│   └── Department.js
├── routes/
│   ├── auth.js
│   ├── grievances.js
│   ├── departments.js
│   └── upload.js
├── middleware/
│   ├── auth.js
│   └── validation.js
├── controllers/
│   ├── authController.js
│   ├── grievanceController.js
│   └── analyticsController.js
└── server.js
```

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  role: String, // 'citizen', 'admin', 'department'
  department: String, // optional, for department users
  createdAt: Date,
  updatedAt: Date
}
```

### Grievances Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  department: String,
  priority: String,
  status: String,
  citizenId: ObjectId,
  citizenName: String,
  citizenEmail: String,
  citizenPhone: String,
  attachments: [String],
  location: {
    address: String,
    latitude: Number,
    longitude: Number
  },
  assignedTo: ObjectId,
  comments: [{
    userId: ObjectId,
    userName: String,
    userRole: String,
    message: String,
    isInternal: Boolean,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date,
  resolvedAt: Date
}
```

### Departments Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  email: String,
  phone: String,
  head: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Security Considerations

1. **Input Validation** - Validate all inputs on the backend
2. **Authentication** - Implement proper JWT authentication
3. **Authorization** - Role-based access control
4. **File Upload Security** - Validate file types and sizes
5. **Rate Limiting** - Implement API rate limiting
6. **HTTPS** - Use HTTPS in production
7. **Data Sanitization** - Sanitize user inputs to prevent XSS

## Testing the Integration

1. Start your backend server
2. Update the `.env` file with your backend URL
3. Set `REACT_APP_USE_MOCK_API=false`
4. Test each functionality:
   - User registration and login
   - Grievance submission
   - Status updates
   - File uploads
   - Comments system

## Support

For technical support integrating your backend:

1. Check the network requests in browser DevTools
2. Verify API response formats match the expected structure
3. Ensure proper CORS configuration on your backend
4. Test authentication token handling

The frontend is designed to be backend-agnostic and should work with any properly implemented REST API following the specifications above.