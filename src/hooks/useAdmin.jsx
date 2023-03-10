import useProject from "./useProject";
import useAuth from "./useAuth";

function useAdmin() {

    const { currentProject } = useProject();
    const { auth } = useAuth();
    return currentProject.owner === auth._id;
}

export default useAdmin