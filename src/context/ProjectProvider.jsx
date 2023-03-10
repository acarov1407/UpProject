import { createContext, useState, useEffect } from "react";
import { getConfig } from "../config/axiosClient";
import axiosClient from "../config/axiosClient";
import { useNavigate } from "react-router-dom";
import { showModalAlert } from "../helpers/alerts";
import { projectMsg, defaultMsg, taskMsg, collabMsg, favoriteMsg, defaultErrorTitle } from "../helpers/messages";
import io from "socket.io-client";

let socket;

const ProjectContext = createContext();

function ProjectProvider({ children }) {

    const [projects, setProjects] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [projectsFilter, setProjectsFilter] = useState([]);
    const [activeFilter, setActiveFilter] = useState('');
    const [currentProject, setCurrentProject] = useState({});
    const [isLoadingProject, setIsLoadingProject] = useState(false);

    const [currentTask, setCurrentTask] = useState({});
    const [isEditingTask, setIsEditingTask] = useState(false);

    const [collaborator, setCollaborator] = useState({});
    const [isLoadingCollaborator, setIsLoadingCollaborator] = useState(false);

    const [alert, setAlert] = useState({});

    const [modalFormTask, setModalFormTask] = useState(false);

    const [isActiveResponsiveBar, setIsActiveResponsiveBar] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        setProjectsFilter(projects);
    }, [projects])

    useEffect(() => {
        setProjectsFilter(favorites);
    }, [favorites]);

    useEffect(() => {
        socket = io(import.meta.env.VITE_API_URL);
    }, []);

    const loadAllProjects = async () => {
        setIsLoadingProject(true);
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const { data } = await axiosClient('/projects', getConfig(token));
            const updatedProjects = calculateProjectsProgress(data);
            setProjects(updatedProjects);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadingProject(false);
        }
    }

    const calculateProjectsProgress = (data) => {
        const updatedProjects = data.map(_project => {
            _project.progress = calculateProjectProgress(_project);
            return _project;
        });

        return updatedProjects;
    }

    const calculateProjectProgress = (_project) => {
        const tasksCount = _project.tasks.length;
        const progress = tasksCount === 0 ? 0 : (_project.completedTasks / tasksCount) * 100;
        return progress;
    }

    const showAlert = (alert) => {
        setAlert(alert);

        setTimeout(() => {
            setAlert({});
        }, 4000);
    }

    const loadProject = async (id) => {
        setIsLoadingProject(true);
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const url = `/projects/${id}`;
            const { data } = await axiosClient(url, getConfig(token));
            data.progress = calculateProjectProgress(data);
            setCurrentProject(data);
        } catch (error) {
            navigate('/projects');
            showModalAlert({ error: true, title: defaultErrorTitle, msg: error.response.data.msg });
        } finally {
            setIsLoadingProject(false);
        }
    }

    const saveProject = async (project) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const { data } = await axiosClient.post('/projects', project, getConfig(token));
            setProjects([...projects, data]);
            showModalAlert({ title: projectMsg.createdSuccess.title, msg: projectMsg.createdSuccess.msg, error: false });
            navigate('/projects');
            return true;
        } catch (error) {
            showModalAlert({ title: projectMsg.createdError.title, msg: projectMsg.createdError.msg, error: true });
            return false;
        }
    }

    const editProject = async (project) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const url = `/projects/${project.id}`;
            const { data } = await axiosClient.put(url, project, getConfig(token));
            const updatedProjects = projects.map(_project => _project._id === data._id ? data : _project);
            setProjects(updatedProjects);
            showModalAlert({ title: defaultMsg.editedSuccess.title, msg: defaultMsg.editedSuccess.msg, error: false });
            navigate('/projects');
            return true;
        } catch (error) {
            showModalAlert({ title: defaultMsg.editedError.title, msg: error.response.data.msg || defaultMsg.editedError.msg, error: true });
            return false;
        }
    }

    const deleteProject = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const url = `/projects/${id}`;
            const { data } = await axiosClient.delete(url, getConfig(token));
            const updatedProjects = projects.filter(_project => _project._id !== data.id);
            setProjects(updatedProjects);
            showModalAlert({ title: projectMsg.deletedSuccess.title, msg: projectMsg.deletedSuccess.msg, error: false });
            navigate('/projects');
            return true;
        } catch (error) {
            showModalAlert({ title: projectMsg.deletedError.title, msg: error.response.data.msg || projectMsg.deletedError.msg, error: true });
            return false;
        }
    }

    const addToFavorites = (project) => {
        const updatedFavorites = [...favorites];
        updatedFavorites.push(project);
        setFavorites(updatedFavorites);
    }

    const deleteFromFavorites = (id) => {
        const updatedFavorites = favorites.filter(_project => _project._id !== id);
        setFavorites(updatedFavorites);
    }

    const handleFavorites = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const url = '/users/favorites';
            const { data } = await axiosClient.post(url, { id }, getConfig(token));
            if (data.status === 'added') addToFavorites(data.data);
            else if (data.status === 'deleted') deleteFromFavorites(data.data);
            return data.status;
        } catch (error) {
            showModalAlert({ title: favoriteMsg.Error.title, msg: error.response.data.msg || favoriteMsg.Error.msg });
        }
    }

    const getFavorites = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const url = '/users/favorites';
            const { data } = await axiosClient(url, getConfig(token));
            const updatedProjects = calculateProjectsProgress(data);
            setFavorites(updatedProjects);
        } catch (error) {
            console.log(error);
        }
    }

    const updateProgress = (tempProject) => {

        tempProject.progress = calculateProjectProgress(tempProject);
        setCurrentProject(tempProject);

        const updatedProjects = projects.map(_project => _project._id === tempProject._id ? tempProject : _project);
        setProjects(updatedProjects);

        const updatedFavorites = favorites.map(_project => _project._id === tempProject._id ? tempProject : _project);
        setFavorites(updatedFavorites);
    }

    const addTaskToState = (task) => {
        const tempCurrentProject = { ...currentProject };
        tempCurrentProject.tasks = [...tempCurrentProject.tasks, task];
        setCurrentProject(tempCurrentProject);
        updateProgress(tempCurrentProject);
    }

    const saveTask = async (task) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const { data } = await axiosClient.post('/tasks', task, getConfig(token));
            setAlert({});
            setModalFormTask(false);
            showModalAlert({ title: taskMsg.createdSuccess.title, msg: taskMsg.createdSuccess.msg, error: false });

            socket.emit('save_task', data);
            return true;
        } catch (error) {
            showModalAlert({ title: taskMsg.createdError.title, msg: error.response.data.msg || taskMsg.createdError.msg, error: true });
            return false;
        }
    }

    const editTaskToState = (taskEdited) => {
        const tempCurrentProject = { ...currentProject };
        tempCurrentProject.tasks = currentProject.tasks?.map(_task => _task._id === taskEdited._id ? taskEdited : _task);
        setCurrentProject(tempCurrentProject);
    }

    const editTask = async (task) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const url = `/tasks/${task._id}`;
            const { data } = await axiosClient.put(url, task, getConfig(token));
            socket.emit('edit_task', data);
            setAlert({});
            setModalFormTask(false);
            showModalAlert({ title: defaultMsg.editedSuccess.title, msg: defaultMsg.editedSuccess.msg, error: false });
            return true;
        } catch (error) {
            showModalAlert({ title: defaultMsg.editedError.title, msg: error.response.data.msg || defaultMsg.editedError.msg, error: true });
            return false;
        }
    }

    const deleteTaskFromState = (taskID) => {
        const tempCurrentProject = { ...currentProject };
        tempCurrentProject.tasks = tempCurrentProject.tasks?.filter(_task => _task._id !== taskID);

        const taskDeleted = currentProject.tasks.filter(_task => _task._id === taskID)[0];
        if (taskDeleted.state) tempCurrentProject.completedTasks -= 1;
        setCurrentProject(tempCurrentProject);
        updateProgress(tempCurrentProject);
    }

    const deleteTask = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const url = `/tasks/${id}`;
            const { data } = await axiosClient.delete(url, getConfig(token));
            socket.emit('delete_task', data);
            showModalAlert({ title: taskMsg.deletedSuccess.title, msg: taskMsg.deletedSuccess.msg, error: false });
            return true;
        } catch (error) {
            showModalAlert({ title: taskMsg.deletedError.title, msg: error.response.data.msg || taskMsg.deletedError.msg, error: true });
            return false;
        }
    }

    const completeTaskInState = (task) => {
        const tempCurrentProject = { ...currentProject };
        tempCurrentProject.tasks = currentProject?.tasks?.map(_task => _task._id === task._id ? task : _task);

        if (task.state) tempCurrentProject.completedTasks = tempCurrentProject.completedTasks + 1;
        else tempCurrentProject.completedTasks = tempCurrentProject.completedTasks - 1;

        updateProgress(tempCurrentProject);
    }

    const completeTask = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const url = `/tasks/state/${id}`;
            const { data } = await axiosClient.post(url, {}, getConfig(token));
            socket.emit('complete_task', data);
        } catch (error) {
            showModalAlert({ title: taskMsg.completeError.title, msg: taskMsg.completeError.msg, error: true });
        }
    }


    const searchCollaborator = async (email) => {
        setIsLoadingCollaborator(true);
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const url = '/projects/collaborators';
            const { data } = await axiosClient.post(url, { email }, getConfig(token));
            setCollaborator(data);
            showAlert({});
        } catch (error) {
            showAlert({ error: true, msg: error.response.data.msg });
        } finally {
            setIsLoadingCollaborator(false);
        }
    }

    const addCollaborator = async (email) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const url = `/projects/collaborators/${currentProject._id}`;
            const { data } = await axiosClient.post(url, { email }, getConfig(token));
            showModalAlert({ error: false, title: collabMsg.addSuccess.title, msg: data.msg });
            setCollaborator({});
            return true;
        } catch (error) {
            showModalAlert({ error: true, title: collabMsg.addError.title, msg: error.response.data.msg || collabMsg.addError.msg });
            return false;
        }
    }

    const deleteCollaborator = async (id) => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) return;
            const url = `/projects/delete-collaborator/${currentProject._id}`;
            const { data } = await axiosClient.post(url, { id }, getConfig(token));
            const tempCurrentProject = { ...currentProject };
            tempCurrentProject.collaborators = currentProject?.collaborators?.filter(_collaborator => _collaborator._id !== data._id);
            setCurrentProject(tempCurrentProject);
            showModalAlert({ error: false, title: collabMsg.deletedSuccess.title, msg: collabMsg.deletedSuccess.msg });
        } catch (error) {
            showModalAlert({ error: true, title: collabMsg.deletedError.title, msg: error.response.data.msg || collabMsg.deletedError.msg })
        }
    }


    const handleModalFormTask = () => {
        setModalFormTask(!modalFormTask);
        setIsEditingTask(false);
        setCurrentTask({});
    }

    const handleModalEditTask = (task) => {
        setIsEditingTask(true);
        setModalFormTask(!modalFormTask);
        setCurrentTask(task);
    }

    const resetFilter = (filterOrigin) => {
        switch (filterOrigin) {
            case 'projects':
                setProjectsFilter(projects);
                break;
            case 'favorites':
                setProjectsFilter(favorites);
                break;
            default:
                setProjectsFilter(projects);
                break;
        }
        setActiveFilter('');
    }

    const logoutReset = () => {
        setProjects([]);
        setCurrentProject({});
        setFavorites([]);
        setProjectsFilter([]);
        setActiveFilter('');
        setCollaborator({});
        setSearchTerm('');
        setAlert({});
    }

    return (
        <ProjectContext.Provider
            value={{
                projects,
                projectsFilter,
                setProjectsFilter,
                activeFilter,
                setActiveFilter,
                alert,
                showAlert,
                saveProject,
                loadAllProjects,
                loadProject,
                currentProject,
                isLoadingProject,
                editProject,
                deleteProject,
                favorites,
                handleFavorites,
                getFavorites,
                saveTask,
                addTaskToState,
                modalFormTask,
                handleModalFormTask,
                isEditingTask,
                editTask,
                editTaskToState,
                currentTask,
                handleModalEditTask,
                deleteTask,
                deleteTaskFromState,
                collaborator,
                searchCollaborator,
                addCollaborator,
                deleteCollaborator,
                isLoadingCollaborator,
                completeTask,
                completeTaskInState,
                isActiveResponsiveBar,
                setIsActiveResponsiveBar,
                resetFilter,
                searchTerm,
                setSearchTerm,
                logoutReset
            }}
        >
            {children}
        </ProjectContext.Provider>
    )
}

export {
    ProjectProvider
}

export default ProjectContext;