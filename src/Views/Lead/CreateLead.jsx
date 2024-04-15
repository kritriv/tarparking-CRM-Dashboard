import React, { useState, useEffect } from "react";
import { Card, Form, Input, Switch, Button, notification, Row, Col, InputNumber, Select } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

const CreateLeadPage = () => {
    const userInfo = useUserInfo();
    const createby = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSubProduct, setSelectedSubProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [subproducts, setSubProducts] = useState([]);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/leads`);
    };

    const handleCategoryChange = (value) => {
        const selectedCategory = categories.find((category) => category.id === value);
        setSelectedCategory(selectedCategory);
    };

    const handleProductChange = (value) => {
        const selectedProduct = products.find((product) => product.id === value);
        setSelectedProduct(selectedProduct);
    }; 
    
    const handleCreateLead = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                console.log(values)
                APIService.LeadApi.createResource(values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Lead successfully Created.",
                        });
                        navigate(`/Leads`);
                    })
                    .catch((error) => {
                        notification.error({
                            message: "Error",
                            description: "Failed to create Lead. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to create Lead. Please try again later",
            });
            setLoading(false);
        }
    };

    const handleSubProductChange = (value) => {
        const selectedSubProduct = subproducts.find((subproduct) => subproduct.id === value);
        if (!selectedSubProduct.specifications) {
            notification.error({
                message: "Error",
                description: "Add its Specifications first!",
            });
        } else if (!selectedSubProduct.tnc) {
            notification.error({
                message: "Error",
                description: "Add its Terms & Conditions first!",
            });
        } else {
            setSelectedSubProduct(selectedSubProduct);
        }
    };

    useEffect(() => {
        // Fetch categories
        APIService.CategoryApi.listResource()
            .then((response) => {
                setCategories(response.data);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            });
    }, []);

    useEffect(() => {
        // Fetch products based on selected category
        if (selectedCategory && selectedCategory.products && selectedCategory.products.length > 0) {
            let categoryId = `category=${selectedCategory.id}`;
            APIService.ProductApi.listResource(undefined, undefined, undefined, categoryId)
                .then((response) => {
                    setProducts(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching Products:", error);
                });
        }
    }, [selectedCategory]);

    useEffect(() => {
        // Fetch sub-products based on selected product
        if (selectedProduct && selectedProduct.sub_products) {
            let productId = `product=${selectedProduct.id}`;
            APIService.SubProductApi.listResource(undefined, undefined, undefined, productId)
                .then((response) => {
                    setSubProducts(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching Sub Products:", error);
                });
        }
    }, [selectedProduct]);

    return (
        <Card title="Create Lead" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[50, 16]}>
                {/* Left Side - Lead Information */}
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

                {/* Right Side - Interested Product */}
                <Col md={24} xl={10}>
                    <div>
                        <h2>Interested Product</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col xs={24} md={24} xl={12}>
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
                                <Col xs={24} md={24} xl={12}>
                                    <Form.Item name="product" label="Product Name" rules={[{ required: true, message: "Select Product Name" }]}>
                                        <Select placeholder="Select Product" onChange={handleProductChange}>
                                            {products.map((product) => (
                                                <Select.Option key={product.id} value={product.id}>
                                                    {product.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                </Col>
                            </Row>
                            <Form.Item name="interestedIn" label="Sub Product Name" rules={[{ required: true, message: "Select Sub Product Name" }]}>
                                <Select placeholder="Select Sub Product" onChange={handleSubProductChange}>
                                    {subproducts.map((subproduct) => (
                                        <Select.Option key={subproduct.id} value={subproduct.id}>
                                            {subproduct.name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" onClick={handleCreateLead} loading={loading}>
                    Create Lead
                </Button>
            </Form.Item>
        </Card>
    );
};

export default CreateLeadPage;
