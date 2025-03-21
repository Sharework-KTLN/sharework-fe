'use client';

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Pagination, Image, Button, Tag } from "antd";
import { EnvironmentOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";

interface jobSaved {
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
    appliedAt?: string;
};

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

const WorkFavorites = () =>{
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [savedJobs, setSavedJobs] = useState<jobSaved[]>([]);

    useEffect(() => {
        const savedJobs = JSON.parse(sessionStorage.getItem("savedJobs") || "[]");
        const appliedJobs = JSON.parse(sessionStorage.getItem("appliedJobs") || "[]");
    
        // Kiểm tra xem job trong savedJobs có trong appliedJobs không
        const updatedSavedJobs = savedJobs.map((job: jobSaved) => {
            const appliedJob = appliedJobs.find((applied: jobSaved) => applied.id === job.id);
            return {
                ...job,
                savedAt: job.savedAt || new Date().toISOString(), // Nếu chưa có savedAt, đặt thời gian hiện tại
                appliedAt: appliedJob ? appliedJob.appliedAt : job.appliedAt, // Cập nhật nếu đã ứng tuyển trước
            };
        });
        setSavedJobs(updatedSavedJobs);
    }, []);
    
    const handleUnsaveJob = (jobId: number) => {
        const updatedSavedJobs = savedJobs.filter((saved) => saved.id !== jobId);
        setSavedJobs(updatedSavedJobs);
        sessionStorage.setItem('savedJobs', JSON.stringify(updatedSavedJobs));
    };
    
    const handleApplyJob = (jobId: number) => {
        // Tìm công việc từ savedJobs
        const appliedJob = savedJobs.find((job) => job.id === jobId);
    
        if (!appliedJob) return; // Nếu không tìm thấy, thoát luôn
    
        // Lấy danh sách appliedJobs từ sessionStorage (nếu có)
        const storedAppliedJobs = JSON.parse(sessionStorage.getItem("appliedJobs") || "[]");
    
        // Kiểm tra xem job đã có trong danh sách applied chưa
        const isAlreadyApplied = storedAppliedJobs.some((job: jobSaved) => job.id === jobId);
    
        if (!isAlreadyApplied) {
            const newAppliedJob = { ...appliedJob, appliedAt: new Date().toISOString().split("T")[0] };
    
            // Cập nhật appliedJobs trong sessionStorage
            const updatedAppliedJobs = [...storedAppliedJobs, newAppliedJob];
            sessionStorage.setItem("appliedJobs", JSON.stringify(updatedAppliedJobs));
    
            // 🔹 Cập nhật lại state savedJobs để giao diện thay đổi ngay lập tức
            const updatedSavedJobs = savedJobs.map((job) =>
                job.id === jobId ? { ...job, appliedAt: newAppliedJob.appliedAt } : job
            );
            setSavedJobs(updatedSavedJobs);
        }
    };

    // Phân trang cho danh sách jobsSaved
    const [currentSavesPage, setCurrentSavesPage] = useState(1);
    const SavesPageSize = 6;
    const paginatedjobsSaved = savedJobs.slice((currentSavesPage - 1) * SavesPageSize, currentSavesPage * SavesPageSize);

    // Phân trang cho danh sách jobSuggestions 
    const [currentSuggestionsPage, setCurrentSuggestionsPage] = useState(1);
    const SuggestionsPageSize = 4;
    const paginatedJobsSuggestions = jobSuggestions.slice((currentSuggestionsPage - 1) * SuggestionsPageSize, currentSuggestionsPage * SuggestionsPageSize);

    return (
        <div style={{ padding: "20px" }}>
            <div>
                <h2 style={{fontWeight:"bold", marginBottom:"12px", marginTop:"12px"}}>Việc làm yêu thích</h2>
                <Row gutter={[16, 16]}>
                    {paginatedjobsSaved.map((job, index) => (
                        <Col xs={24} sm={12} md={8} lg={8} key={`${job.id}-${index}`}>
                        <Card
                            bordered={false}
                            onMouseEnter={() => setHoveredCard(job.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            style={{
                                width: "100%",
                                height: "210px",
                                cursor: "pointer",
                                borderRadius: "10px",
                                display: "flex",
                                alignItems: "center",
                                background: hoveredCard === job.id ? "#FFD4C4" : "#FFEFE5",
                                boxShadow: hoveredCard === job.id ? "0 4px 10px rgba(0,0,0,0.2)" : "none",
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
                                            transform: hoveredCard === job.id ? "scale(1.05)" : "scale(1)",
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
                                        <p style={{ fontSize: "14px" }}><strong>Đã lưu:</strong> {new Date(job.savedAt).toLocaleDateString()} - {new Date(job.savedAt).toLocaleTimeString()}</p>
                                        <p style={{ fontSize: "14px" }}><EnvironmentOutlined /> {job.location}</p>
                                    </div>
                                    {/* Nút hủy lưu */}
                                    <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                                        <Button 
                                            type="primary" className="mb-4"
                                            style={{ alignSelf: "flex-start", marginTop: "8px", background:"#D4421E",fontWeight:"500"}}
                                            icon={<SendOutlined/>}
                                            onClick={() => handleApplyJob(job.id)}
                                            disabled={!!job.appliedAt}
                                        >
                                            {job.appliedAt ? `Đã ứng tuyển` : "Ứng tuyển"}
                                        </Button>
                                        <Button 
                                            style={{ alignSelf: "flex-start", marginTop: "8px",fontWeight:"500" }} 
                                            onClick={() => handleUnsaveJob(job.id)} 
                                            icon={<DeleteOutlined />}
                                        >
                                            Hủy lưu
                                        </Button>
                                    </div>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    ))}
                </Row>
                <Pagination
                    current={currentSavesPage}
                    total={savedJobs.length}
                    pageSize={SavesPageSize}
                    onChange={setCurrentSavesPage}
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

export default WorkFavorites;