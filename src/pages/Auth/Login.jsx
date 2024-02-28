import { Row, Typography, Col } from "antd";
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
    <Row justify="center" align="middle" style={{ height: "100vh" }}>
      <Col
        xs={{ span: 0, order: 2 }}
        sm={{ span: 0, order: 2 }}
        md={{ span: 24 }}
        lg={{ span: 14, offset: 0 }}
        xl={{ span: 14, offset: 0 }}
        xxl={{ span: 14, offset: 0 }}
      >
        <div style={{ textAlign: "center", background: bg, padding: "15rem 0" }}>
          <Title style={{ display: "block" }}>
            Admin Dashboard
          </Title>
          <Title level={5} style={{ display: "block" }}>
            Tar Parking CRM (Quotation Management System)
          </Title>
          <img src={DashboardImg} style={{ maxWidth: "100%" }} alt="" />
        </div>
      </Col>

      <Col
        xs={{ span: 24, order: 1 }}
        sm={{ span: 24, order: 1 }}
        md={{ span: 14, order: 2 }}
        lg={{ span: 10 }}
        xl={{ span: 10 }}
        xxl={{ span: 10 }}
        style={{ textAlign: "center", padding: "10rem 5rem" }}
      >
        <LoginForm />
      </Col>
    </Row>
  );
}

export default Login;
