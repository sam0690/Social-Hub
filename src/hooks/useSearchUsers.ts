import { userServices } from "@/services/userServices";
import type { SearchUser } from "@/services/userServices";
import { useQuery } from "@tanstack/react-query";

export const useSearchUsers = (q: string) => {
    return useQuery({
        queryKey: ["search-users", q],
        queryFn: () => userServices.searchUsers({ q }),
        enabled: !!q,
        staleTime: 0,
        refetchOnMount: true,
        retry: false,
    })
} 