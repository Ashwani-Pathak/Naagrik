# Naagrik Backend Migration to Next.js API Routes

## ✅ What's Been Completed

### 1. Backend Integration
- ✅ MongoDB models (User, Issue) converted to TypeScript
- ✅ Database connection utility with connection caching
- ✅ Authentication middleware with JWT verification
- ✅ Cloudinary integration for image uploads

### 2. API Routes Created
- ✅ `POST /api/auth/register` - User registration
- ✅ `POST /api/auth/login` - User login
- ✅ `POST /api/upload` - Image upload to Cloudinary
- ✅ `GET /api/issues` - Get all issues
- ✅ `POST /api/issues` - Create new issue (authenticated)
- ✅ `POST /api/issues/[id]/upvote` - Upvote an issue
- ✅ `PUT /api/issues/[id]/status` - Update issue status (admin)
- ✅ `DELETE /api/issues/[id]/status` - Delete issue (admin)
- ✅ `POST /api/issues/[id]/comments` - Add comment to issue
- ✅ `POST /api/test` - Test API and database connection

### 3. Frontend Integration
- ✅ Updated API client to use new Next.js endpoints
- ✅ HomePage now fetches real data from API (with fallback)
- ✅ Report page integrated with Cloudinary uploads
- ✅ Authentication flow maintained

## 🔧 Setup Required

### 1. Environment Variables
Update your `.env.local` file with:

```bash
# Database - Install MongoDB locally or use MongoDB Atlas
MONGODB_URI=mongodb://localhost:27017/naagrik

# JWT Secret - Change this to a secure random string
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

# Cloudinary - Sign up at cloudinary.com and get these values
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 2. Database Setup
```bash
# Option 1: Install MongoDB locally
# Download from: https://www.mongodb.com/try/download/community

# Option 2: Use MongoDB Atlas (cloud)
# 1. Go to https://cloud.mongodb.com
# 2. Create a free cluster
# 3. Get connection string and update MONGODB_URI
```

### 3. Cloudinary Setup
```bash
# 1. Go to https://cloudinary.com and create free account
# 2. Get your Cloud Name, API Key, and API Secret from dashboard
# 3. Update the CLOUDINARY_* variables in .env.local
```

## 🚀 How to Test

### 1. Test API Connection
Visit: `http://localhost:3001/api/test`
Should return: `{"message":"API is working!","database":"Connected"}`

### 2. Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### 3. Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 4. Test Image Upload
Use the report page UI or test with:
```bash
curl -X POST http://localhost:3001/api/upload \
  -F "image=@/path/to/your/image.jpg"
```

## 📁 File Structure

```
src/
├── app/
│   ├── api/                    # Backend API routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   └── register/route.ts
│   │   ├── issues/
│   │   │   ├── [id]/
│   │   │   │   ├── comments/route.ts
│   │   │   │   ├── status/route.ts
│   │   │   │   └── upvote/route.ts
│   │   │   └── route.ts
│   │   ├── upload/route.ts
│   │   └── test/route.ts
│   └── ...                    # Frontend pages
├── lib/
│   ├── models/                # MongoDB models
│   │   ├── User.ts
│   │   └── Issue.ts
│   ├── auth.ts               # Authentication utilities
│   ├── cloudinary.ts         # Cloudinary configuration
│   ├── db.ts                 # Database connection
│   └── api.ts                # API client (updated)
```

## 🔄 Migration Benefits

1. **Single Deployment**: Everything runs on one Next.js server
2. **Type Safety**: Full TypeScript integration
3. **Better Performance**: No separate backend server needed
4. **Cloudinary**: Professional image hosting with optimization
5. **Scalability**: Easy to deploy to Vercel, Netlify, etc.

## 🎯 Next Steps

1. Set up environment variables
2. Install and configure MongoDB
3. Set up Cloudinary account
4. Test the API endpoints
5. The frontend should work seamlessly with the new backend!

The old Express.js backend in the `/backend` folder is now obsolete and can be removed once you confirm everything works.
