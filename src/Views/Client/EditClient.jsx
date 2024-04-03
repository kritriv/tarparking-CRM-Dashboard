import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Switch, Button, notification, Row, Col, InputNumber } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

const EditClientPage = () => {
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
            const response = await APIService.ClientApi.readResource(id);
            if (response.success) {
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

    const handleEditClient = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                APIService.ClientApi.updateResource(id, values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Client details updated successfully.",
                        });
                        navigate(`/clients`);
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
        <Card title="Edit Client" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[50, 16]}>
                <Col md={24} xl={12} xs={24}>
                    <div>
                        <h2>Client Information</h2>
                        <Form form={form} layout="vertical" initialValues={clientData}>
                            <Row gutter={16}>
                                <Col xs={24} sm={24} xl={6}>
                                    <Form.Item name="status" label="Status">
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked={clientData?.status === 'true'} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} xl={12}>
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
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="username" label="Username">
                                        <Input placeholder="Enter Username" />
                                    </Form.Item>
                                </Col>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="name" label="Name">
                                        <TextArea placeholder="Enter Name" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="email"
                                label="Email"
                            >
                                <Input placeholder="Enter Email" />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Phone Number"
                            >
                                <Input placeholder="Enter Phone Number" />
                            </Form.Item>

                            <Form.Item
                                name="company"
                                label="Company"
                            >
                                <Input placeholder="Enter Company" />
                            </Form.Item>

                            <Form.Item name="gst" label="GST">
                                <Input placeholder="Enter GST" />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
                <Col md={24} xl={10}>
                    <div>
                        <h2>Address Information</h2>
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name={["address", "site"]}
                                label="Site"
                            >
                                <Input placeholder="Enter Site" />
                            </Form.Item>

                            <Form.Item
                                name={["address", "street"]}
                                label="Street"
                            >
                                <TextArea placeholder="Enter Street" />
                            </Form.Item>
                            <Row gutter={16}>
                                <Col xs={24} md={24} xl={18}>
                                    <Form.Item
                                        name={["address", "city"]}
                                        label="City"
                                    >
                                        <Input placeholder="Enter City" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={24} xl={4}>
                                    <Form.Item
                                        name={["address", "pincode"]}
                                        label="Pincode"
                                    >
                                        <InputNumber placeholder="Enter Pincode" style={{ width: '100%' }}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name={["address", "state"]}
                                label="State"
                            >
                                <Input placeholder="Enter State" />
                            </Form.Item>
                            <Form.Item
                                name={["address", "country"]}
                                label="Country"
                            >
                                <Input placeholder="Enter Country" />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={handleEditClient} loading={loading}>
                                    Update
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default EditClientPage;
