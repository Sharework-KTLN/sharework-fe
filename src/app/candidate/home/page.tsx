'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Pagination, Input, Image } from 'antd';
import { EnvironmentOutlined , SearchOutlined, FilterOutlined, DownOutlined, UpOutlined} from '@ant-design/icons';

const { Option } = Select;

// Dữ liệu
const jobs = [
    { id: 1, title: "Thực Tập Sinh IT Support", company: "Công ty TNHH Thương mại Dịch vụ Thương Phúc", location: "Hà Nội", specialization: "Công nghệ thông tin", jobType: "Thực tập", salary: "5 triệu", image: "https://topdev.vn/blog/wp-content/uploads/2019/04/developer.jpg" },
    { id: 2, title: "Thực Tập Sinh Graphic Design", company: "Công ty TNHH Thương mại Dịch vụ Thương Phúc", location: "Hồ Chí Minh", specialization: "Công nghệ thông tin", jobType: "Thực tập", salary: "5 triệu", image: "https://topdev.vn/blog/wp-content/uploads/2019/04/developer.jpg" },
    { id: 3, title: "Lập Trình Viên Thực Tập", company: "Công ty TNHH Thương mại Dịch vụ Thương Phúc", location: "Đà Nẵng", specialization: "Công nghệ thông tin", jobType: "Part-time", salary: "5 triệu", image: "https://topdev.vn/blog/wp-content/uploads/2019/04/developer.jpg" },
    { id: 4, title: "Thực Tập Sinh Game Unity", company: "Công ty Game Nhất Trí", location: "Đà Nẵng", specialization: "Công nghệ thông tin", jobType: "Thực tập", salary: "5 triệu", image: "https://topdev.vn/blog/wp-content/uploads/2019/04/developer.jpg" },
    { id: 5, title: "Thực Tập Sinh Kế Toán", company: "Ngân hàng TMCP Á Châu", location: "Bình Dương", specialization: "Kế toán", jobType: "Thực tập", salary: "4 triệu", image: "https://topdev.vn/blog/wp-content/uploads/2019/04/developer.jpg" },
    { id: 6, title: "Thực Tập Sinh Kinh doanh", company: "Công ty TNHH Thương mại Dịch vụ Tây Sơn", location: "Bắc Giang", specialization: "Quản trị kinh doanh", jobType: "Part-time", salary: "6 triệu", image: "https://topdev.vn/blog/wp-content/uploads/2019/04/developer.jpg" },
    { id: 7, title: "Thực Tập Sinh Sale Marketing", company: "Công ty TNHH Thương mại Dịch vụ Tây Sơn", location: "Bắc Giang", specialization: "Quản trị kinh doanh", jobType: "Full-time", salary: "5 triệu", image: "https://topdev.vn/blog/wp-content/uploads/2019/04/developer.jpg" },
    { id: 8, title: "Thực Tập Sinh Du Lịch", company: "Công ty du lịch Booking", location: "Bình Dương", specialization: "Du lịch", jobType: "Thực tập", salary: "5 triệu", image: "https://topdev.vn/blog/wp-content/uploads/2019/04/developer.jpg" },
    { id: 9, title: "Thực Tập Sinh Ngân Hàng", company: "Ngân hàng TMCP Công thương Việt Nam", location: "Hồ Chí Minh", specialization: "Kế toán", jobType: "Thực tập", salary: "5 triệu", image: "https://topdev.vn/blog/wp-content/uploads/2019/04/developer.jpg" },
    { id: 10, title: "Thực Tập Sinh Du Lịch", company: "Công ty du lịch Vietravel", location: "Hồ Chí Minh", specialization: "Du lịch", jobType: "Full-time", salary: "12 triệu", image: "https://topdev.vn/blog/wp-content/uploads/2019/04/developer.jpg" }
];

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
        options: ["Thực tập","Full-time", "Part-time", "Freelance"]
    },
    {
        key: "salary",
        placeholder: "Mức lương",
        options: ["Dưới 5 triệu", "5-10 triệu", "Trên 10 triệu"]
    }
];

const pageSize = 9; // Số lượng card hiển thị trên mỗi trang

const Page = () => {
    //Khởi tạo state nhận null hoặc kiểu dữ liệu khác
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({
        location: null,
        specialization: null,
        jobType: null,
        salary: null
    });
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1); // Theo dõi trang hiện tại
    const [filteredJobs, setFilteredJobs] = useState(jobs); // Danh sách công việc đã lọc
    const [openSelect, setOpenSelect] = useState<Record<string, boolean>>({}); // Trạng thái của Select
    const [searchTerm, setSearchTerm] = useState("");
    
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
            const jobSalary = parseInt(job.salary.replace(/\D/g, ""), 10) * 1000000; // Lấy số từ chuỗi "4 triệu" -> 4

            return (
                (!selectedFilters.location || job.location === selectedFilters.location) &&
                (!selectedFilters.specialization || job.specialization === selectedFilters.specialization) &&
                (!selectedFilters.jobType || job.jobType === selectedFilters.jobType) &&
                (!selectedFilters.salary || checkSalaryFilter(jobSalary, selectedFilters.salary)) &&
                (searchTerm === "" ||
                    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    job.company.toLowerCase().includes(searchTerm.toLowerCase())||
                    job.location.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        });

        setFilteredJobs(updatedJobs);
        setCurrentPage(1);
    }, [selectedFilters, searchTerm]);

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

    // Tính toán danh sách job hiển thị dựa trên trang hiện tại
    const startIndex = (currentPage - 1) * pageSize; // Vị trí bắt đầu
    const endIndex = startIndex + pageSize; //Vị trí kết thúc
    const displayedJobs = filteredJobs.slice(startIndex, endIndex); //Lấy danh sách công việc hiển thị

    return (
        <div style={{ width: "100%", overflow: "hidden"}}>
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
                <div style={{ maxWidth: "900px", width: "100%", textAlign: "left", marginBottom:"10px", marginLeft: "140px"}}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', }}>
                        Tìm kiếm <span style={{ background: '#D4421E', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>Việc làm</span>
                    </h2>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%"}}>
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
                                            height:"39px",
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
                            >
                                <Row gutter={16} align="middle" style={{ width: "100%" }}>
                                    {/* Hình ảnh bên trái */}
                                    <Col span={8}>
                                        <Image 
                                            src={job.image} 
                                            alt={job.title} 
                                            style={{ width: "100%", height: "100px", borderRadius: "8px", objectFit: "cover" }} 
                                        />
                                    </Col>
                                    {/* Nội dung bên phải */}
                                    <Col span={16}>
                                        <h3 style={{ marginBottom: 5, fontSize: "16px", fontWeight:"bold" }}>{job.title}</h3>
                                        <p style={{ fontSize: "14px" }}><strong>Công ty:</strong> {job.company}</p>
                                        <p style={{ fontSize: "14px" }}><strong>Loai:</strong> {job.jobType}</p>
                                        <p style={{ fontSize: "14px" }}><strong>Lương:</strong> {job.salary}</p>
                                        <p style={{ fontSize: "14px" }}><EnvironmentOutlined /> {job.location}</p>
                                    </Col>
                                </Row>
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

export default Page;