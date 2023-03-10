import { useEffect } from "react";
import { useParams } from "react-router-dom"
import useProject from "../hooks/useProject"
import Spinner from "../components/Spinner";
import FormProject from "../components/FormProject";


function ProjectEdit() {

    const params = useParams();

    const { loadProject, currentProject, isLoadingProject } = useProject();

    const { name } = currentProject;

    useEffect(() => {
        if (!currentProject) loadProject(params.id);
    }, []);


    if (isLoadingProject) return <Spinner />
    return (
        <>
            <h1 className="font-black text-4xl text-white">Editar Proyecto: {name}</h1>
            <div className="mt-10 flex justify-center">
                <FormProject />
            </div>
        </>

    )
}

export default ProjectEdit