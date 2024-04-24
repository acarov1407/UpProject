import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import useProject from "../hooks/useProject";
import useAdmin from "../hooks/useAdmin";
import { formatDate } from "../helpers/formatDate";
import { showAlertDelete } from "../helpers/alerts";
import { Link } from "react-router-dom";
import { PlusCircleIcon, StarIcon as SolidStarIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon, TrashIcon, StarIcon } from "@heroicons/react/24/outline";
import ModalFormTask from "../components/ModalFormTask";
import Spinner from "../components/Spinner";
import ProgressBar from "../components/ProgressBar";
import Task from "../components/Task";
import Collaborator from "../components/Collaborator";
import io from "socket.io-client";

let socket;

function Project() {

    const {
        loadProject,
        currentProject,
        isLoadingProject,
        deleteProject,
        handleModalFormTask,
        getFavorites,
        favorites,
        handleFavorites,
        addTaskToState,
        deleteTaskFromState,
        editTaskToState,
        completeTaskInState
    } = useProject();

    const [isFavorite, setIsFavorite] = useState(false);
    const [isOpenDetails, setIsOpenDetails] = useState(true);

    const admin = useAdmin();
    const params = useParams();

    useEffect(() => {
        loadProject(params.id);
    }, []);

    useEffect(() => {
        socket = io(import.meta.env.VITE_API_URL);
        socket.emit('open proyect', params.id);
    }, []);

    useEffect(() => {
        socket.on('saved_task', (task) => {
            if(task.project === currentProject._id) addTaskToState(task);
        });

        socket.on('deleted_task', (task) => {
            if(task.project._id === currentProject._id) deleteTaskFromState(task._id);
        });

        socket.on('edited_task', (task) => {
            if(task.project === currentProject._id) editTaskToState(task);
        });

        socket.on('completed_task', (task) => {
            if(task.project === currentProject._id) completeTaskInState(task);
        });

        //TODO: Posiblemente se deba remover en deploy
        return () => {
            socket.off("saved_task")
            socket.off("deleted_task")
            socket.off("edited_task")
            socket.off("completed_task")
          }

    });

    useEffect(() => {
        if (favorites.length === 0) getFavorites();
        const result = favorites.some(_project => _project._id === currentProject._id);
        setIsFavorite(result);
    }, [currentProject]);


    const { name, _id, tasks, collaborators, deadline, client, description, progress } = currentProject;

    const existTasks = tasks?.length > 0;
    const existCollaborators = collaborators?.length > 0;

    const handleClickDelete = async () => {
        const result = await showAlertDelete('¿Estás seguro que quieres eliminar este proyecto?');
        if (result.isConfirmed) {
            await deleteProject(_id);
        }
    }

    const handleClickFavorites = async () => {
        const status = await handleFavorites(_id);
        setIsFavorite(status === 'added' ? true : false);
    }

    if (isLoadingProject) return <Spinner />
    return (
        <>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h1 className="font-black text-4xl text-white">{name}</h1>
                    <button
                        type="button"
                        className={`${isFavorite ? 'text-yellow-600' : 'text-white'}`}
                        onClick={handleClickFavorites}
                    >
                        {
                            isFavorite ? <SolidStarIcon className="h-8 w-8" /> : <StarIcon className="h-8 w-8" />
                        }

                    </button>
                </div>

                {
                    admin &&
                    (
                        <div className="flex flex-col items-start justify-center gap-4 md:gap-3 text-sm">
                            <div className="flex gap-1 items-center text-gray-400 hover:text-white transition-colors">
                                <PencilSquareIcon className="h-5 w-5" />
                                <Link
                                    className="uppercase font-bold"
                                    to={`/projects/edit/${_id}`}
                                >Edit</Link>
                            </div>
                            <div className="flex gap-1 items-center text-gray-400 hover:text-white transition-colors">
                                <TrashIcon className="h-5 w-5" />

                                <button
                                    type="button"
                                    className="uppercase font-bold"
                                    onClick={handleClickDelete}
                                >Delete</button>
                            </div>
                        </div>
                    )
                }

            </div>

            <div className="flex mt-5 gap-8 flex-col md:flex-row md:items-center">
                {
                    admin &&
                    (
                        <button
                            type="button"
                            className="text-sm px-5 py-3 w-auto md:w-auto rounded-md font-bold bg-sky-600 text-white text-center 
        hover:bg-sky-700 transition-colors uppercase flex items-center gap-2"
                            onClick={handleModalFormTask}
                        >
                            <PlusCircleIcon className="h-5 w-5" />
                            New task
                        </button>
                    )
                }

                <button
                    type="button"
                    className="text-white bg-blue-600 py-3 px-5 w-auto md:w-auto rounded-md text-sm uppercase text-center font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    onClick={() => setIsOpenDetails(!isOpenDetails)}
                >
                    {isOpenDetails ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    {isOpenDetails ? 'Hide details' : 'View details'}
                </button>
            </div>
            {
                isOpenDetails &&
                <div className="text-white mt-8 grid gap-2">
                    <p className="font-bold">Deadline:
                        <span className="text-gray-300 font-normal ml-2">{formatDate(deadline)}</span>
                    </p>
                    {
                        admin &&
                        <p className="font-bold">Client:
                            <span className="text-gray-300 font-normal ml-2">{client}</span>
                        </p>
                    }

                    <p className="font-bold">Description:
                        <span className="text-gray-300 font-normal ml-2">{description}</span>
                    </p>

                    <div>
                        <p className="font-bold">Progress: </p>
                        <ProgressBar progress={progress} />
                    </div>

                </div>
            }


            <p className="font-bold text-2xl mt-10 text-white">Project tasks</p>
            <div className={`bg-gray-1000 shadow mt-5 rounded-md flex flex-col gap-5 ${!existTasks ? 'border border-gray-700 bg-gray-850' : ''}`}>
                {
                    existTasks
                        ?
                        (
                            tasks?.map(_task => (
                                <Task key={_task._id} task={_task} />
                            ))
                        )
                        :
                        (
                            <p className="text-center text-gray-100 uppercase p-10">There are no tasks on this project</p>
                        )
                }
            </div>

            {
                admin &&
                (
                    <>
                        <div className="flex items-center justify-between mt-16">
                            <p className="font-bold text-2xl text-white">Collaborators</p>
                            <Link
                                className="text-gray-400 uppercase font-bold hover:text-white transition-colors"
                                to={`/projects/new-collaborator/${currentProject._id}`}
                            >Add</Link>
                        </div>
                        <div className={`bg-gray-1000 shadow mt-5 rounded-md ${!existCollaborators ? 'border border-gray-700 bg-gray-850' : ''}`}>
                            {
                                existCollaborators
                                    ?
                                    (
                                        collaborators?.map(_collaborator => (
                                            <Collaborator key={_collaborator._id} collaborator={_collaborator} />
                                        ))
                                    )
                                    :
                                    (
                                        <p className="text-center text-gray-100 uppercase p-10">There are no collaborators on this project</p>
                                    )
                            }
                        </div>
                    </>
                )
            }

            <ModalFormTask />
        </>

    )
}

export default Project