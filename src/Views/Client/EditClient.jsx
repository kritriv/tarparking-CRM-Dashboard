import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Select, Button, notification, Space } from "antd";
import { ClientsServicesAPI } from "../../apis";
import { useNavigate } from "react-router-dom";

const EditClientPage = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [ClientData, setClientData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchClientData(id);
    }, [id]);

    const fetchClientData = async (id) => {
        try {
            setLoading(true);
            const response = await ClientsServicesAPI.readClient(id);

            if (response.success) {
                setClientData(response.data);
            } else {
                console.error("Error fetching Client data:", response.message);
                notification.error({
                    message: "Error",
                    description: "Failed to fetch Client details.",
                });
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching Client data:", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch Client details. Please try again later.",
            });
        }
    };

    const handleEditClient = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                ClientsServicesAPI.updateClient(id, values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Client details updated successfully.",
                        });
                        navigate(`/people/Client`);
                    })
                    .catch((error) => {
                        console.error("Error updating Client details:", error);
                        notification.error({
                            message: "Error",
                            description: "Failed to update Client details. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            console.error("Error updating Client details:", error);
            notification.error({
                message: "Error",
                description: "Failed to update Client details. Please try again later.",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Edit Client"  style={{ padding: 30, margin: 10 }}>
            <div>
                {ClientData && (
                    <Form form={form} layout="vertical" initialValues={ClientData}>
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
                            name="Clientname"
                            label="Clientname"
                            rules={[
                                { required: true, message: "Please enter Clientname" },
                            ]}
                        >
                            <Input placeholder="Enter Clientname"/>
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
                                <Select.Option value="Client">Client</Select.Option>
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
                            <Button type="primary" onClick={handleEditClient} loading={loading}>
                                Update
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </div>
        </Card>
    );
};

export default EditClientPage;
