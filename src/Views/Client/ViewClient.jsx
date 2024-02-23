import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Switch, Button, notification, Row, Col, InputNumber } from "antd";
import { ClientServicesAPI } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const ViewClientPage = () => {
    const { id } = useParams();
    const userInfo = useUserInfo();
    const editBy = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [clientData, setClientData] = useState(null);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/clients`);
    };

    useEffect(() => {
        fetchClientData(id);
    }, [id]);

    const fetchClientData = async (id) => {
        try {
            setLoading(true);
            const response = await ClientServicesAPI.readClient(id);

            if (response.success) {
                // Set the fetched data as initial values
                form.setFieldsValue(response.data);
                setClientData(response.data);
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

    return (
        <Card title="View Client Details" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} style={{ padding: 50, margin: 10 }}>
            <Row gutter={16}>
                <Col span={12}>
                    <div>
                        <h2>Client Information</h2>
                        <Form form={form} layout="vertical" initialValues={clientData}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item name="status" label="Status">
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked={clientData?.status === 'Active'} disabled/>
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="editBy"
                                        label="EditBy (You)"
                                        initialValue={editBy}
                                    >
                                        <Input placeholder="Enter EditBy Id" disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="username" label="Username">
                                        <Input placeholder="Enter Username" disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="name" label="Name">
                                        <Input placeholder="Enter Name" disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="email"
                                label="Email"
                            >
                                <Input placeholder="Enter Email" disabled />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Phone Number"
                            >
                                <Input placeholder="Enter Phone Number" disabled />
                            </Form.Item>

                            <Form.Item
                                name="company"
                                label="Company"
                            >
                                <Input placeholder="Enter Company" disabled />
                            </Form.Item>

                            <Form.Item name="gst" label="GST">
                                <Input placeholder="Enter GST" disabled />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
                <Col span={12}>
                    <div>
                        <h2>Address Information</h2>
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name={["address", "site"]}
                                label="Site"
                            >
                                <Input placeholder="Enter Site" disabled />
                            </Form.Item>

                            <Form.Item
                                name={["address", "street"]}
                                label="Street"
                            >
                                <Input placeholder="Enter Street" disabled />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={18}>
                                    <Form.Item
                                        name={["address", "city"]}
                                        label="City"
                                    >
                                        <Input placeholder="Enter City" disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        name={["address", "pincode"]}
                                        label="Pincode"
                                    >
                                        <InputNumber placeholder="Enter Pincode" disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name={["address", "state"]}
                                label="State"
                            >
                                <Input placeholder="Enter State" disabled />
                            </Form.Item>
                            <Form.Item
                                name={["address", "country"]}
                                label="Country"
                            >
                                <Input placeholder="Enter Country" disabled />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
            {/* No need for the Update button in view mode */}
        </Card>
    );
};

export default ViewClientPage;
