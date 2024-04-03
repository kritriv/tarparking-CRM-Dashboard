import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Switch, Button, notification, Row, Col } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

const EditCategoryPage = () => {
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
                console.error("Error fetching Comapany data:", response.message);
                notification.error({
                    message: "Error",
                    description: "Failed to fetch Comapany details.",
                });
            }

            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error("Error fetching Comapany data:", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch Comapany details. Please try again later.",
            });
        }
    };

    const handleEditCategory = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                APIService.CategoryApi.updateResource(id, values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Category details updated successfully.",
                        });
                        navigate(`/category`);
                    })
                    .catch((error) => {
                        console.error("Error updating Category details:", error);
                        notification.error({
                            message: "Error",
                            description: "Failed to update Category details. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            console.error("Error updating Category details:", error);
            notification.error({
                message: "Error",
                description: "Failed to update Category details. Please try again later.",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Edit Category" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[16, 16]}>
                <Col xl={18} md={24} xs={24}>
                    <div>
                        <h2>Category Information</h2>
                        <Form form={form} layout="vertical" initialValues={categoryData}>
                            <Row gutter={16}>
                                <Col xl={6} md={24} xs={24}>
                                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                                    </Form.Item>
                                </Col>
                                <Col xl={12} md={24} xs={24}>
                                    <Form.Item
                                        name="editBy"
                                        label="EditBy (You)"
                                        initialValue={editBy}
                                    >
                                        <Input placeholder="Enter EditBy Id" disabled />
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
                                <Input placeholder="Enter Category name" />
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Description"
                                rules={[{ required: true, message: "Please enter description Number" }]}
                            >
                                <TextArea placeholder="Enter description..." autoSize={{ minRows: 3, maxRows: 6 }} />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" onClick={handleEditCategory} loading={loading}>
                    Update
                </Button>
            </Form.Item>
        </Card>
    );
};

export default EditCategoryPage;
