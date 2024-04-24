import { useState } from "react";
import useProject from "../hooks/useProject";
import { AdjustmentsHorizontalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import MyTransition from "./MyTransition";

function Filter({ type }) {
    const [isOpen, setIsOpen] = useState(false);
    const { setProjectsFilter, activeFilter, setActiveFilter, projectsFilter, resetFilter } = useProject();

    const tempProjects = [...projectsFilter];
    const isFilterActive = activeFilter !== '';

    const filterByUrgentDesc = () => {
        const filtered = tempProjects.sort(function (a, b) {
            return new Date(a.deadline) - new Date(b.deadline);
        });

        setProjectsFilter(filtered);
        setActiveFilter('urgent-desc');
    }

    const filterByUrgentAsc = () => {
        const filtered = tempProjects.sort(function (a, b) {
            return new Date(b.deadline) - new Date(a.deadline);
        });

        setProjectsFilter(filtered);
        setActiveFilter('urgent-asc');
    }

    const filterByProgressDesc = () => {
        const filtered = tempProjects.sort(function (a, b) {
            return b.progress - a.progress;
        })

        setProjectsFilter(filtered);
        setActiveFilter('progress-desc');
    }

    const filterByProgressAsc = () => {
        const filtered = tempProjects.sort(function (a, b) {
            return a.progress - b.progress;
        })

        setProjectsFilter(filtered);
        setActiveFilter('progress-asc');
    }


    return (
        <>
            <div className={`border-b border-gray-700 py-1 text-white ${!isOpen ? 'mb-5' : ''} flex items-center justify-between`}>
                <button
                    className="flex items-center gap-2 hover:bg-gray-800 p-3 transition-colors rounded-md"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <AdjustmentsHorizontalIcon className="h-7 w-7" />
                    Filters
                </button>
                {
                    isFilterActive &&
                    <button
                        type="button"
                        onClick={() => resetFilter(type)}
                    >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                }
            </div>
            <MyTransition
                isOpen={isOpen}
            >
                <div className={`py-4 px-3 text-white flex gap-16`}>
                    <div>
                        <p className="uppercase text-xs border-b border-gray-300 py-3 font-bold">Deadline</p>
                        <div className="flex flex-col gap-3 py-4 items-start">
                            <button
                                type="button"
                                className={`text-sm hover:text-white transition-colors ${activeFilter === 'urgent-desc' ? 'font-bold text-gray-200' : 'text-gray-300'}`}
                                onClick={filterByUrgentDesc}
                            >
                                Higher Priority
                            </button>
                            <button
                                type="button"
                                className={`text-sm hover:text-white transition-colors ${activeFilter === 'urgent-asc' ? 'font-bold text-gray-200' : 'text-gray-300'}`}
                                onClick={filterByUrgentAsc}
                            >
                                Lower Priority
                            </button>
                        </div>
                    </div>

                    <div>
                        <p className="uppercase text-xs border-b border-gray-300 py-3 font-bold">Progress</p>
                        <div className="flex flex-col gap-3 py-4 items-start">
                            <button
                                type="button"
                                className={`text-sm hover:text-white transition-colors ${activeFilter === 'progress-desc' ? 'font-bold text-gray-200' : 'text-gray-300'}`}
                                onClick={filterByProgressDesc}
                            >
                                Greater Progress
                            </button>
                            <button
                                type="button"
                                className={`text-sm hover:text-white transition-colors ${activeFilter === 'progress-asc' ? 'font-bold text-gray-200' : 'text-gray-300'}`}
                                onClick={filterByProgressAsc}
                            >
                                Lower Progress
                            </button>
                        </div>
                    </div>
                </div>

            </MyTransition>
        </>
    )
}

export default Filter