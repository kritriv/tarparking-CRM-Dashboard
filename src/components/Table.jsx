import { Table } from "antd";

const TableComponent = ({
  pagination,
  columns,
  data,
  onChange,
  rowSelection,
  style,
}) => {
  return (
    <Table
      pagination={pagination === false ? false : true}
      style={style && style}
      rowSelection={
        rowSelection && {
          type: rowSelection.type,
          ...rowSelection,
        }
      }
      columns={columns}
      dataSource={data}
      onChange={onChange}
    />
  );
};

export default TableComponent;
