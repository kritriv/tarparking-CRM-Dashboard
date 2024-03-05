import Home from "../pages/Home/Home";
import AdminsPage from "../pages/Users/admin";
import UserPage from "../pages/Users/user";
import ViewUser from "../Views/User/ViewUser";
import CreateUser from "../Views/User/CreateUser";
import EditUser from "../Views/User/EditUser";
import ClientPage from "../pages/Clients/client";
import ViewClient from "../Views/Client/ViewClient";
import CreateClient from "../Views/Client/CreateClient";
import EditClient from "../Views/Client/EditClient";
import CompanyPage from "../pages/Company/company";
import CreateCompany from "../Views/Company/CreateCompany";
import EditCompany from "../Views/Company/EditCompany";
import ViewCompany from "../Views/Company/ViewCompany";
import CategoryPage from "../pages/Category/category";
import CreateCategory from "../Views/Category/CreateCategory";
import EditCategory from "../Views/Category/EditCategory";
import ViewCategory from "../Views/Category/ViewCategory";
import ProductPage from "../pages/Product/product";
import CreateProduct from "../Views/Product/CreateProduct";
import EditProduct from "../Views/Product/EditProduct";
import ViewProduct from "../Views/Product/ViewProduct";
import SubProductPage from "../pages/SubProduct/subProduct";
import CreateSubProduct from "../Views/SubProduct/CreateSubProduct";
import EditSubProduct from "../Views/SubProduct/EditSubProduct";
import ViewSubProduct from "../Views/SubProduct/ViewSubProduct";

import TncPage from "../pages/Term-Condition/term-condition";

const routes = [
    { path: '/', element: <Home /> },

    { path: '/admins', element: <AdminsPage /> },
    { path: '/admins/:id', element: <ViewUser /> },
    { path: '/admins/create', element: <CreateUser /> },
    { path: '/admins/edit-admin/:id', element: <EditUser /> },

    { path: '/users', element: <UserPage /> },
    { path: '/users/:id', element: <ViewUser /> },
    { path: '/users/create', element: <CreateUser /> },
    { path: '/users/edit-user/:id', element: <EditUser /> },

    { path: '/company', element: <CompanyPage /> },
    { path: '/company/:id', element: <ViewCompany /> },
    { path: '/company/create', element: <CreateCompany /> },
    { path: '/company/edit-company/:id', element: <EditCompany /> },

    { path: '/clients', element: <ClientPage /> },
    { path: '/clients/:id', element: <ViewClient /> },
    { path: '/clients/create', element: <CreateClient /> },
    { path: '/clients/edit-client/:id', element: <EditClient /> },

    { path: '/category', element: <CategoryPage /> },
    { path: '/category/:id', element: <ViewCategory /> },
    { path: '/category/create', element: <CreateCategory /> },
    { path: '/category/edit-category/:id', element: <EditCategory /> },

    { path: '/products', element: <ProductPage /> },
    { path: '/products/:id', element: <ViewProduct /> },
    { path: '/products/create', element: <CreateProduct /> },
    { path: '/products/edit-product/:id', element: <EditProduct /> },

    { path: '/sub-products', element: <SubProductPage /> },
    { path: '/sub-products/:id', element: <ViewSubProduct /> },
    { path: '/sub-products/create', element: <CreateSubProduct /> },
    { path: '/sub-products/edit-sub-product/:id', element: <EditSubProduct /> },

    { path: '/term-conditions', element: <TncPage /> },
];

export default routes;
