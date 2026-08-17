# Classroom Frontend

## 📚 Project Summary

A comprehensive classroom management platform designed for schools and academic departments. This web application enables administrators, faculty, and students to manage departments, subjects, classes, user accounts, and enrollment workflows seamlessly.

**Key Capabilities:**
- Streamlined academic structure management
- Role-based access control and dashboards
- Efficient class roster and enrollment management
- Teacher assignment and student enrollment
- Multi-user support with distinct workflows

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| Frontend Framework | React 19 |
| Build Tool | Vite |
| Language | TypeScript |
| UI Framework | Refine |
| Styling | Tailwind CSS |
| Component Library | shadcn/ui |
| Authentication | Better Auth |
| Image Management | Cloudinary |

## ✨ Features

- **Authentication & Authorization**
  - User login and registration
  - Role-based dashboard flows (Admin, Faculty, Student)
  - Secure session management via Better Auth

- **Academic Management**
  - Department management and organization
  - Subject creation and configuration
  - Class management with scheduling
  - Faculty assignment to classes

- **User Management**
  - User account creation and management
  - Faculty profile management
  - Role assignment and permissions
  - Profile image uploads via Cloudinary

- **Student Features**
  - Self-service course enrollment
  - View enrolled classes
  - Access class information

## 📁 Project Structure

```
src/
├── App.tsx                 # Main app routes and Refine configuration
├── index.tsx              # Entry point
├── pages/                 # Page-level screens
│   ├── login/            # Authentication pages
│   ├── register/         # User registration
│   ├── admin-dashboard.tsx    # Admin dashboard
│   ├── student-dashboard.tsx  # Student dashboard
│   ├── teacher-dashboard.tsx  # Teacher dashboard
│   ├── users/            # User management
│   ├── classes/          # Class management
│   ├── subjects/         # Subject management
│   ├── departments/      # Department management
│   ├── enrollments/      # Enrollment management
│   └── faculty/          # Faculty management
├── components/           # Reusable components
│   ├── refine-ui/       # Refine framework components
│   ├── ui/              # shadcn/ui components
│   └── upload-widget.tsx # Cloudinary upload handler
├── providers/            # Auth and data providers
├── lib/                  # Utilities and configurations
│   ├── auth-client.ts   # Better Auth client setup
│   ├── cloudinary.ts    # Cloudinary configuration
│   ├── schema.ts        # Data validation schemas
│   └── utils.ts         # Helper functions
├── hooks/               # Custom React hooks
├── constants/           # App constants and configs
├── types/               # TypeScript type definitions
└── styles/              # Global styles
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Backend Server** running at `http://localhost:8000/api/`
- **Cloudinary Account** for image uploads (optional for local development)
- **Better Auth** backend integration

### Environment Setup

1. **Clone and navigate to frontend directory:**
   ```bash
   cd classroom-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** with required variables:
   ```bash
   # Backend API
   VITE_BACKEND_BASE_URL=http://localhost:8000/api/

   # Cloudinary (get from Cloudinary dashboard)
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   VITE_CLOUDINARY_UPLOAD_URL=https://api.cloudinary.com/v1_1/your_cloud_name/image/upload
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Access the app at: **http://localhost:5173**

## 📦 Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run start` | Serve production build locally |
| `npm run lint` | Run ESLint checks (if configured) |
| `npm run preview` | Preview production build locally |

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t classroom-frontend:latest .
```

### Run Container

```bash
docker run -p 80:80 \
  -e VITE_BACKEND_BASE_URL=http://api.example.com/api/ \
  -e VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name \
  classroom-frontend:latest
```

See `Dockerfile` for production build configuration.

## 🔌 Backend Integration

### Expected API Base URL
- **Development:** `http://localhost:8000/api/`
- **Production:** Update `VITE_BACKEND_BASE_URL` accordingly

### Authentication Flow
1. User submits credentials
2. Frontend calls Better Auth endpoints via backend
3. Backend validates and returns session token
4. Frontend stores token for subsequent API requests
5. Auth client (`lib/auth-client.ts`) manages state

### Required Backend Endpoints
- `/auth/signin` - User login
- `/auth/signup` - User registration
- `/users` - User management (GET, POST, PATCH, DELETE)
- `/departments` - Department operations
- `/subjects` - Subject operations
- `/classes` - Class management
- `/enrollments` - Enrollment operations

## 🐛 Troubleshooting

### Issue: "Cannot connect to backend"
**Solution:**
- Verify backend is running: `http://localhost:8000/api/`
- Check `VITE_BACKEND_BASE_URL` in `.env`
- Ensure no CORS issues in backend configuration
- Check browser console for network errors

### Issue: "Image upload not working"
**Solution:**
- Verify Cloudinary credentials in `.env`
- Ensure `VITE_CLOUDINARY_UPLOAD_PRESET` is correct
- Check Cloudinary dashboard for account status
- Verify upload preset exists and is active

### Issue: "Login fails silently"
**Solution:**
- Open browser DevTools → Network tab
- Check API response status codes
- Verify backend Better Auth is properly configured
- Check if user account exists in database

### Issue: "Styles not loading (Tailwind/shadcn)"
**Solution:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Rebuild CSS: `npm run build`
- Check `tailwind.config.js` paths include all template files

### Issue: "Port 5173 already in use"
**Solution:**
```bash
# Use custom port
npm run dev -- --port 3000
```

## 📋 API Endpoints Reference

### Authentication
- `POST /auth/signin` - Login
- `POST /auth/signup` - Register
- `POST /auth/signout` - Logout

### Users
- `GET /users` - List all users
- `POST /users` - Create user
- `GET /users/:id` - Get user details
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Departments
- `GET /departments` - List departments
- `POST /departments` - Create department
- `PATCH /departments/:id` - Update department
- `DELETE /departments/:id` - Delete department

### Classes & Subjects
- `GET /classes` - List classes
- `POST /classes` - Create class
- `GET /subjects` - List subjects
- `POST /subjects` - Create subject

### Enrollments
- `GET /enrollments` - List enrollments
- `POST /enrollments` - Enroll student
- `DELETE /enrollments/:id` - Remove enrollment

## 🤝 Contributing

### Development Workflow
1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m "Add feature"`
3. Push to branch: `git push origin feature/your-feature`
4. Create pull request on main branch

### Code Standards
- Follow TypeScript strict mode
- Use ESLint for code quality
- Format code with Prettier (if configured)
- Add type definitions for new features
- Comment complex logic

### Testing
- Test locally before submitting PR
- Ensure backend is running during testing
- Verify all pages load correctly
- Test with different user roles (Admin, Faculty, Student)

## 📝 Notes

- ⚠️ The frontend **requires** the backend server to be running
- 🔐 Authentication tokens are managed by Better Auth
- 🖼️ Image uploads require valid Cloudinary credentials
- 🌐 CORS must be properly configured in the backend
- 💾 User session is persisted in browser storage
- 🎨 UI components from shadcn/ui are fully customizable via Tailwind CSS

## 📄 License

Include your project license here.

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend logs
3. Check browser DevTools → Console/Network tabs
4. Contact development team or open an issue
