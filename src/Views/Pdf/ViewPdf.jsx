import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { APIService } from '../../apis';
import { notification, Spin, Button, Card } from 'antd';

const PDFViewer = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [pdfData, setPdfData] = useState(null);

    useEffect(() => {
        fetchPDFData();
    }, []);

    const fetchPDFData = async () => {
        try {
            setLoading(true);
            const response = await APIService.QuoteApi.readResource(id);
            setPdfData(response.data);
        } catch (error) {
            console.error("Error fetching PDF:", error);
            notification.error({
                message: "Error",
                description: "Failed to fetch PDF. Please try again later.",
                duration: 3,
            });
        } finally {
            setLoading(false);
        }
    };

    const renderPDF = () => {
        if (pdfData) {
            return (
                <Card title="View Quotation" extra={<Button type='primary'>Download Pdf</Button>} style={{ padding: 50, margin: 10 }}>
                    <div className="pages">
                        <div className="page">
                            <h1>Quote</h1>
                            <p><strong>Client Name:</strong> {pdfData.client.name}</p>
                            <p><strong>Quote Number:</strong> {pdfData.refno}</p>
                        </div>
                    </div>
                </Card>
            );
        } else {
            return null;
        }
    };

    return (
        <div>
            <Spin spinning={loading}>
                {renderPDF()}
            </Spin>
        </div>
    );
};

export default PDFViewer;
