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

    const handleDownloadPDF = () => {
        if (pdfData) {
            const printWindow = window.open('', '_blank');
            const htmlContent = `
            <html>

            <head>
                <title>Print Quote</title>
                <style>
                    body {
                        margin: 15% 5% 5% 5% !important;
                        padding: 0;
                        transform-origin: 0 0;
                        background-image: url("https://www.tarparking.com/crm/uploads/images/quote_bg.png");
                        background-repeat: no-repeat;
                        background-size: cover;
            
                    }
            
                    table {
                        font-family: arial, sans-serif;
                        border-collapse: collapse;
                        width: 100%;
                    }
            
                    td,
                    th {
                        border: 1px solid #dddddd;
                        text-align: left;
                        padding: 8px;
                    }
            
                    tr:nth-child(even) {
                        background-color: #F7CAAC;
                    }
            
                    @media print {
                        body {
                            margin: 20% 5% 5% 5% !important;
                            padding: 0;
                            transform-origin: 0 0;
                            background-image: url("https://www.tarparking.com/crm/uploads/images/quote_bg.png");
                            background-repeat: no-repeat;
                            background-size: cover;
            
                        }
            
                        table {
                            font-family: arial, sans-serif;
                            border-collapse: collapse;
                            width: 100%;
                        }
            
                        td,
                        th {
                            border: 1px solid #dddddd;
                            text-align: left;
                            padding: 8px;
                        }
            
                        tr:nth-child(even) {
                            background-color: #F7CAAC;
                        }
            
                        p {
                            line-height: 2rem;
                        }
            
                        @page {
                            margin: 0;
                        }
            
                        @media print {
                            @page {
                                size: auto;
                                margin: 0;
                            }
            
                            body {
                                margin: 0;
                            }
            
                            .page {
                                margin: 0;
                            }
            
                            .header {
                                display: none;
                            }
                        }
                    }
            
                    body {
                        font-family: Arial, sans-serif;
                    }
                </style>
            </head>
            
            <body>
                <div class="pages">
                    <div class="page">
                        <p><strong>Ref:</strong> ${pdfData.refno}</p>
                        <strong> M/s ${pdfData.client.company}</strong></p>
                        ${pdfData.client.address.street},${pdfData.client.address.city} ,${pdfData.client.address.state}
                        ,${pdfData.client.address.country}-${pdfData.client.address.pincode} <br> <br>
                        <strong>Site:</strong> ${pdfData.client.address.site}<br> <br>
                        <p><strong>KindAttn:-</strong> Mr/Mrs ${pdfData.client.name}</p>
                        <p><strong>Contact No-</strong> ${pdfData.client.phone}, <strong>Email-</strong> ${pdfData.client.email}</p>
                        <br>
                        <h3><strong>SUB:${pdfData.subject}</strong> </h3><br> <br>
                        <p>Dear Sir/Madam,</p>
                        <p>${pdfData.greeting}</p> <br> <br>
                        <h3><u>${pdfData.proposal_title}</u></h3> <br> <br>
                        <table>
                            <tr>
                                <th>Made by</th>
                                <th>Approved by</th>
                                <th>Accepted by</th>
                            </tr>
                            <tr>
                                <td>M/s ${pdfData.ourCompany.name}</td>
                                <td>M/s ${pdfData.ourCompany.name}</td>
                                <td>M/s ${pdfData.client.company}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </body>
            </html>
            `;
            printWindow.document.open();
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            printWindow.print();
        }
    };



    const renderPDF = () => {
        if (pdfData) {
            return (
                <Card title="View Quotation" extra={<Button type='primary' onClick={handleDownloadPDF}>Download</Button>} style={{ padding: 50, margin: 10 }}>
                    <div className="pages">
                        <div className="page">
                            <p><strong>Ref:</strong> {pdfData.refno}</p>
                            <strong> M/s {pdfData.client.company}</strong><p />
                            {pdfData.client.address.street}, {pdfData.client.address.city}, { pdfData.client.address.state}
                            , {pdfData.client.address.country}-{pdfData.client.address.pincode} <br /> <br />
                            <strong>Site:</strong> {pdfData.client.address.site}<br /> <br />
                            <p><strong>KindAttn:-</strong> Mr/Mrs {pdfData.client.name}</p>
                            <p><strong>Contact No-</strong> {pdfData.client.phone}, <strong>Email-</strong> {pdfData.client.email}</p><br />
                            <h3><strong>SUB:{pdfData.subject}</strong> </h3>
                            <p>Dear Sir/Madam,</p>
                            <p>{pdfData.greeting}</p> <br />
                            <h2><strong>{pdfData.proposal_title}</strong></h2> <br /> <br /><br /> <br />
                            
                        </div>
                    </div>
                </Card>
            );
        } else {
            return <Card style={{ padding: 10, margin: 10, height: 1000 }}><h2>No quotes available</h2></Card>;
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
