import { useState, useEffect } from "react";
import { Space, Button, Card, Input, Spin, Dropdown, Menu } from "antd";
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
            setFilteredTncData(response.data);
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
            sub_product: item.sub_product?.name || '',
            prices: item.prices,
            packing_forwarding: item?.packing_forwarding || ''
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
        <Card title="Term & Conditions" extra={
            <Space>
                {loading && <Spin size="large" />}
                <Button onClick={() => handleCreate()} type="primary">Add Tnc</Button>
                <Input
                    placeholder="Search by Sub Product"
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
                    data={TncTableData}
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
