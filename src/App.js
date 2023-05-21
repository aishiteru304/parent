import './App.css';
import React, { useState } from 'react';
import axios from 'axios';

const SERVER_URL = 'http://localhost:8080'; // URL của server

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [token, setToken] = useState('');

  const handleLogin = () => {
    axios
      .post(`${SERVER_URL}/login`, { username: 'user1', password: 'password1' })
      .then((response) => {
        const { token } = response.data;
        setLoggedIn(true);
        setToken(token);
        console.log(token)
      })
      .catch((error) => {
        console.error('Đăng nhập không thành công', error);
      });
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setToken('');
  };

  const handleAuthenticatedRequest = () => {
    axios
      .post(`${SERVER_URL}/authenticate`, { token })
      .then((response) => {
        const { user } = response.data;
        console.log('Thông tin người dùng:', user);
      })
      .catch((error) => {
        console.error('Lỗi xác thực', error);
      });
  };

  return (
    <div>
      {loggedIn ? (
        <div>
          <h2>Đã đăng nhập</h2>
          <button onClick={handleLogout}>Đăng xuất</button>
          <button onClick={handleAuthenticatedRequest}>Yêu cầu xác thực</button>
        </div>
      ) : (
        <div>
          <h2>Chưa đăng nhập</h2>
          <button onClick={handleLogin}>Đăng nhập</button>
        </div>
      )}
    </div>
  );
}

export default App;
