import axios from 'axios';

const Api = axios.create({
    baseURL: 'https://hrsystemapitest.azurewebsites.net/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

export default Api;