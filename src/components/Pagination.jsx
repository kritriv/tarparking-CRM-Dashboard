import { Pagination } from "antd";

const PaginationComponent = ({ total, currentPage=1, onPageChange, showQuickJumper, showSizeChanger }) => {
  return (
    <>
      <Pagination
        showQuickJumper={showQuickJumper && showQuickJumper}
        showSizeChanger={showSizeChanger && showSizeChanger}
        current={currentPage}
        total={total}
        onChange={(page, pageSize) => onPageChange(page, pageSize)}
      />
      <br />
    </>
  );
};
export default PaginationComponent;
