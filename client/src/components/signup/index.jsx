import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

import user from "../../assets/icons/user.svg";
import password from "../../assets/icons/password.svg";

const Signup = () => {
	const [data, setData] = useState({
		username: "",
		email: "",
		password: "",
	});

	const [confirmPassword] = useState('')
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:5000/api/users";
			const { data: res } = await axios.post(url, data);
			navigate("/login");
			console.log(res.message);
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

	// const checkPassword = (rule, value, callback) => {
	// 	if (value && value !== form.getFieldValue('Password')) {
	// 		callback("The passwords don't match");
	// 	} else {
	// 		callback();
	// 	}
	// };

	// const  { touched  } = formState;

	// const onVerifyNewPassword = () => {
	// 	if(touched.newpassword === true && touched.confirmpassword === true){
	// 		if(newpassword !== confirmpassword){
	// 			console.log('The passwords dont match')
	// 			return
	// 		}else{
	// 			console.log('Ok.')
	// 		}
	// 	}
  	// }


	return (
		<>
			<meta charSet="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Manager - Login</title>
			<link rel="stylesheet"/>
			<div className={styles.wrapper}>
				<h1>Register</h1>
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
						id="email"
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
					<label htmlFor="username">@</label>
					<input
						type="text"
						id="username"
						name="username"
						placeholder="Username"
						required
						onChange={handleChange}
						value={data.username}
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
					<input
						type="password"
						id="password"
						name="password"
						placeholder="Password"
						required
						onChange={handleChange}
						value={data.password}
						className={styles.input}
					/>
				</div>
				<br />
				<div>
					<label htmlFor="re-password">
					<img
						src={password}
						alt="re-password"
						className="re-password"
						height="24px"
					/>
					</label>
					<input
						type="password"
						id="re-password"
						name="re-password"
						placeholder="Confirm password"
						required
						onChange={handleChange}
						value={data.password}
						className={styles.input}
					/>
				</div>
				<div>
					<button type="submit">
						register
					</button>
				</div>
				<div className={styles.ask}>
					<p>
						Already have an account? <Link to="/login">Login</Link>
					</p>
				</div>
				</form>
			</div>
		</>

	);
};

export default Signup;