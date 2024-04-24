import { showAlertDelete } from "../helpers/alerts";
import useProject from "../hooks/useProject";

function Collaborator({ collaborator }) {

    const { _id, name, email } = collaborator;
    const { deleteCollaborator } = useProject();

    const handleDeleteCollaborator = async () => {
        const result = await showAlertDelete(`¿Estas seguro que deseas eliminar a ${name} como colaborador?`);
        if(result.isConfirmed) {
            await deleteCollaborator(_id);
        }
    }
    return (
        <div className="border-b border-gray-400 p-5 flex justify-between items-center bg-gray-800 rounded-sm">
            <div>
                <p className="text-white">{name}</p>
                <p className="text-sm text-gray-300">{email}</p>
            </div>
            <div>
                <button
                    type="button"
                    className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-sm hover:bg-red-700 transition-colors"
                    onClick={handleDeleteCollaborator}

                >Delete</button>
            </div>
        </div>
    )
}

export default Collaborator