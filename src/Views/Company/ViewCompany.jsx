import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Switch, Button, notification, Row, Col } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const ViewCompanyPage = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [companyData, setCompanyData] = useState(null);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/company`);
    };

    useEffect(() => {
        fetchCompanyData(id);
    }, [id]);

    const fetchCompanyData = async (id) => {
        try {
            setLoading(true);
            const response = await APIService.CompanyApi.readResource(id);

            if (response.success) {
                form.setFieldsValue(response.data);
                setCompanyData(response.data);
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
        <Card title="View Company Details" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} style={{ padding: 50, margin: 10 }}>
            <Row gutter={150}>
                {/* Left Side - Company Information */}
                <Col span={12}>
                    <div>
                        <h2>Company Information</h2>
                        <Form form={form} layout="vertical" initialValues={companyData}>
                            <Row gutter={16}>
                                <Col span={6}>
                                    <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                                        <Switch checkedChildren="Active" unCheckedChildren="Inactive" defaultChecked disabled />
                                    </Form.Item>
                                </Col>
                                <Col span={18}>
                                    <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter Name" }]}>
                                        <Input placeholder="Enter Name" readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col span={12}>
                                    <Form.List name="emails" initialValue={['']}>
                                        {(fields) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={50} key={key}>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Email #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Email' },
                                                                    { type: 'email', message: 'Please enter a valid Email' },
                                                                ]}
                                                            >
                                                                <Input placeholder="Enter Email" readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                ))}

                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                                <Col span={12}>
                                    <Form.List name="websites" initialValue={['']}>
                                        {(fields) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={50} key={key}>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Website #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Website' },
                                                                ]}
                                                            >
                                                                <Input placeholder="Enter Website" readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                ))}

                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                                <Col span={12}>
                                    <Form.List name="phones" initialValue={['']}>
                                        {(fields) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={50} key={key}>
                                                        <Col span={22}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Phone #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Phone' },
                                                                ]}
                                                            >
                                                                <Input placeholder="Enter Phone no" readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                ))}

                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                            </Row>
                            <Form.Item
                                name="cin_no"
                                label="CIN No"
                                rules={[{ required: true, message: "Please enter CIN No" }]}
                            >
                                <Input placeholder="Enter CIN No" readOnly />
                            </Form.Item>
                            <Form.Item
                                name="tan_no"
                                label="TAN No"
                                rules={[{ required: true, message: "Please enter TAN No" }]}
                            >
                                <Input placeholder="Enter TAN No" readOnly />
                            </Form.Item>
                            <Form.Item
                                name="pan_no"
                                label="PAN No"
                                rules={[{ required: true, message: "Please enter PAN No" }]}
                            >
                                <Input placeholder="Enter PAN No" readOnly />
                            </Form.Item>
                            <Form.Item
                                name="gst_no"
                                label="GST No"
                                rules={[{ required: true, message: "Please enter GST No" }]}
                            >
                                <Input placeholder="Enter GST No" readOnly />
                            </Form.Item>
                        </Form>
                    </div>
                </Col>

                {/* Right Side - Address & Account details */}
                <Col span={10}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <div>
                                <h2>Address details</h2>
                                <Form form={form} layout="vertical">
                                    <Form.Item
                                        name={["address", "office"]}
                                        label="Office Address"
                                        rules={[{ required: true, message: "Please enter office Address" }]}
                                    >
                                        <TextArea placeholder="Enter office address" autoSize={{ minRows: 2, maxRows: 6 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name={["address", "factory"]}
                                        label="Factory Address"
                                        rules={[{ required: true, message: "Please enter factory Address" }]}
                                    >
                                        <TextArea placeholder="Enter factory address" autoSize={{ minRows: 2, maxRows: 6 }} readOnly />
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>
                        <Col span={24}>
                            <div>
                                <h2>Bank details</h2>
                                <Form form={form} layout="vertical">
                                    <Form.Item
                                        name={["bank_details", "bank_name"]}
                                        label="Bank Name"
                                        rules={[{ required: true, message: "Please enter Bank name" }]}
                                    >
                                        <Input placeholder="Enter Bank name" readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name={["bank_details", "account_no"]}
                                        label="Account Number"
                                        rules={[{ required: true, message: "Please enter Account Number" }]}
                                    >
                                        <Input placeholder="Enter Account Number" readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name={["bank_details", "ifsc"]}
                                        label="Ifsc Code"
                                        rules={[{ required: true, message: "Please enter Ifsc Code" }]}
                                    >
                                        <Input placeholder="Enter Ifsc Code" readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name={["bank_details", "branch"]}
                                        label="Branch & Address"
                                        rules={[{ required: true, message: "Please enter Branch & Address" }]}
                                    >
                                        <Input placeholder="Enter Branch & Address" readOnly />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button type="primary" onClick={handleBack} loading={loading}>
                                            Go Back
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    );
};

export default ViewCompanyPage;
