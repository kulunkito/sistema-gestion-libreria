
import {
    createContext,
    useContext,
    useEffect,
    useState
  } from "react";
  
  import { authService } from "../services/auth.service";
  
  const AuthContext = createContext(null);
  
  export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function restoreSession() {
        if (!localStorage.getItem("token")) {
          setLoading(false);
          return;
        }
  
        try {
          const currentUser = await authService.me();
          setUser(currentUser);
        } catch {
          authService.logout();
        } finally {
          setLoading(false);
        }
      }
  
      restoreSession();
    }, []);
  
    async function login(credentials) {
      const currentUser = await authService.login(credentials);
      setUser(currentUser);
      return currentUser;
    }
  
    function logout() {
      authService.logout();
      setUser(null);
    }
  
    return (
      <AuthContext.Provider value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: Boolean(user)
      }}>
        {children}
      </AuthContext.Provider>
    );
  }
  
  export function useAuth() {
    const context = useContext(AuthContext);
  
    if (!context) {
      throw new Error("useAuth debe utilizarse dentro de AuthProvider");
    }
  
    return context;
  }
  