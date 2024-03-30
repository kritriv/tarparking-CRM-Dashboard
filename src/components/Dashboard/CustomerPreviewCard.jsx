import { Statistic, Progress, Divider, Row, Spin } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";

export default function CustomerPreviewCard({
  isLoading = false,
  activeCustomer = 0,
  newCustomer = 0,
  totalCustomer = 0,
}) {
  return (
    <Row className="gutter-row">
      <div className="whiteBox shadow" style={{ height: 458, alignContent: 'center' }}>
        <div
          style={{
            textAlign: "center",
            justifyContent: "center",
            padding: '50px'
          }}
        >
          <h3 style={{  marginBottom: 40, marginTop: 15, fontSize: "large" }}>
            {"Clients"}
          </h3>

          {isLoading ? (
            <Spin />
          ) : (
            <div
              style={{
                display: "grid",
                justifyContent: "center",
              }}
            >
              <Progress type="dashboard" percent={newCustomer} size={148} />
              <p>{"New Client this Month"} {`Total Clients: ${totalCustomer}`}</p>
              <Divider />
              <Statistic
                title={"Active Client"}
                value={activeCustomer}
                precision={2}
                valueStyle={
                  activeCustomer > 0
                    ? { color: "#F17523" }
                    : activeCustomer < 0
                      ? { color: "#F17523" }
                      : { color: "#000000" }
                }
                prefix={
                  activeCustomer > 0 ? (
                    <ArrowUpOutlined />
                  ) : activeCustomer < 0 ? (
                    <ArrowDownOutlined />
                  ) : null
                }
                  
              />
            </div>
          )}
        </div>
      </div>
    </Row>
  );
}
