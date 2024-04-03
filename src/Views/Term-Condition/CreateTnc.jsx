import React, { useState, useEffect } from "react";
import { Card, Form, Input, Select, Button, notification, Row, Col, Divider } from "antd";
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
        <Card title="Create Tnc Details" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[50, 16]}>
                <Col xl={12} sm={24}  xs={24}>
                    <div>
                        <h2>Product Select Info</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col xl={12} sm={24}  xs={24}>
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
                                <Col xl={12} sm={24}  xs={24}>
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
                                <Col xl={12} sm={24}  xs={24}>
                                    <Form.Item name="sub_product" label="Sub Product Name" rules={[{ required: true, message: "Select Sub Product Name" }]}>
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
                            <h2>Term & Condition Info</h2>
                            <Row gutter={10}>
                                <Col span={24}  xs={24}>
                                    <Form.List name="payment_terms" initialValue={['']}>
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Payment Terms #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Payment Terms' },
                                                                ]}
                                                            >
                                                                <TextArea placeholder="Enter Payment Terms" autoSize={{ minRows: 1, maxRows: 6 }} />
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
                                                        Add Term
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={10}>
                                <Col span={24}  xs={24}>
                                    <Form.List name="client_responsibilities" initialValue={['']}>
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Client Responsibility #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Client Responsibilities' },
                                                                ]}
                                                            >
                                                                <TextArea placeholder="Enter Client Responsibilities" autoSize={{ minRows: 1, maxRows: 6 }} />
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
                                                        Add Responsibility
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={10}>
                                <Col span={24}  xs={24}>
                                    <Form.List name="installation_process" initialValue={['']}>
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Installation Process #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Installation Process' },
                                                                ]}
                                                            >
                                                                <TextArea placeholder="Enter Installation Process" autoSize={{ minRows: 1, maxRows: 6 }} />
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
                                                        Add Process
                                                    </Button>
                                                </Form.Item>
                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Col>

                <Col xl={10} sm={24}  xs={24}>
                    <Row gutter={16}>
                        <Col span={24}  xs={24}>
                            <div>
                                <Form form={form} layout="vertical">

                                    <Form.Item
                                        name="prices"
                                        label="Prices"
                                        rules={[{ required: true, message: "Please enter prices" }]}
                                    >
                                        <TextArea placeholder="Enter prices Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="packing_forwarding"
                                        label="Packing Forwarding"
                                        rules={[{ required: true, message: "Please enter Packing Forwarding" }]}
                                    >
                                        <TextArea placeholder="Enter Packing Forwarding Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="material_delivery"
                                        label="Material Delivery"
                                        rules={[{ required: true, message: "Please enter Material Delivery" }]}
                                    >
                                        <TextArea placeholder="Enter Material Delivery Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="operation"
                                        label="Operation"
                                        rules={[{ required: true, message: "Please enter Operation" }]}
                                    >
                                        <TextArea placeholder="Enter Operation Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="force_majeure"
                                        label="Force Majeure"
                                        rules={[{ required: true, message: "Please enter Force Majeure" }]}
                                    >
                                        <TextArea placeholder="Enter Force Majeure Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="warranty"
                                        label="Warranty"
                                        rules={[{ required: true, message: "Please enter Warranty" }]}
                                    >
                                        <TextArea placeholder="Enter Warranty Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="termination"
                                        label="Termination"
                                        rules={[{ required: true, message: "Please enter Termination" }]}
                                    >
                                        <TextArea placeholder="Enter Termination Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="jurisdiction"
                                        label="Jurisdiction"
                                        rules={[{ required: true, message: "Please enter Jurisdiction" }]}
                                    >
                                        <TextArea placeholder="Enter Jurisdiction Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="validity"
                                        label="Validity"
                                        rules={[{ required: true, message: "Please enter Validity" }]}
                                    >
                                        <TextArea placeholder="Enter Validity Info" autoSize={{ minRows: 1, maxRows: 6 }} />
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
