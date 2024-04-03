import { useState, useEffect } from "react";
import { Space, Button, Card, Tag, Input, Spin, Dropdown, Menu } from "antd";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteCategoryModal from "../../Views/Category/DeleteCategory";

const CategoryPage = () => {
    const [searchText, setSearchText] = useState("");
    const [filteredCategoryData, setFilteredCategoryData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [CategoryData, setCategoryData] = useState([]);
    const [totalCategory, setTotalCategory] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(10);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState(null);

    const navigate = useNavigate();

    const handleEdit = (record) => {
        navigate(`edit-Category/${record.id}`);
    };

    const handleView = (record) => {
        navigate(`/category/${record.id}`);
    };
    const handleCreate = () => {
        navigate(`/category/create`);
    };

    const handleDelete = (record) => {
        setDeleteRecord(record);
        setDeleteModalVisible(true);
    };

    const handleDeleteModalCancel = () => {
        setDeleteModalVisible(false);
    };

    const handleSearch = () => {
        const filteredData = CategoryData.filter((item) => {
            const itemName = item.name || '';
            return itemName
                .toLowerCase()
                .includes(searchText.toLowerCase());
        });
        setCategoryData(filteredData);
    };

    const handleRefresh = () => {
        setLoading(true);
        setSearchText("");

        fetchCategoryData().finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchCategoryData(currentPage, currentPageSize);
    }, [currentPage, currentPageSize]);

    const fetchCategoryData = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            setError(false);
            const response = await APIService.CategoryApi.listResource(page, pageSize);
            setCategoryData(response.data);
            setFilteredCategoryData(response.data); // Update filtered data too
            setTotalCategory(response.total);
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(true);
            setLoading(false);
        }
    };

    const CategoryTableData =
        CategoryData &&
        CategoryData.map((item) => ({
            key: item.id,
            id: item.id,
            status: item.status,
            createdby: item.createdby.username,
            name: item.name,
            description: item.description,
            products: item.products.length,
        }));

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setCurrentPageSize(pageSize);
        fetchCategoryData(page, pageSize);
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
            title: "Category Status",
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
            title: "Description",
            dataIndex: "description",
            sorter: (a, b) => a.description.localeCompare(b.description),
        },
        {
            title: "No of Products",
            dataIndex: "products",
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
                    <Button type="link" onClick={e => e.preventDefault()} style={{fontSize: 25, paddingBottom: 50}}>
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
        <Card title="Category List" extra={
            <Space>
                {loading && <Spin size="large" />}
                <Button onClick={() => handleCreate()} type="primary">Add Category</Button>
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
                    data={CategoryTableData}// Use filtered data here
                    onChange={onChange}
                />
                <PaginationComponent
                    showQuickJumper
                    showSizeChanger
                    onPageChange={handlePageChange}
                    total={totalCategory}
                    currentPage={currentPage}
                />
            </Space>
            <DeleteCategoryModal
                visible={deleteModalVisible}
                onCancel={handleDeleteModalCancel}
                record={deleteRecord}
                fetchCategoryData={fetchCategoryData}
                currentPage={currentPage}
            />
        </Card>
    );
};

export default CategoryPage;