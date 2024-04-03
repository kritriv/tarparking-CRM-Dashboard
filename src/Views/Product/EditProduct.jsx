import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Switch, Button, notification, Row, Col, Select } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

const EditProductPage = () => {
    const { id } = useParams();
    const userInfo = useUserInfo();
    const editBy = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState(null);
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/products`);
    };

    useEffect(() => {
        fetchCategories();
        fetchProductData(id);
    }, [id]);

    const fetchProductData = async (id) => {
        try {
            setLoading(true);
            const response = await APIService.ProductApi.readResource(id);
            // console.log(response.data)
            if (response.success) {
                form.setFieldsValue({
                    ...response.data,
                    category: response.data.category.id,
                });
                setProductData(response.data);
            } else {
                console.error("Error fetching Company data:", response.message);
                notification.error({
                    message: "Error",
                    description: "Failed to fetch Company details.",
                });
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching Company data:", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch Company details. Please try again later.",
            });
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await APIService.CategoryApi.listResource();
            if (response.success) {
                setCategories(response.data);
            } else {
                console.error("Error fetching categories:", response.message);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleEditProduct = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                console.log(values)
                APIService.ProductApi.updateResource(id, values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Product details updated successfully.",
                        });
                        navigate(`/products`);
                    })
                    .catch((error) => {
                        console.error("Error updating Product details:", error);
                        notification.error({
                            message: "Error",
                            description: "Failed to update Product details. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            console.error("Error updating Product details:", error);
            notification.error({
                message: "Error",
                description: "Failed to update Product details. Please try again later.",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Edit Product" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[16, 16]}>
                <Col xl={18} md={24} xs={24}>
                    <div>
                        <h2>Product Information</h2>
                        <Form form={form} layout="vertical" initialValues={productData}>
                            <Row gutter={16}>
                                <Col xl={6} md={24} xs={24}>
                                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                                    </Form.Item>
                                </Col>
                                <Col xl={12} md={24} xs={24}>
                                    <Form.Item
                                        name="editBy"
                                        label="EditBy (You)"
                                        initialValue={editBy}
                                    >
                                        <Input placeholder="Enter EditBy Id" disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={50}>
                                <Col sxl={12} md={24} xs={24}>
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
                <Button type="primary" onClick={handleEditProduct} loading={loading}>
                    Update
                </Button>
            </Form.Item>
        </Card>
    );
};

export default EditProductPage;
