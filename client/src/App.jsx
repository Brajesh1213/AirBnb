// import React from 'react';
import { Route, Routes } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import LoginPage from './pages/LoginPage';
import Layout from './Layout';
import Register from './pages/Register';
import axios from 'axios';
import { UserContexProvidor } from './UserContex';
import AccountPage from './pages/AccountPage';
import PalacesPage from './pages/PalacesPage';

axios.defaults.baseURL="http://localhost:5000"
axios.defaults.withCredentials= true;
const App = () => {
  
  return (
    <UserContexProvidor>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account/:subpage?" element={<AccountPage />} />
        <Route path="/account/:subpage/:action" element={<PalacesPage />} />
 
        {/* <Route path="/account/places" element={<AccountPage />} />  */}

      </Route>
    </Routes>
    </UserContexProvidor>
  );
};

export default App;
