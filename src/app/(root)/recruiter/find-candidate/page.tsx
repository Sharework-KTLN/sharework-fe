'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { Input, Select, Row, Col, Card, Pagination, Typography, Modal } from 'antd';
import { User } from '@/types/user'; // Đường dẫn đến file user.ts
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { openChatWithUser } from '@/redux/slice/chatSlice';
import StandaloneChatbox from '@/components/ui/StandaloneChatbox';
import Image from 'next/image';

const { Title, Paragraph } = Typography;
const { Option } = Select;

const FindCandidatePage = () => {

    // Redux
    const dispatch = useDispatch();

    const user = useSelector((state: RootState) => state.user);

    const router = useRouter();
    const [candidates, setCandidates] = useState<Array<User>>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 6;
    const paginatedData = candidates?.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");

    // / State để lưu giá trị các trường filter
    const [searchName, setSearchName] = useState('');
    const [searchLocation, setSearchLocation] = useState('');
    const [searchIndustry, setSearchIndustry] = useState('');
    const [searchSkills, setSearchSkills] = useState<string[]>([]);

    // State để lưu ID ứng viên đang chat
    const [selectedCandidateId, setSelectedCandidateId] = useState<number | null>(null);

    const fetchCandidates = useCallback(async () => {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setModalMessage("Bạn cần đăng nhập để truy cập vào danh sách ứng viên.");
                setShowModal(true);
                return;
            }

            const searchParams = {
                name: searchName,
                location: searchLocation,
                industry: searchIndustry,
                skills: searchSkills.join(','),
            };
            const queryString = new URLSearchParams(searchParams).toString();

            const res = await fetch(`http://localhost:8080/user/getAllCandidates/${user.id}?${queryString}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (res.status === 403) {
                setModalMessage("Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.");
                setShowModal(true);
                return;
            }

            if (!res.ok) throw new Error("Lỗi khi lấy danh sách ứng viên");

            const data: User[] = await res.json();
            setCandidates(data);
        } catch (error) {
            console.error("Lỗi fetch ứng viên:", error);
        }
    }, [user?.id, searchName, searchLocation, searchIndustry, searchSkills]);
    useEffect(() => {
        const debounceTimeout = setTimeout(() => {
            if (user?.id) {
                fetchCandidates();
            }
        }, 500);

        return () => clearTimeout(debounceTimeout);
    }, [fetchCandidates, user?.id]);


    const handleSearchNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchName(e.target.value);
    const handleLocationChange = (value: string) => setSearchLocation(value);
    const handleIndustryChange = (value: string) => setSearchIndustry(value);
    const handleSkillsChange = (value: string[]) => setSearchSkills(value);
    const handleModalOk = () => {
        setShowModal(false);
        router.push("/auth/recruiter/login");
    };

    const handleModalCancel = () => {
        setShowModal(false);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    // Mở chat khi nhấn vào ứng viên
    const handleCardClick = (candidateId: number) => {
        setSelectedCandidateId(candidateId);
    };
    return (
        <div className="w-[95%] max-w-screen-xl mx-auto py-6">
            <Title level={2}>Tìm kiếm ứng viên</Title>

            {/* Bộ lọc tìm kiếm */}
            <div className="mb-6">
                <Row gutter={16}>
                    <Col span={6}>
                        <Input
                            placeholder="Tìm theo tên hoặc trường học"
                            value={searchName}
                            onChange={handleSearchNameChange}
                        />
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder="Chọn vị trí"
                            style={{ width: '100%' }}
                            value={searchLocation}
                            onChange={handleLocationChange}
                        >
                            <Option value="HN">Hà Nội</Option>
                            <Option value="HCM">Hồ Chí Minh</Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder="Chọn lĩnh vực"
                            style={{ width: '100%' }}
                            value={searchIndustry}
                            onChange={handleIndustryChange}
                        >
                            <Option value="it">CNTT</Option>
                            <Option value="marketing">Marketing</Option>
                        </Select>
                    </Col>
                    <Col span={6}>
                        <Select
                            placeholder="Chọn kỹ năng"
                            style={{ width: '100%' }}
                            mode="multiple"
                            value={searchSkills}
                            onChange={handleSkillsChange}
                        >
                            <Option value="js">JavaScript</Option>
                            <Option value="react">React</Option>
                            <Option value="node">Node.js</Option>
                        </Select>
                    </Col>
                </Row>
            </div>

            <Title level={4} className="mb-4">Các ứng viên tiềm năng</Title>

            {/* Danh sách ứng viên */}
            {/* Danh sách ứng viên hoặc thông báo khi không có */}
            {candidates.length > 0 ? (
                <>
                    <Row gutter={[16, 16]}>
                        {paginatedData.map((candidate) => (
                            <Col span={8} key={candidate.id}>
                                <Card
                                    hoverable
                                    className="p-4"
                                    onClick={() => candidate.id !== null && handleCardClick(candidate.id)}
                                >
                                    <div className="flex flex-row">
                                        <div className="w-1/3 pr-4 flex items-center">
                                            <Image
                                                alt={candidate.full_name}
                                                width={100}
                                                height={100}
                                                src={candidate.profile_image || 'https://inkythuatso.com/uploads/thumbnails/800/2022/03/4a7f73035bb4743ee57c0e351b3c8bed-29-13-53-17.jpg'}
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
                                            <p className="text-gray-600 line-clamp-2">
                                                {candidate.introduce_yourself}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Phân trang */}
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
            {/* Hiển thị StandaloneChatbox nếu có ứng viên được chọn */}
            {selectedCandidateId && (
                <StandaloneChatbox conversationId={selectedCandidateId} />
            )}
            {/* Modal cảnh báo đăng nhập */}
            <Modal
                title="Thông báo"
                open={showModal}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Đăng nhập"
                cancelText="Ở lại"
            >
                <p>{modalMessage}</p>
            </Modal>
        </div>
    );
};

export default FindCandidatePage;
