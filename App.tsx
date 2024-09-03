import React from 'react';
import Footer from './components/Footer';
import CoolHeading from './components/CoolHeading';

const App: React.FC = () => {
    return (
        <div>
            <CoolHeading
                title="Solana"
                subtitle="Your Future in Blockchain"
            />
            {/* Your other components */}
            <Footer />
        </div>
    );
};

export default App;