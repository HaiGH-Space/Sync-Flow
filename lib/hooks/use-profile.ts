'use client'

import { useQuery } from "@tanstack/react-query"
import { useUserStore } from "../store/use-user-profile"
import { userService } from "../services/user"
import { useEffect } from "react"

export const useProfile = () => {
    const { userProfile, setUserProfile } = useUserStore()

    const query = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await userService.getUserProfile()
            return response.data
        },
        initialData: userProfile ?? undefined,
        staleTime: 1000 * 60 * 10,
    })

    useEffect(() => {
        if (query.data) {
            setUserProfile(query.data);
        }
    }, [query.data, setUserProfile]);

    return query
}