'use client';
import React from 'react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Modal, Collapse, Form, Input, Select, message, Carousel } from 'antd';
import { MailOutlined, PhoneOutlined, UserOutlined } from '@ant-design/icons';
import type { CarouselProps, RadioChangeEvent } from 'antd';
import Image from 'next/image';
import CustomButton from '@/components/CustomButton';

type LayoutType = Parameters<typeof Form>[0]['layout'];
type DotPosition = CarouselProps['dotPosition'];


const RecruiterRegister: React.FC = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { Option } = Select;
    const provinces: { [key: string]: string[] } = {
        "Hà Nội": ["Quận Ba Đình", "Quận Hoàn Kiếm", "Quận Tây Hồ"],
        "TP. Hồ Chí Minh": ["Quận 1", "Quận 2", "Quận 3"],
        "Đà Nẵng": ["Quận Hải Châu", "Quận Thanh Khê", "Quận Sơn Trà"],
    };

    const [selectedProvince, setSelectedProvince] = useState<string | undefined>(undefined);
    const [districts, setDistricts] = useState<string[]>([]);
    const handleProvinceChange = (value: string) => {
        setSelectedProvince(value);
        setDistricts(provinces[value] || []);
    };
    const router = useRouter();
    const [form] = Form.useForm();

    const [formLayout, setFormLayout] = useState<LayoutType>('vertical');
    const [isMounted, setIsMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [checked, setChecked] = useState(false);



    useEffect(() => {
        setIsMounted(true);
        setTimeout(() => setIsModalOpen(true), 200); // Mở modal sau khi mount xong
    }, []);

    if (!isMounted) return null; // Tránh mismatch với HTML của server

    const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
        setFormLayout(layout);
    };

    const handleButtonRecruiter = () => {
        setIsModalOpen(false);
    };
    const handleButtonCandidate = () => {
        router.push('/auth/candidate/register');
    };
    const handleRegister = () => {
        form
            .validateFields()
            .then((values) => {
                handleFormSubmit(values); // Gửi form nếu hợp lệ
                router.push('/auth/recruiter/login');
            })
            .catch((errorInfo) => {
                console.log("Lỗi form:", errorInfo);
            });
    };
    const handleFormSubmit = async (values: Record<string, unknown>) => {
        console.log("Gửi form:", values);
        try {
            const response = await fetch("http://localhost:8080/auth/recruiter/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            const data = await response.json();
            if (response.ok) {
                alert("Đăng ký thành công!");
                form.resetFields();
            } else {
                alert(data.message || "Đăng ký thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại!");
        }
    };
    return (
        <div
            style={{
                display: 'flex',
            }}
        >
            {contextHolder}
            <div
                style={{
                    width: '70%',
                    height: '100vh',
                    overflowY: 'scroll',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    // backgroundColor: 'blue',
                }}
            >
                <div
                    style={{
                        width: '80%',
                        marginLeft: '10%',
                        height: '100vh',
                        // backgroundColor: 'blue',
                    }}
                >
                    <h1
                        className='text-4xl font-bold text-orange-400 mt-5'
                    >
                        Sharework
                    </h1>
                    <p
                        className='text-2xl font-bold text-blue-400 mt-2'
                    >
                        Đăng ký tài khoản nhà tuyển dụng
                    </p>
                    <p
                        className='text-sm font-normal text-gray-500 mt-2'
                    >
                        Cùng tạo dựng lợi thế cho doanh nghiệp bằng trải nghiệm công nghệ tuyển dụng ứng dụng sâu AI & Hiring Funnel.
                    </p>
                    <Collapse
                        items={[
                            {
                                key: '1',
                                label: (
                                    <span style={{ color: 'white', fontWeight: 'bold' }}>Quy định</span>
                                ),
                                children: (
                                    <div style={{ color: 'black' }}>
                                        <p>1. Người dùng phải cung cấp thông tin chính xác và đầy đủ khi đăng ký.</p>
                                        <p>2. Sharework cam kết bảo mật thông tin cá nhân của nhà tuyển dụng.</p>
                                        <p>3. Nghiêm cấm sử dụng tài khoản để thực hiện các hành vi lừa đảo hoặc vi phạm pháp luật.</p>
                                        <p>4. Người dùng chịu trách nhiệm về mọi hoạt động được thực hiện dưới tài khoản của mình.</p>
                                        <p>5. Sharework có quyền tạm ngừng hoặc chấm dứt tài khoản nếu phát hiện vi phạm.</p>
                                    </div>
                                ),
                            },
                        ]}
                        style={{
                            background: 'linear-gradient(to right, #27445D, #EFE9D5)',
                            borderRadius: '8px',
                            color: 'white',
                            padding: '10px',
                            marginTop: '20px',
                        }}
                    />
                    <p
                        className='text-xl font-bold text-black mt-2'
                    >
                        Tài khoản
                    </p>
                    {/* <div
                        style={{
                            marginTop: '5px',
                        }}
                    >
                        <label
                            className="custom-checkbox"
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => setChecked(!checked)}
                            />
                            <span className="checkmark"></span>
                            Tôi đồng ý với điều khoản của Sharework
                        </label>
                    </div> */}
                    <Form
                        layout={formLayout}
                        form={form}
                        initialValues={{ layout: formLayout }}
                        onValuesChange={onFormLayoutChange}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        style={{
                            marginTop: '5px',
                            fontFamily: 'Arial, sans-serif', // Font chữ Arial
                        }}
                    >
                        <Form.Item
                            label="Email:"
                            name='email'
                            rules={[
                                { required: true, message: "Vui lòng nhập email!" },
                                { type: "email", message: "Email phải có định dạng @gmail.com!" },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="abc123@gmail.com" style={{ fontSize: '14px', color: '#744210' }} />
                        </Form.Item>
                        <Form.Item
                            label="Mật khẩu:"
                            name='password'
                            rules={[
                                { required: true, message: "Vui lòng nhập mật khẩu!" },
                                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                            ]}
                        >
                            <Input.Password prefix={<UserOutlined />} placeholder="Mật khẩu" />
                        </Form.Item>
                        <Form.Item
                            label="Nhập lại mật khẩu:"
                            name='repassword'
                            dependencies={["password"]} // Phụ thuộc vào password
                            rules={[
                                { required: true, message: "Vui lòng nhập lại mật khẩu!" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("Mật khẩu nhập lại không khớp!"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password prefix={<UserOutlined />} placeholder="Nhập lại mật khẩu" />
                        </Form.Item>
                        <p
                            className='text-xl font-bold text-black mt-2'
                        >
                            Thông tin nhà tuyển dụng
                        </p>
                        <div
                            style={{
                                width: '100%',
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '16px'
                            }}
                        >
                            <Form.Item
                                label="Họ và tên:"
                                name='full_name'
                                style={{ flex: 1 }}
                                rules={[
                                    { required: true, message: "Vui lòng nhập họ và tên!" },
                                    { pattern: /^[\p{L}\s]+$/u, message: "Họ và tên không hợp lệ!" },
                                ]}
                            >
                                <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
                            </Form.Item>
                            <Form.Item
                                label="Giới tính:"
                                name="gender"
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
                            >
                                <Select placeholder="Chọn giới tính">
                                    <Option value="nam">Nam</Option>
                                    <Option value="nu">Nữ</Option>
                                </Select>
                            </Form.Item>
                        </div>
                        <Form.Item
                            label="Số điện thoại:"
                            name='company_phone'
                            rules={[
                                { required: true, message: "Vui lòng nhập số điện thoại!" },
                                { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
                            ]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại công ty" />
                        </Form.Item>
                        <Form.Item
                            label="Tên công ty:"
                            name='company_name'
                            rules={[
                                { required: true, message: "Vui lòng nhập tên công ty!" },
                                { pattern: /^[\p{L}\s]+$/u, message: "Tên công ty không hợp lệ!" },
                            ]}
                        >
                            <Input prefix={<PhoneOutlined />} placeholder="Tên công ty" />
                        </Form.Item>
                        <Form.Item
                            label="Email công ty:"
                            name='company_email'
                            rules={[
                                { required: true, message: "Vui lòng nhập email công ty!" },
                                { type: "email", message: "Email phải có định dạng @company.com!" },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="tonhoasen123@company.com" />
                        </Form.Item>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            {/* Chọn tỉnh */}
                            <Form.Item
                                label="Tỉnh/Thành phố"
                                name='province'
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: "Vui lòng chọn tỉnh/thành phố!" }]}
                            >
                                <Select
                                    placeholder="Chọn Tỉnh/Thành phố"
                                    onChange={handleProvinceChange}
                                    value={selectedProvince}
                                >
                                    {Object.keys(provinces).map((province) => (
                                        <Option key={province} value={province}>{province}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            {/* Chọn Quận/Huyện */}
                            <Form.Item
                                label="Quận/Huyện"
                                name='district'
                                style={{ flex: 1 }}
                                rules={[{ required: true, message: "Vui lòng chọn quận/huyện!" }]}
                            >
                                <Select
                                    placeholder="Chọn Quận/Huyện"
                                    disabled={!selectedProvince}
                                >
                                    {districts.map((district) => (
                                        <Option key={district} value={district}>{district}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                    </Form>
                    <label className="custom-checkbox">
                        <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => setChecked(!checked)}
                        />
                        <span className="checkmark"></span>
                        Tôi đồng ý với các điều khoản của Sharework
                    </label>
                    <CustomButton
                        text="Hoàn tất"
                        onClick={handleRegister}
                        backgroundColor="#D4421E"
                        hoverColor="#ff5733"
                        textColor="#fff"
                        style={{
                            fontWeight: 'bold',
                            border: '1px solid orange',
                            width: '100%',
                            marginTop: '10px'
                        }}
                    />
                    <p style={{ marginTop: '10px', textAlign: 'center', fontWeight: '500', fontSize: 14 }}>
                        Bạn đã có tài khoản?
                        <Link href="/auth/recruiter/login" style={{ color: '#007BFF', textDecoration: 'none' }} // Màu xanh dương mặc định
                            onMouseEnter={(e) => (e.currentTarget.style.color = '#0056b3')} // Màu xanh đậm hơn khi hover
                            onMouseLeave={(e) => (e.currentTarget.style.color = '#007BFF')} // Quay lại màu mặc định khi rời
                        >
                            Đăng nhập ngay
                        </Link>
                    </p>
                    <footer
                        style={{
                            width: '100%',
                            height: '50px',
                            textAlign: 'center',
                            alignContent: 'center',
                        }}
                    >
                        @Copyright Sharework
                    </footer>
                </div>
            </div>
            <div
                style={{
                    width: '30%',
                    height: '100vh',
                    background: 'linear-gradient(135deg, #4A90E2, #9013FE)', // Gradient màu xanh dương và tím
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    color: 'white',
                    fontFamily: 'Arial, sans-serif',
                    textAlign: 'center',
                    padding: '20px',
                    position: 'relative',
                }}
            >
                <Link
                    href="/auth/recruiter"
                    style={{
                        position: 'absolute',
                        top: '20px',
                        left: '20px',
                        fontSize: '26px',
                        fontWeight: 'bold',
                        color: '#FF8C00',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        padding: '5px 10px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.4)',
                        transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.textDecoration = 'underline';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
                        e.currentTarget.style.color = '#FFA500'; // sáng hơn 1 tí
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.textDecoration = 'none';
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                        e.currentTarget.style.color = '#FF8C00';
                    }}
                >
                    Sharework
                </Link>


                <h2 style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    marginTop: '60px',
                    marginBottom: '20px',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}>
                    Đăng ký dành cho Nhà Tuyển Dụng
                </h2>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>
                    Kết nối đúng người – Tuyển dụng đúng lúc.
                </p>
                <p style={{ fontSize: '16px', fontStyle: 'italic', marginBottom: '20px', opacity: 0.9 }}>
                    Không chỉ là tuyển dụng, đó là chiến lược phát triển.
                </p>
                <div style={{ fontSize: '20px', color: '#FFD700', fontWeight: '500' }}>
                    🔍 AI dẫn lối – Nhân tài hội tụ
                </div>

            </div>

            <Modal
                width={800}
                open={isModalOpen}
                closable={false}
                maskClosable={false}
                footer={null}
                title={
                    <div
                        style={{
                            textAlign: "center",
                            padding: "24px 0",
                            background: "linear-gradient(135deg, #874bff 0%, #5433ff 100%)",
                            color: "#fff",
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12,
                        }}
                    >
                        <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, lineHeight: 1.5 }}>
                            Chào bạn,
                        </h2>
                        <p style={{ fontSize: 16, fontWeight: 400, marginTop: 8 }}>
                            Bạn hãy dành ra vài giây để xác nhận thông tin dưới đây nhé!
                        </p>
                    </div>
                }

                modalRender={(modal) => (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <div style={{ width: "100%", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}>
                            {modal}
                        </div>
                    </div>
                )}
            >
                <div style={{ padding: 24, borderTop: "1px solid #eee" }}>
                    <div
                        style={{
                            textAlign: "center",
                            fontSize: 16,
                            fontWeight: 600,
                            marginBottom: 24,
                        }}
                    >
                        Để trải nghiệm tốt nhất với Sharework, bạn vui lòng lựa chọn nhóm phù hợp nhất với bạn.
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "24px",
                            justifyContent: "center",
                            flexWrap: "wrap",
                        }}
                    >
                        {/* Nhà tuyển dụng */}
                        <div style={{ textAlign: "center" }}>
                            <Image
                                src="/assets/images/menRecruiter.jpg"
                                width={220}
                                height={220}
                                alt="Nhà tuyển dụng"
                                style={{
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    height: '300px'
                                }}
                            />
                            <CustomButton
                                text="Tôi là nhà tuyển dụng"
                                onClick={handleButtonRecruiter}
                                backgroundColor="#fff"
                                hoverColor="#fceabb"
                                textColor="#e67e22"
                                style={{
                                    fontWeight: 'bold',
                                    border: '1.5px solid #e67e22',
                                    marginTop: '16px',
                                    padding: '8px 16px',
                                    borderRadius: 8
                                }}
                            />
                        </div>

                        {/* Người ứng tuyển */}
                        <div style={{ textAlign: "center" }}>
                            <Image
                                src="/assets/images/womanCandidate.jpg"
                                width={220}
                                height={220}
                                alt="Người ứng tuyển"
                                style={{
                                    objectFit: "cover",
                                    borderRadius: "12px",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    height: '300px'
                                }}
                            />
                            <CustomButton
                                text="Tôi là người ứng tuyển"
                                onClick={handleButtonCandidate}
                                backgroundColor="#fff"
                                hoverColor="#e0f7fa"
                                textColor="#3498db"
                                style={{
                                    fontWeight: 'bold',
                                    border: '1.5px solid #3498db',
                                    marginTop: '16px',
                                    padding: '8px 16px',
                                    borderRadius: 8
                                }}
                            />
                        </div>
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default RecruiterRegister;
