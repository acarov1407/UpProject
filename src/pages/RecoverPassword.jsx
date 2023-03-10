import { Link } from "react-router-dom";
import { useState } from "react";
import axiosClient from "../config/axiosClient";
import { validateEmail } from "../helpers/validation";
import Alert from "../components/Alert";

function RecoverPassword() {

  const [email, setEmail] = useState('');

  const [alert, setAlert] = useState({});

  const toRecoverPassword = async () => {

    try{
      const url = '/users/recover-password';
      const {data} = await axiosClient.post(url, {email});
      setAlert({error: false, msg: data.msg});
    }catch(error){
      setAlert({error: true, msg: error.response.data.msg});
    }
    
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    if(!validateEmail(email)){
      setAlert({error: true, msg: 'Debes introducir un email válido'});
      return;
    }

    setAlert({});

    toRecoverPassword();
    
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
          <Alert alert={alert}/>
        }
        <div>
          <label
            htmlFor="email"
            className="uppercase text-gray-100 block text-xl font-bold"
          >Email Registrado</label>
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
        <input
          className="bg-indigo-500 w-full text-white uppercase font-bold py-3 rounded-md hover:cursor-pointer hover:bg-indigo-600 transition-colors mt-5"
          type="submit"
          value="Enviar Instrucciones"
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
          to="register"
        >
          ¿No tienes una cuenta? Regístrate
        </Link>
      </nav>
    </>
  )
}

export default RecoverPassword