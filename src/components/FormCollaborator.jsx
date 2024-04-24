import { useState } from "react";
import { validateEmpty, validateEmail } from "../helpers/validation";
import useProject from "../hooks/useProject";
import Alert from "./Alert";
import Spinner from "../components/Spinner"

function FormCollaborator() {

    const [email, setEmail] = useState('');

    const {alert, showAlert, searchCollaborator} = useProject();

    const handleSubmit = (e) => {
        e.preventDefault();

        const isFull = validateEmpty({email});
        const isValidEmail = validateEmail(email);

        if(!isFull){
            showAlert({error: true, msg: 'Todos los campos son obligatorios'})
            return;
        }

        if(!isValidEmail){
            showAlert({error: true, msg: 'Debes introducir un email válido'});
            return;
        }

        showAlert({});

        searchCollaborator(email);

    }

    return (
        <form
            className="mt-10 bg-gray-900 shadow rounded-md p-10 border border-gray-600 w-full max-w-lg"
            onSubmit={handleSubmit}
        >
            {
                alert.msg &&
                <Alert alert={alert} />
            }
            <div>
                <label
                    className="uppercase text-gray-100 block text-md font-bold"
                    htmlFor="email"
                >Collaborator email</label>
                <input
                    id="email"
                    className="w-full mt-3 p-3 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500"
                    type="email"
                    placeholder="Collaborator email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <input
                className="bg-indigo-500 w-full text-white uppercase font-bold py-3 rounded-md hover:cursor-pointer hover:bg-indigo-600 transition-colors mt-5"
                type="submit"
                value="Search collaborator"
            />
        </form>
    )
}

export default FormCollaborator