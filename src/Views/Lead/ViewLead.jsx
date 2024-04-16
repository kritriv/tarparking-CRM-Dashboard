import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Button, notification, Row, Col } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;
const ViewLeadPage = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [leadData, setLeadData] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/leads`);
    };
    useEffect(() => {
        fetchLeadData(id);
    }, [id]);

    const fetchLeadData = async (id) => {
        try {
            setLoading(true);
            const response = await APIService.LeadApi.readResource(id);
            if (response.success) {
                form.setFieldsValue({
                    ...response.data,
                    interestedIn: response.data.interestedIn.name
                });
                setLeadData(response.data);
                setSelectedProduct(response.data.interestedIn.name)
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
        <Card title="View Lead Details" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[50, 16]}>
                <Col md={24} xl={12} xs={24}>
                    <div>
                        <h2>Lead Information</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="type" label="Lead Type" rules={[{ required: true, message: "Please enter Type of lead" }]}>
                                        <Input placeholder="Lead Type" readOnly />
                                    </Form.Item>
                                </Col>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter Name" }]}>
                                        <Input placeholder="Enter Name" readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="status" label="Lead Status" rules={[{ required: true, message: "Please enter Status of lead" }]}>
                                        <Input placeholder="Lead status" readOnly />
                                    </Form.Item>
                                </Col>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="source" label="Source" rules={[{ required: true, message: "Please enter Source" }]}>
                                        <Input placeholder="Lead Source" readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        rules={[
                                            { required: true, message: "Please enter Email" },
                                            { type: "email", message: "Please enter a valid Email" },
                                        ]}
                                    >
                                        <Input placeholder="Enter Email" readOnly />
                                    </Form.Item>
                                </Col>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item
                                        name="phone"
                                        label="Phone Number"
                                        rules={[{ required: true, message: "Please enter Phone Number" }]}
                                    >
                                        <Input placeholder="Enter Phone Number" readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="address"
                                label="Address"
                                rules={[{ required: true, message: "Please enter address" }]}
                            >
                                <TextArea placeholder="Enter site address" autoSize={{ minRows: 2, maxRows: 6 }} readOnly />

                            </Form.Item>
                        </Form>
                    </div>
                </Col>
                <Col md={24} xl={10} xs={24}>
                    <div>
                        <h2>Interested Product</h2>
                        <Form form={form} layout="vertical">
                            <Form.Item label="Product Name" name="interestedIn" rules={[{ required: true, message: "Product Name" }]} initialValue={selectedProduct}>
                                <Input placeholder="Product Name" readOnly />
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

export default ViewLeadPage;
