"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { toast } from "react-hot-toast";

import api from "@/lib/api";
import { getToken, removeToken } from "@/lib/cookies";
import useAuthStore from "@/app/stores/useAuthStore";
import type { ApiResponse } from "@/types/api";
import { User } from "@/types/user";
import Loading from "@/app/loading";

const ROLE = ["super_admin", "admin", "user"] as const;

type Role = (typeof ROLE)[number];

export interface WithAuthProps {
  user: User;
}

const LOGIN_ROUTE = "/signin";

export enum RouteRole {
  /**
     Dapat diakses hanya ketika user belum login (Umum)
    */
  public,
  /**
   * Dapat diakses semuanya
   */
  optional,
  /**
   * For all authenticated user
   * will push to login if user is not authenticated
   */
  user,
  /**
   * For all authenticated admin
   * will push to login if user is not authenticated
   */
  admin,
  login,
}

export const isRole = (p: Role): p is Role => ROLE.includes(p as Role);

/**
 * Add role-based access control to a component
 *
 * @see https://react-typescript-cheatsheet.netlify.app/docs/hoc/full_example/
 * @see https://github.com/mxthevs/nextjs-auth/blob/main/src/components/withAuth.tsx
 */
export default function withAuth<T>(
  Component: React.ComponentType<T>,
  routeRole: keyof typeof RouteRole,
) {
  function ComponentWithAuth(props: T) {
    const router = useRouter();
    const params = useSearchParams();
    const redirect = params.get("redirect");
    const pathName = usePathname();

    //#region  //*=========== STORE ===========
    const isAuthenticated = useAuthStore.useIsAuthed();
    const isLoading = useAuthStore.useIsLoading();
    const login = useAuthStore.useLogin();
    const logout = useAuthStore.useLogout();
    const stopLoading = useAuthStore.useStopLoading();
    const user = useAuthStore.useUser();
    //#endregion  //*======== STORE ===========

    const checkAuth = React.useCallback(() => {
      const token = getToken();
      if (!token) {
        isAuthenticated && logout();
        stopLoading();
        return;
      }
      if (!user) {
        const loadUser = async () => {
          try {
            const res = await api.get<ApiResponse<User>>("/users/me");

            if (!res.data.data) {
              toast.error("Sesi login tidak valid");
              throw new Error("Sesi login tidak valid");
            }

            login({
              ...res.data.data,
              token,
            });
          } catch (err) {
            await removeToken();
            console.error("Failed to fetch user data", err);
          } finally {
            stopLoading();
          }
        };

        loadUser();
      }
    }, [isAuthenticated, login, logout, stopLoading, user]);

    React.useEffect(() => {
      checkAuth();
      window.addEventListener("focus", checkAuth);
      return () => {
        window.removeEventListener("focus", checkAuth);
      };
    }, [checkAuth]);

    React.useEffect(() => {
      const Redirect = () => {
        if (isAuthenticated) {
          if (routeRole === "login") {
            router.replace("/dashboard");
          } else if (routeRole === "public" && redirect) {
            router.replace(redirect as string);
          }
        } else if (routeRole !== "public" && routeRole !== "login") {
          router.replace(`${LOGIN_ROUTE}?redirect=${pathName}`);
        }
      };

      if (!isLoading) {
        Redirect();
      }
    }, [isAuthenticated, isLoading, pathName, redirect, router, user]);

    if (
      (isLoading || !isAuthenticated) &&
      routeRole !== "public" &&
      routeRole !== "optional" &&
      routeRole !== "login"
    ) {
      return <Loading />;
    }
    return <Component {...(props as T)} user={user} />;
  }

  return ComponentWithAuth;
}
