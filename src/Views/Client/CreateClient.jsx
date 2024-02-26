import { useState } from "react";
import { Card, Form, Input, Switch, Button, notification, Row, Col, InputNumber } from "antd";
import { ClientServicesAPI } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const CreateClientPage = () => {
    const userInfo = useUserInfo();
    const createby = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/clients`);
    };

    const handleCreateClient = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                ClientServicesAPI.createClient(values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Client successfully Created.",
                        });
                        navigate(`/Clients`);
                    })
                    .catch((error) => {
                        notification.error({
                            message: "Error",
                            description: "Failed to create Client. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to create Client. Please try again later",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Create Client" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} style={{ padding: 50, margin: 10 }}>
            <Row gutter={100}>
                {/* Left Side - Client Information */}
                <Col span={12}>
                    <div>
                        <h2>Client Information</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="createdby"
                                        label="CreatedBy (You)"
                                        rules={[{ required: true, message: "Please CreatedBy Id" }]}
                                        initialValue={createby}
                                    >
                                        <Input placeholder="Enter CreatedBy Id" disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="username" label="Username" rules={[{ required: true, message: "Please enter Username" }]}>
                                        <Input placeholder="Enter Username" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter Name" }]}>
                                        <Input placeholder="Enter Name" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: "Please enter Email" },
                                    { type: "email", message: "Please enter a valid Email" },
                                ]}
                            >
                                <Input placeholder="Enter Email" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Phone Number"
                                rules={[{ required: true, message: "Please enter Phone Number" }]}
                            >
                                <Input placeholder="Enter Phone Number" />
                            </Form.Item>

                            <Form.Item
                                name="company"
                                label="Company"
                                rules={[{ required: true, message: "Please enter Company" }]}
                            >
                                <Input placeholder="Enter Company" />
                            </Form.Item>

                            <Form.Item name="gst" label="GST" rules={[{ required: true, message: "Please enter GST" }]}>
                                <Input placeholder="Enter GST" />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>

                {/* Right Side - Address Information */}
                <Col span={10}>
                    <div>
                        <h2>Address Information</h2>
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name={["address", "site"]}
                                label="Site"
                                rules={[{ required: true, message: "Please enter Site" }]}
                            >
                                <Input placeholder="Enter Site" />
                            </Form.Item>

                            <Form.Item
                                name={["address", "street"]}
                                label="Street"
                                rules={[{ required: true, message: "Please enter Street" }]}
                            >
                                <Input placeholder="Enter Street" />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col span={18}>
                                    <Form.Item
                                        name={["address", "city"]}
                                        label="City"
                                        rules={[{ required: true, message: "Please enter City" }]}
                                    >
                                        <Input placeholder="Enter City" />
                                    </Form.Item>
                                </Col>
                                <Col span={4}>
                                    <Form.Item
                                        name={["address", "pincode"]}
                                        label="Pincode"
                                        rules={[{ required: true, message: "Please enter Pincode" },
                                        { type: "number", message: "Please enter a valid Pincode" },]}
                                    >
                                        <InputNumber placeholder="Enter Pincode" />
                                    </Form.Item>

                                </Col>
                            </Row>
                            <Form.Item
                                name={["address", "state"]}
                                label="State"
                                rules={[{ required: true, message: "Please enter State" }]}
                            >
                                <Input placeholder="Enter State" />
                            </Form.Item>
                            <Form.Item
                                name={["address", "country"]}
                                label="Country"
                                rules={[{ required: true, message: "Please enter Country" }]}
                            >
                                <Input placeholder="Enter Country" />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" onClick={handleCreateClient} loading={loading}>
                    Create Client
                </Button>
            </Form.Item>
        </Card>
    );
};

export default CreateClientPage;
