import { IUserStateContextProps, UserStateContext } from "@/contexts/useUserContext";
import { useContext } from "react";

export const useUserContext = (): IUserStateContextProps => {
    const context = useContext(UserStateContext);
    if (!context) {
        throw new Error('useGlobalState must be used within a GlobalStateProvider');
    }
    return context;
}