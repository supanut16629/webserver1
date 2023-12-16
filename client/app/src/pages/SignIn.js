import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/login", {
        email: email,
        password: password,
      });

      const { status, token, data } = response.data;
      if (status === "ok") {
        console.log(token, data);
        setEmail("");
        setPassword("");
        localStorage.setItem("token", token);
        alert("Login success");

        //collect to redux state
        navigate("/main");
      } else {
        console.log(response);
        setEmail("");
        setPassword("");
        alert("Login Fail");
      }
    } catch (err) {
      console.error("Login failed:", err.response.data.message);
    }
  };

  return (
    <div>
      <div className="pageSignIn-Up">
        <div className="SignIn-UpComponent">
          <form>
            <h3>SignIn</h3>
            <label>
              <h4>Email:</h4>
              <input
                type="text"
                required={true}
                placeholder="Enter your email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <h4>Password:</h4>
              <input
                type="password"
                required={true}
                value={password}
                placeholder="Enter your password"
                onChange={(event) => setPassword(event.target.value)}
              />
              <div>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/signUp");
                  }}
                >
                  <p>Sign Up</p>
                </button>
                <button type="button" onClick={() => handleLogin()}>
                  <p>Log In</p>
                </button>
              </div>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
