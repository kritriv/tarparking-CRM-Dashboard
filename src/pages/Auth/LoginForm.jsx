import { useState } from "react";
import {
  Button,
  Form,
  Input,
} from "antd";
import { useSignIn, useUserInfo } from "../../store/userStore";

function LoginForm() {
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

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{ marginBottom: "1rem", fontSize: "2rem", fontWeight: "bold" }}
      >
        Sign In
      </div>
      <Form
        name="login"
        size="large"
        onFinish={handleFinish}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Username required" }]}
        >
          <Input placeholder="Enter Email" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Password required" }]}
        >
          <Input.Password type="password" placeholder="Enter Password" />
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
      </Form>
    </div>
  );
}

export default LoginForm;
