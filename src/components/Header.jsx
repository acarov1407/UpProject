import { Link } from "react-router-dom";
import { Bars3Icon } from "@heroicons/react/24/outline"
import { FolderIcon } from "@heroicons/react/24/solid"
import useProject from "../hooks/useProject";

function Header() {

    const { isActiveResponsiveBar, setIsActiveResponsiveBar } = useProject();

    return (
        <header
            className="px-8 py-5 bg-gray-900 border-b border-gray-400"
        >
            <div className="flex justify-between flex-col sm:flex-row sm:items-center">
                <div className="text-white flex items-center gap-5">
                    <button
                        className="block md:hidden"
                        onClick={() => setIsActiveResponsiveBar(!isActiveResponsiveBar)}
                    >
                        <Bars3Icon className="h-11 w-11" />
                    </button>
                    <Link
                        to="/projects"
                    >
                        <h2 className="text-4xl text-sky-300 font-black text-center">
                            UpProject
                        </h2>
                    </Link>

                </div>

                <div className="md:flex md:gap-10 md:items-center">
                    <Link
                        to="create-project"
                        className="text-sm px-5 py-3 w-full md:w-auto rounded-md font-bold bg-indigo-600 text-white text-center mt-5 
                        hover:bg-indigo-700 transition-colors uppercase flex items-center gap-2 max-w-[200px]"
                    >
                        <FolderIcon className="h-6 w-6" />
                        New Project
                    </Link>
                </div>
            </div>
        </header>
    )
}

export default Header