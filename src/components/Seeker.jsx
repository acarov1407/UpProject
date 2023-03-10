import useProject from "../hooks/useProject";
import { MagnifyingGlassCircleIcon } from "@heroicons/react/24/outline"

function Seeker({ onChange }) {

    const { searchTerm, setSearchTerm } = useProject();

    const handleChange = async (e) => {
        setSearchTerm(e.target.value);
        onChange(e.target.value);
    }

    return (
        <form
            className="mb-5 relative"
            onSubmit={(e) => e.preventDefault()}
        >
            <input
                type="search"
                placeholder="Buscar Proyecto..."
                className="w-full py-2 pl-12 pr-2 rounded-md bg-gray-700 border border-gray-600 placeholder-gray-400 text-gray-100 focus:outline-none focus:border-indigo-500 
                max-w-[250px] focus:max-w-xl transition-all duration-500"
                value={searchTerm}
                onChange={handleChange}
            />
            <div className="absolute top-[5px] left-2 text-white">
                <MagnifyingGlassCircleIcon className="h-8 w-8" />
            </div>
        </form>
    )
}

export default Seeker