import { Footer } from "antd/es/layout/layout";
const FooterComponent = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
      }}
    >
      Admin Dashboard ©{new Date().getFullYear()} Created by Shail International
    </Footer>
  );
};

export default FooterComponent;
