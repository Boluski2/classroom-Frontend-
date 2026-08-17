import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import {
  BookOpen,
  Building2,
  ClipboardCheck,
  GraduationCap,
  Home as HomeIcon,
  Users,
} from "lucide-react";
import SubjectsList from "./pages/subjects/list";
import { Layout } from "./components/refine-ui/layout/layout";
import SubjectsCreate from "./pages/subjects/create";
import SubjectsShow from "./pages/subjects/show";

import { dataProvider } from "./providers/data";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import DepartmentsList from "./pages/departments/list";
import DepartmentsCreate from "./pages/departments/create";
// import DepartmentsEdit from "./pages/departments/edit";
import DepartmentShow from "./pages/departments/show";
import FacultyList from "./pages/faculty/list";
import FacultyShow from "./pages/faculty/show";
import UsersCreate from "./pages/users/create";
// import UsersEdit from "./pages/users/edit";
import EnrollmentsCreate from "./pages/enrollments/create";
import EnrollmentsJoin from "./pages/enrollments/join";
import EnrollmentConfirm from "./pages/enrollments/confirm";
import Home from "./pages/home";
import AdminDashboard from "./pages/admin-dashboard";
import TeacherDashboard from "./pages/teacher-dashboard";
import StudentDashboard from "./pages/student-dashboard";
import RegistrationCodesPage from "./pages/registration-codes";
import ClassesList from "./pages/Classes/list";
import ClassesCreate from "./pages/Classes/create";
// import ClassesEdit from "./pages/Classes/edit";
import ClassesShow from "./pages/Classes/show";
// import SubjectsEdit from "./pages/subjects/edit";
import { authProvider } from "./providers/auth";
import DepartmentsEdit from "./pages/departments/edit";
import UsersEdit from "./pages/users/edit";
import ClassesEdit from "./pages/Classes/edit";
import SubjectsEdit from "./pages/subjects/edit";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              authProvider={authProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "kkWuv7-GgBIfw-P8CGy0",
              }}
              resources={[
                {
                  name: "dashboard",
                  list: "/",
                  meta: {
                    label: "Home",
                    icon: <HomeIcon />,
                  },
                },
                {
                  name: "subjects",
                  list: "/subjects",
                  create: "/subjects/create",
                  edit: "/subjects/edit/:id",
                  show: "/subjects/show/:id",
                  meta: {
                    label: "Subjects",
                    icon: <BookOpen />,
                  },
                },
                {
                  name: "departments",
                  list: "/departments",
                  show: "/departments/show/:id",
                  create: "/departments/create",
                  edit: "/departments/edit/:id",
                  meta: {
                    label: "Departments",
                    icon: <Building2 />,
                  },
                },
                {
                  name: "users",
                  list: "/users",
                  create: "/users/create",
                  edit: "/users/edit/:id",
                  show: "/users/show/:id",
                  meta: {
                    label: "Users",
                    icon: <Users />,
                  },
                },
                {
                  name: "enrollments",
                  list: "/enrollments/create",
                  create: "/enrollments/create",
                  meta: {
                    label: "Enrollments",
                    icon: <ClipboardCheck />,
                  },
                },
                {
                  name: "registration-codes",
                  list: "/registration-codes",
                  meta: {
                    label: "Registration Codes",
                    icon: <ClipboardCheck />,
                  },
                },
                {
                  name: "classes",
                  list: "/classes",
                  create: "/classes/create",
                  edit: "/classes/edit/:id",
                  show: "/classes/show/:id",
                  meta: {
                    label: "Classes",
                    icon: <GraduationCap />,
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated key="public-routes" fallback={<Outlet />}>
                      <NavigateToResource fallbackTo="/" />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin/login" element={<Login portal="admin" />} />
                  <Route path="/teacher/login" element={<Login portal="teacher" />} />
                  <Route path="/student/login" element={<Login portal="student" />} />
                  <Route path="/register" element={<Register />} />
                </Route>

                <Route
                  element={
                    <Authenticated key="private-routes" fallback={<Login />}>
                      <Layout>
                        <Outlet />
                      </Layout>
                    </Authenticated>
                  }
                >
                  <Route path="/" element={<Home />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/teacher" element={<TeacherDashboard />} />
                  <Route path="/student" element={<StudentDashboard />} />

                  <Route path="subjects">
                    <Route index element={<SubjectsList />} />
                    <Route path="create" element={<SubjectsCreate />} />
                    <Route path="edit/:id" element={<SubjectsEdit />} />
                    <Route path="show/:id" element={<SubjectsShow />} />
                  </Route>

                  <Route path="departments">
                    <Route index element={<DepartmentsList />} />
                    <Route path="create" element={<DepartmentsCreate />} />
                    <Route path="edit/:id" element={<DepartmentsEdit />} />
                    <Route path="show/:id" element={<DepartmentShow />} />
                  </Route>

                  <Route path="users">
                    <Route index element={<FacultyList />} />
                    <Route path="create" element={<UsersCreate />} />
                    <Route path="edit/:id" element={<UsersEdit />} />
                    <Route path="show/:id" element={<FacultyShow />} />
                  </Route>

                  <Route path="faculty">
                    <Route index element={<FacultyList />} />
                    <Route path="show/:id" element={<FacultyShow />} />
                  </Route>

                  <Route path="enrollments">
                    <Route path="create" element={<EnrollmentsCreate />} />
                    <Route path="join" element={<EnrollmentsJoin />} />
                    <Route path="confirm" element={<EnrollmentConfirm />} />
                  </Route>
                  <Route path="registration-codes" element={<RegistrationCodesPage />} />

                  <Route path="classes">
                    <Route index element={<ClassesList />} />
                    <Route path="create" element={<ClassesCreate />} />
                    <Route path="edit/:id" element={<ClassesEdit />} />
                    <Route path="show/:id" element={<ClassesShow />} />
                  </Route>
                </Route>
              </Routes>

              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;