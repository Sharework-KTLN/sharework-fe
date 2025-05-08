'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Typography, Spin, Descriptions, Table, Image } from 'antd';
import CustomButton from "@/components/CustomButton";

const { Title } = Typography;

interface UserSkill {
    id: number;
    skill: {
      id: number;
      name: string;
      description: string;
    };
}
interface UserInterestedMajor {
    id: number;
    major: {
      id: number;
      name: string;
      description: string;
    };
}
  

interface SavedJob {
    id: number;
    job_title: string;
    company_name: string;
    job_location: string;
    saved_at: string;
    job:{
        title: string;
        work_location: string;
        company: { name: string };
    };
}
  

interface UserDetail {
    id: number;
    full_name: string;
    email: string;
    phone: string;
    gender: string;
    date_of_birth: string;
    address: string;
    school: string;
    course: string;
    specialize: string;
    profile_image: string;
    user_skills: UserSkill[];
    user_interested_majors: UserInterestedMajor[];
    saved_jobs: SavedJob[];  // Sửa lại tên field
}

const UserDescription = ({ label, value }: { label: string; value: string | undefined }) => (
    <Descriptions bordered>
        <Descriptions.Item label={label} labelStyle={{ width: '120px' }}>
        {value || 'Không có dữ liệu'}
        </Descriptions.Item>
    </Descriptions>
);

interface Column {
    title: string;
    dataIndex: string;
    width?: number;
  }

interface TableRecord {
    id?: string | number;
    key?: string | number;
}
const UserTable = <T extends TableRecord>({
    dataSource,
    columns,
}: {
    dataSource: T[];
    columns: Column[];
}) => (
    <Table<T>
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        bordered
        size="small"
        rowKey={(record) => record.key ?? record.id ?? ''}
    />
);

const UserDetailPage = () => {
    const searchParams = useSearchParams(); // Lấy tham số từ URL
    const id = searchParams.get('id'); // Lấy id từ query parameter
    const [userDetail, setUserDetail] = useState<UserDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserDetail = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8080/user/detail/${id}`);
            const data = await res.json();
            if (res.ok) {
            setUserDetail(data.data);
            } else {
            setError(data.message || "Lỗi khi tải thông tin người dùng");
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải thông tin người dùng");
        } finally {
            setLoading(false);
        }
        };

        if (id) {
        fetchUserDetail(id);
        }
    }, [id]);

    if (loading) return <Spin size="large" />;
    if (error) return <div>{error}</div>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Chi tiết người dùng</h2>

            <div className="flex flex-col lg:flex-row gap-4">
                {/* Thông tin người dùng */}
                <div className="w-full lg:w-3/4">
                    <Card className="shadow-md p-4">
                        <Title level={3}>{userDetail?.full_name}</Title>

                        <div className="mb-3">
                            <UserDescription label="Email" value={userDetail?.email} />
                            <UserDescription label="Phone" value={userDetail?.phone} />
                            <UserDescription label="Giới tính" value={userDetail?.gender} />
                            <UserDescription label="Ngày sinh" value={userDetail?.date_of_birth ? new Date(userDetail.date_of_birth).toLocaleDateString('vi-VN') : undefined} />
                            <UserDescription label="Địa chỉ" value={userDetail?.address} />
                            <UserDescription label="Trường học" value={userDetail?.school} />
                            <UserDescription label="Khóa học" value={userDetail?.course} />
                            <UserDescription label="Chuyên ngành" value={userDetail?.specialize} />
                        </div>

                        <CustomButton
                            text="Chặn"
                            onClick={() => console.log("Delete user")}
                            backgroundColor="red"
                            hoverColor="darkred"
                            style={{
                                width: '100px',
                                height: '40px',
                                fontSize: '15px',
                                fontWeight: '700',
                                borderRadius: '6px',
                                border: 'none',
                                transition: 'background-color 0.3s ease',
                            }}
                        />
                    </Card>
                </div>

                {/* Avatar của người dùng */}
                <div className="w-full lg:w-1/4">
                    <Card className="shadow-md p-4">
                        <Title level={4}>Avatar</Title>
                        <Image
                        src={userDetail?.profile_image}
                        alt={userDetail?.full_name}
                        width={100}
                        height={100}
                        className="rounded-full object-cover"
                        preview={false}
                        />
                    </Card>
                </div>
            </div>

            {/* Ngành nghề quan tâm */}
            <h3 className="mt-6 text-xl font-semibold">Ngành nghề quan tâm</h3>
            <UserTable
                dataSource={userDetail?.user_interested_majors?.map((item) => ({
                    key: item.id,
                    name: item.major.name, // Truy xuất tên ngành từ item.major.name
                    description: item.major.description, // Truy xuất mô tả từ item.major.description
                })) || []}
                columns={[
                    { title: 'Tên ngành', dataIndex: 'name', width: 200 },
                    { title: 'Mô tả', dataIndex: 'description' },
                ]}
            />
            {/* Kỹ năng */}
            <h3 className="mt-6 text-xl font-semibold">Kỹ năng</h3>
            <UserTable
                dataSource={userDetail?.user_skills?.map((item) => ({
                    key: item.id,
                    name: item.skill.name,  // Truy xuất tên kỹ năng
                    description: item.skill.description,  // Truy xuất mô tả kỹ năng
                })) || []}
                columns={[
                    { title: 'Tên kỹ năng', dataIndex: 'name', width: 200 },
                    { title: 'Mô tả', dataIndex: 'description' },
                ]}
            />


            {/* Các công việc đã lưu */}
            <h3 className="mt-6 text-xl font-semibold">Các công việc đã lưu</h3>
            <UserTable
                dataSource={userDetail?.saved_jobs?.map((item) => ({
                    key: item.id,
                    job_title: item.job?.title,  // Truy xuất tên công việc từ item.job.title
                    company_name: item.job?.company?.name,  // Truy xuất tên công ty từ item.job.company.name
                    job_location: item.job?.work_location,  // Truy xuất địa điểm từ item.job.work_location
                    saved_at: new Date(item.saved_at).toLocaleDateString('vi-VN'),  // Định dạng ngày lưu
                })) || []}
                columns={[
                    { title: 'Tên công việc', dataIndex: 'job_title', width: 250 },
                    { title: 'Công ty', dataIndex: 'company_name', width: 250 },
                    { title: 'Địa điểm', dataIndex: 'job_location' },
                    { title: 'Ngày lưu', dataIndex: 'saved_at' },
                ]}
            />
        </div>
    );
};

export default UserDetailPage;