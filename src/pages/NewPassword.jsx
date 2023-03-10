import { Link, useNavigate } from "react-router-dom"
import axiosClient from "../config/axiosClient";
import { useState, useEffect } from "react";
import { validatePassword, validatePasswords } from "../helpers/validation";
import Alert from "../components/Alert";
import { useParams } from "react-router-dom";

function NewPassword() {

  const navigate = useNavigate();
  const params = useParams();

  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const [isValidToken, setIsValidToken] = useState(false);
  const [alert, setAlert] = useState({});

  useEffect(() => {
    checkToken();
  }, []);

  const redirectToLogin = () => {
    setTimeout(() => {
      navigate('/');
    }, 2500);

  }

  const changePassword = async () => {
    try {
      const url = `/users/recover-password/${params.token}`;
      const { data } = await axiosClient.post(url, { password });
      setAlert({ error: false, msg: data.msg });
      redirectToLogin();
    } catch (error) {
      setAlert({ error: true, msg: error.response.data.msg });
    }
  }
  const checkToken = async () => {
    try {
      const url = `/users/recover-password/${params.token}`;
      await axiosClient(url);
      setIsValidToken(true);
    } catch (error) {
      setIsValidToken(false);
      setAlert({ error: true, msg: error.response.data.msg });
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const isValidPassword = validatePassword(password);
    const areSamePassword = validatePasswords(password, repeatedPassword);

    if (!isValidPassword) {
      setAlert({ error: true, msg: 'Tu contraseña debe tener por lo menos 8 caracteres' });
      return;
    }

    if (!areSamePassword) {
      setAlert({ error: true, msg: 'Las contraseñas no coinciden' });
      return;
    }

    changePassword();

  }
  return (
    <>
      <h1 className="text-gray-100 font-black text-5xl capitalize md:text-6xl">
        Recupera tu cuenta y el acceso a tus
        <span className="text-purple-500"> proyectos</span>
      </h1>

      <form
        className="mt-10 bg-gray-900 shadow rounded-md p-10 border border-gray-500"
        onSubmit={handleSubmit}
      >
        {
          alert.msg &&
          <Alert alert={alert} />
        }
        {
          isValidToken &&
          <>
            <div>
              <label
                htmlFor="password"
                className="uppercase text-gray-100 block text-xl font-bold"
              >Nueva Contraseña</label>
              <input
                className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
                id="password"
                name="password"
                type="password"
                placeholder="Escribe una nueva contraseña"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="repeat-password"
                className="uppercase text-gray-100 block text-xl font-bold"
              >Repite tu contraseña</label>
              <input
                className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
                id="repeat-password"
                name="password"
                type="password"
                placeholder="Repite tu contraseña"
                onChange={(e) => setRepeatedPassword(e.target.value)}
                value={repeatedPassword}
              />
            </div>
            <input
              className="bg-indigo-500 w-full text-white uppercase font-bold py-3 rounded-md hover:cursor-pointer hover:bg-indigo-600 transition-colors mt-5"
              type="submit"
              value="Cambiar Contraseña"
            />
          </>
        }

      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-gray-400 uppercase text-sm hover:text-gray-300"
          to="/"
        >
          ¿Ya tienes una cuenta? Inicia Sesión
        </Link>
        <Link
          className="block text-center my-5 text-gray-400 uppercase text-sm hover:text-gray-300"
          to="register"
        >
          ¿No tienes una cuenta? Regístrate
        </Link>
      </nav>
    </>
  )
}

export default NewPassword