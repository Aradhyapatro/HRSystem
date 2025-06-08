import { useContext } from 'react';
import '../Styles/LoginPage.css';
import AppContext from '../Context/AppContext';
import Api from "../Api/api"
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { username, password, setPassword, setUsername, setJwt, setRole } = useContext(AppContext)
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (username.trim() && password.trim()) {
      const jwt = await Api.post('/auth/Login', { username, password })
      const data = jwt.data
      if (data) {
        setJwt(data)
        const role = await Api.get('/auth/getRole', {
          headers: {
            Authorization: `Bearer ${data}`
          }
        })
        if (role.data) {
          setRole(role.data)
          localStorage.setItem('jwt', data)
        }
        navigate("/")
      }

    } else {
      alert('Please enter both username and password');
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default LoginPage;
