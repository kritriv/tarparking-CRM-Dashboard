import { useState, useEffect } from "react";
import { Card, Form, Input, Switch, Button, notification, Row, Col, Select } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

const CreateProductPage = () => {
    const userInfo = useUserInfo();
    const createby = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/products`);
    };

    useEffect(() => {
        APIService.CategoryApi.listResource()
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    const handleCreateProduct = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                APIService.ProductApi.createResource(values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Product successfully Created.",
                        });
                        navigate(`/sub-products/create`);
                    })
                    .catch((error) => {
                        notification.error({
                            message: "Error",
                            description: "Failed to create Product. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to create Product. Please try again later",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Create Product" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[16, 16]}>
                <Col xl={18} md={24} xs={24}>
                    <div>
                        <h2>Product Information</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col xl={6} md={24} xs={24}>
                                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                                    </Form.Item>
                                </Col>
                                <Col xl={12} md={24} xs={24}>
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
                            <Row gutter={50}>
                                <Col xl={12} md={24} xs={24}>
                                    <Form.Item
                                        name="category"
                                        label="Category Name"
                                        rules={[
                                            { required: true, message: "Select Category Name" },
                                        ]}
                                    >
                                        <Select placeholder="Select Category">
                                            {categories.map((category) => (
                                                <Select.Option key={category.id} value={category.id}>
                                                    {category.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xl={12} md={24} xs={24}>
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
                                <TextArea placeholder="Enter description..." autoSize={{ minRows: 3, maxRows: 6 }} />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" onClick={handleCreateProduct} loading={loading}>
                    Create Product
                </Button>
            </Form.Item>
        </Card>
    );
};

export default CreateProductPage;
