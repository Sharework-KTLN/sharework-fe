export interface Company {
    id: number;
    name: string;
    address?: string;
    phone: string;
    email: string;
    logo?: string;
    recruiter_id?: number;
    created_at?: string; // ISO timestamp format
}