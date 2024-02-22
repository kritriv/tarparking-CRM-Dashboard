import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Select, Button, notification, Space } from "antd";
import { UsersServicesAPI } from "../../apis";
import { useNavigate } from "react-router-dom";

const EditUserPage = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchUserData(id);
    }, [id]);

    const fetchUserData = async (id) => {
        try {
            setLoading(true);
            const response = await UsersServicesAPI.readUser(id);

            if (response.success) {
                setUserData(response.data);
            } else {
                console.error("Error fetching user data:", response.message);
                notification.error({
                    message: "Error",
                    description: "Failed to fetch user details.",
                });
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch user details. Please try again later.",
            });
        }
    };

    const handleEditUser = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                UsersServicesAPI.updateUser(id, values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "User details updated successfully.",
                        });
                        navigate(`/people/user`);
                    })
                    .catch((error) => {
                        console.error("Error updating user details:", error);
                        notification.error({
                            message: "Error",
                            description: "Failed to update user details. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            console.error("Error updating user details:", error);
            notification.error({
                message: "Error",
                description: "Failed to update user details. Please try again later.",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Edit User"  style={{ padding: 30, margin: 10 }}>
            <div>
                {userData && (
                    <Form form={form} layout="vertical" initialValues={userData}>
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[
                                { required: true, message: "Please enter name" },
                            ]}
                        >
                            <Input placeholder="Enter Name"/>
                        </Form.Item>
                        <Form.Item
                            name="username"
                            label="Username"
                            rules={[
                                { required: true, message: "Please enter username" },
                            ]}
                        >
                            <Input placeholder="Enter username"/>
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Please enter email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input placeholder="Enter Email"/>
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label="Role"
                            rules={[
                                { required: true, message: "Please select a role" },
                            ]}
                        >
                            <Select>
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
                            <Input.Password placeholder="Enter password"/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleEditUser} loading={loading}>
                                Update
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </div>
        </Card>
    );
};

export default EditUserPage;
