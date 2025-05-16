'use client';

import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Button, Pagination, Input, Image } from 'antd';
import { EnvironmentOutlined, SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import CustomButton from '@/components/CustomButton';

interface Company {
    id: number;
    name: string; // Tên công ty
    address: string; // Địa chỉ công ty
    phone: string; // Số điện thoại công ty
    email: string; // Email công ty
    logo: string; // Logo công ty
    specialize: string; // Lĩnh vực chuyên môn
    image_company: string; // Hình ảnh công ty
    link?: string; // Link trang web công ty (có thể undefined)
    location: string; // Địa chỉ làm việc
    job_count: number; // Số lượng công việc tuyển dụng
    description: string; // Mô tả công ty
    recruiter_name: string; // Tên người tuyển dụng
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
        options: ["Công nghệ thông tin", "Quản trị kinh doanh", "Du lịch", "Kế toán", "Trí tuệ nhân tạo", "Dịch vụ doanh nghiệp", "Thương mại", "Dịch vụ", "Game", "Cloud"]
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
    const [companies, setCompanies] = useState<Company[]>([]); // Chỉ định kiểu cho jobs
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state có kiểu string hoặc null
    const [filteredCompanies, setFilteredCompanies] = useState(companies); // Danh sách công việc đã lọc
    const [openSelect, setOpenSelect] = useState<Record<string, boolean>>({}); // Trạng thái của Select
    const [searchTerm, setSearchTerm] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                // Đảm bảo URL này trỏ đến backend của bạn chạy trên port 8080
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies`);
                if (!response.ok) {
                    throw new Error("Failed to fetch companies");
                }
                const data = await response.json();
                setCompanies(data);
                setFilteredCompanies(data);
            }
            catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);
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
        const updatedCompanies = companies.filter(company => {
            const matchLocation =
                !selectedFilters.location || company.location.toLowerCase() === selectedFilters.location.toLowerCase();
            const matchSpecialization =
                !selectedFilters.specialization || company.specialize.toLowerCase().includes(selectedFilters.specialization.toLowerCase());

            const matchSearch =
                searchTerm === "" ||
                company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                company.specialize.toLowerCase().includes(searchTerm.toLowerCase()); // 🔥 Mở rộng tìm kiếm

            return matchLocation && matchSpecialization && matchSearch;
        });

        setFilteredCompanies(updatedCompanies);
        setCurrentPage(1);
    }, [companies, selectedFilters, searchTerm]);

    // Tính toán danh sách job hiển thị dựa trên trang hiện tại
    const startIndex = (currentPage - 1) * pageSize; // Vị trí bắt đầu
    const endIndex = startIndex + pageSize; //Vị trí kết thúc
    const displayedCompanies = filteredCompanies.slice(startIndex, endIndex); //Lấy danh sách công việc hiển thị

    const handleCardClick = async (company: Company) => {
        try {
            // Gọi API để lấy thông tin chi tiết của công ty
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${company.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch company detailssssss");
            }
            const companyDetails = await response.json();

            // Sau khi lấy thông tin chi tiết công ty, điều hướng đến trang chi tiết công ty
            router.push(`/candidate/infoBusinessDetail?id=${company.id}`);
        } catch (error) {
            console.error("Error fetching company details:", error);
            setError("Unable to load company details.");
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
                <div style={{ maxWidth: "900px", width: "100%", textAlign: "left", marginLeft: "155px" }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>
                        Tìm kiếm <span style={{ background: '#D4421E', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>Công ty</span>
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
                            <CustomButton
                                text="Tìm kiếm"
                                onClick={() => { }}
                                backgroundColor="#D4421E"
                                hoverColor="#ff5733"
                                textColor="white"
                                style={{
                                    height: '39px',
                                    borderColor: "#D4421E",
                                    transition: "background 0.3s, border-color 0.3s",
                                    alignItems: 'center',
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


            </div>

            <div style={{ width: "100%", overflow: "hidden" }}>
                {/* Danh sách việc làm */}
                <Row gutter={[24, 24]}>
                    {displayedCompanies.map(companies => (
                        <Col xs={24} sm={12} md={8} key={companies.id}>
                            <Card hoverable
                                style={{
                                    borderRadius: "10px",
                                    overflow: "hidden",
                                    height: "100%",
                                    display: 'flex',
                                    flexDirection: "column",
                                    boxShadow: hoveredCard === companies.id ? "0 6px 15px rgba(0,0,0,0.3)" : "0 4px 10px rgba(0,0,0,0.2)",
                                    background: hoveredCard === companies.id ? "#f0f8ff" : "#ffffff",
                                    transition: "all 0.3s ease",
                                    transform: hoveredCard === companies.id ? "translateY(-5px)" : "translateY(-2px)",
                                }}
                                onMouseEnter={() => setHoveredCard(companies.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                onClick={() => handleCardClick(companies)}
                            >
                                <div style={{ position: "relative", height: "140px", overflow: "hidden" }}>
                                    <Image
                                        src={companies.image_company}
                                        alt={companies.name}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        preview={false}
                                    />
                                    <div style={{ position: "absolute", bottom: "-10px", left: "10px", background: "#fff", padding: "5px", borderRadius: "5px" }}>
                                        <Image
                                            src={companies.logo}
                                            alt={companies.name}
                                            style={{ width: "60px", height: "60px", borderRadius: "5px" }}
                                            preview={false}
                                        />
                                    </div>
                                </div>
                                <div style={{ padding: "15px", paddingTop: "25px" }}>
                                    <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>{companies.name}</h3>
                                    <p style={{ fontSize: "14px", color: "#666" }}><EnvironmentOutlined /> {companies.location}</p>
                                    <p style={{ fontSize: "14px", color: "#666" }}>{companies.specialize}</p>
                                    <p style={{ fontSize: "14px", fontWeight: "bold", color: "#D4421E" }}>{companies.job_count} Job →</p>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Phân trang */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Pagination
                        current={currentPage}
                        total={companies.length}
                        pageSize={pageSize}
                        onChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};

export default InfoBusiness;