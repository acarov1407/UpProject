import { useContext } from "react"
import ProjectContext from "../context/ProjectProvider"

function useProject() {
  return useContext(ProjectContext);
}

export default useProject