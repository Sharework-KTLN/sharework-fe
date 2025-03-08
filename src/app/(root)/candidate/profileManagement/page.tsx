'use client';

import React, { useState } from "react";
import { Row, Col, Card, Pagination, Image, Button, Tag } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";

const jobsApplied = [
    { 
        id: 1,
        title: "Thực Tập Sinh Game Unity",
        company: "Công ty Game Nhất Trí",
        date: "12/12/2024",
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA" 
    },
    { 
        id: 2,
        title: "Thực Tập Sinh Graphic Design",
        company: "Công ty TNHH Thương mại Dịch vụ Thương Phúc",
        date: "12/12/2024",
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA" 
    },
    { 
        id: 3,
        title: "Thực Tập Sinh Sale Marketing",
        company: "Công ty TNHH Thương mại Dịch vụ Tây Sơn",
        date: "12/12/2024",
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA" 
    },
    { 
        id: 4,
        title: "Thực Tập Sinh Sale Marketing",
        company: "Công ty TNHH Thương mại Dịch vụ Tây Sơn",
        date: "12/12/2024",
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA" 
    },
    { 
        id: 5,
        title: "Thực Tập Sinh Sale Marketing",
        company: "Công ty TNHH Thương mại Dịch vụ Tây Sơn",
        date: "12/12/2024",
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA" 
    },
];

const jobSuggestions = [
    { 
        id: 1,
        title: "Thực Tập Sinh Kinh doanh",
        company: "Công ty TNHH Thương mại Dịch vụ Tây Sơn",
        salary: "6 triệu",
        location: "Bắc Giang",
        tags: ["Full-time", "Quản trị kinh doanh"],
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA"
    },
    { 
        id: 2,
        title: "Lập Trình Viên Thực Tập",
        company: "Công ty TNHH Thương mại Dịch vụ Thương Phúc",
        salary: "5 triệu",
        location: "Đà Nẵng",
        tags: ["Part-time", "Công nghệ thông tin"],
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA"
    },
];

const ProfileManagement = () => {
    const [hoveredCard, setHoveredCard] = useState<{ id: number | null; type: string | null }>({ id: null, type: null });

    // Phân trang cho danh sách jobsApplied
    const [currentJobsPage, setCurrentJobsPage] = useState(1);
    const jobsPageSize = 4;
    const paginatedJobsApplied = jobsApplied.slice((currentJobsPage - 1) * jobsPageSize, currentJobsPage * jobsPageSize);

    // Phân trang cho danh sách jobSuggestions 
    const [currentSuggestionsPage, setCurrentSuggestionsPage] = useState(1);
    const SuggestionsPageSize = 4;
    const paginatedJobsSuggestions = jobSuggestions.slice((currentSuggestionsPage - 1) * SuggestionsPageSize, currentSuggestionsPage * SuggestionsPageSize);

    return (
        <div style={{ padding: "20px" }}>
            <div>
                <h2 style={{fontWeight:"bold", marginBottom:"12px"}}>Việc làm đã ứng tuyển</h2>
                <Row gutter={[16, 16]}>
                    {paginatedJobsApplied.map((job) => (
                    <Col xs={24} sm={12} md={8} lg={6} key={job.id}>
                        <Card hoverable
                            style={{ 
                                borderRadius: "10px",
                                overflow: "hidden",
                                height: "100%",
                                display: 'flex',
                                flexDirection: "column",
                                boxShadow:
                                    hoveredCard.id === job.id && hoveredCard.type === "jobsApplied"
                                        ? "0 6px 15px rgba(0,0,0,0.3)"
                                        : "0 4px 10px rgba(0,0,0,0.2)",
                                background:
                                    hoveredCard.id === job.id && hoveredCard.type === "jobsApplied" ? "#f0f8ff" : "#ffffff",
                                transition: "all 0.3s ease",
                                transform:
                                    hoveredCard.id === job.id && hoveredCard.type === "jobsApplied"
                                        ? "translateY(-5px)"
                                        : "translateY(-2px)",
                            }}
                            onMouseEnter={() => setHoveredCard({ id: job.id, type: "jobsApplied" })}
                            onMouseLeave={() => setHoveredCard({ id: null, type: null })}
                        >
                            <Image src={job.logo} alt={job.company} width={50} />
                            <h3 style={{fontSize: "16px", fontWeight:"bold" }}>{job.title}</h3>
                            <p style={{ fontSize: "14px" }}>{job.company}</p>
                            <p style={{ fontSize: "14px" }}>Ngày ứng tuyển: {job.date}</p>
                            
                        </Card>
                    </Col>
                    ))}
                </Row>
                <Pagination
                    current={currentJobsPage}
                    total={jobsApplied.length}
                    pageSize={jobsPageSize}
                    onChange={setCurrentJobsPage}
                    style={{ textAlign: "center", marginTop: "12px" }}
                />
            </div>
            
            <div>
                <h2 style={{fontWeight:"bold", marginTop:"20px"}}>Gợi ý việc làm phù hợp</h2>
                <Card>
                    <Row gutter={[16, 16]}>
                        {paginatedJobsSuggestions.map((job) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={job.id}>
                                <Card hoverable 
                                    style={{ 
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        height: "100%",
                                        display: 'flex',
                                        flexDirection: "column",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)" 
                                    }}>
                                    <Image src={job.logo} alt={job.company} width={50} />
                                    <h3 style={{fontSize: "16px", fontWeight:"bold" }}>{job.title}</h3>
                                    <p style={{ fontSize: "14px" }}><strong>Công ty:</strong> {job.company}</p>
                                    <p style={{ fontSize: "14px" }}><strong>Lương:</strong> {job.salary}</p>
                                    <p style={{ fontSize: "14px" }}><EnvironmentOutlined /> {job.location}</p>
                                    <div style={{marginBottom:"5px"}}>
                                        {job.tags.map(tag => (<Tag key={tag}>{tag}</Tag>))}
                                    </div>
                                    <Button type="primary">Xem chi tiết</Button>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                    <Pagination 
                        current={currentSuggestionsPage}
                        total={jobSuggestions.length} 
                        pageSize={SuggestionsPageSize}
                        onChange={setCurrentSuggestionsPage} 
                        style={{ textAlign: "center", marginTop: "12px" }}
                    />
                </Card>
            </div>
            
        </div>
    );
};

export default ProfileManagement;
