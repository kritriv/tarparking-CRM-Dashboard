import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Switch, Button, notification, Row, Col, InputNumber, Modal } from "antd";
import { APIService } from "../../apis";
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

const ViewProductPage = () => {
    const { id } = useParams();
    const userInfo = useUserInfo();
    const editBy = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [subProductData, setsubProductData] = useState(null);
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

    useEffect(() => {
        fetchsubProductData(id);
    }, [id]);

    const fetchsubProductData = async (id) => {
        try {
            setLoading(true);
            const response = await APIService.SubProductApi.readResource(id);

            if (response.success) {
                form.setFieldsValue({
                    ...response.data,
                    category: response.data.category ? response.data.category.name : undefined,
                    product: response.data.product ? response.data.product.name : undefined,
                });
                setsubProductData(response.data);
                setImageURL(response.data.image);
            } else {
                console.error("Error fetching user data:", response.message);
                notification.error({
                    message: "Error",
                    description: "Failed to fetch user details.",
                });
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching user data:", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch user details. Please try again later.",
            });
        }
    };

    return (
        <Card
            title="View Sub Product"
            extra={<Button onClick={() => handleBack()}>Go Back to List</Button>}
            className="custom-card"
        >
            <Row gutter={[16, 16]}>
                <Col xl={18} md={24}  xs={24}>
                    <div>
                        <h2>Sub Product Information</h2>
                        <Form form={form} layout="vertical" initialValues={subProductData}>
                            <Row gutter={30}>
                                <Col xl={3} md={24}  xs={24}>
                                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                                    </Form.Item>
                                </Col>
                                <Col xl={7} md={24}  xs={24}>
                                    <Form.Item
                                        name="editBy"
                                        label="EditBy (You)"
                                        initialValue={editBy}
                                    >
                                        <Input placeholder="Enter EditBy Id" disabled />
                                    </Form.Item>
                                </Col>
                                <Col xl={7} md={24}  xs={24}>
                                    <Form.Item name="category" label="Category Name" rules={[{ required: true, message: "Select Category Name" }]}>
                                        <Input placeholder="Enter Category name" readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xl={7} md={24}  xs={24}>
                                    <Form.Item name="product" label="Product Name" rules={[{ required: true, message: "Select Product Name" }]}>
                                        <Input placeholder="Enter Product name" readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col xl={8} md={24}  xs={24}>
                                    <Form.Item
                                        name="name"
                                        label="Sub Product Name"
                                        rules={[{ required: true, message: "Please enter Sub Product name" }]}
                                    >
                                        <Input placeholder="Enter Sub Product name" readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xl={8} md={24}  xs={24}>
                                    <Form.Item
                                        name="model_no"
                                        label="Model No"
                                        rules={[{ required: true, message: "Please enter Model No" }]}
                                    >
                                        <Input placeholder="Enter Model No" readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xl={8} md={24}  xs={24}>
                                    <Form.Item
                                        name="hsn"
                                        label="HSN No"
                                        rules={[{ required: true, message: "Please enter HSN No" }]}
                                    >
                                        <Input placeholder="Enter HSN No" readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={30}>
                                <Col xl={8} md={24}  xs={24}>
                                    <Form.Item
                                        name={["price", "basic_rate"]}
                                        label="Basic rate"
                                        rules={[{ required: true, message: "Please enter Basic rate" }]}
                                    >
                                        <InputNumber placeholder="Basic rate" style={{ width: '100%' }} readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xl={8} md={24}  xs={24}>
                                    <Form.Item
                                        name={["price", "installation_charges"]}
                                        label="Charges"
                                        rules={[{ required: true, message: "Please enter Installation Charges" }]}
                                    >
                                        <InputNumber placeholder="Installation Charges" style={{ width: '100%' }} readOnly />
                                    </Form.Item>
                                </Col>
                                <Col xl={8} md={24}  xs={24}>
                                    <Form.Item
                                        name={["price", "subTotal"]}
                                        label="Sub Total"
                                        rules={[{ required: true, message: "Please enter Sub Total" }]}
                                    >
                                        <InputNumber placeholder="Sub Total" style={{ width: '100%' }} readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: "Please enter description" }]}
                            >
                                <TextArea placeholder="Enter description..." autoSize={{ minRows: 3, maxRows: 6 }} readOnly />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
                <Col xl={6} md={24}  xs={24}>
                    <Row>
                        <div style={{ marginBottom: 16 }}>
                            <label>Image Preview</label>
                            <br />
                            {imageURL && (
                                <>
                                    <img src={imageURL} alt="Preview" style={{ maxWidth: '100%', maxHeight: 300 }} />
                                    <div style={{ marginTop: 8 }}>
                                        <Button type="link" onClick={handleViewImage}><EyeOutlined size={18} /></Button>

                                    </div>
                                </>
                            )}
                        </div>
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
                <Button type="primary" onClick={handleBack} loading={loading}>
                    Go Back
                </Button>
            </Form.Item>
        </Card>
    );
};

export default ViewProductPage;
