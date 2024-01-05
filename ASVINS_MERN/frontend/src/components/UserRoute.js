import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/useAuthContext';

const UserRoute = ({children}) => {
    const { user } = getUser();

    if(!user) {
        return <Navigate to="/" />;
    }
    return children;

};

export default UserRoute;
