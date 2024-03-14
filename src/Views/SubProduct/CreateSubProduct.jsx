import React, { useState, useEffect } from "react";
import { Card, Form, Input, Switch, Button, notification, Row, Col, Select, InputNumber, message, Upload, Modal } from "antd";
import { InboxOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";
const { Dragger } = Upload;
const { TextArea } = Input;

const CreateSubProductPage = () => {
    const userInfo = useUserInfo();
    const createby = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [imageURL, setImageURL] = useState(null);
    const [viewImageVisible, setViewImageVisible] = useState(false);
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/sub-products`);
    };

    const handleViewImage = () => {
        setViewImageVisible(true);
    };

    const handleViewImageCancel = () => {
        setViewImageVisible(false);
    };


    const handleRemoveImage = () => {
        form.setFieldsValue({ image: null });
        setImageURL(null);
    };
    const props = {
        name: 'file',
        multiple: false,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        showUploadList: {
            showPreviewIcon: true,
            showRemoveIcon: true,
        },
        previewFile(file) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
            });
        },
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);

                const imageName = info.file.name;
                const imageUrl = `https://tarparking.com/crm/uploads/images/${imageName}`;

                form.setFieldsValue({ image: imageUrl });
                setImageURL(imageUrl);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }

    };

    const handleCreateSubProduct = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                // Include the imageURL in the payload
                const payload = { ...values, image: imageURL };

                APIService.SubProductApi.createResource(payload)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Sub Product successfully Created.",
                        });
                        navigate(`/specifications/create`);
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

    return (
        <Card
            title="Create Sub Product"
            extra={<Button onClick={() => handleBack()}>Go Back to List</Button>}
            style={{ padding: 50, margin: 10 }}
        >
            <Row gutter={100}>
                <Col span={18}>
                    <div>
                        <h2>Sub Product Information</h2>
                        <Form form={form} layout="vertical"
                            onValuesChange={(changedValues, allValues) => {
                                const { basic_rate, installation_charges } = allValues.price;
                                form.setFieldsValue({
                                    price: {
                                        ...allValues.price,
                                        subTotal: basic_rate && installation_charges ? basic_rate + installation_charges : undefined,
                                    },
                                });
                            }}
                        >
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
                                <Col span={8}>
                                    <Form.Item
                                        name={["price", "basic_rate"]}
                                        label="Basic rate"
                                        rules={[{ required: true, message: "Please enter Basic rate" }]}
                                    >
                                        <InputNumber placeholder="Basic rate" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        name={["price", "installation_charges"]}
                                        label="Charges"
                                        rules={[{ required: true, message: "Please enter Installation Charges" }]}
                                    >
                                        <InputNumber placeholder="Installation Charges" style={{ width: '100%' }} />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
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
                            <Form.Item
                                name="image"
                                label="Image URL"
                                rules={[{ required: true, message: "Please upload an image" }]}
                            >
                                <Input placeholder="Image URL" readOnly value={imageURL} />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
                <Col span={6}>
                    <Row>
                        <div style={{ marginBottom: 16 }}>
                            <label>Image Preview</label>
                            <br />
                            {imageURL && (
                                <>
                                    <img src={imageURL} alt="Preview" style={{ maxWidth: '100%', maxHeight: 300 }} />
                                    <div style={{ marginTop: 8 }}>
                                        <Button type="link" onClick={handleViewImage}><EyeOutlined size={18} /></Button>
                                        <Button type="link" onClick={handleRemoveImage}><DeleteOutlined size={18}  color="red"  /></Button>

                                    </div>
                                </>
                            )}
                        </div>
                    </Row>
                    <Row>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">
                                Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                banned files.
                            </p>
                        </Dragger>
                    </Row>
                    <Modal
                        open={viewImageVisible}
                        title="View Image"
                        onCancel={handleViewImageCancel}
                        footer={null}
                    >
                        <img src={imageURL} alt="Preview" style={{ maxWidth: '100%', maxHeight: 400 }} />
                    </Modal>
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
