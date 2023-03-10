import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosClient from "../config/axiosClient";
import Alert from "../components/Alert";

function ConfirmAccount() {

  const params = useParams();

  const [alert, setAlert] = useState({});
  const [isAccountConfirmed, setIsAccountConfirmed] = useState(false);

  const toConfirmAccount = async () => {

    try {
      const url = `/users/confirm/${params.id}`;
      const {data} = await axiosClient(url);
      setAlert({error: false, msg: data.msg});
      setIsAccountConfirmed(true);
    } catch (error) {
      setAlert({error: true, msg: error.response.data.msg});
    }

  }
  useEffect(() => {

    toConfirmAccount();

    //Codigo para usar en desarrollo
    /*
    return () => {
      toConfirmAccount();
    }
    */
    
  }, []);
  return (
    <>
      <h1 className="text-gray-100 font-black text-4xl capitalize md:text-5xl">
        Confirma tu cuenta y comienza a crear tus
        <span className="text-purple-500"> proyectos</span>
      </h1>

      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-gray-800 md:max-w-md">
        {
          alert.msg &&
          <Alert 
          alert={alert}
          />
        }

        {
          isAccountConfirmed &&
          <Link
          className="block text-center mt-5 text-white uppercase text-sm font-bold hover:text-gray-200 w-auto bg-indigo-600 p-2 mx-auto"
          to="/"
        >
          Inicia Sesión
        </Link>
        }
      </div>
    </>
  )
}

export default ConfirmAccount