import { Avatar, Card } from "antd";
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
    {metaData && <Meta
      avatar={<Avatar src={metaData.avatar && metaData.avatar} />}
      title={metaData.title && metaData.title}
      description={metaData.description && metaData.description}
    />}
    {content && content}
  </Card>
);
export default CardComponent;
