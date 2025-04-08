'use client';

import React, {useState, useEffect} from "react";
import { Card, Button, Row, Col, Image } from "antd";
import { EnvironmentOutlined, GlobalOutlined } from "@ant-design/icons";
import { useSearchParams } from 'next/navigation';

interface Company {
    id: number;
    name: string;
    address: string;
    phone: string;
    email: string;
    logo: string;
    specialize: string;
    image_company: string;
    link?: string;
    location: string;
    job_count: number;
    description: string;
    recruiter_name: string;
    jobs: Job[]; // Thêm thuộc tính jobs để lưu danh sách công việc
}
interface Job {
    id: number;
    title: string;
    salary_range: string;
    work_location: string;
}
  
const InfoBusinessDetail = () => {
    const searchParams = useSearchParams(); // Use this to get search params
    const id = searchParams.get('id');
    const [companyDetails, setCompanyDetails] = useState<Company | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState<boolean>(false);

    useEffect(() => {
        const fetchCompanyDetails = async () => {
          if (!id) return; // Chờ cho đến khi id có sẵn
    
          try {
            const response = await fetch(`http://localhost:8080/companies/${id}`);
            if (!response.ok) {
              throw new Error("Failed to fetch company details");
            }
            const data = await response.json();
            setCompanyDetails(data); // Lưu thông tin chi tiết công ty vào state
          } catch (error) {
            console.error("Error fetching company details:", error);
            setError("Unable to load company details.");
          }
        };
    
        fetchCompanyDetails();
      }, [id]); // Gọi lại khi id thay đổi
    
      if (error) {
        return <div>{error}</div>;
      }
    
      if (!companyDetails) {
        return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
    }
    const fullContent = companyDetails?.description || "Chưa có mô tả";
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
                    src={companyDetails?.image_company || "https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-hop-tac-thanh-cong-inkythuatso-07-10-42-07.jpg"}
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
                                src={companyDetails?.logo || "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA"}
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
                                <h1 style={{ fontWeight: "700", fontSize: "24px", color:"#000000" }}>{companyDetails.name}</h1>
                                <a 
                                    href={companyDetails?.link} target="_blank" rel="noopener noreferrer" 
                                    style={{ fontWeight: "500", fontSize: "13px", color: "black" }}
                                >
                                    <GlobalOutlined style={{ color: "#000000", fontSize: "13px", marginRight: "8px" }} />
                                    {companyDetails.link}
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
                            {companyDetails.jobs?.map((job:Job) => (
                                <Card 
                                    key={job.id} 
                                    className="flex items-center border rounded-lg p-4 shadow mb-3"
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        flexWrap: 'wrap',  // Allow content to wrap on smaller screens
                                        justifyContent: 'space-between',
                                        marginBottom: '10px'  // Add some space at the bottom on mobile
                                    }}>
                                        <div style={{
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            width: '100%', 
                                            maxWidth: '700px',  // Set max width to keep it from stretching too much
                                            marginRight: '20px', 
                                            marginBottom: '10px'  // Add margin to avoid tight spacing on smaller screens
                                        }}>
                                            <Image 
                                                src={companyDetails?.logo || "https://via.placeholder.com/80"} 
                                                alt={companyDetails?.logo}
                                                width={60} height={60} 
                                                style={{
                                                    marginRight: '20px', 
                                                    border: '1px solid', 
                                                    padding: '4px', 
                                                    backgroundColor: 'white', 
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <div style={{ marginLeft: "15px" }}>
                                                <h3 style={{ fontSize: 18, fontWeight: 700 }}>{job.title}</h3>
                                                <p className="text-sm text-gray-500">{job.salary_range} - {job.work_location}</p>
                                            </div>
                                        </div>
                                        
                                        <Button 
                                            style={{ 
                                                backgroundColor: "#D4421E", 
                                                color: "white", 
                                                border: "none",
                                                fontWeight: "500", 
                                                height: "43px", 
                                                width: '100%',  // Make button full width on smaller screens
                                                maxWidth: '150px'  // Limit width on larger screens
                                            }}
                                        >
                                            Ứng tuyển
                                        </Button>
                                    </div>  
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
                                {companyDetails.address}
                            </p>

                            {/* Google Map Embed */}
                            <iframe 
                                title="Google Map" 
                                width="100%" 
                                height="150" 
                                frameBorder="0" 
                                style={{ border: 0, marginTop: "10px" }} 
                                src={`https://www.google.com/maps?q=${encodeURIComponent(companyDetails?.address)}&output=embed`} 
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