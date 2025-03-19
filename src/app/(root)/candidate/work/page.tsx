'use client';

import React, {useState} from "react";
import { Card, Button, Row, Col, Image } from "antd";
import { EnvironmentOutlined, GlobalOutlined } from "@ant-design/icons";
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
  
const CompanyPage = () => {
    const [expanded, setExpanded] = useState(false);
    const fullContent = `
        Công ty Cổ Phần Đầu Tư Công Nghệ Sạch Sacotec thành lập vào ngày 07-08–2017 là công ty hoạt động tiên phong trong lĩnh vực công nghệ vi sinh học phục vụ cho Nông nghiệp Việt Nam.

        Từ 01/11/2023, Công ty chính thức chuyển thành CÔNG TY TNHH CÔNG NGHỆ SẠCH GREEN BIO.

        Chúng tôi chuyên cung cấp Chế Phẩm Sinh Học – Phân Bón - Thuốc Bảo Vệ Thực Vật Sinh Học và các vật tư phục vụ trong lĩnh vực Nông nghiệp hàng đầu Việt Nam. Với kinh nghiệm nhiều năm nghiên cứu chuyên sâu về công nghệ vi sinh và ứng dụng kinh doanh sản phẩm trong thực tế, Sacotec đã cải tiến công nghệ phù hợp với nông hóa thổ nhưỡng, khí hậu Việt Nam. Thông qua các cơ chế tác động sinh học tiên tiến và không biến đổi gen; Chúng tôi luôn xác định nông nghiệp sạch và bền vững chính là xu hướng của tương lai Việt Nam.

        Chất lượng sản phẩm luôn là tiêu chí hàng đầu của chúng tôi, các sản phẩm của chúng tôi đã đem đến sự đột phá trong việc xử lý các vấn đề cấp thiết nhất hiện nay như an toàn thực phẩm, thoái hóa đất đai hay ô nhiễm môi trường và đặc biệt là sức khỏe người nông dân. Mang đến lợi ích to lớn và bền vững cho các nhà sản xuất cũng như người tiêu dùng.
    `;

    // Rút gọn nội dung
    const shortContent = fullContent.substring(0, 500) + "...";

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
                    src="https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-hop-tac-thanh-cong-inkythuatso-07-10-42-07.jpg"
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
                                src="https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA"
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
                            <Col>
                                <h1 style={{ fontWeight: "700", fontSize: "24px", color:"#000000" }}>SonatGame Studio</h1>
                                <a 
                                    href="https://www.sonat.vn/" target="_blank" rel="noopener noreferrer" 
                                    style={{ fontWeight: "500", fontSize: "13px", color: "black" }}
                                >
                                    <GlobalOutlined style={{ color: "#000000", fontSize: "13px", marginRight: "8px" }} />
                                    https://www.sonat.vn/
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
                                103 Láng Hạ, Đống Đa, Hà Nội
                            </p>

                            {/* Google Map Embed */}
                            <iframe 
                                title="Google Map" 
                                width="100%" 
                                height="150" 
                                frameBorder="0" 
                                style={{ border: 0, marginTop: "10px" }} 
                                src="https://www.google.com/maps?q=103+Láng+Hạ,+Đống+Đa,+Hà+Nội&output=embed" 
                                allowFullScreen
                            ></iframe>
                        </div>
                    </Card>
                </Col>
            </Row>
            {/* Job Listings */}
            <Card className="mt-6">
                <div className="p-6">
                    <h2 className="text-xl font-bold">Tuyển dụng</h2>
                    <Row gutter={[16, 16]} className="mt-4">
                        {jobs.map((job) => (
                            <Col key={job.id} xs={24} sm={12} md={12} lg={8}>
                                <Card>
                                    <div className="p-4">
                                        <h3 className="font-bold">{job.title}</h3>
                                        <p className="text-sm text-gray-500">{job.salary} - {job.location}</p>
                                        <Button className="mt-2 w-full">Ứng tuyển</Button>
                                    </div>
                                </Card>
                            </Col>
                        ))};
                    </Row>
                </div>
            </Card>
        </div>
    );
};
  
  export default CompanyPage;