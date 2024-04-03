import { useState, useEffect } from "react";
import { Space, Button, Card, Tag, Input, Spin, Dropdown, Menu } from "antd";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteCompanyModal from "../../Views/Company/DeleteCompany";

const CompanyPage = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredCompanyData, setFilteredCompanyData] = useState([]);
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

  const handleSearch = () => {
    const filteredData = CompanyData.filter((item) => {
      const itemName = item.name || '';
      return itemName
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
    setCompanyData(filteredData);
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchText("");

    fetchCompanyData().finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchCompanyData(currentPage, currentPageSize);
  }, [currentPage, currentPageSize]);

  const fetchCompanyData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      setError(false);
      const response = await APIService.CompanyApi.listResource(page, pageSize);
      setCompanyData(response.data);
      setFilteredCompanyData(response.data);
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
      align: 'center',
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Deactive",
          value: false,
        }
      ],
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (_, { status }) => {
        let color = 'green';
        let text = 'Active';

        if (status === false || status === 'false') {
          color = 'red';
          text = 'Inactive';
        }

        return (
          <Tag color={color} text={text} key={status}>
            {text}
          </Tag>
        );
      },
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
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          overlay={renderActionsDropdown(record)}
          trigger={['click']}
          onClick={(e) => e.preventDefault()}
        >
          <Button type="link" onClick={e => e.preventDefault()} style={{ fontSize: 25, paddingBottom: 50 }}>
            <span className="ellipsis">...</span>
          </Button>
        </Dropdown>
      ),
    },
  ];

  const renderActionsDropdown = (record) => (
    <Menu>
      <Menu.Item key="view" onClick={() => handleView(record)}>
        <IoMdEye /> View
      </Menu.Item>
      <Menu.Item key="edit" onClick={() => handleEdit(record)}>
        <BiEditAlt /> Edit
      </Menu.Item>
      <Menu.Item key="delete" onClick={() => handleDelete(record)} danger>
        <MdDeleteSweep /> Delete
      </Menu.Item>
    </Menu>
  );

  return (
    <Card title="Company List" extra={
      <Space>
        {loading && <Spin size="large" />}
        <Button onClick={() => handleCreate()} type="primary">Add Company</Button>
        <Input
          placeholder="Search by name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Button icon={<BiRefresh />} onClick={handleRefresh} />
      </Space>
    } className="custom-card">
      <Space direction="vertical" style={{ width: "100%" }}>
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
