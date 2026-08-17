import type { AuthProvider } from "@refinedev/core";
import { User, SignUpPayload } from "@/types";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
  register: async ({
    email,
    password,
    name,
    role,
    image,
    imageCldPubId,
  }: SignUpPayload) => {
    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        image,
        role,
        imageCldPubId,
      } as SignUpPayload);

      if (error) {
        return {
          success: false,
          error: {
            name: "Registration failed",
            message:
              error?.message || "Unable to create account. Please try again.",
          },
        };
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        redirectTo: "/",
      };
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        error: {
          name: "Registration failed",
          message: "Unable to create account. Please try again.",
        },
      };
    }
  },
  login: async ({ email, password }) => {
    try {
      const { data, error } = await authClient.signIn.email({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Login error from auth client:", error);
        return {
          success: false,
          error: {
            name: "Login failed",
            message: error?.message || "Please try again later.",
          },
        };
      }

      if (!data?.user) {
        return {
          success: false,
          error: {
            name: "Login failed",
            message: "Unable to retrieve user profile.",
          },
        };
      }

      const rawUser = data.user as unknown as Record<string, unknown>;

      if (!rawUser.role || typeof rawUser.role !== "string") {
        return {
          success: false,
          error: {
            name: "Login failed",
            message: "User role is missing from login response.",
          },
        };
      }

      const user: User = {
        id: String(rawUser.id ?? ""),
        createdAt: String(rawUser.createdAt ?? ""),
        updatedAt: String(rawUser.updatedAt ?? ""),
        email: String(rawUser.email ?? ""),
        name: String(rawUser.name ?? ""),
        role: rawUser.role as User["role"],
        image: typeof rawUser.image === "string" ? rawUser.image : undefined,
        imageCldPubId: typeof rawUser.imageCldPubId === "string" ? rawUser.imageCldPubId : undefined,
      };

      // Store user data
      localStorage.setItem("user", JSON.stringify(user));

      const redirectTo =
        user.role === "admin"
          ? "/admin"
          : user.role === "teacher"
          ? "/teacher"
          : user.role === "student"
          ? "/student"
          : "/";

      return {
        success: true,
        redirectTo,
      };
    } catch (error) {
      console.error("Login exception:", error);
      return {
        success: false,
        error: {
          name: "Login failed",
          message: "Please try again later.",
        },
      };
    }
  },
  logout: async () => {
    const { error } = await authClient.signOut();

    if (error) {
      console.error("Logout error:", error);
      return {
        success: false,
        error: {
          name: "Logout failed",
          message: "Unable to log out. Please try again.",
        },
      };
    }

    localStorage.removeItem("user");

    return {
      success: true,
      redirectTo: "/login",
    };
  },
  onError: async (error) => {
    if (error.response?.status === 401) {
      return {
        logout: true,
      };
    }

    return { error };
  },
  check: async () => {
    try {
      const { data, error } = await authClient.getSession();

      if (error || !data?.user) {
        return {
          authenticated: false,
          logout: true,
          redirectTo: "/login",
          error: {
            name: "Unauthorized",
            message: error?.message || "Session not found.",
          },
        };
      }

      const rawUser = data.user as unknown as Record<string, unknown>;

      if (!rawUser.role || typeof rawUser.role !== "string") {
        return {
          authenticated: false,
          logout: true,
          redirectTo: "/login",
          error: {
            name: "Unauthorized",
            message: "User role is missing from session data.",
          },
        };
      }

      const user: User = {
        id: String(rawUser.id ?? ""),
        createdAt: String(rawUser.createdAt ?? ""),
        updatedAt: String(rawUser.updatedAt ?? ""),
        email: String(rawUser.email ?? ""),
        name: String(rawUser.name ?? ""),
        role: rawUser.role as User["role"],
        image: typeof rawUser.image === "string" ? rawUser.image : undefined,
        imageCldPubId:
          typeof rawUser.imageCldPubId === "string"
            ? rawUser.imageCldPubId
            : undefined,
      };

      localStorage.setItem("user", JSON.stringify(user));

      return {
        authenticated: true,
      };
    } catch (error) {
      console.error("Auth check failed:", error);
      return {
        authenticated: false,
        logout: true,
        redirectTo: "/login",
        error: {
          name: "Unauthorized",
          message: "Check failed",
        },
      };
    }
  },
  getPermissions: async () => {
    const user = localStorage.getItem("user");

    if (!user) return null;
    const parsedUser: User = JSON.parse(user);

    return {
      role: parsedUser.role,
    };
  },
  getIdentity: async () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser: User = JSON.parse(storedUser);

      return {
        id: parsedUser.id,
        name: parsedUser.name,
        email: parsedUser.email,
        image: parsedUser.image,
        role: parsedUser.role,
        imageCldPubId: parsedUser.imageCldPubId,
      };
    }

    try {
      const { data, error } = await authClient.getSession();
      if (error || !data?.user) return null;

      const rawUser = data.user as unknown as Record<string, unknown>;
      if (!rawUser.role || typeof rawUser.role !== "string") return null;

      const user: User = {
        id: String(rawUser.id ?? ""),
        createdAt: String(rawUser.createdAt ?? ""),
        updatedAt: String(rawUser.updatedAt ?? ""),
        email: String(rawUser.email ?? ""),
        name: String(rawUser.name ?? ""),
        role: rawUser.role as User["role"],
        image: typeof rawUser.image === "string" ? rawUser.image : undefined,
        imageCldPubId:
          typeof rawUser.imageCldPubId === "string"
            ? rawUser.imageCldPubId
            : undefined,
      };

      localStorage.setItem("user", JSON.stringify(user));

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        imageCldPubId: user.imageCldPubId,
      };
    } catch (error) {
      console.error("Failed to load identity:", error);
      return null;
    }
  },
};