import { Outlet, Navigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Spinner from "../components/Spinner";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

function ProtectedRoute() {

    const { auth, isLoadingToken } = useAuth();

    if (isLoadingToken) return <Spinner />

    return (
        <>
            {
                auth._id
                    ?
                    (
                        <div className="bg-gray-1000">
                            <Header />
                            <div className="md:flex md:min-h-screen">
                                <Sidebar />

                                <main className="flex-1 p-10 max-w-6xl mx-auto">
                                    <Outlet />
                                </main>
                            </div>
                        </div>
                    )
                    :
                    <Navigate to="/" />
            }
        </>
    )
}

export default ProtectedRoute