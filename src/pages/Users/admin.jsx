import { useState, useEffect } from "react";
import { Space, Button, Card, Input, Spin, Tag, Dropdown, Menu } from "antd";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteUserModal from "../../Views/User/DeleteUser";

const AdminPage = () => {
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
        navigate(`edit-admin/${record.id}`);
    };

    const handleView = (record) => {
        navigate(`/admins/${record.id}`);
    };

    const handleCreate = () => {
        navigate(`/admins/create`);
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
            setFilteredUserData(response.data);
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
            .filter((item) => item.role === 'ADMIN' || item.role === 'SUPERADMIN')
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
                    text: "Admin",
                    value: "ADMIN",
                },
                {
                    text: "Super Admin",
                    value: "SUPERADMIN",
                },
            ],
            onFilter: (value, record) => record.role === value,
            filterSearch: true,
            render: (_, { role }) => {
                const roleMapping = {
                    'USER': { color: 'magenta', text: 'User' },
                    'ADMIN': { color: 'red', text: 'Admin' },
                    'SUPERADMIN': { color: 'blue', text: 'Super Admin' },
                };

                const { color, text } = roleMapping[role] || { color: 'black', text: 'No Role' };

                return (
                    <Tag color={color} key={role}>
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
        <Card title="Users List" extra={
            <Space>
                {loading && <Spin size="large" />}
                <Button onClick={() => handleCreate()} type="primary">Add Admin</Button>
                <Input
                    placeholder="Search by username"
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
                    data={UserTableData}
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

export default AdminPage;
