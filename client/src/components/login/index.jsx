import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "../styles.module.css";

import user from "../../assets/icons/user.svg";
import password from "../../assets/icons/password.svg";
import eye from "../../assets/icons/eye.svg";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
    const [type, setType] = useState('password');;

    const handleToggle = () => {
		if (type==='password'){
			setType('text')
			return false
		} else {
			setType('password')
			return true
		}
	}

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:5000/api/auth";
			const { data: res } = await axios.post(url, data);
			localStorage.setItem("token", data.email);
			window.location = "/";
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	return (
        <>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Manager - Login</title>
            <link rel="stylesheet"/>
            <div className={styles.wrapper}>
                <h1>Login</h1>
                {error && <div className={styles.error_message}>{error}</div>}
                <form noValidate method="post" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">
                    <img
                        src={user}
                        alt="email"
                        className="email"
                        height="24px"
                    />
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        onChange={handleChange}
                        value={data.email}
                        className={styles.input}
                    />
                </div>
                <br />
                <div>
                    <label htmlFor="password">
                    <img
                        src={password}
                        alt="password"
                        className="password"
                        height="24px"
                        
                    />
                    </label>
                    <span>
						<img
							src={eye }
							alt="eye"
							className={styles.eye}
							height="24px"
							onClick={handleToggle}
						/>
					</span>
                    <input
                        type={type}
                        name="password"
                        placeholder="Password"
                        required
                        onChange={handleChange}
                        value={data.password}
                        className={styles.input}
                    />
                </div>
                <div className={styles.forgotpassword}>
                    <p>
                    <a href="reset_password.html" className={styles.forgotpassword}>
                        Reset Password
                    </a>
                    </p>
                </div>
                <div>
                    <button type="submit">
                    Login
                    </button>
                </div>
                <div>
                    <p>
                    Don't have an account? <Link to="/signup"> Register</Link>
                    </p>
                </div>
                </form>
            </div>
        </>

	);
};

export default Login;