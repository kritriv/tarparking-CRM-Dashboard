/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Modal, Space, Button, notification, Form, Input } from "antd";
import { MdDeleteSweep } from "react-icons/md";
import { BiEditAlt } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { UsersServicesAPI, HomeServicesAPI } from "../../apis";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";

const UserPage = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectionType, setSelectionType] = useState("checkbox");
    const [userData, setUserData] = useState();
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(10);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [form] = Form.useForm();



    const handleEdit = (record) => {
        setEditFormData(record);
        setEditModalVisible(true);
    };

    const handleEditModalOk = () => {
        form.validateFields().then((values) => {
            // Perform API call to update user details
            UsersServicesAPI.updateUser(editFormData.id, values)
                .then(() => {
                    notification.success({
                        message: "Success",
                        description: "User details updated successfully.",
                    });
                    fetchUserData(currentPage, currentPageSize); // Fetch updated data
                    setEditModalVisible(false);
                })
                .catch((error) => {
                    console.error("Error updating user details:", error);
                    notification.error({
                        message: "Error",
                        description:
                            "Failed to update user details. Please try again later.",
                    });
                });
        });
    };

    const handleEditModalCancel = () => {
        setEditModalVisible(false);
    };

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Delete User',
            content: `Are you sure you want to delete user ${record.email}?`,
            onOk: async () => {
                try {
                    const response = await UsersServicesAPI.deleteUser(record.id);

                    if (response && response.success) {
                        notification.success({
                            message: 'User Deleted',
                            description: `${record.email} has been deleted successfully.`,
                        });
                        fetchUserData(currentPage);
                    } else {
                        notification.error({
                            message: 'Error',
                            description: response.message || 'Failed to delete user.',
                        });
                    }
                } catch (error) {
                    notification.error({
                        message: 'Error',
                        description: 'Failed to delete user. Please try again later.',
                    });
                }
            },
        });
    };

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setCurrentPageSize(pageSize);
        fetchUserData(page, pageSize);
    };

    useEffect(() => {
        fetchUserData(currentPage, currentPageSize);
    }, [currentPage, currentPageSize]);

    const rowSelection = {
        type: selectionType,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(
                `selectedRowKeys: ${selectedRowKeys}`,
                "selectedRows: ",
                selectedRows
            );
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === "Disabled User",
            name: record.name,
        }),
    };

    const fetchUserData = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            setError(false);
            const response = await HomeServicesAPI.users(page, pageSize);
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

    useEffect(() => {
        const controller = new AbortController();
        fetchUserData(currentPage);
        return () => {
            controller.abort();
        };
    }, [currentPage]);


    if (error) {
        return <h1>{error}</h1>;
    }


    const userTableData =
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
                },
            ],
            onFilter: (value, record) => record.role === value,
            filterSearch: true,
        },
        {
            title: "Actions",
            dataIndex: "",
            render: (_, record) => (
                <Space>
                    <Button type="link" onClick={() => handleDelete(record)}><IoMdEye size={18} /></Button>
                    <Button type="link" onClick={() => handleEdit(record)}><BiEditAlt size={18} /></Button>
                    <Button type="link" onClick={() => handleDelete(record)}><MdDeleteSweep size={18} /></Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="home-card-area">
            <Space direction="vertical" style={{ display: "flex" }} wrap>
                <TableComponent
                    pagination={false}
                    style={{ margin: "30px" }}
                    rowSelection={rowSelection}
                    columns={columns}
                    data={userTableData}
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
            <Modal
                title="Edit User"
                visible={editModalVisible}
                onOk={handleEditModalOk}
                onCancel={handleEditModalCancel}
            >
                <Form
                    form={form}
                    initialValues={editFormData}
                    layout="vertical"
                >
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            {
                                required: true,
                                message: "Please enter name",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            {
                                required: true,
                                message: "Please enter email",
                            },
                            {
                                type: "email",
                                message: "Please enter a valid email",
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    {/* Add more fields as needed */}
                </Form>
            </Modal>
        </div>
    );
};

export default UserPage;
