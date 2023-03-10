import { useState } from "react"
import axiosClient from "../config/axiosClient";
import { validateForm } from "../helpers/validation";
import { Link } from "react-router-dom"
import Alert from "../components/Alert";

function Register() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatedPassword, setRepeatedPassword] = useState('');

  const [alert, setAlert] = useState({});

  const saveUserInDB = async () => {
    try {
      const usersURL = '/users'
      const { data } = await axiosClient.post(usersURL, { name, email, password });
      setAlert({ error: false, msg: data.msg });
      resetForm();
    } catch (error) {
      setAlert({ error: true, msg: error.response.data.msg });
    }
  }

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setRepeatedPassword('');
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name,
      email,
      password,
      repeatedPassword
    }
    const isValidForm = validateForm(formData).isValid;
    const formErrorMsg = validateForm(formData).msg;

    if (!isValidForm) {
      setAlert({ error: true, msg: formErrorMsg });
      return;
    }

    setAlert({});
    saveUserInDB();
  }

  return (
    <>
      <h1 className="text-gray-100 font-black text-5xl capitalize md:text-6xl">
        Crea tu cuenta y administra tus
        <span className="text-purple-500"> proyectos</span>
      </h1>
      <form
        className="mt-10 bg-gray-900 shadow rounded-md p-10 border border-gray-500"
        onSubmit={handleSubmit}
      >
        {
          alert.msg &&
          <Alert
            alert={alert}
          />
        }
        <div>
          <label
            htmlFor="nombre"
            className="uppercase text-gray-100 block text-xl font-bold"
          >Nombre</label>
          <input
            className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
            id="nombre"
            name="nombre"
            type="text"
            placeholder="Escribe tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mt-5">
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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            placeholder="Contraseña de Registro"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            value={repeatedPassword}
            onChange={(e) => setRepeatedPassword(e.target.value)}
          />
        </div>

        <input
          className="bg-indigo-500 w-full text-white uppercase font-bold py-3 rounded-md hover:cursor-pointer hover:bg-indigo-600 transition-colors mt-5"
          type="submit"
          value="Crear Cuenta"
        />
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
          to="/recover-password"
        >
          Olvidé mi contraseña
        </Link>
      </nav>
    </>
  )
}

export default Register