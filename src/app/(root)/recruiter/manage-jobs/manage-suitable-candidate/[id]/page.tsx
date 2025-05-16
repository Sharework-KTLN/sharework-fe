'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Row, Col, Card, Pagination, Spin } from 'antd';
import Image from 'next/image';
import ContactButton from '@/components/ContactButton';
import { User } from '@/types/user';

const pageSize = 6;

const ManageSuitableCandidates = () => {
    const { id } = useParams();
    const router = useRouter();

    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const fetchCandidates = async () => {
            try {
                setLoading(true);

                const token = localStorage.getItem('recruiterToken'); // hoặc sessionStorage nếu bạn lưu ở đó
                if (!token) {
                    console.warn("Không tìm thấy token!");
                    return;
                }

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/user/getAllCandidatesMatchWithJob/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                const validCandidates = Array.isArray(data.candidates) ? data.candidates : [];

                // Lọc những ứng viên có tfidf_score > 0
                const filtered = validCandidates.filter((c: User) => (c.tfidf_score ?? 0) > 0);

                setCandidates(filtered);
            } catch (err) {
                console.error("Lỗi khi gọi API:", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchCandidates();
    }, [id]);


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleCardClick = (candidateId: number) => {
        router.push(`/candidates/${candidateId}`);
    };

    // Tính dữ liệu hiện tại theo trang
    const paginatedData = candidates.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    if (loading) {
        return (
            <div className="text-center mt-12">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Ứng viên phù hợp</h2>

            {candidates.length > 0 ? (
                <>
                    <Row gutter={[16, 16]}>
                        {paginatedData.map((candidate: User) => (
                            <Col span={8} key={candidate.id}>
                                <Card
                                    hoverable
                                    className="p-4"
                                // onClick={() => candidate.id !== null && handleCardClick(candidate.id)}
                                >
                                    <div className="flex flex-row">
                                        <div className="w-1/3 pr-4 flex items-center">
                                            <Image
                                                alt={candidate.full_name}
                                                width={100}
                                                height={100}
                                                src={
                                                    candidate.profile_image ||
                                                    'https://inkythuatso.com/uploads/thumbnails/800/2022/03/4a7f73035bb4743ee57c0e351b3c8bed-29-13-53-17.jpg'
                                                }
                                                className="w-full h-auto rounded object-cover"
                                            />
                                        </div>
                                        <div className="w-2/3">
                                            <h3 className="font-semibold text-lg mb-1">{candidate.full_name}</h3>
                                            <p className="mb-1">
                                                <strong>Trường:</strong> {candidate.school}
                                            </p>
                                            <p className="mb-1">
                                                <strong>Chuyên ngành:</strong> {candidate.specialize}
                                            </p>
                                        </div>
                                        <ContactButton
                                            userId={candidate.id ?? 0}
                                            userRole="candidate"
                                            buttonText="Liên hệ"
                                            buttonType="primary"
                                            buttonSize="large"
                                        />
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    <div className="mt-6 text-center">
                        <Pagination
                            current={currentPage}
                            total={candidates.length}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                        />
                    </div>
                </>
            ) : (
                <div className="text-center text-gray-500 mt-12 text-lg italic">
                    Hiện tại chưa có ứng viên nào phù hợp với tiêu chí tìm kiếm.
                </div>
            )}
        </div>
    );
};

export default ManageSuitableCandidates;
