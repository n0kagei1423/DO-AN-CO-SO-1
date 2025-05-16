import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Settings = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	const [ data ] = useState({
		userEmail: localStorage.getItem("token"),
		title: "",
		username: "",
		password: "",
		url: ""
	});

	const [error, setError] = useState("");

	const handleNew = async () => {
		try {
			const url = "http://localhost:5000/api/addPassword";
			const { data: res } = await axios.post(url, data);
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

	return (
		<>
			<meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Dashboard</title>
            <link rel="stylesheet"/>
			<div className={styles.container}>
				<div className={styles.sidebar}>
					<h1>Dashboard</h1>
					<div className={styles.nav}>
						<div className={styles.box2}><Link to={"/"} className={styles.box2}>Vault</Link></div>
						<div className={styles.box}><Link to={""} className={styles.box}>Settings</Link></div>
					</div>
				</div>
				{error && <div className={styles.error_message}>{error}</div>}
				<div className={styles.content}>
					<h1>Welcome, {localStorage.getItem("token")}</h1>
				</div>
			</div>
			<div className={styles.navbar}>
					<button className={styles.white_btn} onClick={handleLogout}>
						Logout
					</button>
					<button className={styles.new_btn}>
						+ New
					</button>
			</div>
			
		</>
	);
};

export default Settings;