import { useState, useEffect } from "react";
import { Space, Button, Card, Tag, Input, Spin, Dropdown, Menu } from "antd";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { MdDeleteSweep } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa6";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteQuoteModal from "../../Views/Quote/DeleteQuote";

const QuotePage = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredQuoteData, setFilteredQuoteData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [QuoteData, setQuoteData] = useState([]);
  const [totalQuote, setTotalQuote] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const navigate = useNavigate();

  const handleEdit = (record) => {
    navigate(`edit-Quote/${record.id}`);
  };

  const handleCreate = () => {
    navigate(`/quotes/create`);
  };

  const handleViewPDF = (record) => {
    navigate(`/quotes/pdf/${record.id}`);
    // notification.info({
    //   message: "View PDF",
    //   description: "PDF functionality is not implemented yet.",
    //   duration: 3,
    // });
    // return <PDFViewer record={record} />;
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false);
  };

  const handleSearch = () => {
    const filteredData = QuoteData.filter((item) => {
      const itemName = item.client.name || '';
      return itemName
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
    setQuoteData(filteredData);
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchText("");

    fetchQuoteData().finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchQuoteData(currentPage, currentPageSize);
  }, [currentPage, currentPageSize]);

  const fetchQuoteData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      setError(false);
      const response = await APIService.QuoteApi.listResource(page, pageSize);
      setQuoteData(response.data);
      setFilteredQuoteData(response.data);
      setTotalQuote(response.total);
      setCurrentPage(page);
      setCurrentPageSize(pageSize);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  const QuoteTableData =
    QuoteData &&
    QuoteData.map((item) => ({
      key: item.id,
      ref: item.refno,
      id: item.id,
      status: item.status,
      createdby: item.createdby.username,
      client: item.client ? item.client.name : null,
      clientCompany: item.client ? item.client.company : null,
      item: JSON.parse(item.item).productName,
      quotePrice: `₹ ${item.quote_price.total_price}`,
    }));

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setCurrentPageSize(pageSize);
    fetchQuoteData(page, pageSize);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const columns = [
    {
      title: "Quote Ref ID",
      dataIndex: "ref",
      sorter: (a, b) => a.ref.localeCompare(b.ref),
    },
    {
      title: "Quote Status",
      dataIndex: "status",
      align: 'center',
      filters: [
        {
          text: "Pending",
          value: "pending",
        },
        {
          text: "Cancelled",
          value: "cancelled",
        },
        {
          text: "On Hold",
          value: "on hold",
        },
        {
          text: "Accepted",
          value: "accepted",
        },
        {
          text: "Sent",
          value: "sent",
        }
      ],
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (_, { status }) => {
        let color = 'pink';
        let text = 'Pending';

        if (status === 'cancelled') {
          color = 'red';
          text = 'Cancelled';
        }
        if (status === 'on hold') {
          color = 'purple';
          text = 'On Hold';
        }
        if (status === 'accepted') {
          color = 'green';
          text = 'Accepted';
        }
        if (status === 'sent') {
          color = 'green';
          text = 'Sent';
        }

        return (
          <Tag color={color} key={status}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Created By",
      dataIndex: "createdby",
      sorter: (a, b) => a.createdby.localeCompare(b.createdby),
    },
    {
      title: "Client Name",
      dataIndex: "client",
      sorter: (a, b) => a.client.localeCompare(b.client),
    },
    {
      title: "Client Company",
      dataIndex: "clientCompany",
      sorter: (a, b) => a.clientCompany.localeCompare(b.clientCompany),
    },
    {
      title: "Product",
      dataIndex: "item",
    },
    {
      title: "Quote Price",
      dataIndex: "quotePrice",
      align: 'center',
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
      <Menu.Item key="view" onClick={() => handleViewPDF(record)} >
        <FaFilePdf color="red"/> PDF
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
    <Card title="Quote List" extra={
      <Space>
        {loading && <Spin size="large" />}
        <Button onClick={() => handleCreate()} type="primary">Add Quote</Button>
        <Input
          placeholder="Search by Client Name"
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
          data={QuoteTableData}
          onChange={onChange}
        />
        <PaginationComponent
          showQuickJumper
          showSizeChanger
          onPageChange={handlePageChange}
          total={totalQuote}
          currentPage={currentPage}
        />
      </Space>
      <DeleteQuoteModal
        visible={deleteModalVisible}
        onCancel={handleDeleteModalCancel}
        record={deleteRecord}
        fetchQuoteData={fetchQuoteData}
        currentPage={currentPage}
      />
    </Card>
  );
};

export default QuotePage;
