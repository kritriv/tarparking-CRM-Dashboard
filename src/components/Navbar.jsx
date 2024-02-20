import { useLocation, useNavigate  } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  AiOutlineMenuFold,
  AiOutlineMenuUnfold,
} from "react-icons/ai";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { ImProfile } from "react-icons/im";
import { Layout, Button, Avatar, Space, Flex, theme } from "antd";
import BreadcrumbComponent from "./Breadcrumb";
import DropdownComponent from "./Dropdown";
import SettingButton from "./SettingButton";
import generateBreadcrumbs from "../utils/generateBreadcrumb";
import { useUserInfo, useSignOut } from "../store/userStore";

const { Header } = Layout;

const Navbar = ({ collapsed, toggleCollapse }) => {
  const signOut = useSignOut();
  const userInfo = useUserInfo();
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [breadcrumbItems, setBreadcrumbItems] = useState([]);

  const {
    token: { colorBgContainer }
  } = theme.useToken();

  const updateBreadcrumbs = useCallback(() => {
    const newBreadcrumbItems = generateBreadcrumbs(location);
    setBreadcrumbItems(newBreadcrumbItems);
  }, [location]);

  useEffect(() => {
    updateBreadcrumbs();
  }, [updateBreadcrumbs]);

  useEffect(() => {
    setUserEmail(userInfo.userEmail);
    setUserName(userInfo.userFullName);
  }, [userInfo]);

  const dropdownItems = [
    {
      label: (
        <div style={{ padding: "0 0.8rem" }}>
          <Space direction="horizontal">
            <Space align="center">
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
                style={{ margin: " 0 10px 0 0 " }} />
              <Space direction="vertical">
                <span style={{ fontWeight: "bold" }}>{userName}</span>
                <span>{userEmail}</span>

              </Space >
            </Space>
          </Space>
        </div>
      ),
      key: "0",
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
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      label: (
        <span style={{ fontStyle: "italic", fontWeight: "bold" }}>
          <Space>
            <RiLogoutCircleRLine />
            Logout
          </Space>
        </span>
      ),
      key: "2",
      onClick: handleLogout,
    },
  ];

  async function handleLogout() {
    try {
      // Perform logout actions here
      signOut();
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
        justifyContent: "space-between",
        alignItems: "center",
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
        <DropdownComponent
          items={dropdownItems}
          placement="bottomRight"
          trigger="click"
          icon={<Avatar
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
          />}
        />
      </Flex>
    </Header>
  );
};

export default Navbar;
