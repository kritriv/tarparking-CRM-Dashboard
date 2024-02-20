import { Footer } from "antd/es/layout/layout";
const FooterComponent = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
      }}
    >
      Admin Dashboard ©{new Date().getFullYear()} Created by <a href="https://www.avtarspace.com" target="_blank">Avtar Space Technology</a>
    </Footer>
  );
};

export default FooterComponent;
