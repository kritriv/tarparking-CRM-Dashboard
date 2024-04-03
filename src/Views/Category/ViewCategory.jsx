import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Switch, Button, notification, Row, Col } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

const ViewCategoryPage = () => {
    const { id } = useParams();
    const userInfo = useUserInfo();
    const editBy = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categoryData, setCategoryData] = useState(null);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/category`);
    };

    useEffect(() => {
        fetchCategoryData(id);
    }, [id]);

    const fetchCategoryData = async (id) => {
        try {
            setLoading(true);
            const response = await APIService.CategoryApi.readResource(id);

            if (response.success) {
                form.setFieldsValue(response.data);
                setCategoryData(response.data);
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
        <Card title="View Category Details" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[16, 16]}>
                <Col xl={18} md={24} xs={24}>
                    <div>
                        <h2>Category Information</h2>
                        <Form form={form} layout="vertical" initialValues={categoryData}>
                            <Row gutter={16}>
                                <Col xl={6} md={24} xs={24}>
                                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked disabled/>
                                    </Form.Item>
                                </Col>
                                <Col xl={12} md={24} xs={24}>
                                    <Form.Item
                                        name="editBy"
                                        label="Created By"
                                        initialValue={editBy}
                                    >
                                        <Input placeholder="Enter Created By Id" disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item
                                name="name"
                                label="Category Name"
                                rules={[
                                    { required: true, message: "Please enter name" },
                                ]}
                            >
                                <Input placeholder="Enter Category name" readOnly/>
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: "Please enter description Number" }]}
                            >
                                <TextArea placeholder="Enter description..." autoSize={{ minRows: 3, maxRows: 6 }} readOnly/>
                            </Form.Item>
                        </Form>
                    </div>
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

export default ViewCategoryPage;
