import { Tag, Divider, Row, Col, Spin, Tooltip } from 'antd';

export default function AnalyticSummaryCard({ title, tagColor, data, prefix, isLoading = false }) {
    return (
        <Col
            className="gutter-row"
        >
            <div
                className="whiteBox shadow"
                style={{ color: '#595959', fontSize: 14, height: '100%', width: "100%" }}
            >
                <div className="strong" style={{ textAlign: 'center', justifyContent: 'center' }}>
                    <h3
                        style={{
                            fontSize: 'large',
                            textTransform: 'capitalize',
                        }}
                    >
                        {title}
                    </h3>
                </div>
                <Divider style={{ padding: 0, margin: 0 }}></Divider>
                <div style={{ padding: "15px", justifyContent: 'center' }}>
                    <Row gutter={[0, 0]} justify="space-between" wrap={false}>
                        <Col className="gutter-row" flex="85px" style={{ textAlign: 'left' }}>
                            <div className="left" style={{ whiteSpace: 'nowrap' }}>
                                {prefix}
                            </div>
                        </Col>
                        <Divider
                            style={{
                                height: '100%',
                                padding: '10px',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                            type="vertical"
                        ></Divider>
                        <Col
                            className="gutter-row"
                            flex="auto"
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {isLoading ? (
                                <Spin />
                            ) : (
                                <Tooltip
                                    title={data}
                                    style={{
                                        direction: 'ltr',
                                    }}
                                >
                                    <Tag
                                        color={tagColor}
                                        style={{
                                            padding: '2px 15px',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            maxWidth: '100%',
                                            direction: 'ltr',
                                        }}
                                    >
                                        {data}
                                    </Tag>
                                </Tooltip>
                            )}
                        </Col>
                    </Row>
                </div>
            </div>
        </Col>
    );
}
