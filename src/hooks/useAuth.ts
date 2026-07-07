import {authService} from "@/services/authService";
import {useQuery} from "@tanstack/react-query";

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: ["auth"],
        queryFn: authService.getCurrentUser,
        retry: false, // Don't retry on failure (e.g., if the user is not authenticated)
    });
}
    