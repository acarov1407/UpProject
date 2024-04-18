import useAuth from "../hooks/useAuth"
import useProject from "../hooks/useProject"
import { useLocation, useNavigate } from "react-router-dom";
import { BriefcaseIcon, StarIcon } from "@heroicons/react/24/outline"
import { BriefcaseIcon as SolidBriefcaseIcon, StarIcon as SolidStarIcon, XMarkIcon } from "@heroicons/react/24/solid"


function Sidebar() {

  const { auth, logoutAuth } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { isActiveResponsiveBar, setIsActiveResponsiveBar, logoutReset } = useProject();

  const { name } = auth;

  const handleLogout = () => {
    logoutReset();
    logoutAuth();
    sessionStorage.removeItem('token');
  }

  return (
    <aside className={`${isActiveResponsiveBar ? 'left-0' : 'left-[-100%]'} md:block md:w-72 lg:w-80 px-8 py-10 bg-gray-900 fixed top-0 w-full h-full duration-500 md:relative md:h-auto md:left-0 z-10`}>
      <div className="text-white flex items-center gap-5 mb-16 md:hidden">
        <button
          type="button"
          onClick={() => setIsActiveResponsiveBar(false)}
        >
          <XMarkIcon className="h-11 w-11" />
        </button>
        <h2 className="text-4xl text-sky-300 font-black text-center">
          UpTask
        </h2>
      </div>
      <p className="text-xl font-bold text-white uppercase">Bienvenido(a):
        <span className="block text-yellow-500 uppercase">{name}</span>
      </p>

      <nav className="mt-16 border-y border-gray-600 py-5 px-2 flex flex-col gap-3">
        <button
          className={`text-lg flex items-center gap-2 ${location.pathname === '/projects' ? 'text-purple-400 hover:text-purple-400' : 'text-gray-200 hover:text-white'}`}
          type="button"
          onClick={() => {
            navigate('/projects')
            setIsActiveResponsiveBar(false);
          }}
        >
          {
            location.pathname === '/projects' ? <SolidBriefcaseIcon className="h-5 w-5" /> : <BriefcaseIcon className="h-5 w-5" />
          }
          Proyectos
        </button>

        <button
          className={`text-lg flex items-center gap-2 ${location.pathname === '/projects/favorites' ? 'text-purple-400 hover:text-purple-400' : 'text-gray-200 hover:text-white'}`}
          type="button"
          onClick={() => {
            navigate('/projects/favorites')
            setIsActiveResponsiveBar(false);
          }}
        >
          {
            location.pathname === '/projects/favorites' ? <SolidStarIcon className="h-5 w-5" /> : <StarIcon className="h-5 w-5" />
          }
          Favoritos
        </button>
      </nav>

      <button
        type="button"
        className="text-white text-sm bg-indigo-500 p-3 rounded-md uppercase font-bold w-full mt-10 text-center hover:cursor-pointer hover:bg-indigo-600 transition-colors"
        onClick={handleLogout}
      >
        Cerrar Sesión
      </button>
    </aside>
  )
}

export default Sidebar
