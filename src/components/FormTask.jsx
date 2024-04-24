import { useState, useEffect } from "react";
import { validateEmpty, validateTaskForm } from "../helpers/validation";
import useProject from "../hooks/useProject";
import { useParams } from "react-router-dom";
import Alert from "../components/Alert";



const PRIORITY = ['Low', 'Medium', 'High'];

function FormTask() {

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('');

    const params = useParams();
    const {
        alert,
        showAlert,
        saveTask,
        isEditingTask,
        editTask,
        currentTask,
        currentProject } = useProject();


    const loadData = () => {
        setId(currentTask._id);
        setName(currentTask.name);
        setDescription(currentTask.description);
        setDeadline(currentTask.deadline.split('T')[0]);
        setPriority(currentTask.priority);
    }

    useEffect(() => {
        if (isEditingTask) loadData();
    }, []);

    const resetForm = () => {
        setName('');
        setDescription('');
        setDeadline('');
        setPriority('');
    }

    const handleSaveTask = async () => {
        const isSaved = await saveTask({ name, description, deadline, priority, project: params.id });
        if (isSaved) {
            resetForm();
        }

    }

    const handleEditTask = async () => {
        const isEdited = await editTask({ _id: id, name, description, deadline, priority });
        if (isEdited) {
            resetForm();
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const taskForm = validateTaskForm({ name, description, deadline, priority }, currentProject.deadline);
        if (!taskForm.isValid) {
            showAlert({ error: true, msg: taskForm.msg });
            return;
        }

        showAlert({});

        if (isEditingTask) {
            handleEditTask();
            return;
        }

        handleSaveTask();

    }
    return (
        <form
            className="bg-gray-900 shadow rounded-md p-10"
            onSubmit={handleSubmit}
        >
            {
                alert.msg && <Alert alert={alert}/>
            }

            <div>
                <label
                    className="text-gray-100 uppercase text-sm font-bold block"
                    htmlFor="name"
                >Task name</label>
                <input
                    id="name"
                    type="text"
                    placeholder="A name for the task"
                    className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mt-5">
                <label
                    className="text-gray-100 uppercase text-sm font-bold block"
                    htmlFor="description"
                >Description</label>
                <textarea
                    id="description"
                    placeholder="What's task about"
                    className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="mt-5">
                <label
                    className="text-gray-100 uppercase text-sm font-bold block"
                    htmlFor="deadline"
                >Deadline</label>
                <input
                    id="deadline"
                    type="date"
                    className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />
            </div>
            <div className="mt-5">
                <label
                    className="text-gray-100 uppercase text-sm font-bold block"
                    htmlFor="priority"
                >Priority</label>
                <select
                    id="priority"
                    className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >   <option value="">-- Select an option --</option>
                    {
                        PRIORITY.map(_priority => (
                            <option key={_priority} value={_priority}>{_priority}</option>
                        ))
                    }
                </select>
            </div>

            <input
                type="submit"
                value={`${isEditingTask ? 'Save changes' : 'Create task'}`}
                className="bg-indigo-500 w-full text-white uppercase font-bold py-2 rounded-md hover:cursor-pointer hover:bg-indigo-600 transition-colors mt-5"
            />
        </form>
    )
}

export default FormTask