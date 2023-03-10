import { useState } from "react"
import axiosClient from "../config/axiosClient";
import { validateEmpty } from "../helpers/validation";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom"
import Alert from "../components/Alert";

function Login() {

  const navigate = useNavigate();

  const { setAuth } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [alert, setAlert] = useState({});

  const checkLogin = async () => {
    try {
      const url = '/users/login';
      const { data } = await axiosClient.post(url, { email, password });
      setAlert({});
      sessionStorage.setItem('token', data.token);
      setAuth(data);
      navigate('/projects');
    } catch (error) {
      setAlert({ error: true, msg: error.response.data.msg });
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    const isValidData = validateEmpty({ email, password });

    if (!isValidData) {
      setAlert({ error: true, msg: 'Todos los campos son obligatorios' });
      return;
    }

    checkLogin();

  }

  return (
    <>
      <h1 className="text-gray-100 font-black text-5xl capitalize md:text-6xl">
        Inicia sesión y administra tus
        <span className="text-purple-500"> proyectos</span>
      </h1>

      <form
        className="mt-10 bg-gray-900 shadow rounded-md p-10 border border-gray-600"
        onSubmit={handleSubmit}
      >
        {
          alert.msg &&
          <Alert alert={alert} />
        }
        <div>
          <label
            htmlFor="email"
            className="uppercase text-gray-100 block text-xl font-bold"
          >Email</label>
          <input
            className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
            id="email"
            name="email"
            type="email"
            placeholder="Email de registro"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="mt-5">
          <label
            htmlFor="password"
            className="uppercase text-gray-100 block text-xl font-bold"
          >Contraseña</label>
          <input
            className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
            id="password"
            name="password"
            type="password"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <input
          className="bg-indigo-500 w-full text-white uppercase font-bold py-3 rounded-md hover:cursor-pointer hover:bg-indigo-600 transition-colors mt-5"
          type="submit"
          value="Iniciar Sesión"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className="block text-center my-5 text-gray-400 uppercase text-sm hover:text-gray-300"
          to="register"
        >
          ¿No tienes una cuenta? Regístrate
        </Link>

        <Link
          className="block text-center my-5 text-gray-400 uppercase text-sm hover:text-gray-300"
          to="/recover-password"
        >
          Olvidé mi contraseña
        </Link>
      </nav>
    </>
  )
}

export default Login