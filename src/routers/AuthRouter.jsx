import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";

function AuthRouter() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default AuthRouter;
