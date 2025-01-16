import { useState, useEffect } from 'react';

// Custom hook để lấy chiều rộng cửa sổ màn hình

const useWindowWidth = (): number => {
    const [windowWidth, setWindowWidth] = useState<number>(0);

    useEffect(() => {
        // Kiểm tra xem có phải đang ở phía client không
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowWidth(window.innerWidth);
            };

            // Lắng nghe sự kiện thay đổi kích thước
            window.addEventListener('resize', handleResize);

            // Cập nhật khi lần đầu render
            handleResize();

            // Dọn dẹp sự kiện khi component unmount
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, []);

    return windowWidth;
};

export default useWindowWidth;
