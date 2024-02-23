import { useState } from "react";
import { Card, Form, Input, Switch, Select, Button, notification } from "antd";
import { ClientServicesAPI } from "../../apis";
import { useNavigate } from "react-router-dom";
import { useUserInfo } from "../../store/userStore";

const CreateClientPage = () => {
    const userInfo = useUserInfo();
    const createby = userInfo.userID;
    // console.log("createby:", createby)
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleCreateClient = async () => {
        try {
            form.validateFields().then((values) => {
                console.log(values)
                setLoading(true);
                ClientServicesAPI.createClient(values)
                    .then(() => {
                        notification.success({
                            message: "Success",
                            description: "Client successfully Created.",
                        });
                        navigate(`/Clients`);
                    })
                    .catch((error) => {
                        notification.error({
                            message: "Error",
                            description: "Failed to create Client. Please try again later.",
                        });
                    })
                    .finally(() => setLoading(false));
            });
        } catch (error) {
            notification.error({
                message: "Error",
                description: "Failed to create Client. Please try again later",
            });
            setLoading(false);
        }
    };

    return (
        <Card title="Create Client" style={{ padding: 30, margin: 10 }}>
            <div>
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="status"
                        label="Status"
                        rules={[{ required: true, message: "Please select client Status" }]}
                    >
                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>

                    <Form.Item
                        name="username"
                        label="Username"
                        rules={[
                            { required: true, message: "Please enter Username" },
                        ]}
                    >
                        <Input placeholder="Enter Username" />
                    </Form.Item>
                    <Form.Item
                        name="createdby"
                        label="CreatedBy"
                        rules={[
                            { required: true, message: "Please CreatedBy Id" },
                        ]}
                    >
                        <Input placeholder="Enter CreatedBy Id" />
                    </Form.Item>
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            { required: true, message: "Please enter Name" },
                        ]}
                    >
                        <Input placeholder="Enter Name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: "Please enter Email" },
                            { type: "email", message: "Please enter a valid Email" },
                        ]}
                    >
                        <Input placeholder="Enter Email" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                            { required: true, message: "Please enter Phone Number" },
                        ]}
                    >
                        <Input placeholder="Enter Phone Number" />
                    </Form.Item>
                    <Form.Item
                        name="company"
                        label="Company"
                        rules={[
                            { required: true, message: "Please enter Company" },
                        ]}
                    >
                        <Input placeholder="Enter Company" />
                    </Form.Item>
                    <Form.Item
                        name="gst"
                        label="GST"
                        rules={[
                            { required: true, message: "Please enter GST" },
                        ]}
                    >
                        <Input placeholder="Enter GST" />
                    </Form.Item>
                    {/* <Form.Item
                        name="address"
                        label="Address"
                        rules={[
                            { required: true, message: "Please enter Address" },
                        ]}
                    >
                        <Input placeholder="Enter Address" />
                    </Form.Item> */}
                    <Form.Item>
                        <Button type="primary" onClick={handleCreateClient} loading={loading}>
                            Create Client
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Card>

    );
};

export default CreateClientPage;
