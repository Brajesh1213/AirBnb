import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../UserContex';
// UserContext
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const { setUser } = useContext(UserContext); // Correctly use the UserContext

  const handleLoginSubmit = async (ev) => {
    ev.preventDefault();
    try {
      const { data } = await axios.post('/user/login', { email, password });
      setUser(data); // Set user data from response

      alert('Login successful');
      setRedirect(true);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
      alert(errorMessage);
    }
  };

  if (redirect) {
    return <Navigate to="/" />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mb-2 p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4 p-2 border rounded"
          />
          <button className="primary p-2 border rounded" type="submit">Login</button>
          <div className="text-center py-2 text-gray-500 mt-4">
            Do not have an account yet?{" "}
            <Link className="underline text-blue-500" to="/register">
              Register now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
