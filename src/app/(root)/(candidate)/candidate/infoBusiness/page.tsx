'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Pagination, Input, Image } from 'antd';
import { EnvironmentOutlined , SearchOutlined, DownOutlined, UpOutlined} from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Option } = Select;
interface Job {
    id: number;
    image: string;
    logo: string;
    company: string; // Nếu API trả về 'company', thì giữ nguyên
    description: string;
    link?: string; // Có thể undefined
    location: string;
    locationDetail: string;
    specialization: string;
    jobCount: number;
    title?: string; // Nếu thực sự có 'title'
}
// Dữ liệu
const jobs = [
    {
        id: 1,
        image: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-hop-tac-thanh-cong-inkythuatso-07-10-42-07.jpg", // Ảnh nền công ty
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA", // Logo công ty
        company: "CÔNG TY CỔ PHẦN CÔNG NGHỆ",
        description: "All Your Applications In One Place",
        link: "https://iuh.edu.vn/",
        location: "Hồ Chí Minh",
        locationDetail:"12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, Hồ Chí Minh",
        specialization: "Dịch vụ doanh nghiệp, B2B Solutions",
        jobCount: 1
    },
    {
        id: 2,
        image: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-hop-tac-thanh-cong-inkythuatso-07-10-42-07.jpg",
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA",
        company: "CÔNG TY TNHH PHẦN MỀM ABC",
        description: "Innovative Tech Solutions",
        link: "https://www.haui.edu.vn/vn",
        location: "Hà Nội",
        locationDetail: "Số 298 Đ. Cầu Diễn, Minh Khai, Bắc Từ Liêm, Hà Nội",
        specialization: "Phần mềm, Công nghệ thông tin",
        jobCount: 3
    },
    {
        id: 3,
        image: "https://dplusvn.com/wp-content/uploads/2020/02/hinh-anh-van-phong-cong-ty-zola.jpg",
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA",
        company: "TECH STARTUP XYZ",
        description: "Future of AI & ML",
        link: "https://www.udn.vn/",
        location: "Đà Nẵng",
        locationDetail: "41 Đ. Lê Duẩn, Hải Châu 1, Hải Châu, Đà Nẵng 550000",
        specialization: "Trí tuệ nhân tạo, Machine Learning",
        jobCount: 2
    },
    {
        id: 4,
        image: "https://dplusvn.com/wp-content/uploads/2020/02/hinh-anh-van-phong-cong-ty-zola.jpg",
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA",
        company: "Công ty du lịch Vietravel",
        description: "Đưa bạn đi đến mọi nơi",
        location: "Hồ Chí Minh",
        locationDetail:"12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, Hồ Chí Minh",
        specialization: "Du lịch",
        jobCount: 4
    },
    {
        id: 5,
        image: "https://dplusvn.com/wp-content/uploads/2020/02/hinh-anh-van-phong-cong-ty-zola.jpg",
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA",
        company: "Công ty du lịch Vietravel",
        description: "Đưa bạn đi đến mọi nơi",
        location: "Hồ Chí Minh",
        locationDetail:"12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, Hồ Chí Minh",
        specialization: "Kế toán, Du lịch",
        jobCount: 3
    },
    {
        id: 6,
        image: "https://inkythuatso.com/uploads/thumbnails/800/2023/03/1-hinh-anh-hop-tac-thanh-cong-inkythuatso-07-10-42-07.jpg",
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA",
        company: "Công ty TNHH Thương mại Dịch vụ Tây Sơn",
        description: "Niềm vui của mọi người",
        location: "Bắc Giang",
        locationDetail: "TT. Bích Động, Việt Yên, Bắc Giang",
        specialization: "Quản trị kinh doanh, Công nghệ thông tin",
        jobCount: 4
    },
    {
        id: 7,
        image: "https://dplusvn.com/wp-content/uploads/2020/02/hinh-anh-van-phong-cong-ty-zola.jpg",
        logo: "https://i1-vnexpress.vnecdn.net/2021/02/27/New-Peugeot-Logo-4-7702-1614396937.jpg?w=0&h=0&q=100&dpr=1&fit=crop&s=Pgb1HJVgd6Z1XU1K8OUQXA",
        company: "Ngân hàng TMCP Công thương Việt Nam",
        description: "Niềm tin của mọi nhà",
        location: "Hồ Chí Minh",
        locationDetail:"12 Nguyễn Văn Bảo, Phường 1, Gò Vấp, Hồ Chí Minh",
        specialization: "Kế toán",
        jobCount: 3
    }
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
        options: ["Công nghệ thông tin", "Quản trị kinh doanh", "Du lịch", "Kế toán", "Trí tuệ nhân tạo", "Dịch vụ doanh nghiệp"]
    },
];

const pageSize = 6; // Số lượng card hiển thị trên mỗi trang

const InfoBusiness = () => {
    //Khởi tạo state nhận null hoặc kiểu dữ liệu khác
    const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: string | null }>({
        location: null,
        specialization: null,
    });
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1); // Theo dõi trang hiện tại
    const [filteredJobs, setFilteredJobs] = useState(jobs); // Danh sách công việc đã lọc
    const [openSelect, setOpenSelect] = useState<Record<string, boolean>>({}); // Trạng thái của Select
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter(); 
    
    // Hàm cập nhật trạng thái mở/đóng Select
    const handleDropdownVisibleChange = (key: string, open: boolean) => {
        setOpenSelect(prev => ({ ...prev, [key]: open }));
    };

    // Xử lý thay đổi bộ lọc
    const handleFilterChange = (key: string, value: string | null) => {
        setSelectedFilters(prev => ({ ...prev, [key]: value }));
    };

    
    // Hàm lọc dữ liệu dựa trên bộ lọc và tìm kiếm
    useEffect(() => {
        const updatedJobs = jobs.filter(job => {
            const matchLocation =
                !selectedFilters.location || job.location.toLowerCase() === selectedFilters.location.toLowerCase();
            const matchSpecialization =
                !selectedFilters.specialization || job.specialization.toLowerCase().includes(selectedFilters.specialization.toLowerCase());
    
            const matchSearch =
                searchTerm === "" ||
                job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.specialization.toLowerCase().includes(searchTerm.toLowerCase()); // 🔥 Mở rộng tìm kiếm
    
            return matchLocation && matchSpecialization && matchSearch;
        });
    
        setFilteredJobs(updatedJobs);
        setCurrentPage(1);
    }, [selectedFilters, searchTerm]);

    // Tính toán danh sách job hiển thị dựa trên trang hiện tại
    const startIndex = (currentPage - 1) * pageSize; // Vị trí bắt đầu
    const endIndex = startIndex + pageSize; //Vị trí kết thúc
    const displayedJobs = filteredJobs.slice(startIndex, endIndex); //Lấy danh sách công việc hiển thị

    const handleCardClick = (job: Job) => {
        sessionStorage.setItem("infoBusinessDetail", JSON.stringify(job));
        router.push(`/candidate/infoBusinessDetail?id=${job.id}`); // Chuyển đến trang chi tiết
    };

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
                <div style={{ maxWidth: "900px", width: "100%", textAlign: "left", marginLeft: "155px"}}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold'}}>
                        Tìm kiếm <span style={{ background: '#D4421E', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>Việc làm</span>
                    </h2>
                </div>
                
                <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "10px" }}>
                    <Row
                        gutter={[12, 12]}
                        justify="center"
                        align="middle"
                        style={{ width: "100%", maxWidth: "1200px" }}
                    >
                        {/* Bộ lọc */}
                        {filters.map((filter) => (
                            <Col flex="auto" style={{ minWidth: "200px", maxWidth: "250px" }} key={filter.key}>
                                <Select
                                    placeholder={filter.placeholder}
                                    size="large"
                                    style={{ width: "100%" }}
                                    value={selectedFilters[filter.key] || undefined}
                                    onChange={(value) => handleFilterChange(filter.key, value)}
                                    open={openSelect[filter.key] || false}
                                    onDropdownVisibleChange={(open) => handleDropdownVisibleChange(filter.key, open)}
                                    suffixIcon={openSelect[filter.key] ? <UpOutlined /> : <DownOutlined />}
                                    allowClear
                                >
                                    {filter.options.map((option) => (
                                        <Option key={option} value={option}>
                                            {option}
                                        </Option>
                                    ))}
                                </Select>
                            </Col>
                        ))}

                        {/* Ô tìm kiếm */}
                        <Col flex="auto" style={{ minWidth: "250px" }}>
                            <Input
                                placeholder="Tìm kiếm theo các Vị trí, Chuyên môn, Công ty,..."
                                size="large"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </Col>

                        {/* Nút tìm kiếm */}
                        <Col flex="none">
                            <Button
                                type="primary"
                                size="large"
                                style={{
                                    height: "38px",
                                    background: "#D4421E",
                                    borderColor: "#D4421E",
                                    transition: "background 0.3s, border-color 0.3s",
                                    whiteSpace: "nowrap", // Đảm bảo nút không bị cắt chữ
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#ff5733";
                                    e.currentTarget.style.borderColor = "#ff5733";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#D4421E";
                                    e.currentTarget.style.borderColor = "#D4421E";
                                }}    
                            >
                                <SearchOutlined /> Tìm kiếm
                            </Button>
                        </Col>
                    </Row>
                </div>


            </div>
            
            <div style={{ width: "100%", overflow: "hidden" }}>
            {/* Danh sách việc làm */}
            <Row gutter={[24, 24]}>
                {displayedJobs.map(job => (
                    <Col xs={24} sm={12} md={8} key={job.id}>
                        <Card hoverable 
                            style={{ 
                                borderRadius: "10px",
                                overflow: "hidden",
                                height: "100%",
                                display: 'flex',
                                flexDirection: "column",
                                boxShadow: hoveredCard === job.id ? "0 6px 15px rgba(0,0,0,0.3)" : "0 4px 10px rgba(0,0,0,0.2)",
                                background: hoveredCard === job.id ? "#f0f8ff" : "#ffffff",
                                transition: "all 0.3s ease",
                                transform: hoveredCard === job.id ? "translateY(-5px)" : "translateY(-2px)", 
                            }}
                            onMouseEnter={() => setHoveredCard(job.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={()=>handleCardClick(job)}
                            >
                            <div style={{ position: "relative", height: "140px" ,overflow: "hidden" }}>
                                <Image 
                                    src={job.image}
                                    alt={job.company} 
                                    style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                                />
                                <div style={{ position: "absolute", bottom: "-10px", left: "10px", background: "#fff", padding: "5px", borderRadius: "5px" }}>
                                    <Image 
                                        src={job.logo} 
                                        alt={job.company} 
                                        style={{ width: "60px", height: "60px", borderRadius: "5px" }} 
                                    />
                                </div>
                            </div>
                            <div style={{ padding: "15px", paddingTop: "25px" }}>
                                <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>{job.company}</h3>
                                <p style={{ fontSize: "14px", color: "#666" }}><EnvironmentOutlined /> {job.location}</p>
                                <p style={{ fontSize: "14px", color: "#666" }}>{job.specialization}</p>
                                <p style={{ fontSize: "14px", fontWeight: "bold", color: "#D4421E" }}>{job.jobCount} Job →</p>
                            </div>
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

export default InfoBusiness;