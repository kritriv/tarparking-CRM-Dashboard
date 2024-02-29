import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Switch, Button, notification, Row, Col } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

const ViewProductPage = () => {
    const { id } = useParams();
    const userInfo = useUserInfo();
    const editBy = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState(null);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/products`);
    };

    useEffect(() => {
        fetchProductData(id);
    }, [id]);

    const fetchProductData = async (id) => {
        try {
            setLoading(true);
            const response = await APIService.ProductApi.readResource(id);

            if (response.success) {
                form.setFieldsValue(response.data);
                setProductData(response.data);
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
        <Card title="View Product Details" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} style={{ padding: 50, margin: 10 }}>
            <Row gutter={150}>
                <Col span={18}>
                    <div>
                        <h2>Product Information</h2>
                        <Form form={form} layout="vertical" initialValues={productData}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="editBy"
                                        label="Created By"
                                        initialValue={editBy}
                                    >
                                        <Input placeholder="Enter Created By Id" disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={50}>
                                <Col span={12}>
                                    <Form.Item
                                        name="category"
                                        label="Category Name"
                                        rules={[
                                            { required: true, message: "Select Category Name" },
                                        ]}
                                    >
                                        <Input placeholder="Enter Product name" />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="Product Name"
                                        rules={[
                                            { required: true, message: "Please enter name" },
                                        ]}
                                    >
                                        <Input placeholder="Enter Product name" />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: "Please enter description Number" }]}
                            >
                                <TextArea placeholder="Enter description..." autoSize={{ minRows: 3, maxRows: 6 }} readOnly />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" onClick={handleBack} loading={loading}>
                    Go Back
                </Button>
            </Form.Item>
        </Card>
    );
};

export default ViewProductPage;
