import { useEffect } from "react"
import useProject from "../hooks/useProject";
import { useParams, useNavigate } from "react-router-dom";
import FormCollaborator from "../components/FormCollaborator"
import Spinner from "../components/Spinner";

function NewCollaborator() {

    const {
        loadProject,
        currentProject,
        isLoadingProject,
        isLoadingCollaborator,
        collaborator,
        addCollaborator
    } = useProject();

    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        if (!currentProject.name) loadProject(params.id);
    }, []);

    const handleAddCollaborator = async () => {
        const isSaved = await addCollaborator(collaborator.email);
        if (isSaved) navigate(`/projects/${params.id}`);
    }

    if (isLoadingProject) return <Spinner />
    return (
        <>
            <h1 className="text-4xl font-black text-white text-center leading-normal">
             Add collaborator to project: <span className="block">{currentProject.name}</span>
            </h1>

            <div className="mt-10 flex justify-center">
                <FormCollaborator />

            </div>

            {
                isLoadingCollaborator
                    ?
                    <Spinner />
                    :
                    collaborator._id &&
                    (
                        <div className="flex justify-center mt-10">
                            <div className="bg-gray-900 px-5 py-7 rounded-md shadow border border-gray-600 w-full max-w-md">
                                <h2 className="text-center mb-10 text-xl font-bold text-white">Result:</h2>
                                <div className="flex justify-between items-center">
                                    <p className="text-gray-100">{collaborator.name}</p>
                                    <button
                                        className="bg-green-600 px-5 py-2 rounded-md uppercase text-white font-bold text-sm hover:bg-green-700 transition-colors"
                                        type="button"
                                        onClick={handleAddCollaborator}
                                    >Add</button>
                                </div>
                            </div>
                        </div>
                    )


            }
        </>
    )
}

export default NewCollaborator