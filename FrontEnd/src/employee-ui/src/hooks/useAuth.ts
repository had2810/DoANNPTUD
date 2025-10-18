import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/services/authService";
import { getAccessToken } from "@/lib/authStorage";

export const useAuth = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !!getAccessToken(),
  });
};
