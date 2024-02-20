import { Breadcrumb } from "antd";

const BreadcrumbComponent = ({items}) => {
  return (
    <Breadcrumb className="breadcrum-main"
      items={items}
    />
  );
};

export default BreadcrumbComponent;
