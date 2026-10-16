
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import keycloak from "../auth/keycloak";

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  currentUserId: string | null;
  login: () => void;
  register: () => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const syncAuthState = () => {
      if (!mounted) return;

      const authenticated = Boolean(keycloak.authenticated);
      const token = keycloak.tokenParsed;
      setIsAuthenticated(authenticated);
      setCurrentUserId(
        authenticated && token?.sub ? token.sub : null,
      );

      const realmRoles =
        (token?.realm_access as { roles?: string[] } | undefined)
          ?.roles ?? [];

      setRole(
        realmRoles.find((item) =>
          ["admin", "user"].includes(item.toLocaleLowerCase()),
        ) ?? null,
      );
    };

    const initialize = async () => {
      try {
        await keycloak.init({
          onLoad: "check-sso",
          pkceMethod: "S256",
          checkLoginIframe: false,
        });
console.log("ACCESS TOKEN:", keycloak.token);
        syncAuthState();

        keycloak.onAuthSuccess = syncAuthState;
        keycloak.onAuthRefreshSuccess = syncAuthState;
        keycloak.onAuthLogout = syncAuthState;
        keycloak.onAuthRefreshError = syncAuthState;
      } catch (error) {
        console.error("Keycloak initialization failed:", error);

        if (mounted) {
          setIsAuthenticated(false);
          setCurrentUserId(null);
          setRole(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void initialize();

    return () => {
      mounted = false;
    };
  }, []);

  const login = () => {
    void keycloak.login({
      redirectUri: `${window.location.origin}/`,
    });
  };

  const register = () => {
    void keycloak.register({
      redirectUri: `${window.location.origin}/`,
    });
  };

  const logout = () => {
    void keycloak.logout({
      redirectUri: `${window.location.origin}/Login`,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        role,
        currentUserId,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth باید داخل AuthProvider استفاده شود.");
  }

  return context;
};
