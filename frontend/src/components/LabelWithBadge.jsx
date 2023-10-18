import React from 'react'
import { Label } from './Label';

const LabelWithBadge = ({ children, htmlFor, badge=0 }) => {

    const renderBadge = () => {
        if(!badge) return null;
        return (
            <span className='dark:bg-dark-subtle bg-light-subtle absolute top-0 right-0 w-5 h-5 rounded-full flex items-center justify-center text-white translate-x-5 -translate-y-1 text-sm'>
                {(badge <= 9)? badge: '9+'}
            </span>
        );
    };

    return (
        <div className="relative">
            <Label htmlFor={htmlFor}>{children}</Label>
            {renderBadge()}
        </div>
    );
};

export default LabelWithBadge