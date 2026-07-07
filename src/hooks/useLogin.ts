import {useMutation} from '@tanstack/react-query';
import { authService } from "@/services/authService";

export type LoginPayload = {
    email: string;
    password: string;
};
export const useLogin = () => {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload)
  });
};
export const useLogout = () => {
    return useMutation({
        mutationFn: () => authService.logout()
    });
}

export const useRefresh = () => {
    return useMutation({
        mutationFn: () => authService.refresh()
    });
}
