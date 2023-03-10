import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthLayout from "./layouts/AuthLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RecoverPassword from "./pages/RecoverPassword";
import NewPassword from "./pages/NewPassword";
import ConfirmAccount from "./pages/ConfirmAccount";

import { AuthProvider } from "./context/AuthProvider";
import { ProjectProvider } from "./context/ProjectProvider";
import ProtectedRoute from "./layouts/ProtectedRoute";
import Projects from "./pages/Projects";
import NewProject from "./pages/NewProject";
import Project from "./pages/Project";
import ProjectEdit from "./pages/ProjectEdit";
import NewCollaborator from "./pages/NewCollaborator";
import ProjectFavorites from "./pages/ProjectFavorites";

function App() {


  return (

    <BrowserRouter>
      <AuthProvider>
        <ProjectProvider>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="recover-password" element={<RecoverPassword />} />
              <Route path="recover-password/:token" element={<NewPassword />} />
              <Route path="confirm/:id" element={<ConfirmAccount />} />
            </Route>

            <Route path="/projects" element={<ProtectedRoute />}>
              <Route index element={<Projects />} />
              <Route path="create-project" element={<NewProject />} />
              <Route path="new-collaborator/:id" element={<NewCollaborator />} />
              <Route path=":id" element={<Project />} />
              <Route path="edit/:id" element={<ProjectEdit />} />
              <Route path="favorites" element={<ProjectFavorites />} />
            </Route>
          </Routes>
        </ProjectProvider>
      </AuthProvider>
    </BrowserRouter>


  )
}

export default App
