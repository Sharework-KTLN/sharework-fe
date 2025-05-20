'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Card, Input, Select, Row, Col, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../../../../../redux/slice/userSlice';
import { RootState, AppDispatch } from '@/redux/store';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, logout } from '@/redux/slice/userSlice';
import { EditOutlined} from '@ant-design/icons';
import Image from 'next/image';
import CustomButton from '@/components/CustomButton';

const { Option } = Select;

interface Major {
  id: number;
  name: string;
}

interface Skill {
  id: number;
  name: string;
}

interface User {
  id: number | null;
  email: string;
  password: string;
  full_name: string;
  role: 'candidate' | 'recruiter' | 'admin';
  phone?: string;
  profile_image?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  school?: string;
  course?: string;
  specialize?: string;
  introduce_yourself?: string;
  interested_majors?: number[];
  skills?: number[];
}

interface UserWithRelations extends User {
  user_interested_majors?: Major[];
  user_skills?: Skill[];
}

const CVManager = () => {
  const user: User = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const [imageUrl, setImageUrl] = useState<string>(user.profile_image || "https://i.pravatar.cc/100"); // Nếu không có profile_image, dùng ảnh mặc định
  const [isEditable, setIsEditable] = useState<boolean>(false); // Trạng thái chỉnh sửa
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const searchParams = useSearchParams();
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedMajors, setSelectedMajors] = useState<number[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [editableUser, setEditableUser] = useState(user);
  const [fileName, setFileName] = useState<string>("");

  useEffect(() => {
    if (isEditable) {
      setEditableUser(user);
    }
  }, [isEditable, user]);

  useEffect(() => {
    if (user.profile_image) {
      setImageUrl(user.profile_image);
    } else {
      setImageUrl("https://i.pravatar.cc/100");
    }
  }, [user.profile_image]);


  useEffect(() => {
    const token = searchParams.get('token');
    console.log("token:", token);

    if (token) {
      localStorage.setItem('userToken', token); // Lưu token vào localStorage
      router.replace('/'); // Xóa token khỏi URL
    }
  }, [searchParams, router]);

  useEffect(() => {
    const fetchUser = async () => {
      const savedToken = localStorage.getItem("userToken");
      if (!savedToken) {
        dispatch(logout()); // Xóa Redux nếu không có token
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`, {
          headers: { "Authorization": `Bearer ${savedToken}` },
        });

        const data = await res.json();
        if (res.ok) {
          dispatch(login({ ...data, token: savedToken })); // Cập nhật Redux
        } else {
          localStorage.removeItem("userToken");
          dispatch(logout());
        }
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
        localStorage.removeItem("userToken");
        dispatch(logout());
      }
    };

    if (!user.id) { // Chỉ gọi API nếu Redux chưa có user
      fetchUser();
    }
  }, [dispatch, user.id]);

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/majors`);
        const data = await response.json();
        console.log("Majors fetched:", data);
        setMajors(data);
      } catch (error) {
        console.error("Failed to fetch majors:", error);
      }
    };

    fetchMajors();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/skills`);
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchUserMajors = async () => {
      const token = localStorage.getItem('userToken');

      if (!token) {
        // console.error('Token không tồn tại!');
        router.push("/auth/candidate/login");
        return;
      }

      // Giải mã token để lấy userId
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Giải mã JWT token
      const userId = decodedToken.id;

      if (!userId) {
        // console.error('User ID không có trong token!');
        router.push("/auth/candidate/login");
        return;
      }

      try {
        // Fetch ngành nghề mà người dùng quan tâm
        const majorsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${userId}/majors`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!majorsRes.ok) {
          console.log('Không có ngành nghề nào mà người dùng quan tâm');
          return;  // Dừng lại nếu không có dữ liệu
        }

        const majorsData = await majorsRes.json() as { majorId: number; majorName: string }[];
        setSelectedMajors(majorsData.map((item) => item.majorId));

        // Fetch tất cả ngành nghề có sẵn
        const allMajorsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/majors`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!allMajorsRes.ok) {
          throw new Error('Không thể lấy danh sách ngành nghề');
        }

        const allMajorsData = await allMajorsRes.json() as Major[];
        setMajors(allMajorsData);  // Đã có `id` và `name` trong `allMajorsData`

      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Lỗi khi lấy ngành nghề:', err.message);
          setError(err.message); // Set thông báo lỗi vào state
        } else {
          console.error('Một lỗi không xác định xảy ra');
          setError('Một lỗi không xác định xảy ra');
        }
      }
    };

    fetchUserMajors();
  }, [router]);  // Chạy khi component mount

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/skills`);
        const data = await response.json();
        setSkills(data);
      } catch (error) {
        console.error("Failed to fetch skills:", error);
      }
    };

    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchUserSkills = async () => {
      const token = localStorage.getItem('userToken');

      if (!token) {
        // console.error('Token không tồn tại!');
        router.push("/auth/candidate/login");
        return;
      }

      // Giải mã token để lấy userId
      const decodedToken = JSON.parse(atob(token.split('.')[1])); // Giải mã JWT token
      const userId = decodedToken.id;

      if (!userId) {
        // console.error('User ID không có trong token!');
        router.push("/auth/candidate/login");
        return;
      }

      try {
        // Fetch kỹ năng mà người dùng có
        const skillsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/${userId}/skills`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!skillsRes.ok) {
          console.log('Không có kỹ năng nào của người dùng');
          return;  // Dừng lại nếu không có dữ liệu
        }

        const skillsData = await skillsRes.json() as { skillId: number; skillName: string }[];
        setSelectedSkills(skillsData.map((item) => item.skillId));

        // Fetch tất cả kỹ năng có sẵn
        const allSkillsRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/skills`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!allSkillsRes.ok) {
          throw new Error('Không thể lấy danh sách kỹ năng');
        }

        const allSkillsData = await allSkillsRes.json() as Skill[];
        setSkills(allSkillsData);  // Đã có `id` và `name` trong `allSkillsData`

      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error('Lỗi khi lấy kỹ năng:', err.message);
          setError(err.message); // Set thông báo lỗi vào state
        } else {
          console.error('Một lỗi không xác định xảy ra');
          setError('Một lỗi không xác định xảy ra');
        }
      }
    };

    fetchUserSkills();
  }, [router]);  // Chạy khi component mount

  useEffect(() => {
    setEditableUser(user);
  }, [user]);

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
  const handleFieldChange = (field: keyof typeof editableUser, value: string) => {
    setEditableUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleEditable = () => {
    setIsEditable((prev) => !prev);
    setEditableUser(user); // Reset giá trị mỗi lần mở/chỉnh sửa
  };
  
  const handleUpdateProfile = async () => {
    if (!isEditable) return;

    try {
      const formData = new FormData();

      // ✅ Thêm thông tin người dùng một cách an toàn
      const fields: (keyof User)[] = [
        "full_name",
        "date_of_birth",
        "gender",
        "phone",
        "address",
        "school",
        "course",
        "specialize",
        "introduce_yourself",
      ];

      fields.forEach((field) => {
        const value = editableUser[field];
        if (value !== undefined && value !== null) {
          formData.append(field, String(value));
        }
      });

      // Thêm avatar nếu có
      const file = fileInputRef.current?.files?.[0];
      if (file) {
        formData.append("profile_image", file);
      }

      // Đảm bảo danh sách ngành & kỹ năng là mảng trước khi stringify
      formData.append("interested_majors", JSON.stringify(Array.isArray(selectedMajors) ? selectedMajors : []));
      formData.append("skills", JSON.stringify(Array.isArray(selectedSkills) ? selectedSkills : []));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        messageApi.success(data.message || "✅ Cập nhật hồ sơ thành công!");
        console.log("✅ Cập nhật hồ sơ thành công!");
        setEditableUser(data.user);
        dispatch(setUser(data.user));
        setIsEditable(false);
      } else {
        console.error("❌ Cập nhật thất bại:", data.message);
        messageApi.error(data.message || "Cập nhật hồ sơ thật bại!");
      }
    } catch (error) {
      console.error("❌ Lỗi khi cập nhật hồ sơ:", error);
      messageApi.error("Lỗi hệ thống, vui lòng thử lại sau!");
    }
  };


  return (
    <div style={{ width: '70%', margin: 'auto', padding: 20 }}>
      {/* Header: Thông tin cá nhân */}
      <div style={{
        background: "linear-gradient(to right, #D4421E, #FFA07A)",
        padding: "16px",
        borderRadius: "8px 8px 0 0",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}>
        <h2 style={{ fontWeight: 600, fontSize: 20, color: "#000000", margin: 0 }}>Thông tin cá nhân</h2>
      </div>

      <div style={{
        background: "#FFFFFF",
        padding: "24px",
        borderRadius: "0 0 8px 8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: 20,
      }}>
        <Row gutter={24}>
          {/* Cột bên trái: ảnh đại diện */}
          <Col
            span={6}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ position: "relative", width: 200, height: 200 }}>
              <Image
                src={imageUrl}
                alt="Avatar"
                width={200}
                height={200}
                priority
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  border: "2px solid #f0f0f0",
                  objectFit: "cover",
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
              {/* Camera icon */}
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  backgroundColor: "#fff",
                  borderRadius: "50%",
                  padding: 4,
                  boxShadow: "0 0 4px rgba(0,0,0,0.2)",
                  zIndex: 2,
                }}
              >
                <Image
                  src="/assets/images/camera.png"
                  alt="Camera"
                  width={24}
                  height={24}
                  style={{ cursor: "pointer" }}
                  onClick={handleImageClick}
                />
              </div>
            </div>
          </Col>

          {/* Cột bên phải: thông tin cá nhân */}
          <Col span={18}>
            <Card
              style={{ marginBottom: 12 }}
              extra={<EditOutlined style={{ cursor: 'pointer' }} onClick={toggleEditable} />}
            >
              <Row gutter={16} style={{ marginBottom: 12 }}>
                <Col span={12}>
                  <label style={{ fontWeight: 500 }}>Họ và tên</label>
                  <Input
                    value={editableUser.full_name || ""}
                    disabled={!isEditable}
                    onChange={(e) => handleFieldChange('full_name', e.target.value)}
                  />
                </Col>
                <Col span={12}>
                  <label style={{ fontWeight: 500 }}>Giới tính</label>
                  <Select
                    style={{ width: "100%" }}
                    value={editableUser.gender || undefined}
                    disabled={!isEditable}
                    onChange={(value) => handleFieldChange('gender', value)}
                  >
                    <Option value="Nam">Nam</Option>
                    <Option value="Nữ">Nữ</Option>
                  </Select>
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: 12 }}>
                <Col span={12}>
                  <label style={{ fontWeight: 500 }}>Ngày sinh</label>
                  <Input
                    type="date"
                    value={editableUser.date_of_birth || ""}
                    disabled={!isEditable}
                    onChange={(e) => handleFieldChange('date_of_birth', e.target.value)}
                  />
                </Col>
                <Col span={12}>
                  <label style={{ fontWeight: 500 }}>Điện thoại</label>
                  <Input
                    value={editableUser.phone || ""}
                    disabled={!isEditable}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{ marginBottom: 12 }}>
                <Col span={24}>
                  <label style={{ fontWeight: 500 }}>Email</label>
                  <Input
                    value={editableUser.email || ""}
                    disabled={!isEditable}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <label style={{ fontWeight: 500 }}>Địa chỉ liên lạc</label>
                  <Input
                    value={editableUser.address || ""}
                    disabled={!isEditable}
                    onChange={(e) => handleFieldChange('address', e.target.value)}
                  />
                </Col>
              </Row>
            </Card>
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
        <h2 style={{ fontWeight: 600, fontSize: 20, color: "#000000", margin: 0 }}>
          Thông tin học vấn
        </h2>
      </div>

      <div style={{
        background: "#FFFFFF",
        padding: "24px",
        borderRadius: "0 0 8px 8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: 20, // để cách section dưới
      }}>
        <Row gutter={16} style={{ marginBottom: 12 }}>
          <Col span={12}>
            <label style={{ fontWeight: 500 }}>Trường học</label>
            <Input
              value={editableUser.school || ""}
              disabled={!isEditable}
              onChange={(e) => handleFieldChange('school', e.target.value)}
            />
          </Col>
          <Col span={12}>
            <label style={{ fontWeight: 500 }}>Khoá học</label>
            <Input
              value={editableUser.course || ""}
              disabled={!isEditable}
              onChange={(e) => handleFieldChange('course', e.target.value)}
            />
          </Col>
        </Row>

        <Row gutter={16} style={{ marginBottom: 12 }}>
          <Col span={12}>
            <label style={{ fontWeight: 500 }}>Chuyên ngành</label>
            <Input
              value={editableUser.specialize || ""}
              disabled={!isEditable}
              onChange={(e) => handleFieldChange('specialize', e.target.value)}
            />
          </Col>
          <Col span={12}>
            <label style={{ fontWeight: 500 }}>Ngành việc làm bạn quan tâm</label>
            <Select
              mode="multiple"
              placeholder="Chọn ngành nghề"
              style={{ width: '100%' }}
              disabled={!isEditable}
              value={selectedMajors}
              onChange={(value) => {
                console.log("Selected majors:", value);
                setSelectedMajors(value);
              }}
            >
              {majors
                .filter((major) => major.id !== null && major.id !== undefined)
                .map((major) => (
                  <Option key={major.id} value={major.id}>
                    {major.name}
                  </Option>
                ))}
            </Select>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <label style={{ fontWeight: 500 }}>Kỹ năng</label>
            <Select
              mode="multiple"
              allowClear
              placeholder="Chọn kỹ năng (ví dụ: JavaScript, React...)"
              style={{ width: '100%' }}
              disabled={!isEditable}
              value={selectedSkills}
              onChange={(value) => {
                console.log("Selected skills:", value);
                setSelectedSkills(value);
              }}
            >
              {skills.map((skill) => (
                <Option key={skill.id} value={skill.id}>
                  {skill.name}
                </Option>
              ))}
            </Select>
          </Col>
        </Row>
      </div>

      <div style={{
        background: "linear-gradient(to right, #D4421E, #FFA07A)",
        padding: "16px",
        borderRadius: "8px 8px 0 0",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}>
        <h2 style={{ fontWeight: 600, fontSize: 20, color: "#000000", margin: 0 }}>
          Giới thiệu bản thân
        </h2>
      </div>

      <div style={{
        background: "#FFFFFF",
        padding: "24px",
        borderRadius: "0 0 8px 8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: 20,
      }}>
        <Row gutter={16} style={{ marginBottom: 12 }}>
          <Col span={24}>
            <label style={{ fontWeight: 500 }}>Giới thiệu về bản thân</label>
            <Input.TextArea
              rows={4}
              placeholder="Hãy giới thiệu về bản thân bạn"
              value={editableUser.introduce_yourself || ""}
              disabled={!isEditable}
              onChange={(e) => handleFieldChange('introduce_yourself', e.target.value)}
            />
          </Col>
        </Row>
      </div>
      {/* Button update */}
      <Row justify="center" style={{ marginTop: 24 }}>
        <Col>
          {contextHolder}
          <CustomButton
            text="Cập nhật"
            onClick={() => handleUpdateProfile()} // Thêm logic cập nhật nếu có
            backgroundColor="#D4421E"
            hoverColor="#e9552d"
            textColor="white"
            style={{
              width: 150,
              height: 45,
              fontWeight: 600,
              fontSize: 18,
              borderColor: "#D4421E",
              opacity: !isEditable ? 0.6 : 1,
              cursor: !isEditable ? "not-allowed" : "pointer",
              alignItems: 'center',
              justifyContent: 'center',
              display: 'flex',
            }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CVManager;