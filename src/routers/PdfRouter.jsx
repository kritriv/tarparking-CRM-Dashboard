import { Routes, Route } from "react-router-dom";
import ViewPdf from "../Views/Pdf/ViewPdf";

function AuthRouter() {
    return (
        <Routes>
            <Route path="/quotes/pdf/:id" element={<ViewPdf />} />
        </Routes>
    );
}

export default AuthRouter;
