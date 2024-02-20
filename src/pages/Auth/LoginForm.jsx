import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import {
  Alert,
  Button,
  Checkbox,
  Col,
  Divider,
  Flex,
  Form,
  Input,
  Row,
  Space,
  Tag,
} from "antd";
import { AiFillGithub, AiFillGoogleCircle, AiFillWechat } from "react-icons/ai";
import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { DEFAULT_USER } from "../../mock/assets";
import { useSignIn, useUserInfo } from "../../store/userStore";
import { useThemeToken } from "../../theme/use-theme-token";

function LoginForm() {
  const [copied, setCopied] = useState(null);
  const navigate = useNavigate();
  const themeToken = useThemeToken();
  const [loading, setLoading] = useState(false);

  const signIn = useSignIn();
  const userInfo = useUserInfo();

  if (!userInfo) return null;

  const handleFinish = async ({ email, password }) => {
    setLoading(true);
    try {
      await signIn({ email, password });
    } finally {
      setLoading(false);
    }
  };
  const handleCopy = (field) => {
    setCopied(field);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{ marginBottom: "1rem", fontSize: "1.5rem", fontWeight: "bold" }}
      >
        Sign in
      </div>
      <Form
        name="login"
        size="large"
        initialValues={{
          remember: true,
          username: DEFAULT_USER.email,
          password: DEFAULT_USER.password,
        }}
        onFinish={handleFinish}
      >
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Alert
            type="info"
            message={
              <>
                <Space direction="vertical" style={{ margin: "10px" }}>
                  <Flex>
                    <Tag bordered={false} color="cyan">
                      <strong>Admin user:</strong>
                    </Tag>
                    <strong
                      style={{
                        margin: "2px 6px",
                        color: themeToken.colorInfoTextHover,
                      }}
                    >
                      <Space>
                        <span>{DEFAULT_USER.username}</span>
                        <CopyToClipboard
                          text={DEFAULT_USER.username}
                          onCopy={() => handleCopy('username')}
                        >
                          <span className="clipboard">
                            {copied === 'username' ? <LuCopyCheck /> : <LuCopy />}
                          </span>
                        </CopyToClipboard>
                      </Space>
                    </strong>
                  </Flex>
                  <Flex>
                    <Tag bordered={false} color="cyan">
                      <strong>Password:</strong>
                    </Tag>
                    <strong
                      style={{
                        margin: "2px 6px",
                        color: themeToken.colorInfoTextHover,
                      }}
                    >
                      <Space>
                        <span>{DEFAULT_USER.password}</span>
                        <CopyToClipboard
                          text={DEFAULT_USER.password}
                          onCopy={() => handleCopy('password')}
                        >
                          <span className="clipboard">
                            {copied === 'password' ? <LuCopyCheck /> : <LuCopy />}
                          </span>
                        </CopyToClipboard>
                      </Space>
                    </strong>
                  </Flex>
                </Space>
              </>
            }
            showIcon
          />
        </div>

        <Form.Item
          name="email"
          rules={[{ required: true, message: "user name required" }]}
        >
          <Input placeholder="email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "passord required" }]}
        >
          <Input.Password type="password" placeholder="password" />
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>remember me</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            style={{ width: "100%" }}
            loading={loading}
          >
            login
          </Button>
        </Form.Item>
        <Divider style={{ fontSize: "0.75rem" }}>Other Login Options</Divider>

        <Row align="middle" gutter={8}>
          <Col span={12} flex="1">
            <Button
              style={{ width: "100%", fontSize: "0.875rem" }}
              onClick={() => navigate("/")}
            >
              Mobile SignIn
            </Button>
          </Col>

          <Col span={9} flex="1" onClick={() => navigate("/")}>
            <Button style={{ width: "100%", fontSize: "0.875rem" }}>
              Sign Up
            </Button>
          </Col>
        </Row>

        {/* 
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            fontSize: "1.5rem",
          }}
        >
          <AiFillGithub />
          <AiFillWechat />
          <AiFillGoogleCircle />
        </div> */}
      </Form>
    </div>
  );
}

export default LoginForm;
