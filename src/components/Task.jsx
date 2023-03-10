import { formatDate } from "../helpers/formatDate";
import { useState } from "react";
import useProject from "../hooks/useProject";
import useAdmin from "../hooks/useAdmin";
import { showAlertDelete } from "../helpers/alerts";
import { EllipsisHorizontalCircleIcon } from "@heroicons/react/24/outline";

function Task({ task }) {

    const { _id, name, description, deadline, priority, state, completedBy } = task;

    const { handleModalEditTask, deleteTask, completeTask } = useProject();

    const admin = useAdmin();

    const [isOptionMenuOpen, setIsOptionMenuOpen] = useState(false);
    const [isUpdatingState, setIsUpdatingState] = useState(false);

    const handleClickDelete = async () => {
        
        handleOptionMenu();
        const result = await showAlertDelete('¿Estas seguro que quieres eliminar esta tarea?');

        if (result.isConfirmed) {
            await deleteTask(_id);
        }     
    }

    const handleClickEdit = () => {
        handleOptionMenu();
        handleModalEditTask(task);       
    }

    const handleClickCompleteTask = async() => {
        setIsUpdatingState(true);
        await completeTask(_id);
        setIsUpdatingState(false);
    }

    const handleOptionMenu = () => {
        setIsOptionMenuOpen(!isOptionMenuOpen);
    }

    return (
        <div className={`rounded-md p-5 flex justify-between items-center bg-gray-850 ${state ? 'border-green-800' : 'border-red-800'} relative border-l-8`}>
            <div>
                <p className="mt-2 text-xl text-white">{name}</p>
                <p className="mt-2 text-sm text-gray-300 uppercase">{description}</p>
                <p className="mt-2 text-md text-gray-400">{formatDate(deadline)}</p>
                <p className="mt-2 text-gray-100">Prioridad: <span>{priority}</span></p>
                {
                   state && <p className="mt-2 text-gray-200">Completado Por: <span className="text-white">{completedBy?.name}</span></p>
                }
            </div>
            <div className="w-52 flex justify-center">
                <button
                    className={`${state ? 'bg-sky-600 hover:bg-sky-700' : 'bg-gray-700 hover:bg-gray-800'} px-4 py-3 text-white uppercase font-bold text-sm rounded-lg transition-colors`}
                    type="button"
                    onClick={handleClickCompleteTask}
                    disabled={isUpdatingState}
                >
                    {state ? 'Completa' : 'Incompleta'}
                </button>
            </div>

            {
                admin &&
                (
                    <>
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-300 hover:text-white transition-colors"
                            onClick={handleOptionMenu}
                        >
                            <EllipsisHorizontalCircleIcon className="h-8 w-8" />
                        </button>

                        <div className={`absolute bg-gray-850 top-14 right-3 ${isOptionMenuOpen ? 'block' : 'hidden'} flex flex-col gap-2 w-48`}>
                            <button
                                className="bg-indigo-500 px-4 py-3 text-white uppercase font-bold text-sm hover:bg-indigo-600 transition-colors w-full block rounded-sm"
                                type="button"
                                onClick={handleClickEdit}
                            >
                                Editar
                            </button>

                            <button
                                className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm hover:bg-red-700 transition-colors w-full block rounded-sm"
                                type="button"
                                onClick={handleClickDelete}
                            >
                                Eliminar
                            </button>
                        </div>
                    </>
                )
            }
        </div >
    )
}

export default Task