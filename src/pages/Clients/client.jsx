import { useState, useEffect } from "react";
import { Space, Button, Card, Tag, Input, Spin, Dropdown, Menu } from "antd";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteClientModal from "../../Views/Client/DeleteClient";

const ClientPage = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredClientData, setFilteredClientData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ClientData, setClientData] = useState([]);
  const [totalClient, setTotalClient] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const navigate = useNavigate();

  const handleEdit = (record) => {
    navigate(`edit-Client/${record.id}`);
  };

  const handleView = (record) => {
    navigate(`/clients/${record.id}`);
  };
  const handleCreate = () => {
    navigate(`/clients/create`);
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false);
  };

  const handleSearch = () => {
    const filteredData = ClientData.filter((item) => {
      const itemName = item.name || '';
      return itemName
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
    setClientData(filteredData);
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchText("");

    fetchClientData().finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchClientData(currentPage, currentPageSize);
  }, [currentPage, currentPageSize]);

  const fetchClientData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      setError(false);
      const response = await APIService.ClientApi.listResource(page, pageSize);
      setClientData(response.data)
      setFilteredClientData(response.data);
      setTotalClient(response.total);
      setCurrentPage(page);
      setCurrentPageSize(pageSize);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  const ClientTableData =
    ClientData &&
    ClientData.map((item) => ({
      key: item.id,
      id: item.id,
      status: item.status,
      username: item.username,
      name: item.name,
      email: item.email,
      phone: item.phone,
      company: item.company,
      city: item.address.city,
      country: item.address.country,
    }));

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setCurrentPageSize(pageSize);
    fetchClientData(page, pageSize);
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
      title: "Client Status",
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
          <Tag color={color} key={status}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Username",
      dataIndex: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Email",
      dataIndex: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: "Company",
      dataIndex: "company",
      sorter: (a, b) => a.company.localeCompare(b.company),
    },
    {
      title: "City",
      dataIndex: "city",
      sorter: (a, b) => a.city.localeCompare(b.city),
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: (a, b) => a.country.localeCompare(b.country),
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
    <Card title="Client List" extra={
      <Space>
        {loading && <Spin size="large" />}
        <Button onClick={() => handleCreate()} type="primary">Add Client</Button>
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
          data={ClientTableData}
          onChange={onChange}
        />
        <PaginationComponent
          showQuickJumper
          showSizeChanger
          onPageChange={handlePageChange}
          total={totalClient}
          currentPage={currentPage}
        />
      </Space>
      <DeleteClientModal
        visible={deleteModalVisible}
        onCancel={handleDeleteModalCancel}
        record={deleteRecord}
        fetchClientData={fetchClientData}
        currentPage={currentPage}
      />
    </Card>
  );
};

export default ClientPage;
