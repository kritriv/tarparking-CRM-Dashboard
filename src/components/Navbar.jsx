import { useLocation, Navigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
  AiOutlineLogin,
  AiOutlineDown,
} from "react-icons/ai";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { AliwangwangOutlined } from "@ant-design/icons";
import { ImProfile } from "react-icons/im";
import { Layout, Button, Avatar, Space, Flex, theme } from "antd";
import BreadcrumbComponent from "./Breadcrumb";
import DropdownComponent from "./Dropdown";
import SettingButton from "./SettingButton";
import generateBreadcrumbs from "../utils/generateBreadcrumb";
import { UserServicesAPI } from "../apis";
import { useSignOut } from "../store/userStore";

const { Header } = Layout;

const Navbar = ({ collapsed, toggleCollapse }) => {
  const signOut = useSignOut();
  const location = useLocation();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  const {
    token: { colorBgContainer }
  } = theme.useToken();

  // Function to generate breadcrumb items based on the current location
  const updateBreadcrumbs = useCallback(() => {
    const newBreadcrumbItems = generateBreadcrumbs(location);
    setBreadcrumbItems(newBreadcrumbItems);
  }, [location]);

  useEffect(() => {
    updateBreadcrumbs();
  }, [updateBreadcrumbs]);

  const dropdownIems = [
    {
      label: (
        <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
          <Space>
          <RiLogoutCircleRLine />
            Logout
          </Space>
        </span>
      ),
      key: "0",
      onClick: handleLogout,
    },
    {
      type: "divider",
    },
    {
      label: (
        <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
          <Space>
          <ImProfile />
            Profile
          </Space>
        </span>
      ),
      key: "1",
      onClick: <Navigate to="/" />,
    },
  ];

  async function handleLogout() {
    try {
      const response = await UserServicesAPI.logout();

      if (response.success === "true") {
        signOut();
        // navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error occurred during logout:", error);
    }
  }

  return (
    <Header
      style={{
        padding: "0 16px",
        background: colorBgContainer,
        display: "flex",
        justifyContent: "space-between", // Aligns items in the main axis
        alignItems: "center", // Aligns items in the cross axis
      }}
    >
      <Flex align="center">
        <Button
          type="text"
          icon={collapsed ? <AiOutlineMenuUnfold /> : <AiOutlineMenuFold />}
          onClick={toggleCollapse}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <BreadcrumbComponent className="breadcrumb" items={breadcrumbItems} />
      </Flex>
      <Flex align="center">
        <SettingButton className="settings-button" />
        <Avatar
          className="header-avatar"
          size={{
            xs: 24,
            sm: 32,
            md: 40,
            lg: 40,
            xl: 40,
            xxl: 40,
          }}
          src="https://cdn-icons-png.flaticon.com/512/14122/14122142.png"
        />
        <DropdownComponent
          items={dropdownIems}
          trigger
          arrow
          icon={<AiOutlineDown />}
        />
      </Flex>
    </Header>
  );
};

export default Navbar;
