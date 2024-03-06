import { useState, useEffect } from "react";
import { Space, Button, Card, Input, Spin } from "antd";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteTncModal from "../../Views/Term-Condition/DeleteTnc";

const TncPage = () => {
    const [searchText, setSearchText] = useState("");
    const [filteredTncData, setFilteredTncData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [TncData, setTncData] = useState([]);
    const [totalTnc, setTotalTnc] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(10);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState(null);

    const navigate = useNavigate();

    const handleEdit = (record) => {
        navigate(`edit-tnc/${record.id}`);
    };

    const handleView = (record) => {
        navigate(`/term-conditions/${record.id}`);
    };
    const handleCreate = () => {
        navigate(`/term-conditions/create`);
    };

    const handleDelete = (record) => {
        setDeleteRecord(record);
        setDeleteModalVisible(true);
    };

    const handleDeleteModalCancel = () => {
        setDeleteModalVisible(false);
    };

    const handleSearch = () => {
        const filteredData = TncData.filter((item) => {
            const itemName = item.sub_product.name || '';
            return itemName
                .toLowerCase()
                .includes(searchText.toLowerCase());
        });
        setTncData(filteredData);
    };

    const handleRefresh = () => {
        setLoading(true);
        setSearchText("");

        fetchTncData().finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchTncData(currentPage, currentPageSize);
    }, [currentPage, currentPageSize]);

    const fetchTncData = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            setError(false);
            const response = await APIService.TncApi.listResource(page, pageSize);
            setTncData(response.data);
            setTotalTnc(response.total);
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(true);
            setLoading(false);
        }
    };

    const TncTableData =
        TncData &&
        TncData.map((item) => ({
            key: item.id,
            id: item.id,
            sub_product: item.sub_product.name,
            prices: item.prices,
            packing_forwarding: item.packing_forwarding
        }));

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setCurrentPageSize(pageSize);
        fetchTncData(page, pageSize);
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
            title: "Sub Product",
            dataIndex: "sub_product",
            sorter: (a, b) => a.sub_product.localeCompare(b.sub_product),
        },
        {
            title: "Prices",
            dataIndex: "prices",
            width: 300,
        },
        {
            title: "Packing Forwarding",
            dataIndex: "packing_forwarding",
            width: 300,
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
        <Card title="Term & Conditions" extra={
            <Space>
                {loading && <Spin size="large" />}
                <Button onClick={() => handleCreate()} type="primary">Add Tnc</Button>
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
                    data={filteredTncData.length > 0 ? filteredTncData : TncTableData}
                    onChange={onChange}
                />
                <PaginationComponent
                    showQuickJumper
                    showSizeChanger
                    onPageChange={handlePageChange}
                    total={totalTnc}
                    currentPage={currentPage}
                />
            </Space>
            <DeleteTncModal
                visible={deleteModalVisible}
                onCancel={handleDeleteModalCancel}
                record={deleteRecord}
                fetchTncData={fetchTncData}
                currentPage={currentPage}
            />
        </Card>
    );
};

export default TncPage;
