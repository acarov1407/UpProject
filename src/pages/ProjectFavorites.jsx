import { useEffect, useState } from "react";
import useProject from "../hooks/useProject"
import ProjectPreview from "../components/ProjectPreview";
import Filter from "../components/Filter";
import Alert from "../components/Alert";
import Seeker from "../components/Seeker";

function ProjectFavorites() {

    const { favorites, getFavorites, alert, projectsFilter, setProjectsFilter, resetFilter, setSearchTerm } = useProject();

    const [existResult, setExistResult] = useState(true);

    useEffect(() => {
        if (favorites.length === 0) getFavorites();
        resetFilter('favorites');
        setSearchTerm('');
    }, []);

    const existProjects = favorites.length > 0;

    const searchProject = (projectName) => {

        resetFilter('favorites');
        if (projectName === '') {
            setProjectsFilter(favorites);
            setExistResult(true);
            return;
        }

        const searchResults = favorites.filter(_project => _project.name.toLowerCase().includes(projectName.toLowerCase()));
        setProjectsFilter(searchResults);

        if (searchResults.length === 0) setExistResult(false);
        else setExistResult(true);
    }

    return (
        <>
            <h1 className="text-3xl font-black mb-5 text-white uppercase">Tus proyectos favoritos</h1>
            {
                alert.msg && <Alert alert={alert} />
            }

            <Seeker onChange={searchProject} />
            <Filter />

            <div className={`shadow flex flex-col gap-3 ${!existProjects ? 'bg-gray-850 rounded-md border border-gray-700' : ''}`}>
                {
                    existProjects
                        ?
                        existResult
                            ?
                            projectsFilter.map(project => (
                                <ProjectPreview key={project._id} project={project} />
                            ))
                            :
                            <p className="text-center text-gray-100 uppercase p-10">No se han encontrado resultados para tu búsqueda</p>
                        :
                        <p className="text-center text-gray-100 uppercase p-10">Aún no tienes proyectos favoritos</p>
                }
            </div>
        </>
    )
}

export default ProjectFavorites