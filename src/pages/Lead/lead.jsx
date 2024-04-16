import { useState, useEffect } from "react";
import { Space, Button, Card, Tag, Input, Spin, Dropdown, Menu } from "antd";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteLeadModal from "../../Views/Lead/DeleteLead";

const LeadPage = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredLeadData, setFilteredLeadData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [LeadData, setLeadData] = useState([]);
  const [totalLead, setTotalLead] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const navigate = useNavigate();

  const handleEdit = (record) => {
    navigate(`edit-Lead/${record.id}`);
  };

  const handleView = (record) => {
    navigate(`/leads/${record.id}`);
  };
  const handleCreate = () => {
    navigate(`/leads/create`);
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false);
  };

  const handleSearch = () => {
    const filteredData = LeadData.filter((item) => {
      const itemName = item.name || '';
      return itemName
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
    setLeadData(filteredData);
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchText("");

    fetchLeadData().finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchLeadData(currentPage, currentPageSize);
  }, [currentPage, currentPageSize]);

  const fetchLeadData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      setError(false);
      const response = await APIService.LeadApi.listResource(page, pageSize);
      setLeadData(response.data)
      setFilteredLeadData(response.data);
      setTotalLead(response.total);
      setCurrentPage(page);
      setCurrentPageSize(pageSize);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  const LeadTableData =
    LeadData &&
    LeadData.map((item) => ({
      key: item.id,
      id: item.id,
      type: item.type,
      name: item.name,
      status: item.status,
      email: item.email,
      phone: item.phone,
      source: item.source,
      address: item.address,
    }));

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setCurrentPageSize(pageSize);
    fetchLeadData(page, pageSize);
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
      title: "Type",
      dataIndex: "type",
      sorter: (a, b) => a.type.localeCompare(b.type),
      align: 'center',
      filters: [
        { text: "Company", value: "company" },
        { text: "People", value: "people" }
      ],
      onFilter: (value, record) => record.type === value,
      filterSearch: true,
      render: (_, { type }) => {
        const color = type === 'people' ? 'cyan' : 'purple';
        const text = type === 'people' ? 'People' : 'Company';

        return (
          <Tag color={color} key={type}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      align: 'center',
      filters: [
        { text: "Draft", value: "draft" },
        { text: "New", value: "new" },
        { text: "In Negotiate", value: "innegotiate" },
        { text: "Won", value: "won" },
        { text: "Lose", value: "lose" },
        { text: "Canceled", value: "canceled" },
        { text: "On hold", value: "onhold" },
        { text: "Waiting", value: "waiting" },
      ],
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (_, { status }) => {
        let color = 'purple';
        let text = 'Draft';

        switch (status) {
          case 'new':
            color = 'blue';
            text = 'New';
            break;
          case 'innegotiate':
            color = 'cyan';
            text = 'In Negotiate';
            break;
          case 'won':
            color = 'green';
            text = 'Won';
            break;
          case 'lose':
            color = 'red';
            text = 'Lose';
            break;
          case 'canceled':
            color = 'red';
            text = 'Canceled';
            break;
          case 'onhold':
            color = 'brown';
            text = 'On hold';
            break;
          case 'waiting':
            color = 'yellow';
            text = 'Waiting';
            break;
          default:
            break;
        }

        return (
          <Tag color={color} key={status}>
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
      title: "Address",
      dataIndex: "address",
    },
    {
      title: "Source",
      dataIndex: "source",
      sorter: (a, b) => a.source.localeCompare(b.source),
      align: 'center',
      filters: [
        { text: "LinkedIn", value: "linkedin" },
        { text: "Website", value: "website" },
        { text: "Social Media", value: "socialmedia" },
        { text: "Ads", value: "ads" },
        { text: "Friends", value: "friends" },
        { text: "Sales", value: "sales" },
        { text: "IndiaMart", value: "indiamart" },
        { text: "Other", value: "other" },
      ],
      onFilter: (value, record) => record.source === value,
      filterSearch: true,
      render: (_, { source }) => {
        let color = 'green';
        let text = 'LinkedIn';

        switch (source) {
          case 'linkedin':
            color = 'green';
            text = 'LinkedIn';
            break;
          case 'website':
            color = 'blue';
            text = 'Website';
            break;
          case 'socialmedia':
            color = 'cyan';
            text = 'Social Media';
            break;
          case 'ads':
            color = 'purple';
            text = 'Advertisement';
            break;
          case 'friends':
            color = 'orange';
            text = 'Friends';
            break;
          case 'sales':
            color = 'yellow';
            text = 'Sales';
            break;
          case 'indiamart':
            color = 'brown';
            text = 'IndiaMart';
            break;
          case 'other':
            color = 'red';
            text = 'Other';
            break;
          default:
            break;
        }

        return (
          <Tag color={color} key={source}>
            {text}
          </Tag>
        );
      },
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
    <Card title="Lead List" extra={
      <Space>
        {loading && <Spin size="large" />}
        <Button onClick={() => handleCreate()} type="primary">Add Lead</Button>
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
          data={LeadTableData}
          onChange={onChange}
        />
        <PaginationComponent
          showQuickJumper
          showSizeChanger
          onPageChange={handlePageChange}
          total={totalLead}
          currentPage={currentPage}
        />
      </Space>
      <DeleteLeadModal
        visible={deleteModalVisible}
        onCancel={handleDeleteModalCancel}
        record={deleteRecord}
        fetchLeadData={fetchLeadData}
        currentPage={currentPage}
      />
    </Card>
  );
};

export default LeadPage;
