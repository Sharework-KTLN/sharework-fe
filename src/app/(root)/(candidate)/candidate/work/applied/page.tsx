'use client';

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Pagination, Image, Button, Tag } from "antd";
import { EnvironmentOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { useRouter } from 'next/navigation';

import CustomButton from "@/components/CustomButton";

type jobApplied = {
    application_id: number;  // mã hồ sơ ứng tuyển
    job_id: number
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
    applied_at: string;
};

type JobSuggestion = {
  id: number;
  title: string;
  company: {
    id: number;
    name: string;
    logo: string;
  };
  salary_range: string;
  work_location: string;
  specialize: string;
  deadline: string;
};

const WorkApplied = () => {
    const [hoveredCard, setHoveredCard] = useState<{ id: number | null; type: string | null } | null>(null);
    const [appliedJobs, setAppliedJobs] = useState<jobApplied[]>([]);
    const [recommendedJobs, setRecommendedJobs] = useState<JobSuggestion[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("userToken");

            if (!token) {
                console.warn("Không tìm thấy token!");
                return;
            }

            const fetchAppliedJobs = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/applies`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`,
                        },
                    });

                    if (!res.ok) {
                        console.error("Status code:", res.status);
                        throw new Error("Lỗi khi fetch công việc đã ứng tuyển");
                    }

                    const data = await res.json();
                    console.log("Applications:", data.applications);
                    setAppliedJobs(data.applications); // Đổi tên state tương ứng
                } catch (error) {
                    console.error("Lỗi khi lấy công việc đã ứng tuyển:", error);
                }
            };

            fetchAppliedJobs();
        }
    }, []);

    useEffect(() => {
            const token = localStorage.getItem("userToken");
            if (!token) return;
    
            const fetchRecommendedJobs = async () => {
                try {
                const res = await fetch("http://localhost:8080/jobs/recommended", {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                });
    
                const data = await res.json();
                setRecommendedJobs(data || []); // đảm bảo luôn là mảng
                } catch (error) {
                console.error("Lỗi khi lấy danh sách gợi ý:", error);
                setRecommendedJobs([]); // fallback khi lỗi
                }
            };
    
            fetchRecommendedJobs();
        
        }, []);
    const handleRemoveAppliedJob = (jobId: number) => {
        // // Lọc bỏ công việc đã ứng tuyển có id = jobId
        // const updatedJobs = jobsApplied.filter(job => job.id !== jobId);

        // // Cập nhật sessionStorage
        // sessionStorage.setItem("appliedJobs", JSON.stringify(updatedJobs));

        // // Cập nhật state
        // setJobsApplied(updatedJobs);
    };
    const handleCardClick = async (jobId: number) => {
        try {
            const token = localStorage.getItem("userToken");
            if (!token) {
                router.push("/auth/candidate/login");
                return;
            }

            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };

            if (token) {
                headers["Authorization"] = `Bearer ${token}`;
            }

            const response = await fetch(`http://localhost:8080/jobs/detail/${jobId}`, {
                method: "GET",
                headers,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Không thể lấy thông tin công việc");
            }

            const jobDetail = await response.json();
            sessionStorage.setItem("selectedJob", JSON.stringify(jobDetail));
            router.push(`/candidate/recruitmentInfoDetail?id=${jobId}`);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Lỗi khi lấy thông tin công việc:", error.message);
            } else {
                console.error("Lỗi không xác định:", error);
            }
        }
    };
    // Phân trang cho danh sách jobsApplied
    const [currentJobsPage, setCurrentJobsPage] = useState(1);
    const jobsPageSize = 6;
    const paginatedJobsApplied = appliedJobs.slice((currentJobsPage - 1) * jobsPageSize, currentJobsPage * jobsPageSize);

    // Phân trang cho danh sách jobSuggestions 
    const [currentSuggestionsPage, setCurrentSuggestionsPage] = useState(1);
    const SuggestionsPageSize = 4;
    const paginatedJobsSuggestions =
        Array.isArray(recommendedJobs)
            ? recommendedJobs.slice(
                (currentSuggestionsPage - 1) * SuggestionsPageSize,
                currentSuggestionsPage * SuggestionsPageSize
            )
        : [];

    return (
        <div style={{ padding: "20px", overflowX: "hidden"}}>
            <div>
                <h2 style={{ fontWeight: "bold", marginBottom: "12px" }}>Việc làm đã ứng tuyển</h2>
                <Row gutter={[16, 16]}>
                    {paginatedJobsApplied.length > 0 ? (
                        paginatedJobsApplied.map((job, index) => (
                            <Col xs={24} sm={12} md={8} lg={8} key={`${job.id}-${index}`}>
                                <Card
                                    variant="outlined"
                                    onMouseEnter={() => setHoveredCard({ id: job.id, type: null })}
                                    onMouseLeave={() => setHoveredCard(null)}
                                    onClick={() => handleCardClick(job.job_id)}
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
                                                src={job.company.logo}
                                                alt={job.title}
                                                preview={false}
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
                                        <Col span={16} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", width: "480px" }}>
                                            <div>
                                                <h3 style={{ marginBottom: 5, fontSize: "16px", fontWeight: "bold" }}>{job.title}</h3>
                                                <p style={{ fontSize: "14px" }}><strong>Công ty:</strong> {job.company.name}</p>
                                                <p style={{ fontSize: "14px" }}><strong>Lương:</strong> {job.salary_range}</p>
                                                <p style={{ fontSize: "14px" }}>
                                                    <strong>Ngày ứng tuyển:</strong>{" "}
                                                    {job.applied_at
                                                        ? `${new Date(job.applied_at).toLocaleDateString()} - ${new Date(job.applied_at).toLocaleTimeString()}`
                                                        : "Không xác định"}
                                                </p>
                                                <p style={{ fontSize: "14px" }}><EnvironmentOutlined /> {job.work_location}</p>
                                            </div>
                                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                                                <CustomButton
                                                    text="Đã ứng tuyển"
                                                    onClick={() => { }}
                                                    backgroundColor="#4CAF50"
                                                    hoverColor="#4CAF50"
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
                                                        fontSize: "14px",
                                                        cursor: "not-allowed",         // Hiển thị chuột bị khóa
                                                        
                                                    }}
                                                >
                                                    <SendOutlined />
                                                </CustomButton>
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
                    total={appliedJobs.length}
                    pageSize={jobsPageSize}
                    onChange={setCurrentJobsPage}
                    style={{ textAlign: "center", marginTop: "12px" }}
                />
            </div>

            <div>
                <h2 style={{ fontWeight: "bold", marginTop: "20px" }}>Gợi ý việc làm phù hợp</h2>
                <Card>
                    <Row gutter={[16, 16]}>
                        {Array.isArray(paginatedJobsSuggestions) && paginatedJobsSuggestions.length > 0 ? (
                            paginatedJobsSuggestions.map((job) => (
                                <Col xs={24} sm={12} md={8} lg={6} key={job.id} style={{ display: "flex", flexDirection: "column" }} >
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
                                        <div style={{ flex: 1 }}>
                                            <Image src={job.company.logo} alt={job.company.name} width={50} />
                                            <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>{job.title}</h3>
                                            <p style={{ fontSize: "14px" }}><strong>Công ty:</strong> {job.company.name}</p>
                                            <p style={{ fontSize: "14px" }}><strong>Lương:</strong> {job.salary_range}</p>
                                            <p style={{ fontSize: "14px" }}><EnvironmentOutlined /> {job.work_location}</p>
                                            <Tag>{job.specialize}</Tag>
                                            <p style={{ fontSize: "13px", color: "gray" }}>
                                            <strong>Hạn nộp:</strong> {new Date(job.deadline).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <CustomButton
                                            text="Xem chi tiết"
                                            onClick={() => handleCardClick(job.id)}
                                            backgroundColor="#D4421E"     // màu primary của Ant Design Button, bạn có thể thay đổi
                                            hoverColor="#E44A26"            // màu hover bạn muốn
                                            textColor="white"
                                            style={{
                                                marginTop: "auto",
                                                width: 150,
                                                height: 40,
                                                fontWeight: 600,
                                                fontSize: 16,
                                                borderColor: "#D4421E",
                                                cursor: "pointer",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        />
                                    </Card>
                                </Col>
                            ))
                            ) : (
                            <p>Không có công việc gợi ý nào.</p>
                            )
                        }   
                    </Row>
                    <Pagination
                        current={currentSuggestionsPage}
                        total={recommendedJobs.length}
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