import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

const SearchParamsHandler = () => {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get('token');
        console.log("token:", token);

        if (token) {
            localStorage.setItem('token', token); // Lưu token vào localStorage
            router.replace('/'); // Xóa token khỏi URL
        }
    }, [searchParams, router]);

    return null; // Không render gì cả
};

export default SearchParamsHandler;
