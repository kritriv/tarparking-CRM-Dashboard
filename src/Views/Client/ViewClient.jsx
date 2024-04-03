import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Switch, Button, notification, Row, Col, InputNumber } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

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

    return (
        <Card title="View Client Details" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[50, 16]}>
                <Col md={24} xl={12} xs={24}>
                    <div>
                        <h2>Client Information</h2>
                        <Form form={form} layout="vertical" initialValues={clientData}>
                            <Row gutter={16}>
                                <Col xs={24} sm={24} xl={6}>
                                    <Form.Item name="status" label="Status">
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked={clientData?.status === 'Active'} disabled />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} xl={12}>
                                    <Form.Item
                                        name="editBy"
                                        label="Created By"
                                        initialValue={editBy}
                                    >
                                        <Input placeholder="Enter Created By Id" readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="username" label="Username">
                                        <Input placeholder="Enter Username" readOnly />
                                    </Form.Item>
                                </Col>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="name" label="Name">
                                        <TextArea placeholder="Enter Name" readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="email"
                                label="Email"
                            >
                                <Input placeholder="Enter Email" readOnly />
                            </Form.Item>

                            <Form.Item
                                name="phone"
                                label="Phone Number"
                            >
                                <Input placeholder="Enter Phone Number" readOnly />
                            </Form.Item>

                            <Form.Item
                                name="company"
                                label="Company"
                            >
                                <Input placeholder="Enter Company" readOnly />
                            </Form.Item>

                            <Form.Item name="gst" label="GST">
                                <Input placeholder="Enter GST" readOnly />
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
                                <TextArea placeholder="Enter site address" autoSize={{ minRows: 2, maxRows: 6 }} readOnly />

                            </Form.Item>

                            <Form.Item
                                name={["address", "street"]}
                                label="Street"
                            >
                                <TextArea placeholder="Enter Street" readOnly autoSize={{ minRows: 2, maxRows: 6 }}/>
                            </Form.Item>
                            <Row gutter={16}>
                                <Col xs={24} md={24} xl={18}>
                                    <Form.Item
                                        name={["address", "city"]}
                                        label="City"
                                    >
                                        <Input placeholder="Enter City" readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={24} xl={4}>
                                    <Form.Item
                                        name={["address", "pincode"]}
                                        label="Pincode"
                                    >
                                        <InputNumber placeholder="Enter Pincode" readOnly style={{ width: '100%' }}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name={["address", "state"]}
                                label="State"
                            >
                                <Input placeholder="Enter State" readOnly />
                            </Form.Item>
                            <Form.Item
                                name={["address", "country"]}
                                label="Country"
                            >
                                <Input placeholder="Enter Country" readOnly />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={handleBack} loading={loading}>
                                    Go Back
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default ViewClientPage;
