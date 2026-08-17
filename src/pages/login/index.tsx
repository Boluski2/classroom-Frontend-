import { SignInForm } from "@/components/refine-ui/form/sign-in-form";

type LoginProps = {
  portal?: "admin" | "teacher" | "student";
};

export const Login = ({ portal }: LoginProps) => {
  return (
    <div className="login-page">
      <div className="login-portal-tabs">
        <a
          href="/admin/login"
          className={portal === "admin" ? "portal-tab active" : "portal-tab"}
        >
          Admin
        </a>
        <a
          href="/teacher/login"
          className={portal === "teacher" ? "portal-tab active" : "portal-tab"}
        >
          Teacher
        </a>
        <a
          href="/student/login"
          className={portal === "student" ? "portal-tab active" : "portal-tab"}
        >
          Student
        </a>
      </div>
      <SignInForm portal={portal} />
    </div>
  );
};