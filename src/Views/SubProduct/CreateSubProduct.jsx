import React, { useState, useEffect } from "react";
import { Card, Form, Input, Switch, Button, notification, Row, Col, Select, InputNumber } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

const CreateSubProductPage = () => {
    const userInfo = useUserInfo();
    const createby = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/sub-products`);
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

    useEffect(() => {
        if (selectedCategory && selectedCategory.products && selectedCategory.products.length > 0) {
            let categoryId = `category=${selectedCategory.id}`;
            console.log(categoryId);
            APIService.ProductApi.listResource(undefined, undefined, undefined, categoryId)
                .then((response) => {
                    setProducts(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching Products:", error);
                });
        }
    }, [selectedCategory]);

    const handleCreateSubProduct = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                APIService.SubProductApi.createResource(values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Sub Product successfully Created.",
                        });
                        navigate(`/sub-products`);
                    })
                    .catch((error) => {
                        console.log(error);
                        notification.error({
                            message: "Error",
                            description: "Failed to create Sub Product. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            console.log(error);
            notification.error({
                message: "Error",
                description: "Failed to create Sub Product. Please try again later",
            });
            setLoading(false);
        }
    };

    const handleCategoryChange = (value) => {
        const selectedCategory = categories.find((category) => category.id === value);
        setSelectedCategory(selectedCategory);
    };

    return (
        <Card
            title="Create Sub Product"
            extra={<Button onClick={() => handleBack()}>Go Back to List</Button>}
            style={{ padding: 50, margin: 10 }}
        >
            <Row gutter={16}>
                <Col span={18}>
                    <div>
                        <h2>Sub Product Information</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={30}>
                                <Col span={3}>
                                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                                    </Form.Item>
                                </Col>
                                <Col span={7}>
                                    <Form.Item
                                        name="createdby"
                                        label="CreatedBy (You)"
                                        rules={[{ required: true, message: "Please enter CreatedBy Id" }]}
                                        initialValue={createby}
                                    >
                                        <Input placeholder="Enter CreatedBy Id" disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={7}>
                                    <Form.Item name="category" label="Category Name" rules={[{ required: true, message: "Select Category Name" }]}>
                                        <Select placeholder="Select Category" onChange={handleCategoryChange}>
                                            {categories.map((category) => (
                                                <Select.Option key={category.id} value={category.id}>
                                                    {category.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={7}>
                                    <Form.Item name="product" label="Product Name" rules={[{ required: true, message: "Select Product Name" }]}>
                                        <Select placeholder="Select Sub Product">
                                            {products.map((product) => (
                                                <Select.Option key={product.id} value={product.id}>
                                                    {product.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={8}>
                                    <Form.Item
                                        name="name"
                                        label="Sub Product Name"
                                        rules={[{ required: true, message: "Please enter Sub Product name" }]}
                                    >
                                        <Input placeholder="Enter Sub Product name" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="model_no"
                                        label="Model No"
                                        rules={[{ required: true, message: "Please enter Model No" }]}
                                    >
                                        <Input placeholder="Enter Model No" />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name="hsn"
                                        label="HSN No"
                                        rules={[{ required: true, message: "Please enter HSN No" }]}
                                    >
                                        <Input placeholder="Enter HSN No" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col span={6}>
                                    <Form.Item
                                        name={["price", "quantity"]}
                                        label="Quantity"
                                        rules={[{ required: true, message: "Please enter quantity" }]}
                                    >
                                        <InputNumber placeholder="Quantity" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name={["price", "basic_rate"]}
                                        label="Basic rate"
                                        rules={[{ required: true, message: "Please enter Basic rate" }]}
                                    >
                                        <InputNumber placeholder="Basic rate" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name={["price", "installation_charges"]}
                                        label="Charges"
                                        rules={[{ required: true, message: "Please enter Installation Charges" }]}
                                    >
                                        <InputNumber placeholder="Installation Charges" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item
                                        name={["price", "subTotal"]}
                                        label="Sub Total"
                                        rules={[{ required: true, message: "Please enter Sub Total" }]}
                                    >
                                        <InputNumber placeholder="Sub Total" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: "Please enter description" }]}
                            >
                                <TextArea placeholder="Enter description..." autoSize={{ minRows: 3, maxRows: 6 }} />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" onClick={handleCreateSubProduct} loading={loading}>
                    Create Sub Product
                </Button>
            </Form.Item>
        </Card>

    );
};

export default CreateSubProductPage;
