'use client';
import React from 'react';
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
                messageApi.success("Đăng ký thành công!");
                form.resetFields();
            } else {
                messageApi.error(data.message || "Đăng ký thất bại!");
            }
        } catch (error) {
            console.error("Lỗi khi đăng ký:", error);
            messageApi.error("Có lỗi xảy ra, vui lòng thử lại!");
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
                                children: <p style={{ color: 'black' }}>Dưới đây là những quy định của Sharework</p>,
                            }
                        ]}
                        style={{
                            background: 'linear-gradient(to right, #D4421E, #FF7E5F)', // Gradient từ đỏ sang cam
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
                        // onFinish={handleFormSubmit}
                        initialValues={{ layout: formLayout }}
                        onValuesChange={onFormLayoutChange}
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                        style={{
                            marginTop: '5px',
                        }}
                    >
                        <Form.Item
                            label="Email đăng nhập:"
                            name='email'
                            rules={[
                                { required: true, message: "Vui lòng nhập email!" },
                                { type: "email", message: "Email phải có định dạng @gmail.com!" },
                            ]}
                        >
                            <Input prefix={<MailOutlined />} placeholder="abc123@gmail.com" />
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
                }}
            >
                <Carousel
                    autoplay
                    autoplaySpeed={3000}
                    dots={true}
                    dotPosition='bottom'
                    effect='fade'
                >
                    <div>
                        <Image
                            src='https://d1csarkz8obe9u.cloudfront.net/posterpreviews/we-are-hiring-banner-design-template-996e1ccc08690262935774e681e19504_screen.jpg?ts=1628882340'
                            width={1000}
                            height={1000}
                            alt="Banner 1"
                            priority={true}
                            style={{ objectFit: 'cover', borderRadius: '10px' }}
                        />
                    </div>
                    <div>
                        <Image
                            src='https://d1csarkz8obe9u.cloudfront.net/posterpreviews/we-are-hiring-design-template-b468471c544067826b6902dd080e3f93_screen.jpg?ts=1696845646'
                            width={1000}
                            height={1000}
                            alt="Banner 2"
                            priority={true}
                            style={{ objectFit: 'cover', borderRadius: '10px' }}
                        />
                    </div>
                </Carousel>
            </div>

            <Modal
                width={800}
                height={800}
                open={isModalOpen}
                closable={false} // Ẩn nút đóng
                maskClosable={false} // Ngăn đóng khi bấm ra ngoài
                footer={null}
                title={
                    <div style={{ textAlign: "center", width: "100%", height: '80px' }}>
                        <span
                            style={{
                                margin: 0,
                                fontSize: 20,
                                fontWeight: 700,
                                alignItems: 'center',
                            }}
                        >
                            Chào bạn,
                        </span>
                        <br />
                        <span
                            style={{
                                marginTop: 10,
                                fontSize: 16,
                                fontWeight: 400
                            }}
                        >
                            Bạn hãy giành ra vài giây để xác nhận thông tin dưới đây nhé!
                        </span>
                    </div>
                }
                modalRender={(modal) => (
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <div
                        >
                            {modal}
                        </div>
                    </div>
                )}
            >
                <div
                    style={{
                        width: "100%",
                        justifyContent: "center",
                        borderTop: "1px solid gray",
                    }}
                >
                    <div
                        style={{
                            width: "100%",
                            textAlign: "center",
                            fontSize: 16,
                            fontWeight: 700,
                            marginBottom: "20px" // Tạo khoảng cách với phần bên dưới
                        }}
                    >
                        Để trãi nghiệm tốt nhất với Sharework, bạn vui lòng lựa chọn nhóm phù hợp nhất với bạn.
                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            alignItems: "center",
                            justifyContent: "space-around",
                        }}
                    >
                        <div
                            style={{
                                textAlign: "center"
                            }}
                        >
                            <Image
                                src="/assets/images/menRecruiter.jpg"
                                width={200}
                                height={200}
                                alt="Nhà tuyển dụng"
                                style={{ objectFit: "cover", borderRadius: "10px", height: '300px' }} // Bo góc cho đẹp
                            />
                            <CustomButton
                                text="Tôi là nhà tuyển dụng"
                                onClick={handleButtonRecruiter}
                                backgroundColor="white"
                                hoverColor="darkblue"
                                textColor="orange"
                                style={{
                                    fontWeight: 'bold',
                                    border: '1px solid orange',
                                    marginTop: '10px'
                                }}
                            />
                        </div>

                        {/* Cột 2: Người ứng tuyển */}
                        <div style={{ textAlign: "center" }}>
                            <Image
                                src="/assets/images/womanCandidate.jpg"
                                width={200}
                                height={200}
                                alt="Người ứng tuyển"
                                style={{ objectFit: "cover", borderRadius: "10px", height: '300px' }}
                            />
                            <CustomButton
                                text="Tôi là người ứng tuyển"
                                onClick={handleButtonCandidate}
                                backgroundColor="white"
                                hoverColor="darkblue"
                                textColor="blue"
                                style={{
                                    fontWeight: 'bold',
                                    border: '1px solid blue',
                                    marginTop: '10px'
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
