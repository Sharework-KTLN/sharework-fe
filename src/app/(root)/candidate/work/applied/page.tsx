'use client';

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Pagination, Image, Button, Tag } from "antd";
import { EnvironmentOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";

interface jobApplied {
    id : number;
    title: string;
    company: string;
    location: string;
    specialization: string;
    description: string;
    requirement: string;
    jobType: string;
    salary: string;
    create_date: string;
    end_date: string;
    image: string;
    savedAt: string;
    appliedAt: string;
}

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

const WorkApplied = () =>{
    const [hoveredCard, setHoveredCard] = useState<{ id: number | null; type: string | null } | null>(null);
    const [jobsApplied, setJobsApplied] = useState<jobApplied[]>([]);

    useEffect(() => {
        const appliedJobs = sessionStorage.getItem("appliedJobs");
        if (appliedJobs) {
            const parsedJobs = JSON.parse(appliedJobs).map((job: jobApplied) => ({
                ...job,
                appliedAt: job.appliedAt || "Không có thông tin",
            }));
            setJobsApplied(parsedJobs);
        }
    }, []);

    const handleRemoveAppliedJob = (jobId: number) => {
        // Lọc bỏ công việc đã ứng tuyển có id = jobId
        const updatedJobs = jobsApplied.filter(job => job.id !== jobId);
    
        // Cập nhật sessionStorage
        sessionStorage.setItem("appliedJobs", JSON.stringify(updatedJobs));
    
        // Cập nhật state
        setJobsApplied(updatedJobs);
    };

    // Phân trang cho danh sách jobsApplied
    const [currentJobsPage, setCurrentJobsPage] = useState(1);
    const jobsPageSize = 4;
    const paginatedJobsApplied = jobsApplied.slice((currentJobsPage - 1) * jobsPageSize, currentJobsPage * jobsPageSize);

    // Phân trang cho danh sách jobSuggestions 
    const [currentSuggestionsPage, setCurrentSuggestionsPage] = useState(1);
    const SuggestionsPageSize = 4;
    const paginatedJobsSuggestions = jobSuggestions.slice((currentSuggestionsPage - 1) * SuggestionsPageSize, currentSuggestionsPage * SuggestionsPageSize);

    return(
        <div style={{ padding: "20px" }}>
            <div>
                <h2 style={{ fontWeight: "bold", marginBottom: "12px" }}>Việc làm đã ứng tuyển</h2>
                <Row gutter={[16, 16]}>
                    {paginatedJobsApplied.length > 0 ? (
                        paginatedJobsApplied.map((job, index) => (
                            <Col xs={24} sm={12} md={8} lg={8} key={`${job.id}-${index}`}>
                                <Card
                                    bordered={false}
                                    onMouseEnter={() => setHoveredCard({ id: job.id, type: null })}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    style={{
                                        width: "100%",
                                        height: "210px",
                                        cursor: "pointer",
                                        borderRadius: "10px",
                                        display: "flex",
                                        alignItems: "center",
                                        background: hoveredCard?.id === job.id ? "#FFD4C4" : "#FFEFE5",
                                        boxShadow: hoveredCard?.id === job.id ? "0 4px 10px rgba(0,0,0,0.2)" : "none",
                                        transition: "all 0.3s ease-in-out"
                                    }}
                                >
                                    <Row gutter={16} align="middle" style={{ width: "100%" }}>
                                        {/* Hình ảnh bên trái */}
                                        <Col span={8}>
                                            <Image
                                                src={job.image}
                                                alt={job.title}
                                                style={{
                                                    width: "100%",
                                                    height: "100px",
                                                    borderRadius: "8px",
                                                    objectFit: "cover",
                                                    transform: hoveredCard?.id === job.id ? "scale(1.05)" : "scale(1)",
                                                    transition: "transform 0.3s ease-in-out"
                                                }}
                                            />
                                        </Col>
                                        {/* Nội dung bên phải */}
                                        <Col span={16} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width:"480px"}}>
                                            <div>
                                                <h3 style={{ marginBottom: 5, fontSize: "16px", fontWeight: "bold" }}>{job.title}</h3>
                                                <p style={{ fontSize: "14px" }}><strong>Công ty:</strong> {job.company}</p>
                                                <p style={{ fontSize: "14px" }}><strong>Lương:</strong> {job.salary}</p>
                                                <p style={{ fontSize: "14px" }}><strong>Ngày ứng tuyển:</strong> {job.appliedAt}</p>
                                                <p style={{ fontSize: "14px" }}><EnvironmentOutlined /> {job.location}</p>
                                            </div>
                                            {/* Nút Xem chi tiết */}
                                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                                                <Button 
                                                    type="primary" 
                                                    style={{ 
                                                        alignSelf: "flex-start", marginTop: "8px", background:"#D4421E", fontWeight:"500"
                                                    }}
                                                    icon={<SendOutlined />}
                                                    onClick={() => handleRemoveAppliedJob(job.id)}
                                                >
                                                    Đã ứng tuyển
                                                </Button>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>
                        ))
                    ) : (
                        <p style={{ textAlign: "center", width: "100%" }}>Không có công việc nào đã ứng tuyển.</p>
                    )}
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
                                <Card 
                                    hoverable 
                                    style={{ 
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        height: "100%",
                                        display: 'flex',
                                        flexDirection: "column",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)" 
                                    }}
                                >
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
export default WorkApplied;