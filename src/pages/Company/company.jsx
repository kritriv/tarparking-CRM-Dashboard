import { useState, useEffect } from "react";
import { Space, Button, Card } from "antd";
import { BiEditAlt } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { CompanyServicesAPI } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteCompanyModal from "../../Views/Company/DeleteCompany";

const CompanyPage = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [CompanyData, setCompanyData] = useState([]);
  const [totalCompany, setTotalCompany] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const navigate = useNavigate();

  const handleEdit = (record) => {
    navigate(`edit-Company/${record.id}`);
  };

  const handleView = (record) => {
    navigate(`/company/${record.id}`);
  };
  const handleCreate = () => {
    navigate(`/company/create`);
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false);
  };

  useEffect(() => {
    fetchCompanyData(currentPage, currentPageSize);
  }, [currentPage, currentPageSize]);

  const fetchCompanyData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      setError(false);
      const response = await CompanyServicesAPI.listCompany(page, pageSize);
      setCompanyData(response.data);
      setTotalCompany(response.total);
      setCurrentPage(page);
      setCurrentPageSize(pageSize);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  const CompanyTableData =
    CompanyData &&
    CompanyData.map((item) => ({
      key: item.id,
      id: item.id,
      status: item.status,
      name: item.name,
      cin_no: item.cin_no,
      tan_no: item.tan_no,
      pan_no: item.pan_no
    }));

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setCurrentPageSize(pageSize);
    fetchCompanyData(page, pageSize);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Company Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (status) => (
        <span>{status ? "Active" : "Inactive"}</span>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "CIN No",
      dataIndex: "cin_no",
      sorter: (a, b) => a.cin_no.localeCompare(b.cin_no),
    },
    {
      title: "TAN No",
      dataIndex: "tan_no",
      sorter: (a, b) => a.tan_no.localeCompare(b.tan_no),
    },
    {
      title: "PAN No",
      dataIndex: "pan_no",
      sorter: (a, b) => a.pan_no.localeCompare(b.pan_no),
    },
    {
      title: "Actions",
      dataIndex: "",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleView(record)}><IoMdEye size={18} /></Button>
          <Button type="link" onClick={() => handleEdit(record)}><BiEditAlt size={18} /></Button>
          <Button type="link" onClick={() => handleDelete(record)}><MdDeleteSweep size={18} /></Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Company List" extra={<Button onClick={() => handleCreate()}>Create New Company</Button>} style={{ padding: 20, margin: 10 }}>
      <Space direction="vertical" style={{ display: "flex" }} wrap>
        <TableComponent
          pagination={false}
          style={{ margin: "30px" }}
          columns={columns}
          data={CompanyTableData}
          onChange={onChange}
        />
        <PaginationComponent
          showQuickJumper
          showSizeChanger
          onPageChange={handlePageChange}
          total={totalCompany}
          currentPage={currentPage}
        />
      </Space>
      <DeleteCompanyModal
        visible={deleteModalVisible}
        onCancel={handleDeleteModalCancel}
        record={deleteRecord}
        fetchCompanyData={fetchCompanyData}
        currentPage={currentPage}
      />
    </Card>
  );
};

export default CompanyPage;
