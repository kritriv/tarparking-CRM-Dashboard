import { useState, useEffect } from "react";
import { Space, Button, Card, Tag, Input, Spin } from "antd";
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
      setClientData(response.data);
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
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleView(record)}><IoMdEye size={18} /></Button>
          <Button type="link" onClick={() => handleEdit(record)}><BiEditAlt size={18} /></Button>
          <Button type="link" onClick={() => handleDelete(record)}><MdDeleteSweep size={18} color="red" /></Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Client List" extra={
      <Space>
        {loading && <Spin size="large" />}
        <Button onClick={() => handleCreate()} type="primary">Create Client</Button>
        <Input
          placeholder="Search by name"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Button icon={<BiRefresh />} onClick={handleRefresh} />
      </Space>
    } style={{ padding: 20, margin: 10 }}>
      <Space direction="vertical" style={{ display: "flex" }} wrap>
        <TableComponent
          pagination={false}
          style={{ margin: "30px" }}
          columns={columns}
          data={filteredClientData.length > 0 ? filteredClientData : ClientTableData}
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
