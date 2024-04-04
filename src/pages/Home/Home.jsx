import { useState, useEffect } from "react";
import { Card, Col, Row } from "antd";
import { APIService } from "../../apis"
import SummaryCard from "../../components/Dashboard/SummaryCard";
import CustomerPreviewCard from "../../components/Dashboard/CustomerPreviewCard";
import PreviewCard from "../../components/Dashboard/PreviewCard";

const Home = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientTotal, setClientTotal] = useState([]);
  const [activeClientTotal, setActiveClientTotal] = useState([]);
  const [newClientTotal, setNewClientTotal] = useState([]);
  const [quoteTotal, setQuoteTotal] = useState([]);
  const [quoteData, setQuoteData] = useState([]);
  const [userTotal, setUserTotal] = useState([]);
  const [categoryTotal, setCategoryTotal] = useState([]);
  const [productTotal, setProductTotal] = useState([]);
  const [SubProductTotal, setSubProductTotal] = useState([]);

  const fetchData = async (api, setter, setData) => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.listResource();
      if (setData) {
        setData(response.data);
      }
      setter(response.data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientData();
    fetchData(APIService.QuoteApi, setQuoteTotal, setQuoteData);
    fetchData(APIService.UserApi, setUserTotal);
    fetchData(APIService.CategoryApi, setCategoryTotal);
    fetchData(APIService.ProductApi, setProductTotal);
    fetchData(APIService.SubProductApi, setSubProductTotal);
  }, []);

  const fetchClientData = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await APIService.ClientApi.listResource();

      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const activeClients = response.data.filter(client => client.status === true);

      const newClients = response.data.filter(client => {
        const createdAtDate = new Date(client.createdAt);
        return createdAtDate.getMonth() === currentMonth && createdAtDate.getFullYear() === currentYear;
      });

      setNewClientTotal(newClients.length)
      setClientTotal(response.data.length);
      setActiveClientTotal(activeClients.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  const entityData = [
    {
      result: { quoteData },
      entity: 'quote',
      title: 'Quotation',
    }
  ];

  return (
    <div className="home-card-area">
      <Row gutter={[16, 16]}>
        <Col md={24} xl={18}>
          <Row gutter={[16, 16]} style={{ marginBottom: '1rem' }}>
            <Col sm={24} xs={24} md={24} lg={8}>
              <Card>
                <SummaryCard
                  title={"Clients"}
                  tagColor={"cyan"}
                  prefix={"Total Clients"}
                  isLoading={loading}
                  data={clientTotal}
                />
              </Card>
            </Col>
            <Col md={24} xs={24} lg={8}>
              <Card>
                <SummaryCard
                  title={"Quotes"}
                  tagColor={"purple"}
                  prefix={"Total Quotes"}
                  isLoading={loading}
                  data={quoteTotal}
                />
              </Card>
            </Col>
            <Col md={24} xs={24} lg={8}>
              <Card>
                <SummaryCard
                  title={"Users"}
                  tagColor={"pink"}
                  prefix={"Total Users"}
                  isLoading={loading}
                  data={userTotal}
                />
              </Card>
            </Col>
            <Col md={24} xs={24} lg={8}>
              <Card>
                <SummaryCard
                  title={"Categories"}
                  tagColor={"green"}
                  prefix={"Total Categories"}
                  isLoading={loading}
                  data={categoryTotal}
                />
              </Card>
            </Col>
            <Col md={24} xs={24} lg={8}>
              <Card>
                <SummaryCard
                  title={"Products"}
                  tagColor={"orange"}
                  prefix={"Total Products"}
                  isLoading={loading}
                  data={productTotal}
                />
              </Card>
            </Col>
            <Col md={24} xs={24} lg={8}>
              <Card>
                <SummaryCard
                  title={"Sub Products"}
                  tagColor={"blue"}
                  prefix={"Total Sub Products"}
                  isLoading={loading}
                  data={SubProductTotal}
                />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card>
                <Row gutter={[16, 16]}>
                  {entityData.map((data, index) => {
                    const { result, entity, title } = data;
                    const quoteData = result?.quoteData || [];

                    // Calculate total number of quotes
                    const totalQuotes = quoteData.length;

                    // Calculate percentages for each status
                    const statistics1 = !loading && quoteData.reduce((acc, item) => {
                      const status = item?.status;
                      acc[status] = acc[status] ? acc[status] + 1 : 1;
                      return acc;
                    }, {});

                    // Convert counts to percentages
                    for (const status in statistics1) {
                      statistics1[status] = (statistics1[status] / totalQuotes) * 100;
                    }

                    // Convert to array of objects
                    const stats = Object.entries(statistics1).map(([tag, value]) => ({ tag, value }));

                    return (
                      <Col key={index} lg={24}>
                        <PreviewCard
                          title={title}
                          isLoading={loading}
                          entity={entity}
                          statistics={stats}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col md={24} xl={6}>
          <Card>
            <CustomerPreviewCard
              activeCustomer={activeClientTotal}
              newCustomer={newClientTotal > 0 ? 100 : 0}
              totalCustomer={clientTotal}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
