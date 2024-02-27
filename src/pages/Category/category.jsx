import { useState, useEffect } from "react";
import { Space, Button, Card } from "antd";
import { BiEditAlt } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteCategoryModal from "../../Views/Category/DeleteCategory";

const CategoryPage = () => {
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

    useEffect(() => {
        fetchCategoryData(currentPage, currentPageSize);
    }, [currentPage, currentPageSize]);

    const fetchCategoryData = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            setError(false);
            const response = await APIService.CategoryApi.listResource(page, pageSize);
            setCategoryData(response.data);
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
            createdby: item.createdby,
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
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (status) => (
                <span>{status ? "Active" : "Inactive"}</span>
            ),
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
            sorter: (a, b) => a.products.localeCompare(b.products),
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
        <Card title="Category List" extra={<Button onClick={() => handleCreate()}>Create New Category</Button>} style={{ padding: 20, margin: 10 }}>
            <Space direction="vertical" style={{ display: "flex" }} wrap>
                <TableComponent
                    pagination={false}
                    style={{ margin: "30px" }}
                    columns={columns}
                    data={CategoryTableData}
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
