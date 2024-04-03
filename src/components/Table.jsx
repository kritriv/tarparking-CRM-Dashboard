import { Table } from "antd";
import React from "react";

const TableComponent = ({
  pagination,
  columns,
  data,
  onChange,
  rowSelection,
  style,
}) => {
  return (
    <div style={{ overflowX: "auto" }}>
      <Table
        pagination={pagination === false ? false : true}
        style={{ minWidth: "100%" }}
        rowSelection={
          rowSelection && {
            type: rowSelection.type,
            ...rowSelection,
          }
        }
        columns={columns}
        dataSource={data}
        onChange={onChange}
        scroll={{ x: 'max-content' }}
        responsive={true}
        size="small"
      />
    </div>
  );
};

export default TableComponent;
