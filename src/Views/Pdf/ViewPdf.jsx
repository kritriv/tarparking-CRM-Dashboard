import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { APIService } from '../../apis';
import { notification, Spin, Button, Card } from 'antd';

const PDFViewer = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const [itemData, setItemData] = useState(null);

    useEffect(() => {
        fetchPDFData();
    }, []);

    const fetchPDFData = async () => {
        try {
            setLoading(true);
            const response = await APIService.QuoteApi.readResource(id);
            setPdfData(response.data);
            setItemData(JSON.parse(response.data.item));
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
                            margin: 0 2% !important;
                            transform-origin: 0 0;
                            height: 100%;

                        }

                        .pages {
                            display: grid;
                            grid-template-columns: 1fr;
                            gap: 2.7rem;
                        }

                        .page {
                            padding: 15% 5%;
                            background-image: url("https://www.tarparking.com/crm/uploads/images/quote_bg.png");
                            background-repeat: no-repeat;
                            background-size: 100% 95%;
                            height: 100%
                        }

                        .page2{
                            padding: 14% 5%;
                        }
                        .page2 table tr td {
                            font-size: 14px;
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

                        tr:nth-child(odd) {
                            background-color: #F7CAAC;
                        }

                        tr:nth-child(even) {
                            background-color: #FBE5D5;
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
                    <div class="page page2">
                        <p><strong>System Specification:</strong></p>
                        <table>
                            <tr>
                                <td><b>System module<b /></td>
                                <td>${itemData.specifications.system_module}</td>
                            </tr>
                            <tr>
                                <td><b>System area<b /></td>
                                <td>${itemData.specifications.system_area}</td>
                            </tr>
                            <tr>
                                <td><b>Car size<b /></td>
                                <td>${itemData.specifications.car_size}</td>
                            </tr>
                            <tr>
                                <td><b>Lifting capacity<b /></td>
                                <td>${itemData.specifications.lifting_capacity} KG</td>
                            </tr>
                            <tr>
                                <td><b>Lifting height (top)<b /></td>
                                <td>${itemData.specifications.lifting_height.top} mm</td>
                            </tr>
                            <tr>
                                <td><b>Lifting height (ground)<b /></td>
                                <td>${itemData.specifications.lifting_height.ground} mm</td>
                            </tr>
                            <tr>
                                <td><b>Platform length<b /></td>
                                <td>${itemData.specifications.platform.length} mm</td>
                            </tr>
                            <tr>
                                <td><b>Platform width<b /></td>
                                <td>${itemData.specifications.platform.width} mm</td>
                            </tr>
                            <tr>
                                <td><b>Power<b /></td>
                                <td>${itemData.specifications.power}</td>
                            </tr>
                            <tr>
                                <td><b>Driving unit<b /></td>
                                <td>${itemData.specifications.driving_unit}</td>
                            </tr>
                            <tr>
                                <td><b>Travelling speed<b /></td>
                                <td>Lifting-${itemData.specifications.travelling_speed.lifting},
                                    Horizontal-${itemData.specifications.travelling_speed.horizontal}</td>
                            </tr>
                            <tr>
                                <td><b>Safety <b /></td>
                                <td>${itemData.specifications.safety[0]} <br><br> ${itemData.specifications.safety[1]}</td>
                            </tr>
                            <tr>
                                <td><b>Features <b /></td>
                                <td>${itemData.specifications.features[0]} <br><br> ${itemData.specifications.features[1]}</td>
                            </tr>
                            <tr>
                                <td><b>Material Delivery<b /></td>
                                <td>${itemData.specifications.material_delivery}</td>
                            </tr>
                            <tr>
                                <td><b>Installation<b /></td>
                                <td>${itemData.specifications.installation}</td>
                            </tr>
                            <tr>
                                <td><b>AMC<b /></td>
                                <td>${itemData.specifications.amc}</td>
                            </tr>
                            <tr>
                                <td><b>Material Quality<b /></td>
                                <td>${itemData.specifications.material_quality} </td>
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
                            {pdfData.client.address.street}, {pdfData.client.address.city}, {pdfData.client.address.state}
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
