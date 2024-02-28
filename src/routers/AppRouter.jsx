import { Routes, Route } from "react-router-dom";
import RoutesList from "./routes";

function AppRouter() {
    return (
        <Routes>
            {RoutesList.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
            ))}
        </Routes>
    );
}
export default AppRouter;
