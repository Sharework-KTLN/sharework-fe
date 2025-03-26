'use client';

import React, { useState } from 'react';
import { Card, Input, Select, Button, Row, Col, Avatar, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { Option } = Select;

const CVManager = () => {
    const [cv, setCv] = useState({
        name: '',
        jobTitle: '',
        description: '',
        gender: '',
        birthDate: '',
        phone: '',
        email: '',
        address: '',
        university: '',
        course: '',
        major: '',
        skills: [],
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCv((prevCv) => ({
            ...prevCv,
            [name]: value, // Cập nhật trường có tên tương ứng
        }));
    };
    return (
        <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
                <Card style={{ boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: 10, marginBottom: "10px" }}>
                    <Row align="middle" gutter={16}>
                        <Col span={6}>
                            <Avatar size={80} src="https://i.pravatar.cc/100" />
                        </Col>
                        <Col span={18}>
                            <h2 style={{ margin: 0 }}>{cv.name || 'Họ và tên'}</h2>
                            <p>{cv.jobTitle || 'Chức danh'}</p>
                            <Tag color="blue">{cv.major || 'Chuyên ngành'}</Tag>
                        </Col>
                    </Row>
                </Card>
            
                {/* Tiêu đề có nền đậm hơn */}
                <div 
                    style={{ 
                        background: "linear-gradient(to right, #D4421E, #FFA07A)", 
                        padding: "12px 16px", borderRadius: "8px 8px 0 0", height:"50px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1),", 
                    }}
                >
                    <h2 style={{ fontWeight: "500", fontSize: "18px", color:"#000000" }}>Thông tin cá nhân</h2>
                </div>
                <div 
                    style={{ 
                        background: "#FFFFFF", padding: "16px", borderRadius: "0 0 8px 8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",marginBottom: "10px"}}
                > 
                    <Row gutter={16} style={{}}>
                        <Col span={12}>
                            <label>Họ và tên</label>
                            <Input value={cv.name} />
                        </Col>
                        <Col span={12}>
                            <label>Giới tính</label>
                            <Select style={{ width: '100%' }} value={cv.gender}>
                                <Option value="Nam">Nam</Option>
                                <Option value="Nữ">Nữ</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 10 }}>
                        <Col span={12}>
                            <label>Ngày sinh</label>
                            <Input type="date" value={cv.birthDate} />
                        </Col>
                        <Col span={12}>
                            <label>Điện thoại</label>
                            <Input value={cv.phone}/>
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 10 }}>
                        <Col span={24}>
                            <label>Email</label>
                            <Input value={cv.email} />
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 10 }}>
                        <Col span={24}>
                            <label>Địa chỉ liên lạc</label>
                            <Input value={cv.address} />
                        </Col>
                    </Row>
                </div>
            
                {/* Tiêu đề có nền đậm hơn */}
                <div 
                    style={{ 
                        background: "linear-gradient(to right, #D4421E, #FFA07A)", 
                        padding: "12px 16px", borderRadius: "8px 8px 0 0", height:"50px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    <h2 style={{ fontWeight: "500", fontSize: "18px", color:"#000000" }}>Thông tin học vấn</h2>
                </div>
                <div 
                    style={{ 
                        background: "#FFFFFF", padding: "16px", borderRadius: "0 0 8px 8px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"}}
                > 
                    <Row gutter={16}>
                        <Col span={12}>
                            <label>Trường học</label>
                            <Input value={cv.university} />
                        </Col>
                        <Col span={12}>
                            <label>Khoá học</label>
                            <Input value={cv.course} />
                        </Col>
                    </Row>
                    <Row gutter={16} style={{ marginTop: 10 }}>
                        <Col span={24}>
                            <label>Chuyên ngành</label>
                            <Input value={cv.major} />
                        </Col>
                    </Row>
                </div>
            
            
            <Button type="primary" style={{ marginTop: 20, width: '100%', background: '#D4421E', borderColor: '#D4421E' }}>Cập nhật</Button>
        </div>
    );
};

export default CVManager;