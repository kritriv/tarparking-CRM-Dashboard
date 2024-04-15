import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Switch, Button, notification, Row, Col, Select } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

const EditLeadPage = () => {
    const { id } = useParams();
    const userInfo = useUserInfo();
    const editBy = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [leadData, setLeadData] = useState(null);

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
                    interestedIn: response.data.interestedIn.name,
                    interestedIn_cat: response.data.interestedIn.category.name,
                    interestedIn_pro: response.data.interestedIn.product.name,
                });
                setLeadData(response.data);
            } else {
                console.error("Error fetching Lead data:", response.message);
                notification.error({
                    message: "Error",
                    description: "Failed to fetch Lead details.",
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

    const handleEditLead = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                APIService.LeadApi.updateResource(id, values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Lead details updated successfully.",
                        });
                        navigate(`/leads`);
                    })
                    .catch((error) => {
                        console.error("Error updating Lead details:", error);
                        notification.error({
                            message: "Error",
                            description: "Failed to update Lead details. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            console.error("Error updating Lead details:", error);
            notification.error({
                message: "Error",
                description: "Failed to update Lead details. Please try again later.",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Edit Lead" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[50, 16]}>
                <Col md={24} xl={12} xs={24}>
                    <div>
                        <h2>Lead Information</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col sm={24} xl={6} xs={24}>
                                    <Form.Item name="removed" label="Removed" rules={[{ required: true }]}>
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                                    </Form.Item>
                                </Col>
                                <Col sm={24} xl={12} xs={24}>
                                    <Form.Item
                                        name="editBy"
                                        label="EditBy (You)"
                                        rules={[{ required: true, message: "Please CreatedBy Id" }]}
                                        initialValue={editBy}
                                    >
                                        <Input placeholder="Enter CreatedBy Id" disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="type" label="Lead Type" rules={[{ required: true, message: "Please enter Type of lead" }]}>
                                        <Select placeholder="Select Lead Type">
                                            <Select.Option value="company">Company</Select.Option>
                                            <Select.Option value="people">People</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter Name" }]}>
                                        <Input placeholder="Enter Name" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="status" label="Lead Status" rules={[{ required: true, message: "Please enter Status of lead" }]}>
                                        <Select placeholder="Select Lead status">
                                            <Select.Option value="draft">Draft</Select.Option>
                                            <Select.Option value="new">New</Select.Option>
                                            <Select.Option value="innegotiate">In Negociate</Select.Option>
                                            <Select.Option value="won">Won</Select.Option>
                                            <Select.Option value="lose">Lose</Select.Option>
                                            <Select.Option value="canceled">Canceled</Select.Option>
                                            <Select.Option value="onhold">Onhold</Select.Option>
                                            <Select.Option value="waiting">Waiting</Select.Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item name="source" label="Source" rules={[{ required: true, message: "Please enter Source" }]}>
                                        <Select placeholder="Select Lead Source">
                                            <Select.Option value="linkedin">Linkedin</Select.Option>
                                            <Select.Option value="website">Website</Select.Option>
                                            <Select.Option value="socialmedia">Social Media</Select.Option>
                                            <Select.Option value="ads">Advertisement</Select.Option>
                                            <Select.Option value="friends">Friends</Select.Option>
                                            <Select.Option value="sales">Sales</Select.Option>
                                            <Select.Option value="indiamart">India Mart</Select.Option>
                                            <Select.Option value="other">Other</Select.Option>
                                        </Select>
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
                                        <Input placeholder="Enter Email" />
                                    </Form.Item>
                                </Col>
                                <Col md={24} xl={12} xs={24}>
                                    <Form.Item
                                        name="phone"
                                        label="Phone Number"
                                        rules={[{ required: true, message: "Please enter Phone Number" }]}
                                    >
                                        <Input placeholder="Enter Phone Number" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="address"
                                label="Address"
                                rules={[{ required: true, message: "Please enter address" }]}
                            >
                                <TextArea placeholder="Enter site address" autoSize={{ minRows: 2, maxRows: 6 }} />

                            </Form.Item>
                        </Form>
                    </div>
                </Col>

                <Col md={24} xl={10}>
                    <div>
                        <h2>Interested Product</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col xs={24} md={24} xl={12}>
                                    <Form.Item name="interestedIn_cat" label="Category Name" rules={[{ required: true, message: "Select Category Name" }]}>
                                        <Input readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={24} xl={12}>
                                    <Form.Item name="interestedIn_pro" label="Product Name" rules={[{ required: true, message: "Select Product Name" }]}>
                                        <Input readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="interestedIn" label="Sub Product Name" rules={[{ required: true, message: "Select Sub Product Name" }]}>
                                <Input readOnly />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={handleEditLead} loading={loading}>
                                    Update Lead
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default EditLeadPage;
