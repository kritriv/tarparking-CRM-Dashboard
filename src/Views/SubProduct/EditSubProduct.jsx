import React, { useState, useEffect } from "react";
import { Card, Form, Input, Switch, Button, notification, Row, Col, Select, InputNumber, message, Upload } from "antd";
import { APIService } from "../../apis";
import { useParams } from "react-router-dom";
import { InboxOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";
const { Dragger } = Upload;
const { TextArea } = Input;

const EditSubProductPage = () => {
    const { id } = useParams();
    const userInfo = useUserInfo();
    const editBy = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subProductData, setSubProductData] = useState(null);
    const [imageURL, setImageURL] = useState(null); 

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/sub-products`);
    };

    const props = {
        name: 'file',
        multiple: false,
        action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                message.success(`${info.file.name} file uploaded successfully.`);

                const imageName = info.file.name;
                const imageUrl = `https://tarparking.com/crm/uploads/${imageName}`;

                form.setFieldsValue({ image: imageUrl });
                setImageURL(imageUrl);
            } else if (status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        }

    };

    useEffect(() => {
        fetchCategories();
        fetchSubProductData(id);
    }, [id]);

    const fetchSubProductData = async (id) => {
        try {
            setLoading(true);
            const response = await APIService.SubProductApi.readResource(id);
            if (response.success) {
                form.setFieldsValue({
                    ...response.data,
                    category: response.data.product.category.id,
                    product: response.data.product.id,
                });
                setSelectedCategory(response.data.product.category);
                setProducts([response.data.product]);
                setSubProductData(response.data);
            } else {
                console.error("Error fetching Sub Product data:", response.message);
                notification.error({
                    message: "Error",
                    description: "Failed to fetch Sub Product details.",
                });
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching Sub Product data:", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch Sub Product details. Please try again later.",
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

    const handleEditSubProduct = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                APIService.SubProductApi.updateResource(id, values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Sub Product details updated successfully.",
                        });
                        navigate(`/sub-products`);
                    })
                    .catch((error) => {
                        console.error("Error updating Sub Product details:", error);
                        notification.error({
                            message: "Error",
                            description: "Failed to update Sub Product details. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            console.error("Error updating Sub Product details:", error);
            notification.error({
                message: "Error",
                description: "Failed to update Sub Product details. Please try again later.",
            });
            setLoading(false);
        }
    };

    const handleCategoryChange = async (value) => {
        try {
            const selectedCategory = categories.find((category) => category.id === value);
            setSelectedCategory(selectedCategory);

            if (selectedCategory && selectedCategory.products && selectedCategory.products.length > 0) {
                let categoryId = `category=${selectedCategory.id}`;
                const response = await APIService.ProductApi.listResource(undefined, undefined, undefined, categoryId);

                if (response.success) {
                    setProducts(response.data);
                } else {
                    console.error("Error fetching Products:", response.message);
                }
            } else {
                setProducts([]);
            }

            form.setFieldsValue({ product: undefined });
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    return (
        <Card
            title="Edit Sub Product"
            extra={<Button onClick={() => handleBack()}>Go Back to List</Button>}
            style={{ padding: 50, margin: 10 }}
        >
            <Row gutter={16}>
                <Col span={18}>
                    <div>
                        <h2>Sub Product Information</h2>
                        <Form form={form} layout="vertical" initialValues={subProductData}
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
                                        name="editBy"
                                        label="EditBy (You)"
                                        initialValue={editBy}
                                    >
                                        <Input placeholder="Enter EditBy Id" disabled />
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
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" onClick={handleEditSubProduct} loading={loading}>
                    Update Sub Product
                </Button>
            </Form.Item>
        </Card>
    );
};

export default EditSubProductPage;
