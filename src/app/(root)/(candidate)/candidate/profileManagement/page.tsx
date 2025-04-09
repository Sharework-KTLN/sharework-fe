'use client';

import React, { useRef, useState, useEffect, use } from 'react';
import { Card, Input, Select, Button, Row, Col, Image, Tag } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { useRouter, useSearchParams} from 'next/navigation';
import { login, logout } from '@/redux/userSlice';
import { EditOutlined } from '@ant-design/icons';

const { Option } = Select;

const CVManager = () => {
    const user = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const [imageUrl, setImageUrl] = useState<string>("https://i.pravatar.cc/100");
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    useEffect(() => {
            const token = searchParams.get('token');
            console.log("token:", token);
    
            if (token) {
                localStorage.setItem('token', token); // Lưu token vào localStorage
                router.replace('/'); // Xóa token khỏi URL
            }
        }, [searchParams, router]);

    useEffect(() => {
            const fetchUser = async () => {
                const savedToken = localStorage.getItem("token");
                if (!savedToken) {
                    dispatch(logout()); // Xóa Redux nếu không có token
                    return;
                }
                try {
                    const res = await fetch("http://localhost:8080/auth/me", {
                        headers: { "Authorization": `Bearer ${savedToken}` },
                    });
    
                    const data = await res.json();
                    if (res.ok) {
                        dispatch(login({ ...data, token: savedToken })); // Cập nhật Redux
                    } else {
                        localStorage.removeItem("token");
                        dispatch(logout());
                    }
                } catch (error) {
                    console.error("Lỗi khi lấy user:", error);
                    localStorage.removeItem("token");
                    dispatch(logout());
                }
            };
    
            if (!user.id) { // Chỉ gọi API nếu Redux chưa có user
                fetchUser();
            }
    }, [dispatch, user.id]);
    const handleImageClick = () => {
        fileInputRef.current?.click(); // ✅ Mở file selector khi click ảnh
      };
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) {
              setImageUrl(reader.result as string);
            }
          };
          reader.readAsDataURL(file);
        }
    };
    return (
        <div style={{ width:'80%', margin: 'auto', padding: 20 }}>
        {/* Header: Thông tin cá nhân */}
        <div style={{
          background: "linear-gradient(to right, #D4421E, #FFA07A)",
          padding: "16px",
          borderRadius: "8px 8px 0 0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}>
          <h2 style={{ fontWeight: 600, fontSize: 20, color: "#000000", margin: 0 }}>Thông tin cá nhân</h2>
        </div>
      
        <div
  style={{
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "0 0 8px 8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    marginBottom: 20,
  }}
>
        <Row gutter={24}>
            {/* Cột bên trái: ảnh đại diện */}
            <Col span={6} style={{ display: "flex", justifyContent: "center", alignItems:"center" }}>
            <div>
                <Image
                src={imageUrl}
                alt="Avatar"
                width={200}
                height={200}
                preview={false}
                style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    cursor: "pointer",
                    border: "2px solid #f0f0f0",
                    marginBottom: 16,
                }}
                onClick={handleImageClick}
                />
                <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: "none" }}
                />
            </div>
            </Col>

            {/* Cột bên phải: thông tin cá nhân */}
            <Col span={18}>
            <Row gutter={16} style={{ marginBottom: 12 }}>
                <Col span={12}>
                <label style={{ fontWeight: 500 }}>Họ và tên</label>
                <Input value={user.full_name} />
                </Col>
                <Col span={12}>
                <label style={{ fontWeight: 500 }}>Giới tính</label>
                <Select style={{ width: "100%" }} value={user.gender}>
                    <Option value="Nam">Nam</Option>
                    <Option value="Nữ">Nữ</Option>
                </Select>
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 12 }}>
                <Col span={12}>
                <label style={{ fontWeight: 500 }}>Ngày sinh</label>
                <Input type="date" value={user.date_of_birth} />
                </Col>
                <Col span={12}>
                <label style={{ fontWeight: 500 }}>Điện thoại</label>
                <Input value={user.phone} />
                </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 12 }}>
                <Col span={24}>
                <label style={{ fontWeight: 500 }}>Email</label>
                <Input value={user.email} />
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                <label style={{ fontWeight: 500 }}>Địa chỉ liên lạc</label>
                <Input value={user.address} />
                </Col>
            </Row>
            </Col>
        </Row>
        </div>
      
        {/* Header: Thông tin học vấn */}
        <div style={{
          background: "linear-gradient(to right, #D4421E, #FFA07A)",
          padding: "16px",
          borderRadius: "8px 8px 0 0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}>
          <h2 style={{ fontWeight: 600, fontSize: 20, color: "#000000", margin: 0 }}>Thông tin học vấn</h2>
        </div>
      
        <div style={{
          background: "#FFFFFF",
          padding: "24px",
          borderRadius: "0 0 8px 8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}>
          <Row gutter={16} style={{ marginBottom: 12 }}>
            <Col span={12}>
              <label style={{ fontWeight: 500 }}>Trường học</label>
              <Input value={user.school} />
            </Col>
            <Col span={12}>
              <label style={{ fontWeight: 500 }}>Khoá học</label>
              <Input value={user.course} />
            </Col>
          </Row>
      
          <Row gutter={16}>
            <Col span={24}>
              <label style={{ fontWeight: 500 }}>Chuyên ngành</label>
              <Input value={user.specialize} />
            </Col>
          </Row>
        </div>
      
        <Button
          type="primary"
          style={{
            marginTop: 24,
            width: '100%',
            background: '#D4421E',
            borderColor: '#D4421E',
            fontWeight: 600,
            height: 45,
            fontSize: 16
          }}
        >
          Cập nhật
        </Button>
      </div>
    );
};

export default CVManager;