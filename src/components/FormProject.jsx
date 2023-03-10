import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { validateEmpty, validateDeadline } from "../helpers/validation";
import useProject from "../hooks/useProject";
import Alert from "../components/Alert";

function FormProject() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [client, setClient] = useState('');

    const [isEditing, setIsEditing] = useState(false);

    const { alert, showAlert, saveProject, editProject, currentProject } = useProject();

    const params = useParams();

    const loadFormData = () => {
        setName(currentProject.name);
        setDescription(currentProject.description);
        setDeadline(currentProject.deadline?.split('T')[0]);
        setClient(currentProject.client);
    }

    useEffect(() => {
        if (params.id) {
            setIsEditing(true);
            loadFormData();
        } else {
            setIsEditing(false);
        }
    }, []);

    const resetForm = () => {
        setName('');
        setDescription('');
        setDeadline('');
        setClient('');
    }

    const saveDataProject = async () => {
        const isSaved = await saveProject({ name, description, deadline, client });
        if (isSaved) resetForm();
    }

    const editDataProject = async () => {
        const id = params.id;
        const isSaved = await editProject({ id, name, description, deadline, client });
        if (isSaved) resetForm();
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const isValidForm = validateEmpty({ name, description, deadline, client });
        const isValidDeadline = validateDeadline(deadline);

        if (!isValidForm) {
            showAlert({ error: true, msg: 'Todos los campos son obligatorios' });
            return;
        }

        if (!isValidDeadline) {
            showAlert({ error: true, msg: 'Debes introducir una fecha de entrega válida' });
            return;
        }

        showAlert({});

        if (isEditing) {
            editDataProject();
            return;
        } else {
            saveDataProject();
            return;
        }

    }


    return (
        <form
            className="mt-10 bg-gray-900 shadow rounded-md p-10 border border-gray-600 w-full max-w-lg"
            onSubmit={handleSubmit}
        >
            {
                alert.msg && <Alert alert={alert} />
            }
            <div>
                <label
                    className="text-gray-100 uppercase text-sm font-bold block"
                    htmlFor="name"
                >Nombre Proyecto</label>
                <input
                    id="name"
                    className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
                    type="text"
                    placeholder="Dale un nombre a tu proyecto"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="mt-5">
                <label
                    className="text-gray-100 uppercase text-sm font-bold block"
                    htmlFor="description"
                >Descripción</label>
                <textarea
                    id="description"
                    className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
                    type="text"
                    placeholder="De que trata tu proyecto"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />
            </div>
            <div className="mt-5">
                <label
                    className="text-gray-100 uppercase text-sm font-bold block"
                    htmlFor="deadline"
                >Fecha Entrega</label>
                <input
                    id="deadline"
                    className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />
            </div>
            <div className="mt-5">
                <label
                    className="text-gray-100 uppercase text-sm font-bold block"
                    htmlFor="client"
                >Cliente</label>
                <input
                    id="client"
                    className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
                    type="text"
                    placeholder="El cliente de tu proyecto"
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                />
            </div>

            <input
                className="bg-indigo-500 w-full text-white uppercase font-bold py-3 rounded-md hover:cursor-pointer hover:bg-indigo-600 transition-colors mt-5"
                type="submit"
                value={`${isEditing ? 'Guardar Cambios' : 'Crear Proyecto'}`}
            />
        </form>
    )
}

export default FormProject