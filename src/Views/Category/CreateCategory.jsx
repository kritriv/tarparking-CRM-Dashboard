import { useState } from "react";
import { Card, Form, Input, Switch, Button, notification, Row, Col } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const { TextArea } = Input;

const CreateCategoryPage = () => {
    const userInfo = useUserInfo();
    const createby = userInfo.userID;
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/category`);
    };

    const handleCreateCategory = async () => {
        try {
            form.validateFields().then((values) => {
                setLoading(true);
                APIService.CategoryApi.createResource(values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Category successfully Created.",
                        });
                        navigate(`/Category`);
                    })
                    .catch((error) => {
                        notification.error({
                            message: "Error",
                            description: "Failed to create Category. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to create Category. Please try again later",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Create Category" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} style={{ padding: 50, margin: 10 }}>
            <Row gutter={150}>
                <Col span={18}>
                    <div>
                        <h2>Category Information</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name="createdby"
                                        label="CreatedBy (You)"
                                        rules={[{ required: true, message: "Please CreatedBy Id" }]}
                                        initialValue={createby}
                                    >
                                        <Input placeholder="Enter CreatedBy Id" disabled />
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
                <Button type="primary" onClick={handleCreateCategory} loading={loading}>
                    Create Category
                </Button>
            </Form.Item>
        </Card>
    );
};

export default CreateCategoryPage;
