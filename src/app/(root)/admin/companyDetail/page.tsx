'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, Typography, Spin, Descriptions, Table, Image } from 'antd';
import CustomButton from '@/components/CustomButton';

const { Title } = Typography;

interface Job {
  id: number;
  title: string;
  salary_range: string;
  status: string;
  description: string;
  work_location: string;
  specialize: string;
  deadline: string;
  company: {
    id: number;
    name: string;
    logo: string;
  };
}

interface CompanyDetail {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  specialize: string;
  logo: string | null; // Logo có thể là null nếu không có
  description: string | null; // Mô tả công ty có thể là null
  location: string | null; // Địa chỉ làm việc có thể là null
  link: string | null; // Link công ty có thể là null
  job_count: number; // Số lượng công việc là kiểu number
  recruiter_name: string; // Tên nhà tuyển dụng có thể là string, nếu không có sẽ trả về "Không rõ"
  jobs: Job[]; // Danh sách các công việc của công ty
}


const CompanyDetailPage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [companyDetail, setCompanyDetail] = useState<CompanyDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanyDetail = async () => {
      if (!id) return; // Kiểm tra id có tồn tại không

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/companies/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch company details");
        }
        const data = await response.json();
        setCompanyDetail(data); // Lưu thông tin chi tiết công ty vào state
      } catch (error) {
        console.error("Error fetching company details:", error);
        setError("Unable to load company details.");
      }
    };

    fetchCompanyDetail();
  }, [id]); // Gọi lại khi id thay đổi

  if (error) {
    return <div>{error}</div>;
  }

  if (!companyDetail) {
    return <div>Loading...</div>; // Hiển thị khi đang tải dữ liệu
  }


  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Chi tiết công ty</h2>

      <div className="flex flex-col lg:flex-row gap-4">
        {/* Section thông tin công ty */}
        <div className="w-full lg:w-3/4">
          <Card className="shadow-md p-4">
            <Title level={3}>{companyDetail.name}</Title>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Địa chỉ">{companyDetail.address}</Descriptions.Item>
              <Descriptions.Item label="Điện thoại">{companyDetail.phone}</Descriptions.Item>
              <Descriptions.Item label="Email">{companyDetail.email}</Descriptions.Item>
              <Descriptions.Item label="Chuyên ngành">{companyDetail.specialize}</Descriptions.Item>
              <Descriptions.Item label="Website">
                {companyDetail.link ? (
                  <a href={companyDetail.link} target="_blank" rel="noopener noreferrer">
                    {companyDetail.link}
                  </a>
                ) : (
                  'Chưa cập nhật'
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Mô tả">{companyDetail.description}</Descriptions.Item>
              <Descriptions.Item label="Địa điểm hoạt động">{companyDetail.location}</Descriptions.Item>
              <Descriptions.Item label="Số lượng công việc">{companyDetail.job_count}</Descriptions.Item>
              <Descriptions.Item label="Người tuyển dụng">{companyDetail.recruiter_name}</Descriptions.Item>
            </Descriptions>

            <div className="mt-4">
              <CustomButton
                text="Chặn công ty"
                onClick={() => console.log("Block company")}
                backgroundColor="red"
                hoverColor="darkred"
                style={{
                  width: '150px',
                  height: '40px',
                  fontSize: '15px',
                  fontWeight: '700',
                  borderRadius: '6px',
                  border: 'none',
                  transition: 'background-color 0.3s ease',
                }}
              />
            </div>
          </Card>
        </div>

        {/* Logo công ty */}
        <div className="w-full lg:w-1/4 flex justify-center items-center">
          <Card className="shadow-md p-4 flex justify-center items-center">
            <Title level={4}>Logo công ty</Title>
            <Image
              src={companyDetail.logo || '/default-logo.png'}
              alt={companyDetail.name}
              width={150}
              height={150}
              className="object-cover"
              preview={false}
            />
          </Card>
        </div>
      </div>

      {/* Danh sách công việc */}
      <h3 className="mt-6 text-xl font-semibold">Danh sách công việc</h3>
      <Table
        dataSource={companyDetail.jobs.map((job: Job) => ({
          key: job.id,
          title: job.title,
          description: job.description,
          salary_range: job.salary_range,
          work_location: job.work_location,
        }))}
        columns={[
          { title: 'Tên công việc', dataIndex: 'title', width: 250 },
          { title: 'Mô tả', dataIndex: 'description' },
          { title: 'Mức lương', dataIndex: 'salary_range', width: 150 },
          { title: 'Địa điểm làm việc', dataIndex: 'work_location', width: 200 },
        ]}
        pagination={false}
        bordered
        size="small"
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default CompanyDetailPage;
