import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, Form, Input, Button, notification, InputNumber, Row, Col, Divider } from "antd";
import { APIService } from "../../apis";
import { useNavigate } from "react-router-dom";

const { TextArea } = Input;

const ViewSpecificationPage = () => {
    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [specificationData, setSpecificationData] = useState(null);

    const navigate = useNavigate();

    const handleBack = () => {
        navigate(`/specifications`);
    };

    useEffect(() => {
        fetchSpecificationData(id);
    }, [id]);

    const fetchSpecificationData = async (id) => {
        try {
            setLoading(true);
            const response = await APIService.SpecificationApi.readResource(id);

            if (response.success) {
                form.setFieldsValue({
                    ...response.data,
                    sub_product: response.data.sub_product.name,
                });
                setSpecificationData(response.data);
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
        <Card title="View Specification Details" extra={<Button onClick={() => handleBack()}>Go Back to List</Button>} style={{ padding: 50, margin: 10 }}>
            <Row gutter={150}>
                <Col span={12}>
                    <div>
                        <h2>Product Select Info</h2>
                        <Form form={form} layout="vertical">
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="sub_product" label="Sub Product Name" rules={[{ required: true, message: "Select Sub Product Name" }]}>
                                        <Input readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <h2>Specifications Details</h2>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name={["lifting_height", "top"]}
                                        label="Lifting Height Top"
                                        rules={[{ required: true, message: "Please enter Lifting Height Top" }]}
                                    >
                                        <InputNumber placeholder="Enter Lifting Height Top" style={{ width: '100%' }} readOnly />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name={["lifting_height", "ground"]}
                                        label="Lifting Height ground"
                                        rules={[{ required: true, message: "Please enter Lifting Height ground" }]}
                                    >
                                        <InputNumber placeholder="Enter Lifting Height ground" style={{ width: '100%' }} readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name={["platform", "length"]}
                                        label="Platform length"
                                        rules={[{ required: true, message: "Please enter Platform length" }]}
                                    >
                                        <InputNumber placeholder="Enter Platform length" style={{ width: '100%' }} readOnly />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name={["platform", "width"]}
                                        label="Platform width"
                                        rules={[{ required: true, message: "Please enter Platform width" }]}
                                    >
                                        <InputNumber placeholder="Enter Platform width" style={{ width: '100%' }} readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item
                                        name={["travelling_speed", "lifting"]}
                                        label="Travelling Speed Lifting"
                                        rules={[{ required: true, message: "Please enter Travelling Speed Lifting" }]}
                                    >
                                        <Input placeholder="Enter Travelling Speed Lifting" style={{ width: '100%' }} readOnly />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item
                                        name={["travelling_speed", "horizontal"]}
                                        label="Travelling Speed horizontal"
                                        rules={[{ required: true, message: "Please enter Travelling Speed horizontal" }]}
                                    >
                                        <Input placeholder="Enter Travelling Speed horizontal" style={{ width: '100%' }} readOnly />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Divider />
                            <Row gutter={10}>
                                <Col span={24}>
                                    <Form.List name="safety" initialValue={['']}>
                                        {(fields) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Safety #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Safety' },
                                                                ]}
                                                            >
                                                                <TextArea placeholder="Enter Safety" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
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
                                <Col span={24}>
                                    <Form.List name="features" initialValue={['']}>
                                        {(fields) => (
                                            <>
                                                {fields.map(({ key, name, ...restField }) => (
                                                    <Row gutter={16} key={key}>
                                                        <Col span={18}>
                                                            <Form.Item
                                                                {...restField}
                                                                name={name}
                                                                label={`Feature #${key + 1}`}
                                                                rules={[
                                                                    { required: true, message: 'Please enter Feature' },
                                                                ]}
                                                            >
                                                                <TextArea placeholder="Enter Feature" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
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

                <Col span={10}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <div>
                                <Form form={form} layout="vertical">

                                    <Form.Item
                                        name="system_module"
                                        label="System Module"
                                        rules={[{ required: true, message: "Please enter System Module" }]}
                                    >
                                        <TextArea placeholder="Enter System Module Info" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="system_area"
                                        label="System Area"
                                        rules={[{ required: true, message: "Please enter System Area" }]}
                                    >
                                        <TextArea placeholder="Enter System Area Info" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="car_size"
                                        label="Car Size"
                                        rules={[{ required: true, message: "Please enter Car Size" }]}
                                    >
                                        <TextArea placeholder="Enter Car Size Info" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="lifting_capacity"
                                        label="Lifting Capacity"
                                        rules={[{ required: true, message: "Please enter Lifting Capacity" }]}
                                    >
                                        <TextArea placeholder="Enter Lifting Capacity Info" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="power"
                                        label="Power"
                                        rules={[{ required: true, message: "Please enter Power" }]}
                                    >
                                        <TextArea placeholder="Enter Power Info" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="driving_unit"
                                        label="Driving Unit"
                                        rules={[{ required: true, message: "Please enter Driving Unit" }]}
                                    >
                                        <TextArea placeholder="Enter Driving Unit Info" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="material_delivery"
                                        label="Material Delivery"
                                        rules={[{ required: true, message: "Please enter Material Delivery" }]}
                                    >
                                        <TextArea placeholder="Enter Material Delivery Info" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="installation"
                                        label="Installation"
                                        rules={[{ required: true, message: "Please enter Installation" }]}
                                    >
                                        <TextArea placeholder="Enter Installation Info" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="amc"
                                        label="AMC"
                                        rules={[{ required: true, message: "Please enter AMC" }]}
                                    >
                                        <TextArea placeholder="Enter AMC Info" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
                                    </Form.Item>
                                    <Form.Item
                                        name="material_quality"
                                        label="Material Quality"
                                        rules={[{ required: true, message: "Please enter Material Quality" }]}
                                    >
                                        <TextArea placeholder="Enter Material Quality Info" autoSize={{ minRows: 1, maxRows: 6 }} readOnly />
                                    </Form.Item>

                                </Form>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Form.Item>
                <Button type="primary" onClick={handleBack} loading={loading}>
                    Go back
                </Button>
            </Form.Item>
        </Card>
    );
};

export default ViewSpecificationPage;
