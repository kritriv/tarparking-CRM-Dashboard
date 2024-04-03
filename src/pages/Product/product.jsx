import { useState, useEffect } from "react";
import { Space, Button, Card, Tag, Input, Spin, Dropdown, Menu } from "antd";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteProductModal from "../../Views/Product/DeleteProduct";

const ProductPage = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredProductData, setFilteredProductData] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ProductData, setProductData] = useState([]);
  const [totalProduct, setTotalProduct] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const navigate = useNavigate();

  const handleEdit = (record) => {
    navigate(`edit-Product/${record.id}`);
  };

  const handleView = (record) => {
    navigate(`/products/${record.id}`);
  };
  const handleCreate = () => {
    navigate(`/products/create`);
  };

  const handleDelete = (record) => {
    setDeleteRecord(record);
    setDeleteModalVisible(true);
  };

  const handleDeleteModalCancel = () => {
    setDeleteModalVisible(false);
  };

  const handleSearch = () => {
    const filteredData = ProductData.filter((item) => {
      const itemName = item.name || '';
      return itemName
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
    setProductData(filteredData);
  };

  const handleRefresh = () => {
    setLoading(true);
    setSearchText("");

    fetchProductData().finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchProductData(currentPage, currentPageSize);
  }, [currentPage, currentPageSize]);

  const fetchProductData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      setError(false);
      const response = await APIService.ProductApi.listResource(page, pageSize);
      setProductData(response.data);
      setFilteredProductData(response.data);
      setTotalProduct(response.total);
      setCurrentPage(page);
      setCurrentPageSize(pageSize);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  const ProductTableData =
    ProductData &&
    ProductData.map((item) => ({
      key: item.id,
      id: item.id,
      status: item.status,
      createdby: item.createdby.username,
      name: item.name,
      category: item.category.name,
      description: item.description,
      sub_products: Array.isArray(item.sub_products) ? item.sub_products.length : 0,
    }));

  const handlePageChange = (page, pageSize) => {
    setCurrentPage(page);
    setCurrentPageSize(pageSize);
    fetchProductData(page, pageSize);
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
      title: "Status",
      dataIndex: "status",
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
      title: "Created By",
      dataIndex: "createdby",
      sorter: (a, b) => a.createdby.localeCompare(b.createdby),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "No of Sub Products",
      dataIndex: "sub_products",
      align: 'center',
    },
    {
      title: "Description",
      dataIndex: "description",
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
    <Card title="Product List" extra={
      <Space>
        {loading && <Spin size="large" />}
        <Button onClick={() => handleCreate()} type="primary">Add Product</Button>
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
          data={ProductTableData}
          onChange={onChange}
        />
        <PaginationComponent
          showQuickJumper
          showSizeChanger
          onPageChange={handlePageChange}
          total={totalProduct}
          currentPage={currentPage}
        />
      </Space>
      <DeleteProductModal
        visible={deleteModalVisible}
        onCancel={handleDeleteModalCancel}
        record={deleteRecord}
        fetchProductData={fetchProductData}
        currentPage={currentPage}
      />
    </Card>
  );
};

export default ProductPage;
