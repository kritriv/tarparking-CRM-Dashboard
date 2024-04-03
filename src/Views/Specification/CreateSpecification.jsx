import React, { useState, useEffect } from "react";
import { Card, Form, Input, Select, Button, notification, InputNumber, Row, Col, Divider } from "antd";
import { PlusOutlined } from '@ant-design/icons';
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const CreateSpecificationPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [subproducts, setSubProducts] = useState([]);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/specifications`);
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

    const handleCreateSpecification = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                APIService.SpecificationApi.createResource(values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Specification Info successfully Created.",
                        });
                        navigate(`/term-conditions/create`);
                    })
                    .catch((error) => {
                        notification.error({
                            message: "Error",
                            description: "Failed to create Specification Info. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to Specification Info. Please try again later",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Create Specification Details" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card" >
            <Row gutter={[50, 16]}>
                <Col xl={12} md={24}  xs={24}>
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
                            <h2>Specifications Details</h2>
                            <Row gutter={16}>
                                <Col xl={12} sm={24}  xs={24}>
                                    <Form.Item
                                        name={["lifting_height", "top"]}
                                        label="Lifting Height Top"
                                        rules={[{ required: true, message: "Please enter Lifting Height Top" }]}
                                    >
                                        <InputNumber placeholder="Enter Lifting Height Top" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xl={12} sm={24}  xs={24}>
                                    <Form.Item
                                        name={["lifting_height", "ground"]}
                                        label="Lifting Height ground"
                                        rules={[{ required: true, message: "Please enter Lifting Height ground" }]}
                                    >
                                        <InputNumber placeholder="Enter Lifting Height ground" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xl={12} sm={24}  xs={24}>
                                    <Form.Item
                                        name={["platform", "length"]}
                                        label="Platform length"
                                        rules={[{ required: true, message: "Please enter Platform length" }]}
                                    >
                                        <InputNumber placeholder="Enter Platform length" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xl={12} sm={24}  xs={24}>
                                    <Form.Item
                                        name={["platform", "width"]}
                                        label="Platform width"
                                        rules={[{ required: true, message: "Please enter Platform width" }]}
                                    >
                                        <InputNumber placeholder="Enter Platform width" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col xl={12} sm={24}  xs={24}>
                                    <Form.Item
                                        name={["travelling_speed", "lifting"]}
                                        label="Travelling Speed Lifting"
                                        rules={[{ required: true, message: "Please enter Travelling Speed Lifting" }]}
                                    >
                                        <Input placeholder="Enter Travelling Speed Lifting" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col xl={12} sm={24}  xs={24}>
                                    <Form.Item
                                        name={["travelling_speed", "horizontal"]}
                                        label="Travelling Speed horizontal"
                                        rules={[{ required: true, message: "Please enter Travelling Speed horizontal" }]}
                                    >
                                        <Input placeholder="Enter Travelling Speed horizontal" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={10}>
                                <Col span={24}  xs={24}>
                                    <Form.List name="safety" initialValue={['']}>
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Safety #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Safety' },
                                                                ]}
                                                            >
                                                                <TextArea placeholder="Enter Safety" autoSize={{ minRows: 1, maxRows: 6 }} />
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
                                                        Add Safety
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
                                    <Form.List name="features" initialValue={['']}>
                                        {(fields, { add, remove }) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Feature #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Feature' },
                                                                ]}
                                                            >
                                                                <TextArea placeholder="Enter Feature" autoSize={{ minRows: 1, maxRows: 6 }} />
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
                                                        Add Feature
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

                <Col xl={10} md={24}  xs={24}>
                    <Row gutter={16}>
                        <Col span={24}  xs={24}>
                            <div>
                                <Form form={form} layout="vertical">

                                    <Form.Item
                                        name="system_module"
                                        label="System Module"
                                        rules={[{ required: true, message: "Please enter System Module" }]}
                                    >
                                        <TextArea placeholder="Enter System Module Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="system_area"
                                        label="System Area"
                                        rules={[{ required: true, message: "Please enter System Area" }]}
                                    >
                                        <TextArea placeholder="Enter System Area Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="car_size"
                                        label="Car Size"
                                        rules={[{ required: true, message: "Please enter Car Size" }]}
                                    >
                                        <TextArea placeholder="Enter Car Size Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="lifting_capacity"
                                        label="Lifting Capacity"
                                        rules={[{ required: true, message: "Please enter Lifting Capacity" }]}
                                    >
                                        <TextArea placeholder="Enter Lifting Capacity Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="power"
                                        label="Power"
                                        rules={[{ required: true, message: "Please enter Power" }]}
                                    >
                                        <TextArea placeholder="Enter Power Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="driving_unit"
                                        label="Driving Unit"
                                        rules={[{ required: true, message: "Please enter Driving Unit" }]}
                                    >
                                        <TextArea placeholder="Enter Driving Unit Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="material_delivery"
                                        label="Material Delivery"
                                        rules={[{ required: true, message: "Please enter Material Delivery" }]}
                                    >
                                        <TextArea placeholder="Enter Material Delivery Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="installation"
                                        label="Installation"
                                        rules={[{ required: true, message: "Please enter Installation" }]}
                                    >
                                        <TextArea placeholder="Enter Installation Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="amc"
                                        label="AMC"
                                        rules={[{ required: true, message: "Please enter AMC" }]}
                                    >
                                        <TextArea placeholder="Enter AMC Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <Form.Item
                                        name="material_quality"
                                        label="Material Quality"
                                        rules={[{ required: true, message: "Please enter Material Quality" }]}
                                    >
                                        <TextArea placeholder="Enter Material Quality Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>

                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" onClick={handleCreateSpecification} loading={loading}>
                    Create Specification
                </Button>
            </Form.Item>
        </Card>
    );
};

export default CreateSpecificationPage;
