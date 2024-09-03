import React from 'react';
import Footer from './components/Footer';
import CoolHeading from './components/CoolHeading';

const App: React.FC = () => {
    return (
        <div>
            <CoolHeading
                title="Solana"
                subtitle="Your journey to Web3 starts here" visible={false} />
            {/* Your other components */}
            <Footer />
        </div>
    );
};

export default App;