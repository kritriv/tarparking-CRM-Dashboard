import { useState, useEffect } from "react";
import { Space, Button, Card, Input, Spin } from "antd";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteUserModal from "../../Views/User/DeleteUser";

const UserPage = () => {
    const [searchText, setSearchText] = useState("");
    const [filteredUserData, setFilteredUserData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(10);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState(null);

    const navigate = useNavigate();

    const handleEdit = (record) => {
        navigate(`edit-user/${record.id}`);
    };

    const handleView = (record) => {
        navigate(`/users/${record.id}`);
    };

    const handleCreate = () => {
        navigate(`/users/create`);
    };

    const handleDelete = (record) => {
        setDeleteRecord(record);
        setDeleteModalVisible(true);
    };

    const handleDeleteModalCancel = () => {
        setDeleteModalVisible(false);
    };

    const handleSearch = () => {
        const filteredData = userData.filter((item) => {
            const itemName = item.username || '';
            return itemName
                .toLowerCase()
                .includes(searchText.toLowerCase());
        });
        setUserData(filteredData);
    };

    const handleRefresh = () => {
        setLoading(true);
        setSearchText("");

        fetchUserData().finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchUserData(currentPage, currentPageSize);
    }, [currentPage, currentPageSize]);

    const fetchUserData = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            setError(false);
            const response = await APIService.UserApi.listResource(page, pageSize);
            setUserData(response.data);
            setTotalUsers(response.total);
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(true);
            setLoading(false);
        }
    };

    const UserTableData =
        userData &&
        userData
            .filter((item) => item.role === 'USER')
            .map((item) => ({
                key: item.id,
                id: item.id,
                username: item.username,
                name: item.name,
                email: item.email,
                role: item.role,
            }));

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setCurrentPageSize(pageSize);
        fetchUserData(page, pageSize);
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
            title: "Name",
            dataIndex: "name",
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: "Username",
            dataIndex: "username",
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => a.email.localeCompare(b.email),
        },
        {
            title: "Role",
            dataIndex: "role",
            filters: [
                {
                    text: "User",
                    value: "USER",
                }
            ],
            onFilter: (value, record) => record.role === value,
            filterSearch: true,
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
        <Card title="Users List" extra={
            <Space>
                {loading && <Spin size="large" />}
                <Button onClick={() => handleCreate()} type="primary">Create User</Button>
                <Input
                    placeholder="Search by username"
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
                    data={filteredUserData.length > 0 ? filteredUserData : UserTableData}
                    onChange={onChange}
                />
                <PaginationComponent
                    showQuickJumper
                    showSizeChanger
                    onPageChange={handlePageChange}
                    total={totalUsers}
                    currentPage={currentPage}
                />
            </Space>
            <DeleteUserModal
                visible={deleteModalVisible}
                onCancel={handleDeleteModalCancel}
                record={deleteRecord}
                fetchUserData={fetchUserData}
                currentPage={currentPage}
            />
        </Card>
    );
};

export default UserPage;
