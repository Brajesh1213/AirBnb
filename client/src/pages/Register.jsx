import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const registerUser = async (ev) => {
    ev.preventDefault();
    try {
      await axios.post('/register', { name, email, password });
      alert('Registration successful! Now you can log in.');
      navigate('/login');
    } catch (error) {
      // Extract error message from response or use a default message
      const errorMessage = error.response?.data?.error || 'Registration failed!';
      alert(errorMessage);
    }
  };

  return (
    <div className="mt-4 flex-grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
            required
          />
          <button className="primary" type="submit">Register</button>
          <div className="text-center py-2 text-gray-500">
            Already a member?{" "}
            <Link className="underline text-blue-500" to="/login">
              Log in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
