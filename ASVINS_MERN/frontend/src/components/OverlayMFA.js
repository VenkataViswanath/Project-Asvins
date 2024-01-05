import React from 'react';
import '../css/OverlayMFA.css';

const OverlayMFA = ({children}) => {
    return (
        <div className="overlay">
            <div className="overlay-content">
                {children}
            </div>
        </div>
    );
};

export default OverlayMFA;