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

    //TODO: Eliminar callback para deploy
    return () => {
      toConfirmAccount();
    }
    
  }, []);
  return (
    <>
      <h1 className="text-sky-600 font-black text-5xl capitalize">
        Confirma tu cuenta y comienza a crear tus
        <span className="text-slate-700"> proyectos</span>
      </h1>

      <div className="mt-20 md:mt-10 shadow-lg px-5 py-10 rounded-xl bg-white">
        {
          alert.msg &&
          <Alert 
          alert={alert}
          />
        }

        {
          isAccountConfirmed &&
          <Link
          className="block text-center my-5 text-slate-500 uppercase text-sm"
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