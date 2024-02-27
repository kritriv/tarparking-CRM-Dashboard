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
import EditClient from "./Views/Client/EditClient";
import CreateClient from "./Views/Client/CreateClient";
import ViewClient from "./Views/Client/ViewClient";

import CompanyPage from "./pages/Company/company";
import CreateCompany from "./Views/Company/CreateCompany";
import EditCompany from "./Views/Company/EditCompany";
import ViewCompany from "./Views/Company/ViewCompany";

import CategoryPage from "./pages/Category/category";
import CreateCategory from "./Views/Category/CreateCategory";
import EditCategory from "./Views/Category/EditCategory";
import ViewCategory from "./Views/Category/ViewCategory";

import { useUserInfo } from "./store/userStore";

function App() {
  const userInfo = useUserInfo();

  return (
    <Router>
      {Object.keys(userInfo).length !== 0 ? (
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/admins" element={<AdminsPage />} />
            <Route path="/admins/:id" element={<ViewUser />} />
            <Route path="/admins/create" element={<CreateUser />} />
            <Route path="/admins/edit-admin/:id" element={<EditUser />} />

            <Route path="/users" element={<UserPage />} />
            <Route path="/users/:id" element={<ViewUser />} />
            <Route path="/users/create" element={<CreateUser />} />
            <Route path="users/edit-user/:id" element={<EditUser />} />

            <Route path="/company" element={<CompanyPage />} />
            <Route path="/company/:id" element={<ViewCompany />} />
            <Route path="/company/create" element={<CreateCompany />} />
            <Route path="/company/edit-company/:id" element={<EditCompany />} />

            <Route path="/clients" element={<ClientPage />} />
            <Route path="/clients/:id" element={<ViewClient />} />
            <Route path="/clients/create" element={<CreateClient />} />
            <Route path="/clients/edit-client/:id" element={<EditClient />} />

            <Route path="/category" element={<CategoryPage />} />
            <Route path="/category/:id" element={<ViewCategory />} />
            <Route path="/category/create" element={<CreateCategory />} />
            <Route path="/category/edit-category/:id" element={<EditCategory />} />

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
