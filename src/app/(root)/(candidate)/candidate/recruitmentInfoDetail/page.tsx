'use client';
import { Card, Button ,Typography, Tag , Image} from "antd";
import { EnvironmentOutlined, MoneyCollectOutlined, ClockCircleOutlined , LaptopOutlined,
    SolutionOutlined , CalendarOutlined , HourglassOutlined, SendOutlined , HeartOutlined, HeartFilled, 
    ExportOutlined, RiseOutlined, TeamOutlined} from "@ant-design/icons";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const { Title, Text } = Typography;

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
    specialize: string; // Lĩnh vực cần tuyển
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

const iconStyle = {
    backgroundColor: "#52c41a", // Màu nền cho icon
    borderRadius: "50%", // Tạo hình tròn
    padding: "8px", // Khoảng cách bên trong vòng tròn
    display: "flex", // Đảm bảo icon nằm giữa vòng tròn
    alignItems: "center", 
    justifyContent: "center",
    fontSize: "19px",
    marginRight: "8px"
};

const info1Style = {
    color:"gray",
    fontSize:"13px"
};

const info2Style = {
    fontWeight:"bold",
    fontSize:"13px"
};

const RecruitmentInfoDetail = () =>{
    const searchParams = useSearchParams(); // Use this to get search params
    const id = searchParams.get('id');
    const [jobDetails, setJobDetails] = useState<Job | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [savedJobs, setSavedJobs] = useState<number[]>([]);
    const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

    useEffect(() => {
        const fetchJobDetails = async () => {
            if (!id) return; // Chờ cho đến khi id có sẵn

            try {
                const response = await fetch(`http://localhost:8080/jobs/detail/${id}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch job details");
                }
                const data = await response.json();
                setJobDetails(data); // Lưu thông tin chi tiết công việc vào state
            } catch (error) {
                console.error("Error fetching job details:", error);
                setError("Unable to load job details.");
            }
        };

        fetchJobDetails();
    }, [id]); // Gọi lại khi id thay đổi

    const descriptionSentences = jobDetails?.description.split('.').filter(Boolean) || [];
    const work_ScheduleSentences = jobDetails?.work_schedule.split('.').filter(Boolean) || [];
    const required_SkillsSentences = jobDetails?.required_skills.split('.').filter(Boolean) || [];
    const benefitsSentences = jobDetails?.benefits.split(/(?<!\d)\.(?!\d)/).map(s => s.trim()).filter(Boolean) || [];
    const candidate_requiredSentences = jobDetails?.candidate_required.split('.').filter(Boolean) || [];

    const calculateDaysRemaining = (endDate: string) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
      
        const end = new Date(endDate);
        end.setHours(0, 0, 0, 0);
      
        const timeDifference = end.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
      
        if (daysRemaining < 0) {
          return "Đã hết hạn nộp hồ sơ";
        }
      
        return `Còn ${daysRemaining} ngày đến hạn nộp hồ sơ`;
    };
    // Effect để lấy công việc đã lưu
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
                    // Bỏ qua lỗi này để không ảnh hưởng đến giao diện chi tiết công việc
                    return;
                }
                const data = await res.json();
                setSavedJobs(data.savedJobs.map((item: SavedJob) => item.id)); // Lấy id của các công việc đã lưu
            } catch (err) {
                // Không làm gì cả, không log hay thông báo lỗi
            }
        };
        fetchSavedJobs();
    }, []); // Chạy lần đầu khi component mount
    
    // Phần còn lại của bạn vẫn giữ nguyên, chẳng hạn khi không có công việc chi tiết:
    if (error) {
        return <div>{error}</div>;
    }
    
    if (!jobDetails) {
        return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
    }
    
    const handleSaveJob = async (jobId: number) => {
        try {
            const token = localStorage.getItem("token");
    
            if (!token) {
                throw new Error("Bạn chưa đăng nhập hoặc thiếu token");
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
        const token = localStorage.getItem("token");
        if (!token) {
            setError("Bạn chưa đăng nhập hoặc thiếu token");
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
                throw new Error("Không thể hủy lưu công việc");
            }
    
            // Cập nhật lại savedJobs sau khi hủy lưu công việc thành công
            setSavedJobs((prev) => prev.filter(id => id !== jobId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Lỗi không xác định khi hủy lưu công việc");
        }
    };
    return (
        <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
            {/* Job Details Section */}
            <div className="w-full lg:w-3/4">
                <Card className="shadow-md">
                    <Title level={3}>{jobDetails.title}</Title>
                    <div className="flex gap-2 items-center mb-3">
                        <Tag icon={<MoneyCollectOutlined />} color="green">{jobDetails.salary_range}</Tag>
                        <Tag icon={<EnvironmentOutlined />} color="blue">{jobDetails.work_location}</Tag>
                        <Tag icon={<HourglassOutlined/>} color="orange">{jobDetails.experience_required}</Tag>
                        <Tag icon={<ClockCircleOutlined/>} color="default">{calculateDaysRemaining(jobDetails.deadline)}</Tag>
                    </div>
                    <Button 
                        type="primary" className="mb-4" 
                        style={{
                            background: appliedJobs.includes(jobDetails.title) ? "#4CAF50" : "#D4421E",
                            fontWeight:"500",
                            marginRight:"10px"
                        }}
                        icon={<SendOutlined/>}
                        // onClick={handleApplyJob}
                    >
                        {appliedJobs.includes(jobDetails.title) ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
                    </Button>

                    <Button 
                        type="primary" 
                        className="mb-4" 
                        ghost
                        style={{
                            color: "#D4421E", 
                            borderColor: "#D4421E", 
                            fontWeight: "500"
                        }}
                        onClick={() => 
                            savedJobs.includes(jobDetails.id) ? handleUnsaveJob(jobDetails.id) : handleSaveJob(jobDetails.id)
                        }
                        icon={savedJobs.includes(jobDetails.id) ? <HeartFilled style={{ color: "#D4421E" }} /> : <HeartOutlined />}
                    >
                        {savedJobs.includes(jobDetails.id) ? "Đã lưu" : "Lưu tin"}
                    </Button>
                    
                    <Title level={4}>Mô tả công việc</Title>
                    <div style={{marginTop:"-7px", marginBottom:"7px"}}>
                        <ul className="list-disc pl-5">
                            {descriptionSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                        </ul>
                    </div>

                    <Title level={4}>Yêu cầu ứng viên</Title>
                    <div style={{marginTop:"-7px", marginBottom:"7px"}}>
                        <ul className="list-disc pl-5">
                            {required_SkillsSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                            {candidate_requiredSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                        </ul>
                    </div>

                    <Title level={4}>Thời gian làm việc</Title>
                    <div style={{marginTop:"-7px", marginBottom:"7px"}}>
                        <ul className="list-disc pl-5">
                            {work_ScheduleSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                        </ul>
                    </div>

                    <Title level={4}>Quyền lợi</Title>
                    <div style={{marginTop:"-7px", marginBottom:"7px"}}>
                        <ul className="list-disc pl-5">
                            {benefitsSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                        </ul>
                    </div>

                    <Title level={4}>Cách thức ứng tuyển</Title>
                    <div style={{marginTop:"-7px", marginBottom:"7px"}}>
                        <ul className="list-disc pl-5">
                            <li>Gửi CV qua trang đăng tuyển</li>
                            <li>Hoặc gửi email cho công ty</li>
                        </ul>
                    </div>
                </Card>
            </div>
            
            {/* Company Section */}
            <div className="w-full lg:w-1/4">
                <div>
                    <Card className="shadow-md p-4">
                        <Title level={4}>Công ty</Title>
                        {/* Chia cột chứa hình ảnh và thông tin */}
                        <div className="flex items-center gap-4">
                        {/* Ảnh công ty */}
                        <div className="w-16 h-16">
                            <Image 
                                src={jobDetails.company_logo}
                                alt={jobDetails.company_name}
                                width={64}
                                height={64}
                                className="rounded-md object-cover"
                            />
                        </div>

                        {/* Thông tin công ty */}
                        <div>
                            <Text strong>{jobDetails.company_name}</Text>
                            <br />
                            <Text>Lĩnh vực: {jobDetails.specialize}</Text>
                            <br/>
                            <Text>Địa điểm: {jobDetails.work_location}</Text>
                        </div>
                        </div>
                        <Button 
                            type="link" 
                            className="mt-3" 
                            style={{ color: "#D4421E", fontWeight: "500" }}
                        >
                            Xem trang chi tiết <ExportOutlined />
                        </Button>
                    </Card>
                </div>
                <div style={{marginTop:"10px"}}>
                    <Card className="shadow-md p-4">
                        <Title level={4}>Thông tin chung</Title>
                        {/* Chia cột chứa hình ảnh và thông tin */}
                        <div className="flex flex-col gap-4"> {/* Thêm flex-col để sắp xếp theo cột */}
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    <RiseOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Cấp bậc</span>
                                    <span className="block" style={info2Style}>{jobDetails.work_level}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    <SolutionOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Học vấn</span>
                                    <span className="block" style={info2Style}>{jobDetails.educational_level}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    <TeamOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Số lượng tuyển</span>
                                    <span className="block" style={info2Style}>{jobDetails.vacancies} người</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    < LaptopOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2"> {/* Sử dụng flex-col cho 2 span xuống dòng */}
                                    <span className="block" style={info1Style}>Hình thức làm việc</span>
                                    <span className="block" style={info2Style}>{jobDetails.work_type}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    <CalendarOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Hạn nộp hồ sơ</span>
                                    <span className="block" style={info2Style}>
                                        {jobDetails.deadline?.split('T')[0].split('-').reverse().join('/')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default RecruitmentInfoDetail;