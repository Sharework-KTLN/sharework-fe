'use client';

import React, { useState, useEffect } from "react";
import { Row, Col, Card, Pagination, Image, Tag } from "antd";
import { EnvironmentOutlined, DeleteOutlined, SendOutlined } from "@ant-design/icons";
import { useRouter } from 'next/navigation';
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

interface AppliedJob {
    id: number;
    job_id: number; // Tham chiếu đến job đã lưu
    candidate_id: number; // Tham chiếu đến người dùng (ứng viên) đã ứng tuyển
    applied_at: string; // Thời gian ứng tuyển công việc
    // job: Job; // Thông tin công việc ứng tuyển, liên kết với bảng Job
}

const WorkFavorites = () => {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [savedJobs, setSavedJobs] = useState<jobSaved[]>([]);
    const [recommendedJobs, setRecommendedJobs] = useState<JobSuggestion[]>([]);
    const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
    const router = useRouter();
    
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("userToken");

            if (!token) {
                console.warn("Không tìm thấy token!");
                return;
            }

            const fetchSavedJobs = async () => {
                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/favorites`, {
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
    useEffect(() => {
        const fetchAppliedJobs = async () => {
            const token = localStorage.getItem("userToken");
            if (!token) return;
            try {
                const res = await fetch("http://localhost:8080/user/applies", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) return; // Không làm gì nếu lỗi
                const data = await res.json();
                // Cập nhật danh sách công việc đã ứng tuyển (Lưu id công việc đã ứng tuyển)
                setAppliedJobs(data.applications.map((item: AppliedJob) => item.job_id)); 
            } catch (err) {
                // Không log lỗi, giữ im lặng như yêu cầu
            }
        };
        fetchAppliedJobs();
    }, []);    

    const handleUnsaveJob = async (jobId: number) => {
        const token = localStorage.getItem("userToken");
        if (!token) {
            console.warn("Không tìm thấy token!");
            return;
        }
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/unsavejob/${jobId}`, {
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
    // Phân trang cho danh sách jobsSaved
    const [currentSavesPage, setCurrentSavesPage] = useState(1);
    const SavesPageSize = 6;
    const paginatedjobsSaved = savedJobs.slice((currentSavesPage - 1) * SavesPageSize, currentSavesPage * SavesPageSize);

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

    // const handleApplyJob = ()=>{}
    return (
        <div style={{ padding: "20px", overflowX: "hidden" }}>
            <div>
                <h2 style={{ fontWeight: "bold", marginBottom: "12px", marginTop: "12px" }}>Việc làm yêu thích</h2>
                <Row gutter={[16, 16]}>
                    {paginatedjobsSaved.map((job, index) => (
                        <Col xs={24} sm={12} md={8} lg={8} key={`${job.id}-${index}`}>
                            <Card
                                variant="outlined"
                                onMouseEnter={() => setHoveredCard(job.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => handleCardClick(job.id)}
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
                                            <p style={{ fontSize: "14px" }}>
                                                <strong>Công ty:</strong> {job.company.name}
                                            </p>
                                            <p style={{ fontSize: "14px" }}><strong>Lương:</strong> {job.salary_range}</p>
                                            <p style={{ fontSize: "14px" }}><strong>Đã lưu:</strong> {new Date(job.saved_at).toLocaleDateString()} - {new Date(job.saved_at).toLocaleTimeString()}</p>
                                            <p style={{ fontSize: "14px" }}><EnvironmentOutlined /> {job.work_location}</p>
                                        </div>
                                        {/* Nút hủy lưu */}
                                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                                            <CustomButton
                                                text={appliedJobs.includes(job.id) ? "Đã ứng tuyển" : "Ứng tuyển"}
                                                onClick={() => {
                                                    if (!appliedJobs.includes(job.id)) {
                                                    //   handleApplyJob(job.id); // Gọi hàm ứng tuyển với job.id
                                                    }
                                                }}
                                                backgroundColor={appliedJobs.includes(job.id) ? "#4CAF50" : "#D4421E"}
                                                hoverColor={appliedJobs.includes(job.id) ? "#45A049" : "#E44A26"}
                                                textColor="#FFF"
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
                                                    cursor: appliedJobs.includes(job.id) ? "not-allowed" : "pointer",
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

export default WorkFavorites;