'use client';

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Pagination, Image, Button, Tag } from "antd";
import { EnvironmentOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import CustomButton from "@/components/CustomButton";

type jobSaved = {
    id: number;
    title: string;
    salary_range: string;
    status: string;
    company_id: number;
    work_location: string;
    specialize: string;
    deadline: string;
    company: {
        id: number;
        name: string;
        logo: string;
    };
    saved_at: string;
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

const WorkFavorites = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [savedJobs, setSavedJobs] = useState<jobSaved[]>([]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token");

            if (!token) {
                console.warn("Không tìm thấy token!");
                return;
            }

            const fetchSavedJobs = async () => {
                try {
                    const res = await fetch("http://localhost:8080/user/favorites", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!res.ok) {
                        console.error("Status code:", res.status);
                        throw new Error("Lỗi khi fetch công việc đã lưu");
                    }

                    const data = await res.json();
                    setSavedJobs(data.savedJobs);
                } catch (error) {
                    console.error("Lỗi khi lấy công việc đã lưu:", error);
                }
            };
            fetchSavedJobs();
        }
    }, []);

    const handleUnsaveJob = async (jobId: number) => {
        const token = localStorage.getItem("token");
        if (!token) {
            console.warn("Không tìm thấy token!");
            return;
        }
        try {
            const res = await fetch(`http://localhost:8080/user/unsavejob/${jobId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) {
                throw new Error("Lỗi khi bỏ lưu công việc");
            }
            // Xoá công việc khỏi danh sách savedJobs trong state
            setSavedJobs((prevSavedJobs) =>
                prevSavedJobs.filter((job) => job.id !== jobId)
            );
            console.log("Công việc đã bị bỏ lưu");
        } catch (error) {
            console.error("Lỗi khi bỏ lưu công việc:", error);
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


    // const handleApplyJob = ()=>{}
    return (
        <div style={{ padding: "20px" }}>
            <div>
                <h2 style={{ fontWeight: "bold", marginBottom: "12px", marginTop: "12px" }}>Việc làm yêu thích</h2>
                <Row gutter={[16, 16]}>
                    {paginatedjobsSaved.map((job, index) => (
                        <Col xs={24} sm={12} md={8} lg={8} key={`${job.id}-${index}`}>
                            <Card
                                variant="outlined"
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
                                            src={job.company.logo}
                                            alt={job.title}
                                            preview={false}
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
                                    <Col span={16} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: "480px" }}>
                                        <div>
                                            <h3 style={{ marginBottom: 5, fontSize: "16px", fontWeight: "bold" }}>{job.title}</h3>
                                            <p style={{ fontSize: "14px" }}><strong>Công ty:</strong> {job.company.name}</p>
                                            <p style={{ fontSize: "14px" }}><strong>Lương:</strong> {job.salary_range}</p>
                                            <p style={{ fontSize: "14px" }}><strong>Đã lưu:</strong> {new Date(job.saved_at).toLocaleDateString()} - {new Date(job.saved_at).toLocaleTimeString()}</p>
                                            <p style={{ fontSize: "14px" }}><EnvironmentOutlined /> {job.work_location}</p>
                                        </div>
                                        {/* Nút hủy lưu */}
                                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                                            <CustomButton
                                                text="Ứng tuyển"
                                                onClick={() => { }}
                                                backgroundColor="#D4421E"
                                                hoverColor="#E9552D"
                                                textColor="white"
                                                style={{
                                                    alignSelf: "flex-start",
                                                    marginTop: "8px",
                                                    fontWeight: "600",
                                                    height: "32px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    borderRadius: "8px",
                                                    fontSize: "14px"
                                                }}
                                            >
                                                <SendOutlined />
                                            </CustomButton>

                                            <CustomButton
                                                text="Hủy lưu"
                                                onClick={() => handleUnsaveJob(job.id)}
                                                backgroundColor="#FFFFFF"
                                                textColor="#333"
                                                hoverColor="#E0E0E0"
                                                style={{
                                                    alignSelf: "flex-start",
                                                    marginTop: "8px",
                                                    fontWeight: "600",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    borderRadius: "8px",
                                                    height: "32px",
                                                    fontSize: "14px",
                                                    gap: "8px",
                                                }}
                                            >
                                                <DeleteOutlined />
                                            </CustomButton>
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
                <h2 style={{ fontWeight: "bold", marginTop: "20px" }}>Gợi ý việc làm phù hợp</h2>
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
                                    <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>{job.title}</h3>
                                    <p style={{ fontSize: "14px" }}><strong>Công ty:</strong> {job.company}</p>
                                    <p style={{ fontSize: "14px" }}><strong>Lương:</strong> {job.salary}</p>
                                    <p style={{ fontSize: "14px" }}><EnvironmentOutlined /> {job.location}</p>
                                    <div style={{ marginBottom: "5px" }}>
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