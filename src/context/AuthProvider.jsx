import { createContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { getConfig } from "../config/axiosClient";
import axiosClient from "../config/axiosClient";

const AuthContext = createContext();

function AuthProvider({ children }) {

  const [auth, setAuth] = useState({});
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  const navigate = useNavigate();

  const authUser = async (token) => {

    try {
      const { data } = await axiosClient('/users/profile', getConfig(token));
      setAuth(data);
      //navigate('/projects');
    } catch (error) {
      setAuth({});
      console.log(error);
    } finally {
      setIsLoadingToken(false);
    }
  }

  const loadToken = () => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      setIsLoadingToken(false);
      return;
    }
    authUser(token);
  }

  useEffect(() => {
    loadToken();
  }, []);

  const logoutAuth = () => {
    setAuth({});
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        isLoadingToken,
        logoutAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export {
  AuthProvider
}

export default AuthContext;