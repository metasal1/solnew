import React from 'react';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();
    const myUrl = 'https://metasal.xyz'; // Replace with your URL

    return (
        <footer>
            <p>
                &copy; {currentYear} | <a href={myUrl} target="_blank" rel="noopener noreferrer">@metasal</a>
            </p>
        </footer>
    );
};

export default Footer;