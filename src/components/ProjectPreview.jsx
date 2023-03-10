import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import { InformationCircleIcon } from "@heroicons/react/24/outline"

function ProjectPreview({ project }) {

  const { name, _id, client, owner } = project;
  const { auth } = useAuth();

  const isCollaborator = owner !== auth._id;

  return (
    <div className="border-2 border-gray-700 p-5 flex bg-gray-850 rounded-md gap-4 flex-col sm:flex-row sm:items-center">
      <p className="flex-1 text-white text-lg">
        {name}
        <span className="text-sm text-gray-400 uppercase ml-2">
          {client}
        </span>
        {
          isCollaborator && <span className="ml-4 p-1 text-xs rounded-md text-white bg-green-500 font-bold">Colaborador</span>
        }

      </p>


      <Link
        className="text-indigo-400 uppercase text-sm font-bold hover:text-indigo-500 transition-colors flex items-center gap-2"
        to={`/projects/${_id}`}
      >
        Ver Proyecto
        <InformationCircleIcon className="w-5 h-5"/>
      </Link>
    </div>
  )
}

export default ProjectPreview