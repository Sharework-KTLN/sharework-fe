import React from 'react';

const name = 'John'; // Lỗi: thiếu dấu chấm phẩy


const Header = () => {
    return (
        <div>
            <h1>Hello {name}!</h1>
        </div>
    );
};

export default Header;
