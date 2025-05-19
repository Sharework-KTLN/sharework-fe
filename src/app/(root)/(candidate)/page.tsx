'use client';
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Pagination, Input, Image } from 'antd';
import { EnvironmentOutlined, SearchOutlined, FilterOutlined, DownOutlined, UpOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';
import { motion } from 'framer-motion';

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
        options: ["Remote", "Full-time", "Part-time"]
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
                const token = localStorage.getItem("userToken");

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs`, {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { Authorization: `Bearer ${token}` } : {}) // Có cũng được, không có cũng không sao
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch jobs");
                }

                const data = await response.json();
                setJobs(data);
                setFilteredJobs(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An unknown error occurred");
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            const token = localStorage.getItem("userToken");
            if (!token) {
                setError("Bạn chưa đăng nhập hoặc thiếu token");
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/favorites`, {
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

    // Hàm map giá trị filter sang dữ liệu thực tế
    const mapJobTypeFilterToData = (filterValue: string) => {
    switch (filterValue) {
        case "Remote":
        return "remote";  // Nếu có, hoặc bạn tùy chỉnh theo data bạn
        case "Full-time":
        return "full_time";
        case "Part-time":
        return "part_time";
        default:
        return filterValue.toLowerCase(); // fallback
    }
    };
    // Hàm parse chuỗi salary_range thành { min, max } (đơn vị đồng)
    const parseSalaryRange = (salaryRangeStr: string): { min: number; max: number } | null => {
        if (!salaryRangeStr) return null;
        // Tìm tất cả số trong chuỗi (vd: "8-10 triệu" => ["8", "10"])
        const numbers = salaryRangeStr.match(/\d+/g);
        if (!numbers || numbers.length === 0) return null;

        const nums = numbers.map(numStr => parseInt(numStr, 10));
        if (nums.length === 1) {
            return { min: nums[0] * 1000000, max: nums[0] * 1000000 };
        } else {
            return { min: Math.min(...nums) * 1000000, max: Math.max(...nums) * 1000000 };
        }
    };

    // Hàm kiểm tra khoảng lương job có hợp với filter không
    const checkSalaryFilter = (jobSalaryRange: { min: number; max: number } | null, filter: string) => {
        if (!jobSalaryRange) return true; // Nếu ko có dữ liệu thì mặc định đúng

        const { min, max } = jobSalaryRange;

        switch (filter) {
            case "Dưới 5 triệu":
                return max < 5000000;
            case "5-10 triệu":
                // Khoảng lương giao nhau với 5-10 triệu
                return min <= 10000000 && max >= 5000000;
            case "Trên 10 triệu":
                return min > 10000000;
            default:
                return true;
        }
    };

    useEffect(() => {
        const normalizeLocation = (location: string) => {
            return location
                .toLowerCase()
                .replace(/tp\.?\s*hcm|hcm/g, "hồ chí minh")
                .replace(/tp\.?\s*hà nội/g, "hà nội")
                .replace(/\s+/g, " ")
                .trim();
        };

        const updatedJobs = jobs.filter(job => {
            const jobSalaryRange = parseSalaryRange(job.salary_range);

            const locationFilterPassed = !selectedFilters.location ||
                normalizeLocation(job.work_location).includes(normalizeLocation(selectedFilters.location));

            const jobTypeDataValue = selectedFilters.jobType ? mapJobTypeFilterToData(selectedFilters.jobType) : null;
            return (
                locationFilterPassed &&
                (!selectedFilters.specialization || job.industry === selectedFilters.specialization) &&
                (!jobTypeDataValue || job.work_type === jobTypeDataValue) &&
                (!selectedFilters.salary || checkSalaryFilter(jobSalaryRange, selectedFilters.salary)) &&
                (searchTerm === "" ||
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.work_location.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        });

        setFilteredJobs(updatedJobs);
        setCurrentPage(1);
    }, [jobs, selectedFilters, searchTerm]);


    // // Tính toán danh sách job hiển thị dựa trên trang hiện tại
    const startIndex = (currentPage - 1) * pageSize; // Vị trí bắt đầu
    const endIndex = startIndex + pageSize; //Vị trí kết thúc
    const displayedJobs = filteredJobs.slice(startIndex, endIndex); //Lấy danh sách công việc hiển thị

    const handleCardClick = async (jobId: number) => {
        try {
            // Lấy token từ localStorage nếu có
            const token = localStorage.getItem("userToken");
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/jobs/detail/${jobId}`, {
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
            const token = localStorage.getItem("userToken");

            if (!token) {
                router.push("/auth/candidate/login");
                return;
            }

            // Gửi yêu cầu POST đến /user/savejob để lưu công việc
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/savejob/${jobId}`, {
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
            const token = localStorage.getItem("userToken");

            if (!token) {
                router.push("/auth/candidate/login");
                return;
            }

            // Gửi yêu cầu DELETE đến /user/unsavejob để xóa công việc đã lưu
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/unsavejob/${jobId}`, {
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

    const handleSearch = () => { };
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
                                    name='search'
                                    placeholder="Tìm kiếm theo các Kỹ năng, Vị trí, Công ty,..."
                                    size="large"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </Col>
                            <Col>
                                <CustomButton
                                    text="Tìm kiếm"
                                    onClick={handleSearch}
                                    backgroundColor="#D4421E"
                                    hoverColor="#ff5733"
                                    textColor="white"
                                    style={{
                                        height: '39px',
                                        borderColor: "#D4421E",
                                        transition: "background 0.3s, border-color 0.3s",
                                        alignItems: 'center',       // 👈 canh giữa theo chiều dọc
                                        justifyContent: 'center',
                                        display: 'flex',
                                        gap: '8px',
                                        padding: '0 20px',
                                        borderRadius: "8px"
                                    }}
                                >
                                    <SearchOutlined />
                                </CustomButton>
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
                                <CustomButton
                                    text="Xóa bộ lọc"
                                    onClick={resetFilters}
                                    backgroundColor="#FFFFFF"
                                    hoverColor="#E0E0E0"
                                    textColor="#333"
                                    style={{
                                        height: '40px',
                                        alignItems: 'center',       // 👈 canh giữa theo chiều dọc
                                        justifyContent: 'center',
                                        display: 'flex',
                                        gap: '8px',
                                        padding: '0 20px',
                                        borderRadius: "8px"
                                    }}
                                >
                                    <FilterOutlined />
                                </CustomButton>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            <div style={{}}>
                {/* Danh sách việc làm */}
                <Row gutter={[16, 16]}>
                    {displayedJobs.map(job => (
                        <Col xs={24} sm={12} md={8} lg={8} key={job.id}>
                            <Card
                                variant="outlined"
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
                                            src={job.company_logo || 'fallback_image_url.jpg'}
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
                <div style={{ textAlign: 'center', marginTop: '20px' ,marginBottom: '40px'}}>
                    <Pagination
                        current={currentPage}
                        total={jobs.length}
                        pageSize={pageSize}
                        onChange={setCurrentPage}
                    />
                </div>
            </div>
            <div className="w-full min-h-screen bg-gray-100 mt-1">
            {/* Hero Section - Thay thế Carousel bằng hiệu ứng chữ động */}
                <div className="relative w-full h-[450px] flex items-center justify-center bg-gray-900">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="text-5xl font-bold text-center bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 bg-clip-text text-transparent animate-gradient"
                    >
                        Khám phá công việc mơ ước của bạn ngay hôm nay<br /> nhanh chóng và dễ dàng
                    </motion.h1>
                </div>


                {/* Giới thiệu dịch vụ */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl mx-auto text-center py-16"
                >
                    <h2 className="text-3xl font-bold text-gray-800">Tìm việc dễ dàng, nhanh chóng</h2>
                    <p className="mt-4 text-gray-600">
                        Hàng ngàn công việc chất lượng đang chờ bạn ứng tuyển. Hãy để chúng tôi giúp bạn kết nối với nhà tuyển dụng phù hợp nhất.
                    </p>
                </motion.div>

                {/* Các lợi ích */}
                <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {[
                        { title: "Công việc đa dạng", desc: "Từ thực tập, part-time đến full-time tại các công ty uy tín." },
                        { title: "Cá nhân hóa đề xuất", desc: "Gợi ý việc làm dựa trên kỹ năng và sở thích của bạn." },
                        { title: "Ứng tuyển nhanh chóng", desc: "Chỉ với vài cú click, hồ sơ của bạn đến tay nhà tuyển dụng." }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }} // Nhỏ & mờ lúc đầu
                            whileInView={{ opacity: 1, scale: 1 }} // Phóng to khi vào màn hình
                            exit={{ opacity: 0, scale: 0.8 }} // Thu nhỏ khi scroll ngược
                            transition={{ duration: 0.025 }}
                            whileHover={{ scale: 1.1, y: -10 }} // 🔥 Phóng to + nâng cao lên khi hover
                            className="p-6 bg-white shadow-lg rounded-lg text-center transition"
                        >
                            <h3 className="text-xl font-bold bg-clip-text text-transparent 
                    bg-gradient-to-r from-blue-500 to-indigo-600">
                                {item.title}
                            </h3>
                            <p className="mt-2 text-gray-600">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center py-16"
                >
                    <h2 className="text-2xl font-bold text-gray-800">Tham gia cộng đồng ứng viên</h2>
                    <p className="mt-2 text-gray-600">Tạo tài khoản miễn phí và bắt đầu hành trình sự nghiệp của bạn!</p>
                    <CustomButton
                        text="Đăng ký tìm việc ngay"
                        backgroundColor="#007BFF"
                        hoverColor="#0056b3"
                        textColor="white"
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease'
                        }}
                        onClick={() => router.push('/auth/recruiter/register')}
                    />
                </motion.div>

                {/* Footer */}
                <footer className="bg-gray-900 text-white py-6 mt-10">
                    <div className="max-w-5xl mx-auto flex justify-between">
                        <div>
                            <h3 className="text-lg font-bold">ShareWork</h3>
                            <p className="text-sm text-gray-400">Nền tảng kết nối ứng viên với hàng ngàn công việc mơ ước.</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Hỗ trợ ứng viên</h3>
                            <p className="text-sm text-gray-400">Email: hotro@jobplatform.com</p>
                            <p className="text-sm text-gray-400">Hotline: 0909 123 456</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold">Mạng xã hội</h3>
                            <p className="text-sm text-gray-400">Facebook | LinkedIn | Twitter</p>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;