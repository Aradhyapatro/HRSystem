import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppContext from '../Context/AppContext';
import HomeScreen from './HomeScreen';
import LoginPage from './LoginPage';

const HomePage = () => {
    const { jwt } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!jwt) {
            navigate('/Login'); // redirect to login if jwt is null
        }
    }, [jwt, navigate]);

    return jwt ? <HomeScreen /> : <LoginPage></LoginPage>;
};

export default HomePage;
