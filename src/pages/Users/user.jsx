/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Flex, Pagination, Space } from "antd";
import { HomeServicesAPI } from "../../apis";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";

const Home = () => {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectionType, setSelectionType] = useState("checkbox");
    const [userData, setUserData] = useState();
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page, pageSize) => {
        // Handle page change logic here
        setCurrentPage(page)
    };
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
            // Column configuration not to be checked
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
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(true);
            setLoading(false);
        }
    };

    useEffect(() => {
        const controller = new AbortController();
        // Call the fetchUserData function with currentPage
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
                key: item.id, // Set the unique key for each row
                id: item.id,
                username: item.username,
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
            width: "40%",
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
        </div>
    );
};

export default Home;
