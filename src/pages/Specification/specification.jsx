import { useState, useEffect } from "react";
import { Space, Button, Card, Input, Spin, Dropdown, Menu } from "antd";
import { BiEditAlt, BiRefresh } from "react-icons/bi";
import { IoMdEye } from "react-icons/io";
import { MdDeleteSweep } from "react-icons/md";
import { APIService } from "../../apis"
import { useNavigate } from "react-router-dom";

import TableComponent from "../../components/Table";
import PaginationComponent from "../../components/Pagination";
import DeleteSpecificationModal from "../../Views//Specification/DeleteSpecification";

const SpecificationPage = () => {
    const [searchText, setSearchText] = useState("");
    const [filteredSpecificationData, setFilteredSpecificationData] = useState([]);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [SpecificationData, setSpecificationData] = useState([]);
    const [totalSpecification, setTotalSpecification] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageSize, setCurrentPageSize] = useState(10);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteRecord, setDeleteRecord] = useState(null);

    const navigate = useNavigate();

    const handleEdit = (record) => {
        navigate(`edit-specification/${record.id}`);
    };

    const handleView = (record) => {
        navigate(`/specifications/${record.id}`);
    };
    const handleCreate = () => {
        navigate(`/specifications/create`);
    };

    const handleDelete = (record) => {
        setDeleteRecord(record);
        setDeleteModalVisible(true);
    };

    const handleDeleteModalCancel = () => {
        setDeleteModalVisible(false);
    };

    const handleSearch = () => {
        const filteredData = SpecificationData.filter((item) => {
            const itemName = item.sub_product.name || '';
            return itemName
                .toLowerCase()
                .includes(searchText.toLowerCase());
        });
        setSpecificationData(filteredData);
    };

    const handleRefresh = () => {
        setLoading(true);
        setSearchText("");

        fetchSpecificationData().finally(() => {
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchSpecificationData(currentPage, currentPageSize);
    }, [currentPage, currentPageSize]);

    const fetchSpecificationData = async (page = 1, pageSize = 10) => {
        try {
            setLoading(true);
            setError(false);
            const response = await APIService.SpecificationApi.listResource(page, pageSize);
            setSpecificationData(response.data);
            setFilteredSpecificationData(response.data);
            setTotalSpecification(response.total);
            setCurrentPage(page);
            setCurrentPageSize(pageSize);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setError(true);
            setLoading(false);
        }
    };

    const SpecificationTableData =
        SpecificationData &&
        SpecificationData.map((item) => ({
            key: item.id,
            id: item.id,
            sub_product: item.sub_product.name,
            system_module: item.system_module,
            system_area: item.system_area,
            car_size: item.car_size
        }));

    const handlePageChange = (page, pageSize) => {
        setCurrentPage(page);
        setCurrentPageSize(pageSize);
        fetchSpecificationData(page, pageSize);
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
            title: "System Module",
            dataIndex: "system_module",
        },
        {
            title: "System Area",
            dataIndex: "system_area",
        },
        {
            title: "Car Size",
            dataIndex: "car_size",
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
        <Card title="Specification List" extra={
            <Space>
                {loading && <Spin size="large" />}
                <Button onClick={() => handleCreate()} type="primary">Add Specification</Button>
                <Input
                    placeholder="Search by Sub Product"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onPressEnter={handleSearch}
                />
                <Button icon={<BiRefresh />} onClick={handleRefresh} />
            </Space>
        } style={{ padding: 20, margin: 10 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
                <TableComponent
                    pagination={false}
                    style={{ margin: "30px" }}
                    columns={columns}
                    data={SpecificationTableData}
                    onChange={onChange}
                />
                <PaginationComponent
                    showQuickJumper
                    showSizeChanger
                    onPageChange={handlePageChange}
                    total={totalSpecification}
                    currentPage={currentPage}
                />
            </Space>
            <DeleteSpecificationModal
                visible={deleteModalVisible}
                onCancel={handleDeleteModalCancel}
                record={deleteRecord}
                fetchSpecificationData={fetchSpecificationData}
                currentPage={currentPage}
            />
        </Card>
    );
};

export default SpecificationPage;
