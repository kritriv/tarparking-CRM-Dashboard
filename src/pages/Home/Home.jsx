/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Flex, Space } from "antd";
import { HomeServicesAPI } from "../../apis";

import CardComponent from "../../components/Card";

const Home = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchUserData = async (page = 1, pageSize = 10) => {
    try {
      setLoading(true);
      setError(false);
      const response = await HomeServicesAPI.users(page, pageSize);
      setUserData(response.data);
      setTotalUsers(response.total);
      setCurrentPage(page);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    // Call the fetchUserData function with currentPage
    fetchUserData(currentPage);
    return () => {
      controller.abort();
    };
  }, [currentPage]);


  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div className="home-card-area">
      <Space direction="vertical" style={{ display: "flex" }} wrap>
        <Flex wrap="wrap" justify="space-evenly" align="center">
          <CardComponent
            title={"Client"}
            hoverable
            style={{
              width: 300,
            }}
            content={<p>{userData && userData[0].email}</p>}
          />
          <CardComponent
            title={"Quotation"}
            hoverable
            style={{
              width: 300,
            }}
            content={<p>hello this is content</p>}
          />
          <CardComponent
            title={"Product"}
            hoverable
            style={{
              width: 300,
            }}
            content={<p>hello this is content</p>}
          />
          <CardComponent
            title={"Invoice"}
            hoverable
            style={{
              width: 300,
            }}
            content={<p>hello this is content</p>}
          />
        </Flex>
      </Space>
    </div>
  );
};

export default Home;
