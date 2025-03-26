"use client";

import React, { useState } from "react";
import { Card, Avatar, Typography, Row, Col, Input, Button, Space, Divider, Tooltip } from "antd";
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

const CV = () => {
    const [hovered, setHovered] = useState(false);
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

    return (
        <Card style={{ maxWidth: 900, margin: "auto", padding: 20, position: "relative" }}>
            <Row gutter={16}>
                <Col span={8} style={{background: "#FFF3E0", padding: 20, borderRadius: 10, position: "relative" }}>
                    <div style={{textAlign:'center'}}>
                        <Avatar size={100} src="https://via.placeholder.com/100" />
                        <Title level={3} style={{ color: "#D4421E", marginTop: 10, fontWeight:"700" }}>Nhựt Hào</Title>
                        <Text type="secondary">Vị trí ứng tuyển</Text>
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
                </Col>
            </Row>

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