import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Select, Button, notification, Space } from "antd";
import { ClientsServicesAPI } from "../../apis";
import { useNavigate } from "react-router-dom";

const ViewClientPage = () => {
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

    const handleGoBack = () => {
        navigate(`/Clients`);
    };

    return (
        <Card title="Client details" style={{ padding: 30, margin: 10 }}>
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
                            <Input placeholder="Enter Name" disabled />
                        </Form.Item>
                        <Form.Item
                            name="Clientname"
                            label="Clientname"
                            rules={[
                                { required: true, message: "Please enter Clientname" },
                            ]}
                        >
                            <Input placeholder="Enter Clientname" disabled />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Please enter email" },
                                { type: "email", message: "Please enter a valid email" },
                            ]}
                        >
                            <Input placeholder="Enter Email" disabled />
                        </Form.Item>
                        <Form.Item
                            name="role"
                            label="Role"
                            rules={[
                                { required: true, message: "Please select a role" },
                            ]}
                        >
                            <Select disabled >
                                <Select.Option value="Client">Client</Select.Option>
                                <Select.Option value="ADMIN">ADMIN</Select.Option>
                                <Select.Option value="SUPERADMIN">SUPERADMIN</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleGoBack} loading={loading}>
                                Go Back
                            </Button>
                        </Form.Item>
                    </Form>
                )}
            </div>
        </Card>
    );
};

export default ViewClientPage;
