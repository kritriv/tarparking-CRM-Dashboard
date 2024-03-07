import React, { useState, useEffect } from "react";
import { Card, Form, Input, Select, Button, notification, Row, Col, Divider, Steps } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;
const { Step } = Steps;

const CreateQuotePage = () => {
    const userInfo = useUserInfo();
    const createby = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedSubProduct, setSelectedSubProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [clients, setClients] = useState([]);
    const [subproducts, setSubProducts] = useState([]);
    const [imageURL, setImageURL] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/quotes`);
    };

    const handleNext = () => {
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const handlePrev = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const handleCategoryChange = (value) => {
        const selectedCategory = categories.find((category) => category.id === value);
        setSelectedCategory(selectedCategory);
    };

    const handleProductChange = (value) => {
        const selectedProduct = products.find((product) => product.id === value);
        setSelectedProduct(selectedProduct);
    };

    const handleSubProductChange = (value) => {
        const selectedSubProduct = subproducts.find((subproduct) => subproduct.id === value);
        setSelectedSubProduct(selectedSubProduct);
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
        // Fetch clients
        APIService.ClientApi.listResource()
            .then((response) => {
                setClients(response.data);
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

    const handleCreateQuote = async () => {
        try {
            form.validateFields().then(async (values) => {
                setLoading(true);

                // Merge values from both steps
                const mergedValues = {
                    ...values,

                };
                console.log(mergedValues)

                // Create quote
                await APIService.QuoteApi.createResource(mergedValues);

                notification.success({
                    message: "Success",
                    description: "Quote Info successfully Created.",
                });

                navigate(`/quotes`);
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to create Quote Info. Please try again later",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card title="Create Quotation" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} style={{ padding: 50, margin: 10 }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Steps direction="vertical" current={currentStep}>
                                <Step title="Product Selection" description="Select category, product, and sub-product" />
                                <Step title="Quote Information" description="Enter quote details" />
                                <Step title="Product Details" description="Enter Product details" />
                            </Steps>
                            <div style={{ marginTop: "20px" }}>
                                {currentStep === 0 && (
                                    <Button type="primary" onClick={handleNext}>
                                        Next
                                    </Button>
                                )}
                                {currentStep === 1 && (
                                    <Button style={{ marginRight: "10px" }} onClick={handlePrev}>
                                        Previous
                                    </Button>
                                )}
                                {currentStep === 1 && (
                                     <Button type="primary" onClick={handleNext}>
                                     Next
                                 </Button>
                                )}
                                {currentStep === 2 && (
                                    <Button style={{ marginRight: "10px" }} onClick={handlePrev}>
                                        Previous
                                    </Button>
                                )}
                                {currentStep === 2 && (
                                    <Button type="primary" onClick={handleCreateQuote} loading={loading}>
                                        Create Quote
                                    </Button>
                                )}
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col span={16}>
                    <div>
                        <Form form={form} layout="vertical" >
                            {currentStep === 0 && (
                                <Row gutter={16}>
                                    <Col span={12}>
                                        <Form.Item
                                            name="createdby"
                                            label="CreatedBy (You)"
                                            rules={[{ required: true, message: "Please CreatedBy Id" }]}
                                            initialValue={createby}
                                        >
                                            <Input placeholder="Enter CreatedBy Id" readOnly />
                                        </Form.Item>
                                    </Col>
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
                                        <Form.Item name="sub_product" label="Sub Product Name" rules={[{ required: true, message: "Select Sub Product Name" }]}>
                                            <Select placeholder="Select Sub Product" onChange={handleSubProductChange}>
                                                {subproducts.map((subproduct) => (
                                                    <Select.Option key={subproduct.id} value={subproduct.id}>
                                                        {subproduct.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item name="client" label="Client" rules={[{ required: true, message: "Select Client" }]}>
                                            <Select
                                                showSearch
                                                placeholder="Select Client"
                                                optionFilterProp="children"
                                                filterOption={(input, option) =>
                                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }
                                            >
                                                {clients.map((client) => (
                                                    <Select.Option key={client.id} value={client.id}>
                                                        {client.name}
                                                    </Select.Option>
                                                ))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item
                                            name="refno"
                                            label="Ref No"
                                            initialValue="SHAIL/Q/PUZZLE-2L/RYJO/23-24/1301/113/01/00"
                                            rules={[{ required: true, message: "Please enter Ref No" }]}
                                        >
                                            <TextArea placeholder="Enter Ref No" autoSize={{ minRows: 1, maxRows: 2 }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                            {currentStep === 1 && (
                                <Row gutter={16}>
                                    <Col span={18}>
                                        <Form.Item
                                            name="subject"
                                            label="Quote Subject"
                                            initialValue="Quotation of 5 level puzzle car parking system for Puducherry"
                                            rules={[{ required: true, message: "Please enter Quote Subject" }]}
                                        >
                                            <TextArea placeholder="Enter Quote Subject" autoSize={{ minRows: 2, maxRows: 6 }} />
                                        </Form.Item>
                                        <Form.Item
                                            name="greeting"
                                            label="Quote Greeting"
                                            initialValue="This has reference to telephonic discussion with you on13.01.2024 regarding your requirement of car Parking system. We are giving below the details of equipment along with techno-commercial offer."
                                            rules={[{ required: true, message: "Please enter Quote Greeting" }]}
                                        >
                                            <TextArea placeholder="Enter Quote Greeting" autoSize={{ minRows: 2, maxRows: 6 }} />
                                        </Form.Item>
                                        <Form.Item
                                            name="proposal_title"
                                            label="Quote Proposal title"
                                            initialValue="Proposal for supply, installation, erection, testing & Commissionning of puzzel car parking system, model- shail02."
                                            rules={[{ required: true, message: "Please enter Quote Proposal title" }]}
                                        >
                                            <TextArea placeholder="Enter Quote Proposal title" autoSize={{ minRows: 2, maxRows: 6 }} />
                                        </Form.Item>
                                        <Form.Item
                                            name="back_image"
                                            label="Back Image URL"
                                            initialValue={"https://tarparking.com/crm/uploads/images"}
                                            rules={[{ required: true, message: "Please upload an image" }]}
                                        >
                                            <Input placeholder="Image Back URL" readOnly value={imageURL} />
                                        </Form.Item>
                                        <Form.Item
                                            name="remark"
                                            label="Remark"
                                        >
                                            <TextArea placeholder="Enter remark" autoSize={{ minRows: 2, maxRows: 6 }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                        </Form>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default CreateQuotePage;
