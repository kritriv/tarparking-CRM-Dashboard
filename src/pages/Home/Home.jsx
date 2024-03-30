import { useState, useEffect } from "react";
import { Card, Col, Row } from "antd";
import { APIService } from "../../apis"
import SummaryCard from "../../components/Dashboard/SummaryCard";
import CustomerPreviewCard from "../../components/Dashboard/CustomerPreviewCard";

const Home = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [clientTotal, setClientTotal] = useState([]);
  const [activeClientTotal, setActiveClientTotal] = useState([]);
  const [newClientTotal, setNewClientTotal] = useState([]);
  const [quoteTotal, setQuoteTotal] = useState([]);
  const [userTotal, setUserTotal] = useState([]);
  const [categoryTotal, setCategoryTotal] = useState([]);
  const [productTotal, setProductTotal] = useState([]);
  const [SubProductTotal, setSubProductTotal] = useState([]);



  useEffect(() => {
    fetchClientData(currentPage, currentPageSize);
    fetchQuoteData(currentPage, currentPageSize);
    fetchUserData(currentPage, currentPageSize);
    fetchCategoryData(currentPage, currentPageSize);
    fetchProductData(currentPage, currentPageSize);
    fetchSubProductData(currentPage, currentPageSize);
  }, [currentPage, currentPageSize]);


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


  const fetchQuoteData = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await APIService.QuoteApi.listResource();
      setQuoteTotal(response.data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await APIService.UserApi.listResource();
      setUserTotal(response.data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await APIService.CategoryApi.listResource();
      setCategoryTotal(response.data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  const fetchProductData = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await APIService.ProductApi.listResource();
      setProductTotal(response.data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  const fetchSubProductData = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await APIService.SubProductApi.listResource();
      setSubProductTotal(response.data.length);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="home-card-area">
      <Row gutter={[16, 16]}>
        {/* Left Column with 6 Cards */}
        <Col xs={24} sm={12} md={8} lg={18}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={12} lg={8}>
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
            <Col xs={24} sm={12} md={12} lg={8}>
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
            <Col xs={24} sm={12} md={12} lg={8}>
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
            <Col xs={24} sm={12} md={12} lg={8}>
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
            <Col xs={24} sm={12} md={12} lg={8}>
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
            <Col xs={24} sm={12} md={12} lg={8}>
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
        </Col>
        {/* Right Column with 1 Large Card */}
        <Col xs={24} sm={12} lg={5}>
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
