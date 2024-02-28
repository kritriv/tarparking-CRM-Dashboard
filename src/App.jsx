import { Suspense } from 'react';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/custom.css";
import MainLayout from "./components/Layouts/MainLayout";
import PageLoader from "./components/PageLoader";
import Login from "./pages/Auth/Login";
import RoutesList from "./routers/routes";
import { useUserInfo } from "./store/userStore";

function App() {
  const userInfo = useUserInfo();

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        {Object.keys(userInfo).length !== 0 ? (
          <MainLayout>
            <Routes>
              {RoutesList.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))}
            </Routes>
          </MainLayout>
        ) : (
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        )}
      </Suspense>

    </Router>
  );
}

export default App;
