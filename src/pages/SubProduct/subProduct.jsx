import { useState, useEffect } from "react";
import { Space, Button, Card, Tag, Input, Spin } from "antd";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteSubProductModal from "../../Views/SubProduct/DeleteSubProduct";

const SubProductPage = () => {
    const [searchText, setSearchText] = useState("");
    const [filteredSubProductData, setFilteredSubProductData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [SubProductData, setSubProductData] = useState([]);
    const [totalSubProduct, setTotalSubProduct] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(10);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState(null);

    const navigate = useNavigate();

    const handleEdit = (record) => {
        navigate(`edit-sub-product/${record.id}`);
    };

    const handleView = (record) => {
        navigate(`/sub-products/${record.id}`);
    };
    const handleCreate = () => {
        navigate(`/sub-products/create`);
    };

    const handleDelete = (record) => {
        setDeleteRecord(record);
        setDeleteModalVisible(true);
    };

    const handleDeleteModalCancel = () => {
        setDeleteModalVisible(false);
    };

    const handleSearch = () => {
        const filteredData = SubProductData.filter((item) => {
            const itemName = item.name || '';
            return itemName
                .toLowerCase()
                .includes(searchText.toLowerCase());
        });
        setSubProductData(filteredData);
    };

    const handleRefresh = () => {
        setLoading(true);
        setSearchText("");

        fetchSubProductData().finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchSubProductData(currentPage, currentPageSize);
    }, [currentPage, currentPageSize]);

    const fetchSubProductData = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            setError(false);
            const response = await APIService.SubProductApi.listResource(page, pageSize);
            setSubProductData(response.data);
            setTotalSubProduct(response.total);
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(true);
            setLoading(false);
        }
    };

    const SubProductTableData =
        SubProductData &&
        SubProductData.map((item) => ({
            key: item.id,
            id: item.id,
            status: item.status,
            createdby: item.createdby.username,
            name: item.name,
            model_no: item.model_no,
            hsn: item.hsn,
            category: item.category.name,
            product: item.product.name,
        }));

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setCurrentPageSize(pageSize);
        fetchSubProductData(page, pageSize);
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
            title: "Sub Product Name",
            dataIndex: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Model No",
            dataIndex: "model_no",
            sorter: (a, b) => a.model_no.localeCompare(b.model_no),
        },
        {
            title: "HSN No",
            dataIndex: "hsn",
            sorter: (a, b) => a.hsn.localeCompare(b.hsn),
        },
        {
            title: "Category",
            dataIndex: "category",
            sorter: (a, b) => a.category.localeCompare(b.category),
        },
        {
            title: "Main Product",
            dataIndex: "product",
            sorter: (a, b) => a.product.localeCompare(b.product),
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
        <Card title="Sub Product List" extra={
            <Space>
                {loading && <Spin size="large" />}
                <Button onClick={() => handleCreate()} type="primary">Add Sub Product</Button>
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
                    data={filteredSubProductData.length > 0 ? filteredSubProductData : SubProductTableData}
                    onChange={onChange}
                />
                <PaginationComponent
                    showQuickJumper
                    showSizeChanger
                    onPageChange={handlePageChange}
                    total={totalSubProduct}
                    currentPage={currentPage}
                />
            </Space>
            <DeleteSubProductModal
                visible={deleteModalVisible}
                onCancel={handleDeleteModalCancel}
                record={deleteRecord}
                fetchSubProductData={fetchSubProductData}
                currentPage={currentPage}
            />
        </Card>
    );
};

export default SubProductPage;
