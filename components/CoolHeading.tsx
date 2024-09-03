import React from 'react';

interface CoolHeadingProps {
    title: string;
    subtitle?: string;
    visible: boolean;
}

const CoolHeading: React.FC<CoolHeadingProps> = ({ title, subtitle, visible }) => {
    if (!visible) return null;

    return (
        <div>
            <h1 className="cool-heading">{title}</h1>
            {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
    );
};

export default CoolHeading;