import React, { useState, useEffect } from "react";
import { Card, Form, Input, Select, Button, notification, Row, Col } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const CreateTncPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [subproducts, setSubProducts] = useState([]);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/term-conditions`);
    };

    const handleCategoryChange = (value) => {
        const selectedCategory = categories.find((category) => category.id === value);
        setSelectedCategory(selectedCategory);
    };
    const handleProductChange = (value) => {
        const selectedProduct = products.find((product) => product.id === value);
        setSelectedProduct(selectedProduct);
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

    const handleCreateTnc = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                console.log(values)
                APIService.TncApi.createResource(values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Tnc Info successfully Created.",
                        });
                        navigate(`/term-conditions`);
                    })
                    .catch((error) => {
                        notification.error({
                            message: "Error",
                            description: "Failed to create Tnc Info. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to Tnc Info. Please try again later",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Create Tnc Details" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} style={{ padding: 50, margin: 10 }}>
            <Row gutter={150}>
                {/* Left Side - Product Select Info */}
                <Col span={12}>
                    <div>
                        <h2>Product Select Info</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={12}>
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
                                <Col span={12}>
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
                                <Col span={12}>
                                    <Form.Item name="subproduct" label="Sub Product Name" rules={[{ required: true, message: "Select Sub Product Name" }]}>
                                        <Select placeholder="Select Sub Product">
                                            {subproducts.map((subproduct) => (
                                                <Select.Option key={subproduct.id} value={subproduct.id}>
                                                    {subproduct.name}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={50}>
                                <Col span={12}>
                                    <Form.List name="emails" initialValue={['']}>
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Email #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Email' },
                                                                    { type: 'email', message: 'Please enter a valid Email' },
                                                                ]}
                                                            >
                                                                <Input placeholder="Enter Email" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Button
                                                                type="danger"
                                                                onClick={() => {
                                                                    if (fields.length > 1) {
                                                                        remove(name);
                                                                    }
                                                                }}
                                                            >
                                                                Remove
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                ))}
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                        Add Email
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                                <Col span={12}>
                                    <Form.List name="websites" initialValue={['']}>
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Website #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Website' },
                                                                ]}
                                                            >
                                                                <Input placeholder="Enter Website" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Button type="danger" onClick={() => remove(name)}>
                                                                Remove
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                ))}
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                        Add Website
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                                <Col span={12}>
                                    <Form.List name="phones" initialValue={['']}>
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Phone #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Phone' },
                                                                ]}
                                                            >
                                                                <Input placeholder="Enter Phone no" />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col span={6}>
                                                            <Button type="danger" onClick={() => remove(name)}>
                                                                Remove
                                                            </Button>
                                                        </Col>
                                                    </Row>
                                                ))}
                                                <Form.Item>
                                                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                                        Add Phone No
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                            </Row>
                            <Form.Item
                                name="cin_no"
                                label="CIN No"
                                rules={[{ required: true, message: "Please enter CIN No" }]}
                            >
                                <Input placeholder="Enter CIN No" />
                            </Form.Item>
                            <Form.Item
                                name="tan_no"
                                label="TAN No"
                                rules={[{ required: true, message: "Please enter TAN No" }]}
                            >
                                <Input placeholder="Enter TAN No" />
                            </Form.Item>
                            <Form.Item
                                name="pan_no"
                                label="PAN No"
                                rules={[{ required: true, message: "Please enter PAN No" }]}
                            >
                                <Input placeholder="Enter PAN No" />
                            </Form.Item>
                            <Form.Item
                                name="gst_no"
                                label="GST No"
                                rules={[{ required: true, message: "Please enter GST No" }]}
                            >
                                <Input placeholder="Enter GST No" />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>

                {/* Right Side - Address & Account details */}
                <Col span={10}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <div>
                                <h2>Address details</h2>
                                <Form form={form} layout="vertical">
                                    <Form.Item
                                        name={["address", "office"]}
                                        label="Office Address"
                                        rules={[{ required: true, message: "Please enter office Address" }]}
                                    >
                                        <TextArea placeholder="Enter office address" autoSize={{ minRows: 2, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name={["address", "factory"]}
                                        label="Factory Address"
                                        rules={[{ required: true, message: "Please enter factory Address" }]}
                                    >
                                        <TextArea placeholder="Enter factory address" autoSize={{ minRows: 2, maxRows: 6 }} />
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div>
                                <h2>Bank details</h2>
                                <Form form={form} layout="vertical">
                                    <Form.Item
                                        name={["bank_details", "bank_name"]}
                                        label="Bank Name"
                                        rules={[{ required: true, message: "Please enter Bank name" }]}
                                    >
                                        <Input placeholder="Enter Bank name" />
                                    </Form.Item>
                                    <Form.Item
                                        name={["bank_details", "account_no"]}
                                        label="Account Number"
                                        rules={[{ required: true, message: "Please enter Account Number" }]}
                                    >
                                        <Input placeholder="Enter Account Number" />
                                    </Form.Item>
                                    <Form.Item
                                        name={["bank_details", "ifsc"]}
                                        label="Ifsc Code"
                                        rules={[{ required: true, message: "Please enter Ifsc Code" }]}
                                    >
                                        <Input placeholder="Enter Ifsc Code" />
                                    </Form.Item>
                                    <Form.Item
                                        name={["bank_details", "branch"]}
                                        label="Branch & Address"
                                        rules={[{ required: true, message: "Please enter Branch & Address" }]}
                                    >
                                        <Input placeholder="Enter Branch & Address" />
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" onClick={handleCreateTnc} loading={loading}>
                    Create Tnc
                </Button>
            </Form.Item>
        </Card>
    );
};

export default CreateTncPage;
