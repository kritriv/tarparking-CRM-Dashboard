import { Avatar, Card, Col, Row } from "antd";
const { Meta } = Card;

const CardComponent = ({
  title,
  hoverable,
  style,
  coverImage,
  actions,
  metaData,
  content
}) => (
  <Card
    title={title && title}
    hoverable={hoverable && hoverable}
    style={style && style}
    cover={coverImage && coverImage}
    actions={actions}
  >
    <Row gutter={16}>
      {metaData && (
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Meta
            avatar={<Avatar src={metaData.avatar && metaData.avatar} />}
            title={metaData.title && metaData.title}
            description={metaData.description && metaData.description}
          />
        </Col>
      )}
      {content && (
        <Col xs={24} sm={12} md={16} lg={18} xl={20}>
          {content}
        </Col>
      )}
    </Row>
  </Card>
);

export default CardComponent;
