"use client";

import { useSearchParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Card, Image, Typography, Row, Col, Input, Button, Space, Divider, Tooltip} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  FacebookOutlined,
  HomeOutlined,
  CalendarOutlined,
  PlusOutlined,
  DeleteOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  DragOutlined,
  PictureOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
interface CV {
    id: number;
    name: string;
    image?: string;  // Ảnh là tùy chọn, có thể không có
    positionApply?: string;
    createdAt?: string;
}
const CV = () => {
    const searchParams = useSearchParams();
    const cvId = searchParams.get('cvId'); // Lấy cvId từ query parameters
    const [cv, setCv] = useState<CV[]>([]);
    const [hovered, setHovered] = useState(false);
    const [image, setImage] = useState<string>("https://via.placeholder.com/100");
    const [name, setName] = useState("");
    const [positionApply, setpositionApply] = useState("");
    const [skillName, setSkillName] = useState("");
    const [skillDesc, setSkillDesc] = useState("");
    const [hobbiesDesc, setHobbiesDesc] = useState("");
    const [careerGoalsDesc, setCareerGoalsDesc] = useState("");
    const [universityName, setUniversityName] = useState("");
    const [startStudy, setStartStudy] = useState("");
    const [endStudy, setEndStudy] = useState("");
    const [subjectName, setSubjectName] = useState("");
    const [learningProcess, setLearningProcess] = useState("");
    const [positionName, setpositionName] = useState("");
    const [businessName, setbusinessName] = useState("");
    const [startWork, setStartWork] = useState("");
    const [endWork, setEndWork] = useState("");
    const [workingProcess, setWorkingProcess] = useState("");
    const [activeName, setActiveName] = useState("");
    const [OrgaName, setOrgaName] = useState("");
    const [startActive, setStartActive] = useState("");
    const [endActive, setEndActive] = useState("");
    const [activeProcess, setActiveProcess] = useState("");
    const [certificateTime, setCertificateTime] = useState("");
    const [certificateName, setCertificateName] = useState("");

    

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]; // Dùng optional chaining tránh lỗi khi không có file
        if (file) {
            const imageUrl = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh
            setImage(imageUrl); 
            sessionStorage.setItem("cvImage", imageUrl); // Lưu URL vào sessionStorage
        }
    };
    
    const handleSaveCV = () => {
        const lastId = JSON.parse(sessionStorage.getItem("lastId") || "0");
        const newId = lastId + 1;
        sessionStorage.setItem("lastId", JSON.stringify(newId));

        const newCV = {
            id: newId,
            image,
            name,
            positionApply,
            skillName,
            skillDesc,
            hobbiesDesc,
            careerGoalsDesc,
            universityName,
            startStudy,
            endStudy,
            subjectName,
            learningProcess,
            positionName,
            businessName,
            startWork,
            endWork,
            workingProcess,
            activeName,
            OrgaName,
            startActive,
            endActive,
            activeProcess,
            certificateTime,
            certificateName,
            createdAt: new Date().toISOString()
        };
        // Lấy dữ liệu CV hiện tại từ sessionStorage
        const existingCvData = JSON.parse(sessionStorage.getItem("cvData") || "[]");
        // Cập nhật CV mới vào mảng dữ liệu hiện tại
        const updatedCvData = Array.isArray(existingCvData) ? [...existingCvData, newCV] : [newCV];
        // Lưu dữ liệu CV vào sessionStorage
        sessionStorage.setItem("cvData", JSON.stringify(updatedCvData));
        alert("CV đã được lưu!");
    };
    useEffect(() => {
        // Kiểm tra nếu cvId đã có và tải thông tin CV từ sessionStorage
        if (cvId) {
            const savedCvData = JSON.parse(sessionStorage.getItem("cvData") || "[]");
            const selectedCv = savedCvData.find((cv: CV) => cv.id === parseInt(cvId as string));
            if (selectedCv) {
                setCv(selectedCv);
                setImage(selectedCv.image);
                setName(selectedCv.name);
                setpositionApply(selectedCv.positionApply);
                setSkillName(selectedCv.skillName);
                setSkillDesc(selectedCv.skillDesc);
                setHobbiesDesc(selectedCv.hobbiesDesc);
                setCareerGoalsDesc(selectedCv.careerGoalsDesc);
                // Set các trường khác từ CV đã lưu
            }
        }
    }, [cvId]);

    // Nếu đang tải thông tin CV, hiển thị thông báo
    if (cvId && !cv) {
        return <div>Đang tải thông tin CV...</div>;
    }
    
    return (
        <Card style={{ maxWidth: 900, margin: "auto", padding: 20, position: "relative" }}>
            <Row gutter={16}>
                <Col span={8} style={{background: "#FFF3E0", padding: 20, borderRadius: 10, position: "relative" }}>
                    <div style={{textAlign:'center'}}>
                        <label htmlFor="upload">
                            <div
                            style={{
                                width: "120px",
                                height: "120px",
                                borderRadius: "50%",
                                border: "3px solid #D4421E",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                overflow: "hidden", 
                                cursor: "pointer",
                                margin: "0 auto",
                            }}
                            >
                            <Image
                                src={image || "/default-avatar.jpg"}  // Sử dụng ảnh mặc định nếu không có ảnh
                                alt="avatar"
                                style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '50%',
                                }}
                            />
                            </div>
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            id="upload"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                        />
                        <Input
                            placeholder="Tên"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                backgroundColor: "transparent", border: "none",
                                fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out"
                            }}
                        />
                        <Input
                            placeholder="Vị trí ứng tuyển"
                            value={positionApply}
                            onChange={(e) => setpositionApply(e.target.value)}
                            style={{
                                backgroundColor: "transparent", border: "none",
                                fontSize: "14px", color: "#333"
                            }}
                        />
                    </div>
                    <Divider style={{ borderColor: "#D4421E", borderWidth: "1px" }} />
                    <div>
                        <h2 style={{ fontWeight: "700", fontSize: "17px", color: "#D4421E"}}>Thông tin cá nhân</h2>
                        <Space direction="vertical" style={{ width: "100%", gap: "2px" }}>
                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <CalendarOutlined 
                                    style={{
                                        position: "absolute", left: 10, color: "#D4421E", fontSize: 16
                                    }}
                                />
                                <Input
                                    placeholder="DD/MM/YYYY"
                                    style={{
                                        paddingLeft: 40, backgroundColor: "transparent", border: "none",
                                        fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out"
                                    }}
                                    onFocus={(e) => {
                                    e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                    }}
                                    onBlur={(e) => {
                                    e.target.style.border = "none"; // Ẩn viền khi mất focus
                                    }}
                                />
                            </div>
                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <UserOutlined
                                    style={{
                                        position: "absolute", left: 10, color: "#D4421E", fontSize: 16
                                    }}
                                />
                                <Input
                                    placeholder="Nam/Nữ"
                                    style={{
                                        paddingLeft: 40, backgroundColor: "transparent", border: "none",
                                        fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out"
                                    }}
                                    onFocus={(e) => {
                                    e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                    }}
                                    onBlur={(e) => {
                                    e.target.style.border = "none"; // Ẩn viền khi mất focus
                                    }}
                                />
                            </div>
                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <PhoneOutlined 
                                    style={{
                                        position: "absolute", left: 10, color: "#D4421E", fontSize: 16
                                    }}
                                />
                                <Input
                                    placeholder="012345689"
                                    style={{
                                        paddingLeft: 40, backgroundColor: "transparent", border: "none",
                                        fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out"
                                    }}
                                    onFocus={(e) => {
                                    e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                    }}
                                    onBlur={(e) => {
                                    e.target.style.border = "none"; // Ẩn viền khi mất focus
                                    }}
                                />
                            </div>
                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <MailOutlined
                                    style={{
                                        position: "absolute", left: 10, color: "#D4421E", fontSize: 16
                                    }}
                                />
                                <Input
                                    placeholder="email@gmail.com"
                                    style={{
                                        paddingLeft: 40, backgroundColor: "transparent", border: "none",
                                        fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out"
                                    }}
                                    onFocus={(e) => {
                                    e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                    }}
                                    onBlur={(e) => {
                                    e.target.style.border = "none"; // Ẩn viền khi mất focus
                                    }}
                                />
                            </div>
                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <FacebookOutlined 
                                    style={{
                                        position: "absolute", left: 10, color: "#D4421E", fontSize: 16
                                    }}
                                />
                                <Input
                                    placeholder="Facebook.com/profile"
                                    style={{
                                        paddingLeft: 40, backgroundColor: "transparent", border: "none",
                                        fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out"
                                    }}
                                    onFocus={(e) => {
                                    e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                    }}
                                    onBlur={(e) => {
                                    e.target.style.border = "none"; // Ẩn viền khi mất focus
                                    }}
                                />
                            </div>
                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                <HomeOutlined
                                    style={{
                                        position: "absolute", left: 10, color: "#D4421E", fontSize: 16
                                    }}
                                />
                                <Input
                                    placeholder="Địa chỉ"
                                    style={{
                                        paddingLeft: 40, backgroundColor: "transparent", border: "none",
                                        fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out"
                                    }}
                                    onFocus={(e) => {
                                    e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                    }}
                                    onBlur={(e) => {
                                    e.target.style.border = "none"; // Ẩn viền khi mất focus
                                    }}
                                />
                            </div>
                        </Space>
                    </div>
                    <Divider style={{ borderColor: "#D4421E", borderWidth: "1px" }} />
                    <div style={{ backgroundColor: "#FFF3E0", borderRadius: "5px" }}>
                        <h2 style={{ fontWeight: "700", fontSize: "17px", color: "#D4421E" }}>Các kỹ năng</h2>
                        <div>
                            <Input
                                placeholder="Tên kỹ năng"
                                value={skillName}
                                onChange={(e) => setSkillName(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: skillName ? "normal" : "italic",
                                    fontWeight: skillName ? "bold" : "normal",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                            {/* Input Mô tả kỹ năng */}
                            <Input.TextArea
                                placeholder="Mô tả kỹ năng"
                                value={skillDesc}
                                onChange={(e) => setSkillDesc(e.target.value)}
                                autoSize={{ minRows: 1, maxRows: 5 }}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: skillDesc ? "normal" : "italic",
                                    height:20
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                        </div>     
                    </div>
                    <Divider style={{ borderColor: "#D4421E", borderWidth: "1px" }} />
                    <div style={{ backgroundColor: "#FFF3E0", borderRadius: "5px" }}>
                        <h2 style={{ fontWeight: "700", fontSize: "17px", color: "#D4421E" }}>Sở thích</h2>
                        <div>
                            <Input.TextArea
                                placeholder="Các sở thích của bạn"
                                value={hobbiesDesc}
                                onChange={(e) => setHobbiesDesc(e.target.value)}
                                autoSize={{ minRows: 1, maxRows: 5 }}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: hobbiesDesc ? "normal" : "italic",
                                    height:20
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                        </div>
                    </div>
                    <Divider style={{ borderColor: "#D4421E", borderWidth: "1px" }} />
                </Col>

                <Col span={16} style={{ padding: 20 }}>
                    <div style={{borderRadius: "5px" }}>
                        <h2 style={{ fontWeight: "700", fontSize: "17px", color: "#D4421E" }}>Mục tiêu nghề nghiệp</h2>
                        <div>
                            <Input.TextArea
                                placeholder="Mục tiêu nghề nghiệp của bạn, bao gồm mục tiêu ngắn hạn và dài hạn"
                                value={careerGoalsDesc}
                                onChange={(e) => setCareerGoalsDesc(e.target.value)}
                                autoSize={{ minRows: 1, maxRows: 5 }}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: careerGoalsDesc ? "normal" : "italic",
                                    height:20
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa";
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none";
                                }}
                           />
                        </div>
                    </div>
                    <Divider style={{ borderColor: "#D4421E", borderWidth: "1px" }} />
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <h2 style={{ fontWeight: "700", fontSize: "17px", color: "#D4421E" }}>Học vấn</h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Input
                                placeholder="Tên trường học"
                                value={universityName}
                                onChange={(e) => setUniversityName(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: universityName ? "normal" : "italic",
                                    fontWeight: universityName ? "bold" : "normal",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                            <Input
                                placeholder="Bắt đầu"
                                value={startStudy}
                                onChange={(e) => setStartStudy(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#999", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: "italic",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20, textAlign:"right", 
                                    width: startStudy.length * 10 + "px",
                                    minWidth: "70px", maxWidth: "100px",
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                            <span style={{ fontSize: "14px", color: "#999" }}>-</span>
                            <Input
                                placeholder="Kết thúc"
                                value={endStudy}
                                onChange={(e) => setEndStudy(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#999", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: "italic",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20,width: endStudy.length * 10 + "px",
                                    minWidth: "70px", maxWidth: "100px"
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                        </div>
                            <Input.TextArea
                                placeholder="Ngành học / Môn học"
                                value={subjectName}
                                onChange={(e) => setSubjectName(e.target.value)}
                                autoSize={{ minRows: 1, maxRows: 5 }}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: subjectName ? "normal" : "italic",
                                    height:20
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa";
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none";
                                }}
                            />
                            <Input.TextArea
                                placeholder="Mô tả quá trình hoặc thành tích của bạn"
                                value={learningProcess}
                                onChange={(e) => setLearningProcess(e.target.value)}
                                autoSize={{ minRows: 1, maxRows: 5 }}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: learningProcess ? "normal" : "italic",
                                    height:20, marginTop:-5
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa";
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none";
                                }}
                           />
                    </Space>
                    <Divider style={{ borderColor: "#D4421E", borderWidth: "1px" }} />
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <h2 style={{ fontWeight: "700", fontSize: "17px", color: "#D4421E" }}>Kinh nghiệm làm việc</h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Input
                                placeholder="Vị trí công việc"
                                value={positionName}
                                onChange={(e) => setpositionName(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: positionName ? "normal" : "italic",
                                    fontWeight: positionName ? "bold" : "normal",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                            <Input
                                placeholder="Bắt đầu"
                                value={startWork}
                                onChange={(e) => setStartWork(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#999", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: "italic",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20, textAlign:"right", 
                                    width: startWork.length * 10 + "px",
                                    minWidth: "70px", maxWidth: "100px",
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                            <span style={{ fontSize: "14px", color: "#999" }}>-</span>
                            <Input
                                placeholder="Kết thúc"
                                value={endWork}
                                onChange={(e) => setEndWork(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#999", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: "italic",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20,width: endWork.length * 10 + "px",
                                    minWidth: "70px", maxWidth: "100px"
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                        </div>
                            <Input.TextArea
                                placeholder="Tên công ty"
                                value={businessName}
                                onChange={(e) => setbusinessName(e.target.value)}
                                autoSize={{ minRows: 1, maxRows: 5 }}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: businessName ? "normal" : "italic",
                                    height:20
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa";
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none";
                                }}
                            />
                            <Input.TextArea
                                placeholder="Mô tả kinh nghiệm làm việc của bạn"
                                value={workingProcess}
                                onChange={(e) => setWorkingProcess(e.target.value)}
                                autoSize={{ minRows: 1, maxRows: 5 }}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: workingProcess ? "normal" : "italic",
                                    height:20, marginTop:-5
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa";
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none";
                                }}
                           />
                    </Space>
                    <Divider style={{ borderColor: "#D4421E", borderWidth: "1px" }} />
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <h2 style={{ fontWeight: "700", fontSize: "17px", color: "#D4421E" }}>Hoạt động</h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Input
                                placeholder="Vị trí của bạn"
                                value={activeName}
                                onChange={(e) => setActiveName(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: activeName ? "normal" : "italic",
                                    fontWeight: activeName ? "bold" : "normal",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                            <Input
                                placeholder="Bắt đầu"
                                value={startActive}
                                onChange={(e) => setStartActive(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#999", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: "italic",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20, textAlign:"right", 
                                    width: startActive.length * 10 + "px",
                                    minWidth: "70px", maxWidth: "100px",
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                            <span style={{ fontSize: "14px", color: "#999" }}>-</span>
                            <Input
                                placeholder="Kết thúc"
                                value={endActive}
                                onChange={(e) => setEndActive(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#999", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: "italic",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20,width: endActive.length * 10 + "px",
                                    minWidth: "70px", maxWidth: "100px"
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                        </div>
                            <Input.TextArea
                                placeholder="Tên tổ chức"
                                value={OrgaName}
                                onChange={(e) => setOrgaName(e.target.value)}
                                autoSize={{ minRows: 1, maxRows: 5 }}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: OrgaName ? "normal" : "italic",
                                    height:20
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa";
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none";
                                }}
                            />
                            <Input.TextArea
                                placeholder="Mô tả hoạt động"
                                value={activeProcess}
                                onChange={(e) => setActiveProcess(e.target.value)}
                                autoSize={{ minRows: 1, maxRows: 5 }}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: activeProcess ? "normal" : "italic",
                                    height:20, marginTop:-5
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa";
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none";
                                }}
                           />
                    </Space>
                    <Divider style={{ borderColor: "#D4421E", borderWidth: "1px" }} />
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <h2 style={{ fontWeight: "700", fontSize: "17px", color: "#D4421E" }}>Chứng chỉ</h2>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Input
                                placeholder="Thời gian"
                                value={certificateTime}
                                onChange={(e) => setCertificateTime(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: certificateTime ? "normal" : "italic",
                                    fontWeight: certificateTime ? "bold" : "normal",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20,width: certificateTime.length * 10 + "px",
                                    minWidth: "100px", maxWidth: "200px",
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                            <Input
                                placeholder="Tên chứng chỉ"
                                value={certificateName}
                                onChange={(e) => setCertificateName(e.target.value)}
                                spellCheck={false}
                                style={{
                                    paddingLeft: 5, backgroundColor: "transparent", border: "none",
                                    fontSize: "14px", color: "#333", transition: "border-bottom 0.3s ease-in-out",
                                    fontStyle: certificateName ? "normal" : "italic",
                                    marginBottom: -5 , // Giảm khoảng cách,
                                    height:20, 
                                    
                                }}
                                onFocus={(e) => {
                                e.target.style.border = "1px solid #aaa"; // Hiển thị viền khi focus
                                }}
                                onBlur={(e) => {
                                e.target.style.border = "none"; // Ẩn viền khi mất focus
                                }}
                            />
                            <span style={{ fontSize: "14px", color: "#999" }}>-</span>
                        </div>
                    </Space>
                    <Divider style={{ borderColor: "#D4421E", borderWidth: "1px" }} />
                    
                </Col>
                
            </Row>
            <div style={{ textAlign: "center", marginTop: 20 }}>
                <Button 
                    type="primary" 
                    style={{ backgroundColor: "#D4421E", borderColor: "#D4421E", fontWeight: "bold" }}
                    size="large"
                    onClick={handleSaveCV}
                >
                    Lưu hồ sơ
                </Button>
            </div>
        {hovered && (
            <div style={{ position: "absolute", top: 10, right: 10, display: "flex", gap: 8 }}>
            <Tooltip title="Di chuyển">
                <Button icon={<DragOutlined />} shape="circle" />
            </Tooltip>
            <Tooltip title="Thêm ảnh">
                <Button icon={<PictureOutlined />} shape="circle" />
            </Tooltip>
            <Tooltip title="Lên">
                <Button icon={<ArrowUpOutlined />} shape="circle" />
            </Tooltip>
            <Tooltip title="Xuống">
                <Button icon={<ArrowDownOutlined />} shape="circle" />
            </Tooltip>
            <Tooltip title="Thêm">
                <Button type="primary" icon={<PlusOutlined />} style={{ background: "#00A550" }}>Thêm</Button>
            </Tooltip>
            <Tooltip title="Xóa">
                <Button type="primary" danger icon={<DeleteOutlined />} />
            </Tooltip>
            </div>
        )}
        
        </Card>
  );
};

export default CV;