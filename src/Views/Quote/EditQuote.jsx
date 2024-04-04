import React, { useState, useEffect } from "react";
import { Card, Form, Input, Select, Button, notification, Row, Col, Steps, InputNumber, Divider } from "antd";
import { APIService } from "../../apis";
import { PlusOutlined } from '@ant-design/icons';
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;
const { Step } = Steps;

const EditQuotePage = () => {
    const { id } = useParams();
    const userInfo = useUserInfo();
    const editBy = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [quoteData, setQuoteData] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [specifications, setSpecifications] = useState([]);
    const [tnc, setTnc] = useState([]);
    const [selectedSubProduct, setSelectedSubProduct] = useState(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [allStepValues, setAllStepValues] = useState({});

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/quotes`);
    };
    const handleNext = async () => {
        const values = await form.validateFields();
        setCurrentStep((prevStep) => prevStep + 1);
        const mergedValues = { ...allStepValues, ...values };
        setAllStepValues(mergedValues);
    };

    const handlePrev = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const fetchQuoteData = async (id) => {
        try {
            setLoading(true);
            const response = await APIService.QuoteApi.readResource(id);
            if (response.success) {
                form.setFieldsValue({
                    ...response.data,
                    item: JSON.parse(response.data.item),
                    specifications: JSON.parse(response.data.item).specifications,
                    tnc: JSON.parse(response.data.tnc)
                });
                setQuoteData(response.data);
                setSpecifications(JSON.parse(response.data.item).specifications)

            } else {
                console.error("Error fetching Quote data:", response.message);
                notification.error({
                    message: "Error",
                    description: "Failed to fetch Quote details.",
                });
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching Quote data:", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch Quote details. Please try again later.",
            });
        }
    };
    useEffect(() => {
        fetchQuoteData(id);
    }, [id]);

    const handleEditQuote = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                const itemFieldValue = form.getFieldValue(['item']);
                const tncFieldValue = form.getFieldValue(['tnc']);
                const priceFieldValue = form.getFieldValue(['quote_price']);

                const itemObject = typeof itemFieldValue === 'object' ? itemFieldValue : JSON.parse(itemFieldValue);
                const tncObject = typeof tncFieldValue === 'object' ? tncFieldValue : JSON.parse(tncFieldValue);

                const mergedItemObject = {
                    ...itemObject,
                    specifications: form.getFieldValue(['specifications']),
                };

                const mergedValues = { ...allStepValues, item: mergedItemObject, tnc: tncObject, quote_price: priceFieldValue };
                delete mergedValues.specifications;
                delete mergedValues.client;
                delete mergedValues.editBy;
                delete mergedValues.ourCompany;

                APIService.QuoteApi.updateResource(id, mergedValues)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Quote details updated successfully.",
                        });
                        navigate(`/quotes`);
                    })
                    .catch((error) => {
                        console.error("Error updating Quote details:", error);
                        notification.error({
                            message: "Error",
                            description: "Failed to update Quote details. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            console.error("Error updating Quote details:", error);
            notification.error({
                message: "Error",
                description: "Failed to update Quote details. Please try again later.",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Create Quotation" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[16, 16]}>
                <Col xl={8} sm={24} xs={24}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Steps direction="vertical" current={currentStep}>
                                <Step title="Product Selection" description="Select category, product, and sub-product" />
                                <Step title="Quote Information" description="Enter quote details" />
                                <Step title="Product Info & Price" description="Enter Product details & Price" />
                                <Step title="Specifications" description="Enter Product Specifications" />
                                <Step title="Terms & Conditions" description="Enter Quote Terms & Conditions" />
                            </Steps>
                            <div style={{ marginTop: "10px" }}>
                                {[
                                    { step: 0, buttons: [<Button key="step0" type="primary" onClick={handleNext}>Next</Button>] },
                                    {
                                        step: 1, buttons: [
                                            <Button key="step1_prev" style={{ marginRight: "10px" }} onClick={handlePrev}>Previous</Button>,
                                            <Button key="step1_next" type="primary" onClick={handleNext}>Next</Button>
                                        ]
                                    },
                                    {
                                        step: 2, buttons: [
                                            <Button key="step2_prev" style={{ marginRight: "10px" }} onClick={handlePrev}>Previous</Button>,
                                            <Button key="step2_next" type="primary" onClick={handleNext}>Next</Button>
                                        ]
                                    },
                                    {
                                        step: 3, buttons: [
                                            <Button key="step2_prev" style={{ marginRight: "10px" }} onClick={handlePrev}>Previous</Button>,
                                            <Button key="step2_next" type="primary" onClick={handleNext}>Next</Button>
                                        ]
                                    },
                                    {
                                        step: 4, buttons: [
                                            <Button key="step4_prev" style={{ marginRight: "10px" }} onClick={handlePrev}>Previous</Button>,
                                            <Button key="step4_update" type="primary" onClick={handleEditQuote} loading={loading}>Update Quote</Button>
                                        ]
                                    }
                                ].find(item => item.step === currentStep)?.buttons}
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col xl={16} md={24}  xs={24}>
                    <div>
                        <Form
                            form={form}
                            layout="vertical"
                            onValuesChange={(changedValues, allValues) => {
                                if (currentStep === 2) {
                                    const { basic_rate, installation_charges, discount, freight_cost, unloading_cost, transport_charge, tax_rate, quantity } = allValues.quote_price;
                                    const item_sub_total = (basic_rate + installation_charges) * quantity;
                                    const taxtotal = ((item_sub_total * tax_rate) / 100);
                                    const total_price = item_sub_total + taxtotal + freight_cost + unloading_cost + transport_charge - discount;
                                    form.setFieldsValue({
                                        quote_price: {
                                            ...allValues.quote_price,
                                            total_price: total_price,
                                        },
                                    });
                                }
                            }}

                        >
                            {currentStep === 0 && (
                                <Row gutter={50}>
                                    <Col xl={12} sm={24}  xs={24}>
                                        <Form.Item
                                            name="editBy"
                                            label="EditBy (You)"
                                            initialValue={editBy}
                                        >
                                            <Input placeholder="Enter EditBy Id" disabled />
                                        </Form.Item>
                                    </Col>
                                    <Col xl={12} sm={24}  xs={24}>
                                        <Form.Item name="status" label=" Quote Status" rules={[{ required: true, message: "Select Quote  Status" }]}>
                                            <Select placeholder="Select Status">
                                                <Select.Option value="pending">Pending</Select.Option>
                                                <Select.Option value="sent">Sent</Select.Option>
                                                <Select.Option value="accepted">Accepted</Select.Option>
                                                <Select.Option value="cancelled">Cancelled</Select.Option>
                                                <Select.Option value="on hold">On Hold</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                    <Col xl={12} sm={24}  xs={24}>
                                        <Form.Item name={["item", "categoryName"]} label="Category Name" rules={[{ required: true, message: "Select Category Name" }]}>
                                            <Input readOnly />
                                        </Form.Item>
                                    </Col>
                                    <Col xl={12} sm={24}  xs={24}>
                                        <Form.Item name={["item", "mainProduct"]} label="Product Name" rules={[{ required: true, message: "Select Product Name" }]}>
                                            <Input readOnly />
                                        </Form.Item>
                                    </Col>
                                    <Col xl={12} sm={24}  xs={24}>
                                        <Form.Item name={["item", "productName"]} label="Sub Product Name" rules={[{ required: true, message: "SelectSub Product" }]}>
                                            <Input readOnly />
                                        </Form.Item>
                                    </Col>
                                    <Col xl={12} sm={24}  xs={24}>
                                        <Form.Item name={["client", "name"]} label="Client" rules={[{ required: true, message: "Select Client" }]}>
                                            <Input readOnly />
                                        </Form.Item>
                                    </Col>
                                    <Col xl={12} sm={24}  xs={24}>
                                        <Form.Item name={["ourCompany", "name"]} label="Our Company" rules={[{ required: true, message: "Select Our Company" }]}>
                                            <Input readOnly />
                                        </Form.Item>
                                    </Col>
                                    <Col xl={12} sm={24}  xs={24}>
                                        <Form.Item
                                            name="refno"
                                            label="Ref No"
                                            rules={[{ required: true, message: "Please enter Ref No" }]}
                                        >
                                            <TextArea placeholder="Enter Ref No" autoSize={{ minRows: 1, maxRows: 2 }} readOnly />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            )}
                            {currentStep === 1 && (
                                <Row gutter={16}>
                                    <Col xl={18} sm={24} xs={24}>
                                        <Form.Item
                                            name="subject"
                                            label="Quote Subject"
                                            rules={[{ required: true, message: "Please enter Quote Subject" }]}
                                        >
                                            <TextArea placeholder="Enter Quote Subject" autoSize={{ minRows: 2, maxRows: 6 }} />
                                        </Form.Item>
                                        <Form.Item
                                            name="greeting"
                                            label="Quote Greeting"
                                            rules={[{ required: true, message: "Please enter Quote Greeting" }]}
                                        >
                                            <TextArea placeholder="Enter Quote Greeting" autoSize={{ minRows: 2, maxRows: 6 }} />
                                        </Form.Item>
                                        <Form.Item
                                            name="proposal_title"
                                            label="Quote Proposal title"
                                            rules={[{ required: true, message: "Please enter Quote Proposal title" }]}
                                        >
                                            <TextArea placeholder="Enter Quote Proposal title" autoSize={{ minRows: 2, maxRows: 6 }} />
                                        </Form.Item>
                                        <Form.Item
                                            name="back_image"
                                            label="Back Image URL"
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
                            {currentStep === 2 && (
                                <>
                                    <div>
                                        <h2>Product Information</h2>
                                        <Row gutter={50}>
                                            <Col span={22}>
                                                <div>
                                                    <Row gutter={30}>
                                                        <Col xl={12} sm={24}  xs={24}>
                                                            <Form.Item
                                                                name={["item", "categoryName"]}
                                                                label="Category Name"
                                                                initialValue={selectedSubProduct && selectedSubProduct.category ? selectedSubProduct.category.name : ''}
                                                                rules={[{ required: true, message: "Please enter Category name" }]}
                                                            >
                                                                <Input placeholder="Enter Category name" readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={12} sm={24}  xs={24}>
                                                            <Form.Item
                                                                name={["item", "mainProduct"]}
                                                                label="Main Product"
                                                                initialValue={selectedSubProduct && selectedSubProduct.product ? selectedSubProduct.product.name : ''}
                                                                rules={[{ required: true, message: "Please enter Main Product" }]}
                                                            >
                                                                <Input placeholder="Enter Main Product" readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={12} sm={24}  xs={24}>
                                                            <Form.Item
                                                                name={["item", "productName"]}
                                                                label="Product Name"
                                                                initialValue={selectedSubProduct && selectedSubProduct.name ? selectedSubProduct.name : ''}
                                                                rules={[{ required: true, message: "Please enter Quote name" }]}
                                                            >
                                                                <Input placeholder="Enter Quote name" readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={12} sm={24}  xs={24}>
                                                            <Form.Item
                                                                name={["item", "model_no"]}
                                                                label="Model No"
                                                                initialValue={selectedSubProduct && selectedSubProduct.model_no ? selectedSubProduct.model_no : ''}
                                                                rules={[{ required: true, message: "Please enter Model No" }]}
                                                            >
                                                                <Input placeholder="Enter Model No" readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={12} sm={24}  xs={24}>
                                                            <Form.Item
                                                                name={["item", "hsn"]}
                                                                label="HSN No"
                                                                initialValue={selectedSubProduct && selectedSubProduct.hsn ? selectedSubProduct.hsn : ''}
                                                                rules={[{ required: true, message: "Please enter HSN No" }]}
                                                            >
                                                                <Input placeholder="Enter HSN No" readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={12} sm={24}  xs={24}>
                                                            <Form.Item
                                                                name={["item", "image"]}
                                                                label="Product Image URL"
                                                                initialValue={selectedSubProduct && selectedSubProduct.image ? selectedSubProduct.image : ''}
                                                                rules={[{ required: true, message: "Please enter Basic rate" }]}
                                                            >
                                                                <TextArea placeholder="Product Image URL" readOnly style={{ width: '100%' }} />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div>
                                        <h2>Price Details</h2>
                                        <Row gutter={50}>
                                            <Col span={22}>
                                                <div>
                                                    <Row gutter={30}>
                                                        <Col xl={8} sm={24} xs={24}>
                                                            <Form.Item
                                                                name={["quote_price", "quantity"]}
                                                                label="Enter Quantity "
                                                                initialValue={1}
                                                                rules={[{ required: true, message: "Please Enter Quantity" }]}
                                                            >
                                                                <InputNumber placeholder="Enter Quantity" style={{ width: '100%' }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={8} sm={24} xs={24}>
                                                            <Form.Item
                                                                name={["quote_price", "basic_rate"]}
                                                                label="Basic rate"
                                                                initialValue={selectedSubProduct && selectedSubProduct.price ? selectedSubProduct.price.basic_rate : ''}
                                                                rules={[{ required: true, message: "Please Enter Basic rate" }]}
                                                            >
                                                                <InputNumber placeholder="Enter Basic rate" style={{ width: '100%' }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={8} sm={24} xs={24}>
                                                            <Form.Item
                                                                name={["quote_price", "installation_charges"]}
                                                                label="Installation Charges"
                                                                initialValue={selectedSubProduct && selectedSubProduct.price ? selectedSubProduct.price.installation_charges : ''}
                                                                rules={[{ required: true, message: "Please Enter Installation" }]}
                                                            >
                                                                <InputNumber placeholder="Enter Installation" style={{ width: '100%' }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={8} sm={24} xs={24}>
                                                            <Form.Item
                                                                name={["quote_price", "freight_cost"]}
                                                                label="freight Cost"
                                                                initialValue={0}
                                                            >
                                                                <InputNumber placeholder="Enter freight Cost" style={{ width: '100%' }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={8} sm={24} xs={24}>
                                                            <Form.Item
                                                                name={["quote_price", "unloading_cost"]}
                                                                label="Unloading Cost"
                                                                initialValue={0}
                                                            >
                                                                <InputNumber placeholder="Enter unloading Cost" style={{ width: '100%' }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={8} sm={24} xs={24}>
                                                            <Form.Item
                                                                name={["quote_price", "transport_charge"]}
                                                                label="Transport Charges"
                                                                initialValue={0}
                                                            >
                                                                <InputNumber placeholder="Enter Transport Charges" style={{ width: '100%' }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={8} sm={24} xs={24}>
                                                            <Form.Item
                                                                name={["quote_price", "discount"]}
                                                                label="Other Discount"
                                                                initialValue={0}
                                                            >
                                                                <InputNumber placeholder="Enter Discount" style={{ width: '100%' }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={8} sm={24} xs={24}>
                                                            <Form.Item
                                                                name={["quote_price", "tax_rate"]}
                                                                label="Tax Rate (GST)"
                                                                initialValue={18}
                                                                rules={[{ required: true, message: "Please Enter Tax Rate (GST)" }]}
                                                            >
                                                                <InputNumber placeholder="Enter Tax Rate" style={{ width: '100%' }} />
                                                            </Form.Item>
                                                        </Col>
                                                        <Col xl={8} sm={24} xs={24}>
                                                            <Form.Item
                                                                name={["quote_price", "total_price"]}
                                                                label="Total Value"
                                                            >
                                                                <InputNumber placeholder="Enter Total Value" style={{ width: '100%' }} readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </>
                            )}
                            {currentStep === 3 && (
                                <>
                                    {/* <Form initialValues={specifications}> */}
                                    <h2>Product Specifications</h2>
                                    <Divider />
                                    <Row gutter={50} >
                                        <Col xl={12} sm={24}  xs={24}>
                                            <div>
                                                <Row gutter={16}>
                                                    <Col xl={12} sm={24}  xs={24} >
                                                        <Form.Item
                                                            name={["specifications", "lifting_height", "top"]}
                                                            label="Lifting Height Top"
                                                            initialValue={specifications && specifications.lifting_height ? specifications.lifting_height.top : ''}
                                                            rules={[{ required: true, message: "Please enter Lifting Height Top" }]}
                                                        >
                                                            <InputNumber placeholder="Enter Lifting Height Top" style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xl={12} sm={24}  xs={24} >
                                                        <Form.Item
                                                            name={["specifications", "lifting_height", "ground"]}
                                                            label="Lifting Height ground"
                                                            initialValue={specifications && specifications.lifting_height ? specifications.lifting_height.ground : ''}
                                                            rules={[{ required: true, message: "Please enter Lifting Height ground" }]}
                                                        >
                                                            <InputNumber placeholder="Enter Lifting Height ground" style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row gutter={16}>
                                                    <Col xl={12} sm={24}  xs={24} >
                                                        <Form.Item
                                                            name={["specifications", "platform", "length"]}
                                                            label="Platform length"
                                                            initialValue={specifications && specifications.platform ? specifications.platform.length : ''}
                                                            rules={[{ required: true, message: "Please enter Platform length" }]}
                                                        >
                                                            <InputNumber placeholder="Enter Platform length" style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xl={12} sm={24}  xs={24} >
                                                        <Form.Item
                                                            name={["specifications", "platform", "width"]}
                                                            label="Platform width"
                                                            initialValue={specifications && specifications.platform ? specifications.platform.width : ''}
                                                            rules={[{ required: true, message: "Please enter Platform width" }]}
                                                        >
                                                            <InputNumber placeholder="Enter Platform width" style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Row gutter={16}>
                                                    <Col xl={12} sm={24}  xs={24} >
                                                        <Form.Item
                                                            name={["specifications", "travelling_speed", "lifting"]}
                                                            label="Travelling Speed Lifting"
                                                            initialValue={specifications?.travelling_speed?.horizontal || ''}
                                                            rules={[{ required: true, message: "Please enter Travelling Speed Lifting" }]}
                                                        >
                                                            <Input placeholder="Enter Travelling Speed Lifting" style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col xl={12} sm={24}  xs={24} >
                                                        <Form.Item
                                                            name={["specifications", "travelling_speed", "horizontal"]}
                                                            label="Travelling Speed horizontal"
                                                            initialValue={specifications && specifications.travelling_speed ? specifications.travelling_speed.horizontal : ''}
                                                            rules={[{ required: true, message: "Please enter Travelling Speed horizontal" }]}
                                                        >
                                                            <Input placeholder="Enter Travelling Speed horizontal" style={{ width: '100%' }} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                                <Divider />
                                                <Row gutter={10}>
                                                    <Col span={24}>
                                                        {/* Safety Fields */}
                                                        <Form.List name={["specifications", "safety"]} initialValue={specifications && specifications.safety ? specifications.safety : ['']}>
                                                            {(fields, { add, remove }) => (
                                                                <>
                                                                    {fields.map(({ key, name, ...restField }) => (
                                                                        <Row gutter={16} key={key}>
                                                                            <Col xl={18} sm={24} xs={24}>
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
                                                    <Col span={24}>
                                                        <Form.List name={["specifications", "features"]} initialValue={specifications && specifications.features ? specifications.features : ['']}>
                                                            {(fields, { add, remove }) => (
                                                                <>
                                                                    {fields.map(({ key, name, ...restField }) => (
                                                                        <Row gutter={16} key={key}>
                                                                            <Col xl={18} sm={24} xs={24}>
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
                                            </div>
                                        </Col>
                                        <Col xl={10} sm={24} xs={24}>
                                            <Row gutter={16}>
                                                <Col span={24} >
                                                    <div >
                                                        <Form.Item
                                                            name={["specifications", "system_module"]}
                                                            label="System Module"
                                                            initialValue={specifications && specifications.system_module ? specifications.system_module : ''}
                                                            rules={[{ required: true, message: "Please enter System Module" }]}
                                                        >
                                                            <TextArea placeholder="Enter System Module Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["specifications", "system_area"]}
                                                            label="System Area"
                                                            initialValue={specifications && specifications.system_area ? specifications.system_area : ''}
                                                            rules={[{ required: true, message: "Please enter System Area" }]}
                                                        >
                                                            <TextArea placeholder="Enter System Area Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["specifications", "car_size"]}
                                                            label="Car Size"
                                                            initialValue={specifications && specifications.car_size ? specifications.car_size : ''}
                                                            rules={[{ required: true, message: "Please enter Car Size" }]}
                                                        >
                                                            <TextArea placeholder="Enter Car Size Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["specifications", "lifting_capacity"]}
                                                            label="Lifting Capacity"
                                                            initialValue={specifications && specifications.lifting_capacity ? specifications.lifting_capacity : ''}
                                                            rules={[{ required: true, message: "Please enter Lifting Capacity" }]}
                                                        >
                                                            <TextArea placeholder="Enter Lifting Capacity Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["specifications", "power"]}
                                                            label="Power"
                                                            initialValue={specifications && specifications.power ? specifications.power : ''}
                                                            rules={[{ required: true, message: "Please enter Power" }]}
                                                        >
                                                            <TextArea placeholder="Enter Power Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["specifications", "driving_unit"]}
                                                            label="Driving Unit"
                                                            initialValue={specifications && specifications.driving_unit ? specifications.driving_unit : ''}
                                                            rules={[{ required: true, message: "Please enter Driving Unit" }]}
                                                        >
                                                            <TextArea placeholder="Enter Driving Unit Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["specifications", "material_delivery"]}
                                                            label="Material Delivery"
                                                            initialValue={specifications && specifications.material_delivery ? specifications.material_delivery : ''}
                                                            rules={[{ required: true, message: "Please enter Material Delivery" }]}
                                                        >
                                                            <TextArea placeholder="Enter Material Delivery Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["specifications", "installation"]}
                                                            label="Installation"
                                                            initialValue={specifications && specifications.installation ? specifications.installation : ''}
                                                            rules={[{ required: true, message: "Please enter Installation" }]}
                                                        >
                                                            <TextArea placeholder="Enter Installation Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["specifications", "amc"]}
                                                            label="AMC"
                                                            initialValue={specifications && specifications.amc ? specifications.amc : ''}
                                                            rules={[{ required: true, message: "Please enter AMC" }]}
                                                        >
                                                            <TextArea placeholder="Enter AMC Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["specifications", "material_quality"]}
                                                            label="Material Quality"
                                                            initialValue={specifications && specifications.material_quality ? specifications.material_quality : ''}
                                                            rules={[{ required: true, message: "Please enter Material Quality" }]}
                                                        >
                                                            <TextArea placeholder="Enter Material Quality Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    {/* </Form> */}
                                </>
                            )}
                            {currentStep === 4 && (
                                <>
                                    <h2>Terms & Conditions</h2>
                                    <Divider />
                                    <Row gutter={50}>
                                        <Col xl={12} sm={24}  xs={24}>
                                            <div>
                                                <Row gutter={10}>
                                                    <Col span={24}>
                                                        <Form.List name={["tnc", "payment_terms"]} initialValue={tnc && tnc.payment_terms ? tnc.payment_terms : ['']}>
                                                            {(fields, { add, remove }) => (
                                                                <>
                                                                    {fields.map(({ key, name, ...restField }) => (
                                                                        <Row gutter={16} key={key}>
                                                                            <Col xl={18} sm={24} xs={24}>
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
                                                    <h4>Client Responsibility</h4>
                                                    <Col span={24}>
                                                        <Form.List name={["tnc", "client_responsibilities"]} initialValue={tnc && tnc.client_responsibilities ? tnc.client_responsibilities : ['']}>
                                                            {(fields, { add, remove }) => (
                                                                <>
                                                                    {fields.map(({ key, name, ...restField }) => (
                                                                        <Row gutter={16} key={key}>
                                                                            <Col xl={18} sm={24} xs={24}>
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
                                                    <Col span={24}>
                                                        <Form.List name={["tnc", "installation_process"]} initialValue={tnc && tnc.installation_process ? tnc.installation_process : ['']}>
                                                            {(fields, { add, remove }) => (
                                                                <>
                                                                    {fields.map(({ key, name, ...restField }) => (
                                                                        <Row gutter={16} key={key}>
                                                                            <Col xl={18} sm={24} xs={24}>
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
                                            </div>
                                        </Col>
                                        <Col xl={10} sm={24} xs={24}>
                                            <Row gutter={16}>
                                                <Col span={24}>
                                                    <div>
                                                        <Form.Item
                                                            name={["tnc", "prices"]}
                                                            label="Prices"
                                                            initialValue={tnc?.prices || ''}
                                                            rules={[{ required: true, message: "Please enter prices" }]}
                                                        >
                                                            <TextArea placeholder="Enter prices Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["tnc", "packing_forwarding"]}
                                                            label="Packing Forwarding"
                                                            initialValue={tnc?.packing_forwarding || ''}
                                                            rules={[{ required: true, message: "Please enter Packing Forwarding" }]}
                                                        >
                                                            <TextArea placeholder="Enter Packing Forwarding Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["tnc", "material_delivery"]}
                                                            label="Material Delivery"
                                                            initialValue={tnc?.material_delivery || ''}
                                                            rules={[{ required: true, message: "Please enter Material Delivery" }]}
                                                        >
                                                            <TextArea placeholder="Enter Material Delivery Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["tnc", "operation"]}
                                                            label="Operation"
                                                            initialValue={tnc?.operation || ''}
                                                            rules={[{ required: true, message: "Please enter Operation" }]}
                                                        >
                                                            <TextArea placeholder="Enter Operation Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["tnc", "force_majeure"]}
                                                            label="Force Majeure"
                                                            initialValue={tnc?.force_majeure || ''}
                                                            rules={[{ required: true, message: "Please enter Force Majeure" }]}
                                                        >
                                                            <TextArea placeholder="Enter Force Majeure Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["tnc", "warranty"]}
                                                            label="Warranty"
                                                            initialValue={tnc?.warranty || ''}
                                                            rules={[{ required: true, message: "Please enter Warranty" }]}
                                                        >
                                                            <TextArea placeholder="Enter Warranty Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["tnc", "termination"]}
                                                            label="Termination"
                                                            initialValue={tnc?.termination || ''}
                                                            rules={[{ required: true, message: "Please enter Termination" }]}
                                                        >
                                                            <TextArea placeholder="Enter Termination Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["tnc", "jurisdiction"]}
                                                            label="Jurisdiction"
                                                            initialValue={tnc?.jurisdiction || ''}
                                                            rules={[{ required: true, message: "Please enter Jurisdiction" }]}
                                                        >
                                                            <TextArea placeholder="Enter Jurisdiction Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            name={["tnc", "validity"]}
                                                            label="Validity"
                                                            initialValue={tnc?.validity || ''}
                                                            rules={[{ required: true, message: "Please enter Validity" }]}
                                                        >
                                                            <TextArea placeholder="Enter Validity Info" autoSize={{ minRows: 1, maxRows: 6 }} />
                                                        </Form.Item>
                                                    </div>

                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        </Form>
                    </div>
                </Col>
            </Row>
        </Card>
    );
};

export default EditQuotePage;
