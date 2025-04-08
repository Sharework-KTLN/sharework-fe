'use client';
import { Card, Button ,Typography, Tag , Image} from "antd";
import { EnvironmentOutlined, MoneyCollectOutlined, ClockCircleOutlined , LaptopOutlined,
    SolutionOutlined , CalendarOutlined , HourglassOutlined, SendOutlined , HeartOutlined, HeartFilled, 
    ExportOutlined} from "@ant-design/icons";
import { useEffect, useState } from 'react';

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
    industry: string; // Lĩnh vực cần tuyển
    salary_type: string; // Hình thức lương (net/gross, theo giờ/tháng, v.v.)
    deadline: string; // Hạn bài đăng
    work_type: string; // Hình thức làm việc (toàn thời gian, bán thời gian, remote, v.v.)
    work_schedule: string; // Thời gian làm việc
    vacancies: number; // Số lượng tuyển dụng
    benefits: string; // Phúc lợi công việc
    company_name: string; // Tên công ty
    company_logo: string;
    recruiter: string; // Tên người tuyển dụng
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
    const [job, setJob] = useState<Job | null >(null);
    const [savedJob, setSavedJob] = useState(false);
    const [appliedJobs, setAppliedJobs] = useState<string[]>([]);

    useEffect(() => {
        // Lấy dữ liệu từ sessionStorage
        const storedJob = sessionStorage.getItem('selectedJob');
        if (storedJob) {
            const jobData = JSON.parse(storedJob);
            setJob(jobData); 
    
            // Kiểm tra nếu công việc này đã được lưu
            const savedJobs = JSON.parse(sessionStorage.getItem('savedJobs') || '[]');
            const isSaved = savedJobs.some((savedJob: Job) => savedJob.title === jobData.title);
            setSavedJob(isSaved);
        }
    }, []);

    useEffect(() => {
        // Lấy danh sách công việc đã ứng tuyển từ sessionStorage
        const storedAppliedJobs = JSON.parse(sessionStorage.getItem('appliedJobs') || '[]');
        setAppliedJobs(storedAppliedJobs);
    }, []);

    // Kiểm tra nếu chưa có job, hiển thị thông báo hoặc placeholder
    if (!job) {
        return <div>Đang tải dữ liệu...</div>;
    };

    const descriptionSentences = job.description.split('.').filter(Boolean);
    const work_ScheduleSentences = job.work_schedule.split('.').filter(Boolean);
    const required_SkillsSentences = job.required_skills.split('.').filter(Boolean);

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

    // Lưu công việc vào sessionStorage
    const handleSaveJob = () => {
        if (!job) return;
    
        let savedJobs = JSON.parse(sessionStorage.getItem('savedJobs') || '[]');

        if (savedJob) {
            // Nếu công việc đã được lưu, xóa nó khỏi danh sách
            savedJobs = savedJobs.filter((savedJob: Job) => savedJob.title !== job.title);
        } else {
            // Nếu chưa lưu, thêm công việc vào danh sách với thời gian hiện tại
            const savedJobData = { ...job, savedAt: new Date().toISOString() };
            savedJobs.push(savedJobData);
        }

        sessionStorage.setItem('savedJobs', JSON.stringify(savedJobs));
        setSavedJob(!savedJob); // Cập nhật UI
    };

    const handleApplyJob = () => {
        if (!job) return;

        let appliedJobsList = JSON.parse(sessionStorage.getItem('appliedJobs') || '[]');

        if (appliedJobs.includes(job.title)) {
            // Nếu đã ứng tuyển, xóa công việc khỏi danh sách
            appliedJobsList = appliedJobsList.filter((appliedJob: Job) => appliedJob.title !== job.title);
        } else {
            // Nếu chưa ứng tuyển, thêm công việc vào danh sách
            const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại
            appliedJobsList.push({ ...job, appliedAt: today });
        }

        sessionStorage.setItem('appliedJobs', JSON.stringify(appliedJobsList));
        setAppliedJobs(appliedJobsList.map((appliedJob: Job) => appliedJob.title)); // Cập nhật UI
    };

    return (
        <div className="container mx-auto p-4 flex flex-col lg:flex-row gap-4">
            {/* Job Details Section */}
            <div className="w-full lg:w-3/4">
                <Card className="shadow-md">
                    <Title level={3}>{job.title}</Title>
                    <div className="flex gap-2 items-center mb-3">
                        <Tag icon={<MoneyCollectOutlined />} color="green">{job.salary_range}</Tag>
                        <Tag icon={<EnvironmentOutlined />} color="blue">{job.work_location}</Tag>
                        <Tag icon={<HourglassOutlined/>} color="orange">{job.experience_required}</Tag>
                        <Tag icon={<ClockCircleOutlined/>} color="default">{calculateDaysRemaining(job.deadline)}</Tag>
                    </div>
                    <Button 
                        type="primary" className="mb-4" 
                        style={{
                            background: appliedJobs.includes(job.title) ? "#4CAF50" : "#D4421E",
                            fontWeight:"500",
                            marginRight:"10px"
                        }}
                        icon={<SendOutlined/>}
                        onClick={handleApplyJob}
                    >
                        {appliedJobs.includes(job.title) ? "Đã ứng tuyển" : "Ứng tuyển ngay"}
                    </Button>

                    <Button 
                        type="primary" className="mb-4" ghost
                        style={{
                            color: savedJob ? "#D4421E" : "#D4421E", 
                            borderColor: "#D4421E", 
                            fontWeight: "500"
                        }}
                        onClick={handleSaveJob}
                        icon={savedJob ? <HeartFilled style={{ color: "#D4421E" }} /> : <HeartOutlined />} // Đổi icon
                    >
                            {savedJob ? "Đã lưu" : "Lưu tin"} 
                    </Button>
                    
                    <Title level={4}>Thông tin chi tiết</Title>
                    <div style={{marginTop:"-7px", marginBottom:"7px"}}>
                        <ul className="list-disc pl-5">
                            {descriptionSentences.map((sentence, index) => (
                                <li key={index}>{sentence.trim()}.</li>
                            ))}
                            {required_SkillsSentences.map((sentence, index) => (
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
                                src={job.company_logo}
                                alt={job.company_name}
                                width={64}
                                height={64}
                                className="rounded-md object-cover"
                            />
                        </div>

                        {/* Thông tin công ty */}
                        <div>
                            <Text strong>{job.company_name}</Text>
                            <br />
                            <Text>Lĩnh vực: {job.industry}</Text>
                            <br/>
                            <Text>Địa điểm: {job.work_location}</Text>
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
                                    <SolutionOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Học vấn</span>
                                    <span className="block" style={info2Style}>Đại học trở lên</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    < LaptopOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2"> {/* Sử dụng flex-col cho 2 span xuống dòng */}
                                    <span className="block" style={info1Style}>Hình thức làm việc</span>
                                    <span className="block" style={info2Style}>{job.work_type}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div style={{ ...iconStyle, backgroundColor: "#faad14" }}>
                                    <CalendarOutlined style={{ color: "white" }} />
                                </div>
                                <div className="flex flex-col ml-2">
                                    <span className="block" style={info1Style}>Hạn nộp hồ sơ</span>
                                    <span className="block" style={info2Style}>{job.deadline}</span>
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