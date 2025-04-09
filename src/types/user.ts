export interface User {
    id: number | null ;
    email: string;
    password: string;
    full_name: string;
    role: 'CANDIDATE' | 'RECRUITER' | 'ADMIN'; // tùy theo enum role_users của bạn
    phone?: string;
    profile_image?: string;
    gender?: string;
    date_of_birth?: string; // hoặc Date nếu bạn muốn parse
    address?: string;
    school?: string;
    course?: string;
    specialize?: string;
    file_url: string;
}