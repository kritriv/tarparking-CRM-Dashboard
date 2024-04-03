import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Button, notification, Row, Col, Divider } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const ViewTncPage = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [tncData, setTncData] = useState(null);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/term-conditions`);
    };

    useEffect(() => {
        fetchTncData(id);
    }, [id]);

    const fetchTncData = async (id) => {
        try {
            setLoading(true);
            const response = await APIService.TncApi.readResource(id);

            if (response.success) {
                form.setFieldsValue({
                    ...response.data,
                    sub_product: response.data.sub_product.name,
                });
                setTncData(response.data);
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
        <Card title="View Tnc Details" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} className="custom-card">
            <Row gutter={[50, 16]}>
                <Col xl={14} sm={24}  xs={24}>
                    <div>
                        <h2>Product Select Info</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col xl={12} sm={24}  xs={24}>
                                    <Form.Item name="sub_product" label="Sub Product Name" rules={[{ required: true, message: "Select Sub Product Name" }]}>
                                        <TextArea readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <h2>Term & Condition Info</h2>
                            <Row gutter={10}>
                                <Col span={24}  xs={24}>
                                    <Form.List name="payment_terms" initialValue={['']}>
                                        {(fields) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}  xs={24}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Payment Terms #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Payment Terms' },
                                                                ]}
                                                            >
                                                                <TextArea placeholder="Enter Payment Terms" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                ))}
                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={10}>
                                <Col span={24}  xs={24}>
                                    <Form.List name="client_responsibilities" initialValue={['']}>
                                        {(fields) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}  xs={24}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Client Responsibility #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Client Responsibilities' },
                                                                ]}
                                                            >
                                                                <TextArea placeholder="Enter Client Responsibilities" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                ))}
                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={10}>
                                <Col span={24}  xs={24}>
                                    <Form.List name="installation_process" initialValue={['']}>
                                        {(fields) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}  xs={24}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Installation Process #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Installation Process' },
                                                                ]}
                                                            >
                                                                <TextArea placeholder="Enter Installation Process" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
                                                            </Form.Item>
                                                        </Col>
                                                    </Row>
                                                ))}
                                            </>
                                        )}
                                    </Form.List>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Col>

                <Col xl={10} sm={24}  xs={24}>
                    <Row gutter={16}>
                        <Col span={24}  xs={24}>
                            <div>
                                <Form form={form} layout="vertical">

                                    <Form.Item
                                        name="prices"
                                        label="Prices"
                                        rules={[{ required: true, message: "Please enter prices" }]}
                                    >
                                        <TextArea placeholder="Enter prices Info" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="packing_forwarding"
                                        label="Packing Forwarding"
                                        rules={[{ required: true, message: "Please enter Packing Forwarding" }]}
                                    >
                                        <TextArea placeholder="Enter Packing Forwarding Info" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="material_delivery"
                                        label="Material Delivery"
                                        rules={[{ required: true, message: "Please enter Material Delivery" }]}
                                    >
                                        <TextArea placeholder="Enter Material Delivery Info" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="operation"
                                        label="Operation"
                                        rules={[{ required: true, message: "Please enter Operation" }]}
                                    >
                                        <TextArea placeholder="Enter Operation Info" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="force_majeure"
                                        label="Force Majeure"
                                        rules={[{ required: true, message: "Please enter Force Majeure" }]}
                                    >
                                        <TextArea placeholder="Enter Force Majeure Info" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="warranty"
                                        label="Warranty"
                                        rules={[{ required: true, message: "Please enter Warranty" }]}
                                    >
                                        <TextArea placeholder="Enter Warranty Info" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="termination"
                                        label="Termination"
                                        rules={[{ required: true, message: "Please enter Termination" }]}
                                    >
                                        <TextArea placeholder="Enter Termination Info" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="jurisdiction"
                                        label="Jurisdiction"
                                        rules={[{ required: true, message: "Please enter Jurisdiction" }]}
                                    >
                                        <TextArea placeholder="Enter Jurisdiction Info" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="validity"
                                        label="Validity"
                                        rules={[{ required: true, message: "Please enter Validity" }]}
                                    >
                                        <TextArea placeholder="Enter Validity Info" autoSize={{ minRows: 1, maxRows: 12 }} readOnly />
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

export default ViewTncPage;
