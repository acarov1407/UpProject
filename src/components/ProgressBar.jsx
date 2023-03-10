
function ProgressBar({ progress }) {
    return (
        <div className="bg-gray-700 mt-2 max-w-lg rounded-full">
            <div
                className="rounded-full bg-amber-600 text-xs text-center transition-all"
                style={{ width: `${progress}%` }}
            >
                <p className="text-center text-md font-bold px-2">{parseInt(progress)}%</p>
            </div>

        </div>
    )
}

export default ProgressBar