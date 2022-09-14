import React from 'react';

const Button = ({ id, text, color, onClick }) => {
    return (
        <button id={id} onClick={onClick} style={{ backgroundColor: color }} className='btn'>{text}</button>
    );
};

export default Button;
