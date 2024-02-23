import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/custom.css";
import MainLayout from "./components/Layouts/MainLayout";
import Login from "./pages/Auth/Login";

import Home from "./pages/Home/Home";

import UserPage from "./pages/Users/user";
import AdminsPage from "./pages/Users/admin";
import EditUser from "./Views/User/EditUser";
import CreateUser from "./Views/User/CreateUser";
import ViewUser from "./Views/User/ViewUser";

import ClientPage from "./pages/Clients/client";
import CreateClient from "./Views/Client/CreateClient";


import { useUserInfo } from "./store/userStore";

function App() {
  const userInfo = useUserInfo();

  return (
    <Router>
      {Object.keys(userInfo).length !== 0 ? (
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/clients" element={<ClientPage />} />
            <Route path="/clients/create" element={<CreateClient />} />

            <Route path="/users" element={<UserPage />} />
            <Route path="/users/:id" element={<ViewUser />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="users/edit-user/:id" element={<EditUser />} />

            <Route path="/admins" element={<AdminsPage />} />
            <Route path="/admins/:id" element={<ViewUser />} />
            <Route path="/admins/create" element={<CreateUser />} />
            <Route path="/admins/edit-admin/:id" element={<EditUser />} />

          </Routes>
        </MainLayout>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />

        </Routes>
      )}
    </Router>
  );
}

export default App;
