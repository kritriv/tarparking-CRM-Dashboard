import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/custom.css";
import MainLayout from "./components/Layouts/MainLayout";
import Home from "./pages/Home/Home";
import Client from "./pages/Clients/client";
import Users from "./pages/Users/user";
import Admins from "./pages/Users/admin";
import About from "./pages/About/About";
import Login from "./pages/Auth/Login";
import { useUserInfo } from "./store/userStore";

function App() {
  const userInfo = useUserInfo();

  return (
    <Router>
      {/* Conditional rendering based on userInfo */}
      {Object.keys(userInfo).length !== 0 ? (
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />}>
              <Route path="/about/list" element={<About />} />
              <Route path="/about/list/update" element={<About />} />
              <Route path="/about/list/create" element={<About />} />
            </Route>
            <Route path="/clients" element={<Client />} />
            <Route path="/users" >
              <Route path="/users/admin" element={<Admins />} />
              <Route path="/users/user" element={<Users />} />
            </Route>
          </Routes>
        </MainLayout>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Add more routes for non-authenticated users if needed */}
        </Routes>
      )}
    </Router>
  );
}

export default App;
