import { createContext, useContext } from "react";
import { UserType, WorkspaceType } from "@/types/api.type";
import useAuth from "@/hooks/api/use-auth";

// Define the context shape
type AuthContextType = {
  user?: UserType;
  workspace?: WorkspaceType;
  error: any;
  isLoading: boolean;
  isFetching: boolean;
  refetchAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: authData,
    error: authError,
    isLoading: authLoading,
    isFetching,
    refetch: refetchAuth,
  } = useAuth();

  const user = authData?.user;

  return (
    <AuthContext.Provider
      value={{
        user,
        error: authError,
        isLoading: authLoading,
        isFetching,
        refetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCurrentUserContext must be used within a AuthProvider");
  }
  return context;
};
