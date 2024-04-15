import { useNavigate } from "react-router-dom";
import {
  AiOutlineDashboard,
} from "react-icons/ai";
import { RiCustomerService2Line } from "react-icons/ri";
import { TbFileInvoice } from "react-icons/tb";
import { GrTableAdd } from "react-icons/gr";
import { FaTags, FaUsersGear } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import reactLogo from "../assets/tarparking.svg";
import { Layout, Menu, Grid, Image } from "antd";
import { useSettings } from "../store/settingStore";

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const sidebarMenuItems = [
  {
    key: "1",
    icon: <AiOutlineDashboard />,
    label: "Dashboard",
    path: "/",
  },
  {
    key: "2",
    icon: <GrTableAdd />,
    label: "Leads",
    path: "/leads",
  },
  {
    key: "3",
    icon: <RiCustomerService2Line />,
    label: "Clients",
    path: "/clients",
  },
  {
    key: "sub1",
    icon: <FaTags />,
    label: "Products",
    children: [
      { key: "sub1_option1", label: "Category", path: "/category" },
      { key: "sub1_option2", label: "Product", path: "/products" },
      { key: "sub1_option3", label: "Sub Product", path: "/sub-products" },
      { key: "sub1_option4", label: "Specification", path: "/specifications" },
    ],
  },
  {
    key: "4",
    icon: <TbFileInvoice />,
    label: "Quotation",
    path: "/quotes",
  },
  {
    key: "sub2",
    icon: <FaUsersGear />,
    label: "People",
    children: [
      { key: "sub2_option1", label: "Admins", path: "admins" },
      { key: "sub2_option2", label: "Users", path: "users" },
    ],
  },
  {
    key: "sub3",
    icon: <IoSettingsOutline />,
    label: "Settings",
    children: [
      { key: "sub3_option1", label: "Company Setting", path: "/company" },
      { key: "sub3_option2", label: "Term & Condition", path: "/term-conditions" },
    ],
  },
];

const SideBarComponent = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const screens = useBreakpoint();

  const handleMenuItemClick = (path) => {
    navigate(path);
  };

  const settings = useSettings();
  const { themeMode } = settings;

  // Transform sidebar menu items to match Ant Design's Menu items format
  const transformedMenuItems = sidebarMenuItems.map((item) => {
    if (item.children) {
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        children: item.children.map((child) => ({
          key: child.key,
          label: child.label,
          onClick: () => handleMenuItemClick(child.path), // Set onClick event
        })),
      };
    } else {
      return {
        key: item.key,
        icon: item.icon,
        label: item.label,
        onClick: () => handleMenuItemClick(item.path), // Set onClick event
      };
    }
  });

  return (
    <>
      {screens.xs ? (
        <>
          <Sider
            theme={themeMode}
            className="custom-sider"
            trigger={null}
            collapsible
            collapsed={collapsed}
            collapsedWidth={0}
            breakpoint="lg"
            onBreakpoint={(broken) => setCollapsed(broken)}
          >
            <div className="brand-container">
              <Image width={100} src={reactLogo} alt="Brand Logo" />
            </div>
            <Menu
              theme={themeMode}
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={transformedMenuItems}
            />
          </Sider>
        </>
      ) : (
        <>
          <Sider
            className="custom-sider"
            trigger={null}
            collapsible
            collapsed={collapsed}
            theme={themeMode}
            width={280}
          >
            <div className="brand-container">
              <Image
                preview={false}
                // width={140}
                style={collapsed ? { width: 50 } : { width: 140 }}

                src={reactLogo}
                alt="Brand Logo"
              />
            </div>
            <Menu
              theme={themeMode}
              mode="inline"
              defaultSelectedKeys={["1"]}
              items={transformedMenuItems}
              style={collapsed ? { padding: 10 } : { padding: 30 }}
            />
          </Sider>
        </>
      )}
    </>
  );
};

export default SideBarComponent;
