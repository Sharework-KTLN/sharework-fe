'use client';

import React, {useState, useEffect} from "react";
import { Card, Button, Row, Col, Image } from "antd";
import { EnvironmentOutlined, GlobalOutlined } from "@ant-design/icons";

interface Business{
    id: number;
    image: string;
    logo: string;
    company: string; // Nếu API trả về 'company', thì giữ nguyên
    description: string;
    link?: string; // Có thể undefined
    location: string;
    locationDetail: string;
    specialization: string;
    jobCount: number;
    title?: string; // Nếu thực sự có 'title'
}
interface Job {
    id: number;
    title: string;
    salary: string;
    location: string;
};

const jobs: Job[] = [
    { id: 1, title: "Game Designer (Fresher)", salary: "Từ 8 triệu", location: "Hà Nội" },
    { id: 2, title: "Digital Marketing Intern", salary: "Từ 6-8 triệu", location: "Hà Nội" },
];
  
const InfoBusinessDetail = () => {
    const [business, setBusiness] = useState<Business | null>(null);
    const [expanded, setExpanded] = useState<boolean>(false);

    useEffect(() => {
        const businessDetail = sessionStorage.getItem("infoBusinessDetail");
        if (businessDetail) {
            setBusiness(JSON.parse(businessDetail));
        }
    }, []);
    if (!business) return <p>Loading...</p>;

    const fullContent = business?.description || "Chưa có mô tả";
    // Rút gọn nội dung
    const shortContent = fullContent.length > 500 ? fullContent.substring(0, 500) + "..." : fullContent;

    return (
        <div className="container mx-auto p-6">
            <div 
                style={{
                    maxWidth: "1450px",
                    width: "calc(100% - 47px)",
                    height: "200px",
                    borderRadius: "8px 8px 0 0",
                    overflow: "hidden",
                    margin: "0 auto"
                }}
            >
                <Image
                    src={business?.image || "https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-hop-tac-thanh-cong-inkythuatso-07-10-42-07.jpg"}
                    alt="Banner"
                    width="100%" // Kích thước ảnh
                    height="200px"
                    style={{
                        objectFit: "cover"
                    }}
                    preview={false} // Tắt tính năng xem trước
                />
            </div>
            {/* Company Header */}
            <Card 
                style={{ 
                    background: "linear-gradient(to right, #D4421E, #FFA07A)", 
                    maxWidth: "100%", 
                    width: "calc(100% - 47px)", // Giảm 40px để có lề trái và phải đều
                    margin: "0 auto", // Căn giữa toàn bộ Card
                    padding: "0 0 16px 16px",
                    borderRadius: "0 0 8px 8px",
                    height: "150px"
                }}>
                    
                <Row align="middle" justify="space-between">
                    <Col>
                        <Row align="middle">
                            <Image
                                src={business?.logo || "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA"}
                                alt="Company Logo"
                                width={100}
                                height={100}
                                style={{
                                    border: "1px solid white",
                                    padding: "3px",
                                    background: "white",
                                    borderRadius: "50%", // Bo tròn ảnh
                                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.2)",
                                    marginRight: "10px"
                                }}
                                preview={false} // Tắt tính năng xem trước
                            />
                            <Col style={{marginLeft:"15px"}}>
                                <h1 style={{ fontWeight: "700", fontSize: "24px", color:"#000000" }}>{business.company}</h1>
                                <a 
                                    href={business?.link} target="_blank" rel="noopener noreferrer" 
                                    style={{ fontWeight: "500", fontSize: "13px", color: "black" }}
                                >
                                    <GlobalOutlined style={{ color: "#000000", fontSize: "13px", marginRight: "8px" }} />
                                    {business.link}
                                </a>
                            </Col>
                        </Row>
                    </Col>
                    <Col>
                        <Button 
                            style={{ 
                                backgroundColor: "#D4421E", color: "white", border: "none",
                                fontWeight: "500", height: "43px"
                            }}>
                            + Theo dõi công ty
                        </Button>
                    </Col>
                </Row>
            </Card>
            
            {/* Company Info Section */}
            <Row gutter={[16, 16]} style={{}}>
                {/* About Company */}
                <Col xs={24} md={16}>
                    <Card 
                        style={{
                            border: "none", padding: "0", margin: "0",
                        }}>
                        {/* Tiêu đề có nền đậm hơn */}
                        <div 
                            style={{ 
                                background: "linear-gradient(to right, #D4421E, #FFA07A)", 
                                padding: "12px 16px", borderRadius: "8px 8px 0 0", height:"50px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                            }}>
                            <h2 style={{ fontWeight: "500", fontSize: "18px", color:"#000000" }}>Giới thiệu công ty</h2>
                        </div>

                        {/* Nội dung có nền trắng */}
                        <div 
                            style={{ 
                                background: "#FFFFFF", padding: "16px", borderRadius: "0 0 8px 8px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                            }}>
                            <p className="mt-2 text-black-600">
                                {expanded ? fullContent : shortContent}
                            </p>
                            <Button 
                                type="link" 
                                onClick={() => setExpanded(!expanded)}
                                style={{ color: "#D4421E", fontWeight: "500", paddingLeft: "0" }}
                            >
                                {expanded ? "Thu gọn" : "Xem thêm"}
                            </Button>
                        </div>
                    </Card>
                    {/* Danh sách tuyển dụng */}
                    <Card 
                        style={{
                            border: "none", padding: "0", margin: "0",
                        }}
                    >
                        {/* Tiêu đề Tuyển dụng */}
                        <div style={{ 
                                background: "linear-gradient(to right, #D4421E, #FFA07A)", 
                                padding: "12px 16px", borderRadius: "8px 8px 0 0",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                            }}>
                            <h2 style={{ fontWeight: "500", fontSize: "18px", color:"#000000" }}>Tuyển dụng</h2>
                            <div className="flex space-x-2">
                                <input 
                                    type="text" 
                                    placeholder="Tên công việc, vị trí ứng tuyển..."
                                    className="border border-gray-300 p-2 rounded-md w-72"
                                />
                                <select className="border border-gray-300 p-2 rounded-md">
                                    <option>Tất cả tỉnh/thành phố</option>
                                    <option>Hà Nội</option>
                                    <option>TP.HCM</option>
                                </select>
                                <Button
                                    style={{ 
                                        backgroundColor: "#D4421E", color: "white", border: "none",
                                        fontWeight: "500", height: "43px"
                                    }}>
                                    Tìm kiếm
                                </Button>
                            </div>
                        </div>

                        <div style={{ maxHeight: "300px", overflowY: "auto" }}> 
                            {jobs.map((job) => (
                                <Card 
                                    key={job.id} 
                                    className="flex items-center border rounded-lg p-4 shadow mb-3"
                                >
                                    <div className="flex items-center">
                                        <Image 
                                            src={business?.logo || "https://via.placeholder.com/80"} 
                                            alt="Company Logo"
                                            width={60} height={60} 
                                            className="mr-4 border p-1 bg-white rounded-lg"
                                        />
                                        <div>
                                            <h3 className="font-bold">{job.title}</h3>
                                            <p className="text-sm text-gray-500">{job.salary} - {job.location}</p>
                                        </div>
                                    </div>
                                    <Button className="mt-2 w-full">Ứng tuyển</Button>
                                </Card>
                            ))}
                        </div>
                    </Card>
                </Col>

                {/* Contact Info */}
                <Col xs={24} md={8}>
                    <Card style={{ border: "none", padding: "0" }}>
                        {/* Tiêu đề có nền đậm hơn */}
                        <div 
                            style={{ 
                                background: "linear-gradient(to right, #D4421E, #FFA07A)",
                                padding: "12px 16px", borderRadius: "8px 8px 0 0", height:"50px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                            }}>
                            <h2 style={{ fontWeight: "500", fontSize: "18px", color:"#000000" }}>Thông tin liên hệ</h2>
                        </div>

                        <div style={{ 
                            background: "#FFFFFF", padding: "16px", borderRadius: "0 0 8px 8px",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                            }}>
                            <p className="mt-2 text-black-600 flex items-center">
                                <EnvironmentOutlined style={{ color: "#D4421E", fontSize: "20px", marginRight: "8px" }} />
                                {business.locationDetail}
                            </p>

                            {/* Google Map Embed */}
                            <iframe 
                                title="Google Map" 
                                width="100%" 
                                height="150" 
                                frameBorder="0" 
                                style={{ border: 0, marginTop: "10px" }} 
                                src={`https://www.google.com/maps?q=${encodeURIComponent(business?.locationDetail)}&output=embed`} 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
  
export default InfoBusinessDetail;