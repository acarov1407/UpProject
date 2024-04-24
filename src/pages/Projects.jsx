import { useEffect, useState } from "react";
import useProject from "../hooks/useProject"
import ProjectPreview from "../components/ProjectPreview";
import Filter from "../components/Filter";
import Alert from "../components/Alert";
import Spinner from "../components/Spinner";
import Seeker from "../components/Seeker";

function Projects() {

  const { projects, loadAllProjects, alert, isLoadingProject, projectsFilter, setProjectsFilter, resetFilter, setSearchTerm } = useProject();

  const [existResult, setExistResult] = useState(true);

  useEffect(() => {
    if (projects.length === 0) loadAllProjects();
    resetFilter('projects');
    setSearchTerm('');
  }, []);


  const existProjects = projects.length > 0;

  const searchProject = (projectName) => {

    resetFilter('projects');
    if (projectName === '') {
      setProjectsFilter(projects);
      setExistResult(true);
      return;
    }

    const searchResults = projects.filter(_project => _project.name.toLowerCase().includes(projectName.toLowerCase()));
    setProjectsFilter(searchResults);

    if (searchResults.length === 0) setExistResult(false);
    else setExistResult(true);
  }


  if (isLoadingProject) return <Spinner />
  return (
    <>
      <h1 className="text-3xl font-black text-white uppercase mb-5">Projects</h1>
      {
        alert.msg && <Alert alert={alert} />
      }

      <Seeker onChange={searchProject} />
      <Filter />

      <div className={`shadow flex flex-col gap-3 ${!existProjects || !existResult ? 'bg-gray-850 rounded-md border border-gray-700' : ''}`}>
        {
          existProjects
            ?
            existResult
              ?
              projectsFilter.map(project => (
                <ProjectPreview key={project._id} project={project} />
              ))
              :
              <p className="text-center text-gray-100 uppercase p-10">No results found for your search</p>
            :
            <p className="text-center text-gray-100 uppercase p-10">There are no projects yet</p>
        }
      </div>
    </>
  )
}

export default Projects