import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [surname, setSurname] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (event) => {
    try {
      event.preventDefault();
      //check null value
      if (
        email.trim() === "" ||
        firstname.trim() === "" ||
        surname.trim() === "" ||
        password.trim() === "" ||
        password2.trim() === ""
      ) {
        return alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      }

      //check Email Repeat
      const response = await axios.post(
        "http://localhost:5000/checkEmailRepeat",
        {
          email: email,
        }
      );
      if (response.data.status == "repeat") {
        return alert("อีเมลนี้ถูกใช้ไปแล้ว");
      }

      //check condition Password and re Password
      if (password.length < 8 || password.length > 16) {
        return console.log(
          "เงื่อนไข: Password จะต้องมี8-16ตัวอักษร \nมีตัวอักษรพิเศษ และตัวพิมพ์ใหญ่อย่างน้อยตัว"
        );
      }
      if (!/[^a-zA-Z0-9]/.test(password)) {
        return console.log(
          "เงื่อนไข: Password จะต้องมี8-16ตัวอักษร \nมีตัวอักษรพิเศษ และตัวพิมพ์ใหญ่อย่างน้อยตัว"
        );
      }
      if (!/[A-Z]/.test(password)) {
        return console.log(
          "เงื่อนไข: Password จะต้องมี8-16ตัวอักษร \nมีตัวอักษรพิเศษ และตัวพิมพ์ใหญ่อย่างน้อยตัว"
        );
      }
      if (password !== password2) {
        return console.log("password ไม่ตรงกัน");
      }

      //INSERT data to database table users
      const res = await axios.post("http://localhost:5000/signUp", {
        firstname,
        surname,
        email,
        isAdmin: 0,
        password,
      });
      if(res.data.status == "ok"){
        console.log("register success")
        navigate("/")
      }else{
        console.log("register fail")
      }

    } catch (err) {console.log("Error =",err)}
  };

  return (
    <div className="pageSignIn-Up">
      <div className="SignIn-UpComponent" id="signUp">
        <form onSubmit={handleSignUp}>
          <h3>SignUp</h3>
          <label>
            Email:
            <br />
            <input
              type="text"
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <br />
          <label>
            Firstname:
            <br />
            <input
              type="text"
              name="firstname"
              value={firstname}
              onChange={(event) => setFirstname(event.target.value)}
            />
          </label>
          <br />
          <label>
            Surname:
            <br />
            <input
              type="text"
              name="surname"
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
            />
          </label>
          <br />
          <label>
            Password:
            <br />
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          <br />
          <label>
            Password Again:
            <br />
            <input
              type="password"
              name="password"
              value={password2}
              onChange={(event) => setPassword2(event.target.value)}
            />
          </label>
          <div>
            <button
              type="button"
              onClick={() => {
                navigate("/");
              }}
            >
              Cancel
            </button>

            <button type="submit">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
