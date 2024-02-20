import { CloseOutlined, SettingOutlined } from "@ant-design/icons";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { FaCloudMoon, FaSun } from "react-icons/fa6";
import { Button, Card, Drawer, Flex, Typography, Divider } from "antd";
import Color from "color";
import { motion } from "framer-motion";
import { useState } from "react";
import screenfull from "screenfull";
import CyanBlur from "../assets/images/background/cyan-blur.png";
import RedBlur from "../assets/images/background/red-blur.png";
import { varHover } from "../utils/variants/action";
import { useSettingActions, useSettings } from "../store/settingStore";
import { useThemeToken } from "../theme/use-theme-token";
import { ThemeMode } from "../utils/enum";

/**
 * App Setting
 */
export default function SettingButton() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { colorPrimary, colorTextSecondary, colorBgContainer } =  useThemeToken();

  const settings = useSettings();
  const { themeMode } = settings;
  const { setSettings } = useSettingActions();

  const setThemeMode = (themeMode) => {
    setSettings({
      ...settings,
      themeMode,
    });
  };

  const style = {
    backdropFilter: "blur(20px)",
    backgroundImage: `url("${CyanBlur}"), url("${RedBlur}")`,
    backgroundRepeat: "no-repeat, no-repeat",
    backgroundColor: Color(colorBgContainer).alpha(0.9).toString(),
    backgroundPosition: "right top, left bottom",
    backgroundSize: "50, 50%",
  };
  const bodyStyle = {
    padding: 0,
  };

  const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);
  const toggleFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <>
      <motion.div
        animate={{
          rotate: [0, drawerOpen ? 0 : 360],
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
        }}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={() => setDrawerOpen(true)}
        style={{
          position: "relative",
          transformOrigin: "center",
          marginRight: "20px",
        }}
      >
        <Button
          type="text"
          shape="circle"
          size="large"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          icon={<SettingOutlined style={{ fontSize: 24 }} />}
        />
      </motion.div>
      <Drawer
        placement="right"
        title="Settings"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        closable={false}
        width={280}
        styles={{
          body: { ...bodyStyle, backgroundColor: "transparent" },
          mask: { backgroundColor: "transparent" },
        }}
        style={style}
        extra={
          <Button
            type="text"
            shape="circle"
            onClick={() => setDrawerOpen(false)}
          >
            <CloseOutlined />
          </Button>
        }
        footer={
          <Button type="dashed" block size="large" onClick={toggleFullScreen}>
            <Flex align="center" justify="center">
              {isFullscreen ? (
                <>
                  <MdFullscreenExit color={colorPrimary} className="!m-0" />
                  <span className="ml-2">Exit FullScreen</span>
                </>
              ) : (
                <>
                  <MdFullscreen />
                  <span className="ml-2 text-gray">FullScreen</span>
                </>
              )}
            </Flex>
          </Button>
        }
      >
        <div style={{ margin: "0.75rem" }}>
          <Typography.Text
            strong
            style={{ color: colorTextSecondary, fontWeight: "600" }}
          >
            Mode
          </Typography.Text>

          <Flex justify="space-evenly">
            <Flex align="center" justify="center">
              <Card hoverable onClick={() => setThemeMode(ThemeMode.Light)}>
                <FaSun
                  size="24"
                  color={themeMode === ThemeMode.Light ? colorPrimary : ""}
                />
              </Card>
            </Flex>
            <Flex align="center" justify="center">
              <Card hoverable onClick={() => setThemeMode(ThemeMode.Dark)}>
                <FaCloudMoon
                  size="24"
                  color={themeMode === ThemeMode.Dark ? colorPrimary : ""}
                />
              </Card>
            </Flex>
          </Flex>
        </div>
        <Divider />
      </Drawer>
    </>
  );
}
