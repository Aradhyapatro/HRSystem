import './App.css';
import LoginPage from "./Components/LoginPage"
import AdminScreen from "./Components/AdminScreen"
import OperationScreen from "./Components/OperationScreen"
import { Route, BrowserRouter as Router, Routes, useNavigate } from 'react-router-dom';
import HomePage from './Components/HomePage';
import DepartmentScreen from './Components/DepartmentScreen';
import AppContext from './Context/AppContext';
import { useContext, useEffect } from 'react';
import Api from './Api/api';

function App() {
  const { role, setJwt, jwt, setRole } = useContext(AppContext)
  const navigate = useNavigate()

  const validate = async (token) => {
    try {
      const res = await Api.get('auth/isExpired', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);

      return res.data;
    } catch (error) {
      console.error('Token validation failed', error);
      setJwt('');
      localStorage.removeItem('jwt');
      navigate('/Login')
    }
  };

  const setRoleFunc = async (token) => {
    const res = await Api.get('auth/getRole', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setRole(res.data)
  }

  useEffect(() => {
    const caching = async () => {

      const token = localStorage.getItem('jwt');
      if (token) {
        setJwt(token);
        const data = await validate(token);

        if (data == false) {
          await setRoleFunc(token)
          navigate('/')
        }
      }
    }
    caching();
  }, []);

  return (

    <Routes>
      <Route path='/' element={<HomePage></HomePage>}></Route>
      {(role === 'HR' || role === 'ADMIN') && <Route path='/Operations' element={<OperationScreen></OperationScreen>}></Route>}
      <Route path='/Login' element={<LoginPage />}></Route>
      {role === 'ADMIN' && <Route path='/Admin' element={<AdminScreen></AdminScreen>}></Route>}
      {role === 'ADMIN' && <Route path='/Department' element={<DepartmentScreen></DepartmentScreen>}></Route>}
      <Route path='/**' element={<div>404 not found</div>}></Route>
    </Routes>
  );
}

export default App;
