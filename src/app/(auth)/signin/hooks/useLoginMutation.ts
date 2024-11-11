import { useMutation } from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { setToken } from "@/lib/cookies";
import { ApiResponse } from "@/types/api";
import { LoginRequest, LoginResponse } from "@/types/login";
import { User } from "@/types/user";
import useAuthStore from "@/app/stores/useAuthStore";

export default function useLoginMutation() {
  const { login } = useAuthStore();

  const router = useRouter();

  const { mutate, isPending } = useMutation<
    AxiosResponse,
    AxiosError<ApiError>,
    LoginRequest
  >({
    mutationFn: async (data: LoginRequest) => {
      const res = await api.post<LoginResponse>("/users/login", data);

      const token = res.data.token;
      setToken(token);

      const user = await api.get<ApiResponse<User>>("/users/me");
      if (user) login({ ...user.data.data, token: token });

      return res;
    },
    onSuccess: () => {
      toast.success("Anda berhasil login");
      router.push("/dashboard");
    },
    onError: (error, data) => {
      if (error.response?.data.message === "User not verified") {
        toast.error("User belum verified!");
        const username = data.username;
        router.replace(`/verify?username=${encodeURIComponent(username)}`);
      } else {
        toast.error(error.response?.data.message || error.message);
      }
    },
  });
  return { mutate, isPending };
}
