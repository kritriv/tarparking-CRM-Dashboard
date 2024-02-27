import { useState } from "react";
import { Card, Form, Input, Select, Button, notification } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";

const CreateUserPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/users`);
    };
    const handleCreateUser = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                APIService.UserApi.createResource(values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "User successfully Created.",
                        });
                        navigate(`/users`);
                    })
                    .catch((error) => {
                        notification.error({
                            message: "Error",
                            description: "Failed to create user. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to create user. Please try again later",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Create User Or Admin" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} style={{ padding: 30, margin: 10 }}>
            <div>
                <Form form={form} layout="vertical" >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            { required: true, message: "Please enter name" },
                        ]}
                    >
                        <Input placeholder="Enter Name" />
                    </Form.Item>
                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            { required: true, message: "Please enter username" },
                        ]}
                    >
                        <Input placeholder="Enter username" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Please enter email" },
                            { type: "email", message: "Please enter a valid email" },
                        ]}
                    >
                        <Input placeholder="Enter Email" />
                    </Form.Item>
                    <Form.Item
                        name="role"
                        label="Role"
                        rules={[
                            { required: true, message: "Please select a role" },
                        ]}
                    >
                        <Select placeholder="Select Role">
                            <Select.Option value="USER">USER</Select.Option>
                            <Select.Option value="ADMIN">ADMIN</Select.Option>
                            <Select.Option value="SUPERADMIN">SUPERADMIN</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            {
                                required: true,
                                message: "Please enter password",
                            },
                        ]}
                    >
                        <Input.Password placeholder="Enter password" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={handleCreateUser} loading={loading}>
                            Create user
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Card>
    );
};

export default CreateUserPage;
