'use client';
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Pagination, Input, Image } from 'antd';
import { EnvironmentOutlined, SearchOutlined, FilterOutlined, DownOutlined, UpOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

interface Job {
    id: number;
    title: string;
    description: string;
    status: string;
    experience_required: string;
    salary_range: string;
    work_location: string; // Địa chỉ làm việc (thay vì location)
    created_at: string;
    updated_at: string;
    company_id: number;
    recruiter_id: number;
    required_skills: string; // Yêu cầu kỹ năng
    industry: string; // Lĩnh vực cần tuyển
    salary_type: string; // Hình thức lương (net/gross, theo giờ/tháng, v.v.)
    deadline: string; // Hạn bài đăng
    work_type: string; // Hình thức làm việc (toàn thời gian, bán thời gian, remote, v.v.)
    work_schedule: string; // Thời gian làm việc
    vacancies: number; // Số lượng tuyển dụng
    benefits: string; // Phúc lợi công việc
    educational_level: string; // Trình độ học vấn
    work_level: string; // Cấp bậc làm việc
    candidate_required: string; // Yêu cầu ứng viên
    company_name: string; // Tên công ty
    company_logo: string;
    recruiter: string; // Tên người tuyển dụng
}

interface SavedJob {
    id: number;
    job_id: number; // Tham chiếu đến job đã lưu
    candidate_id: number; // Tham chiếu đến người dùng (ứng viên) đã lưu công việc
    saved_at: string; // Thời gian lưu công việc
    job: Job; // Thông tin công việc đã lưu, liên kết với bảng Job
}
const { Option } = Select;
const filters = [
    {
        key: "location",
        placeholder: "Chọn tỉnh/thành phố",
        options: ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Bình Dương", "Bắc Giang"]
    },
    {
        key: "specialization",
        placeholder: "Chọn chuyên môn",
        options: ["Công nghệ thông tin", "Quản trị kinh doanh", "Du lịch", "Kế toán"]
    },
    {
        key: "jobType",
        placeholder: "Chọn loại công việc",
        options: ["Thực tập", "Full-time", "Part-time"]
    },
    {
        key: "salary",
        placeholder: "Mức lương",
        options: ["Dưới 5 triệu", "5-10 triệu", "Trên 10 triệu"]
    }
];

const pageSize = 9; // Số lượng card hiển thị trên mỗi trang

const Home = () => {
    //Khởi tạo state nhận null hoặc kiểu dữ liệu khác
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({
        location: null,
        specialization: null,
        jobType: null,
        salary: null
    });
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1); // Theo dõi trang hiện tại
    const [openSelect, setOpenSelect] = useState<Record<string, boolean>>({}); // Trạng thái của Select
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter(); // Khởi tạo router
    const [savedJobs, setSavedJobs] = useState<number[]>([]); // mảng id của job đã lưu
    const [jobs, setJobs] = useState<Job[]>([]); // Chỉ định kiểu cho jobs
    const [filteredJobs, setFilteredJobs] = useState(jobs); // Danh sách công việc đã lọc
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state có kiểu string hoặc null

    useEffect(() => {
        const fetchJobs = async () => {
          try {
            // Đảm bảo URL này trỏ đến backend của bạn chạy trên port 8080
            const response = await fetch("http://localhost:8080/jobs");
            if (!response.ok) {
              throw new Error("Failed to fetch jobs");
            }
            const data = await response.json();
            setJobs(data);
            setFilteredJobs(data);
          } catch (err) {
            if (err instanceof Error) {
              setError(err.message);
            } else {
              setError("An unknown error occurred");
            }
          } finally {
            setLoading(false);
          }
        };
      
        fetchJobs();
    }, []);
    
    useEffect(() => {
        const fetchSavedJobs = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Bạn chưa đăng nhập hoặc thiếu token");
                return;
            }
    
            try {
                const res = await fetch("http://localhost:8080/user/favorites", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) {
                    throw new Error("Không thể lấy danh sách công việc đã thích");
                }
                const data = await res.json();
                setSavedJobs(data.savedJobs.map((item: SavedJob) => item.id)); // Lấy id của các công việc đã lưu
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Lỗi không xác định khi lấy danh sách công việc đã thích");
                }
            }
        };
        fetchSavedJobs();
    }, []);

    // Hàm cập nhật trạng thái mở/đóng Select
    const handleDropdownVisibleChange = (key: string, open: boolean) => {
        setOpenSelect(prev => ({ ...prev, [key]: open }));
    };

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = (key: string, value: string | null) => {
        setSelectedFilters(prev => ({ ...prev, [key]: value }));
    };

    // Xóa bộ lọc
    const resetFilters = () => {
        setSelectedFilters({
            location: null,
            specialization: null,
            jobType: null,
            salary: null
        });
        setFilteredJobs(jobs); // Hiển thị lại toàn bộ danh sách công việc
    };

    // Hàm lọc dữ liệu dựa trên bộ lọc và tìm kiếm
    useEffect(() => {
        const updatedJobs = jobs.filter(job => {
            // Chuyển đổi salary của job thành số để so sánh
            const jobSalary = parseInt(job.salary_range.replace(/\D/g, ""), 10) * 1000000; // Lấy số từ chuỗi "4 triệu" -> 4

            return (
                (!selectedFilters.location || job.work_location === selectedFilters.location) &&
                (!selectedFilters.specialization || job.industry === selectedFilters.specialization) &&
                (!selectedFilters.jobType || job.work_type === selectedFilters.jobType) &&
                (!selectedFilters.salary || checkSalaryFilter(jobSalary, selectedFilters.salary)) &&
                (searchTerm === "" ||
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.work_location.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        });

        setFilteredJobs(updatedJobs);
        setCurrentPage(1);
    }, [jobs, selectedFilters, searchTerm]);

    // Kiểm tra mức lương theo filter
    const checkSalaryFilter = (jobSalary: number, filter: string) => {
        switch (filter) {
            case "Dưới 5 triệu":
                return jobSalary < 5000000;
            case "5-10 triệu":
                return jobSalary >= 5000000 && jobSalary <= 10000000;
            case "Trên 10 triệu":
                return jobSalary > 10000000;
            default:
                return true;
        }
    };

    // // Tính toán danh sách job hiển thị dựa trên trang hiện tại
    const startIndex = (currentPage - 1) * pageSize; // Vị trí bắt đầu
    const endIndex = startIndex + pageSize; //Vị trí kết thúc
    const displayedJobs = filteredJobs.slice(startIndex, endIndex); //Lấy danh sách công việc hiển thị

    const handleCardClick = async (jobId: number) => {
        try {
            // Lấy token từ localStorage nếu có
            const token = localStorage.getItem("token");
            if (!token) {
                router.push("/auth/candidate/login");
                return;
            }
    
            // Nếu không có token, có thể gửi yêu cầu không có Authorization header
            const headers: HeadersInit = {
                "Content-Type": "application/json",
            };
    
            if (token) {
                // Nếu có token, thêm Authorization header
                headers["Authorization"] = `Bearer ${token}`;
            }
    
            // Gửi yêu cầu API để lấy chi tiết công việc
            const response = await fetch(`http://localhost:8080/jobs/detail/${jobId}`, {
                method: "GET",
                headers,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Không thể lấy thông tin công việc");
            }
    
            const jobDetail = await response.json();
            
            // Lưu thông tin công việc vào sessionStorage nếu cần
            sessionStorage.setItem('selectedJob', JSON.stringify(jobDetail));
    
            // Điều hướng đến trang chi tiết công việc
            router.push(`/candidate/recruitmentInfoDetail?id=${jobId}`);
        } catch (error: unknown) { // Chỉ định kiểu 'unknown' cho error
            if (error instanceof Error) {
                console.error("Lỗi khi lấy thông tin công việc:", error.message);
            } else {
                console.error("Lỗi không xác định:", error);
            }
        }
    };
    
    const handleSaveJob = async (jobId: number) => {
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                router.push("/auth/candidate/login");
                return;
            }
    
            // Gửi yêu cầu POST đến /user/savejob để lưu công việc
            const response = await fetch(`http://localhost:8080/user/savejob/${jobId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ jobId }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Lưu công việc thất bại");
            }
    
            // Nếu lưu thành công, cập nhật lại trạng thái savedJobs
            setSavedJobs((prev) =>
                prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
            );
        } catch (error) {
            if (error instanceof Error) {
                console.error("Lỗi khi lưu công việc:", error.message);
            } else {
                console.error("Lỗi không xác định:", error);
            }
            throw error;
        }
    };

    const handleUnsaveJob = async (jobId: number) => {
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                router.push("/auth/candidate/login");
                return;
            }
    
            // Gửi yêu cầu DELETE đến /user/unsavejob để xóa công việc đã lưu
            const response = await fetch(`http://localhost:8080/user/unsavejob/${jobId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ jobId }), // Gửi jobId trong body request
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Bỏ lưu công việc thất bại");
            }
    
            // Nếu xóa thành công, cập nhật lại trạng thái savedJobs
            setSavedJobs((prev) =>
                prev.includes(jobId) ? prev.filter((id) => id !== jobId) : prev
            );
        } catch (error) {
            if (error instanceof Error) {
                console.error("Lỗi khi bỏ lưu công việc:", error.message);
            } else {
                console.error("Lỗi không xác định:", error);
            }
            throw error;
        }
    };
     return (
        <div style={{ width: "100%", overflow: "hidden" }}>
            <div style={{
                background: '#FFEFE5',
                padding: '20px',
                borderRadius: '8px',
                minHeight: '80px',
                maxHeight: '250px',
                height: 'auto',
                alignItems: 'center',  // Căn giữa theo chiều dọc
                justifyContent: 'center',  // Căn giữa theo chiều ngang
                overflow: 'hidden',
                marginBottom: '10px'
            }}>
                {/* Tiêu đề */}
                <div style={{ maxWidth: "900px", width: "100%", textAlign: "left", marginBottom: "10px", marginLeft: "140px" }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', }}>
                        Tìm kiếm <span style={{ background: '#D4421E', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>Việc làm</span>
                    </h2>
                </div>

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
                    {/* Ô tìm kiếm */}
                    <div style={{ maxWidth: "1200px", width: "100%", textAlign: "center", marginBottom: "10px" }}>
                        <Row gutter={[12, 12]} justify="center" align="middle" style={{ width: "100%" }} >
                            <Col flex="auto">
                                <Input
                                    placeholder="Tìm kiếm theo các Kỹ năng, Vị trí, Công ty,..."
                                    size="large"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <Button type="primary"
                                    size="large"
                                    style={{
                                        height: "39px",
                                        background: "#D4421E",
                                        borderColor: "#D4421E",
                                        transition: "background 0.3s, border-color 0.3s"
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.background = "#ff5733"; // Màu sáng hơn khi hover
                                        e.currentTarget.style.borderColor = "#ff5733";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.background = "#D4421E"; // Quay lại màu cũ
                                        e.currentTarget.style.borderColor = "#D4421E";
                                    }}
                                >
                                    <SearchOutlined /> Tìm kiếm
                                </Button>
                            </Col>
                        </Row>
                    </div>

                    {/* Bộ lọc */}
                    <div style={{ maxWidth: "1200px", width: "100%" }}>
                        <Row gutter={[12, 12]} justify="center" align="middle" style={{ width: "100%" }}>
                            {filters.map(filter => (
                                <Col flex="1" style={{ maxWidth: "270px" }} key={filter.key}>
                                    <Select
                                        placeholder={filter.placeholder}
                                        size="large"
                                        style={{ width: "100%" }}
                                        value={selectedFilters[filter.key] || undefined}
                                        onChange={value => handleFilterChange(filter.key, value)}
                                        open={openSelect[filter.key] || false}
                                        onDropdownVisibleChange={open => handleDropdownVisibleChange(filter.key, open)}
                                        suffixIcon={openSelect[filter.key] ? <UpOutlined /> : <DownOutlined />}
                                        allowClear
                                    >
                                        {filter.options.map(option => (
                                            <Option key={option} value={option}>{option}</Option>
                                        ))}
                                    </Select>
                                </Col>
                            ))}
                            {/* Nút xóa bộ lọc */}
                            <Col flex="none" >
                                <Button size="large" icon={<FilterOutlined />} onClick={resetFilters}>
                                    Xóa bộ lọc
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            <div>
                {/* Danh sách việc làm */}
                <Row gutter={[16, 16]}>
                    {displayedJobs.map(job => (
                        <Col xs={24} sm={12} md={8} lg={8} key={job.id}>
                            <Card
                                bordered={false}
                                style={{
                                    width: "100%",
                                    height: "150px",
                                    cursor: "pointer",
                                    boxShadow: hoveredCard === job.id ? "0 6px 15px rgba(0,0,0,0.3)" : "0 4px 10px rgba(0,0,0,0.2)",
                                    borderRadius: "10px",
                                    background: hoveredCard === job.id ? "#f0f8ff" : "#ffffff",
                                    transition: "all 0.3s ease",
                                    transform: hoveredCard === job.id ? "translateY(-5px)" : "translateY(-2px)",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                                onMouseEnter={() => setHoveredCard(job.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => handleCardClick(job.id)}
                            >
                                <Row gutter={16} align="middle" style={{ width: "100%" }}>
                                    {/* Hình ảnh bên trái */}
                                    <Col span={8}>
                                        <Image
                                            src={job.company_logo||'fallback_image_url.jpg'}
                                            alt={job.company_name}
                                            style={{ width: "100%", height: "100px", borderRadius: "8px", objectFit: "cover" }}
                                            preview={false}
                                        />
                                    </Col>
                                    {/* Nội dung bên phải */}
                                    <Col span={16} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                                        <h3 style={{ marginBottom: 5, fontSize: "16px", fontWeight: "bold" }}>{job.title}</h3>
                                        <p style={{ fontSize: "14px" }}><strong>Công ty:</strong> {job.company_name}</p>
                                        <p style={{ fontSize: "14px" }}><strong>Loai:</strong> {job.work_type}</p>
                                        <p style={{ fontSize: "14px" }}><strong>Lương:</strong> {job.salary_range}</p>
                                        <p style={{ fontSize: "14px" }}><EnvironmentOutlined /> {job.work_location}</p>
                                    </Col>
                                </Row>
                                    {savedJobs.some(savedJob => savedJob === job.id) ? (
                                        <HeartFilled 
                                            onClick={(e) => {
                                                e.stopPropagation(); // Ngăn chặn sự kiện click vào card
                                                handleUnsaveJob(job.id);
                                            }}
                                            style={{
                                                position: "absolute",
                                                bottom: "10px",
                                                right: "10px",
                                                fontSize: "20px",
                                                cursor: "pointer",
                                                color: "#D4421E",
                                                transition: "color 0.2s ease"
                                            }}
                                        />
                                    ) : (
                                        <HeartOutlined 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSaveJob(job.id);
                                            }}
                                            style={{
                                                position: "absolute",
                                                bottom: "10px",
                                                right: "10px",
                                                fontSize: "20px",
                                                cursor: "pointer",
                                                color: "#D4421E",
                                                transition: "color 0.2s ease"
                                            }}
                                        />
                                    )}
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Phân trang */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Pagination
                        current={currentPage}
                        total={jobs.length}
                        pageSize={pageSize}
                        onChange={setCurrentPage}
                    />
                </div>
            </div>
        </div> 
    );
};

export default Home;