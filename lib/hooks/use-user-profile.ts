import type { UserProfile } from "../services/user"
import { create } from "zustand"

type UserProfileActions = {
    logout: () => Promise<void>
    setUserProfile: (profile: UserProfile) => void
}

type UserProfileStore = {
    userProfile?: UserProfile
} & UserProfileActions

export const useUserStore = create<UserProfileStore>((set) => ({
    userProfile: undefined,
    logout: async () => {
        // call logout endpoint, need implement
        set({ userProfile: undefined })
    },
    setUserProfile: (profile: UserProfile) => set({ userProfile: profile }),
}))