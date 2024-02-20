import { Layout, Typography, Flex } from "antd";
import Color from "color";
import { Navigate } from "react-router-dom";

import DashboardImg from "../../assets/images/background/dashboard.png";
import Overlay2 from "../../assets/images/background/overlay_2.jpg";
import { useUserToken } from "../../store/userStore";
import { useThemeToken } from "../../theme/use-theme-token";

import LoginForm from "./LoginForm";

function Login() {
  const { Title } = Typography;
  const token = useUserToken();
  const { colorBgElevated } = useThemeToken();

  if (token.accessToken) {
    return <Navigate to="/" replace />;
  }

  const gradientBg = Color(colorBgElevated).alpha(0.9).toString();
  const bg = `linear-gradient(${gradientBg}, ${gradientBg}) center center / cover no-repeat,url(${Overlay2})`;

  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Flex direction="row" style={{ height: "100%", width: "100%" }}>
        <Flex
          justify="center"
          align="center"
          style={{ background: bg, flex: 2 }}
        >
          <div style={{ textAlign: "center" }}>
            <Title style={{ display: "block" }}>
             Admin Dashboard
            </Title>
            <img src={DashboardImg} style={{ maxWidth: "100%" }} alt="" />
            <Title level={5} style={{ display: "block" }}>
              Quotation Management System
            </Title>
          </div>
        </Flex>
        <Flex justify="center" align="center" style={{ flex: 1 }}>
          <LoginForm />
        </Flex>
      </Flex>
    </Layout>
  );
}
export default Login;
