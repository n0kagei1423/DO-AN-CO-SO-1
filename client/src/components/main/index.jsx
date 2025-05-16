import styles from "./styles.module.css";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	const [ data, setData ] = useState({
		userEmail: localStorage.getItem("token"),
		passwords: {
			title: "",
			username: "",
			password: "",
			url: ""
		},
	});

	const handleChange = ({ currentTarget: input }) => {
		setData({
			...data,
			passwords: {
				...data.passwords,
				[input.name]: input.value
			}
		});
	};

	const [error, setError] = useState("");

	const handleNew = async (e) => {
		e.preventDefault();
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

	const ref = useRef();

	const [showPopup, setShowPopup] = useState(false);
	const togglePopup = () => {
		setShowPopup(!showPopup);
	};

	function useOnClickOutside(ref, handler) {
		useEffect(
			() => {
				const listener = (event) => {
					if (!ref.current || ref.current.contains(event.target)) {
					return;
					}
					handler(event);
				};
				document.addEventListener("mousedown", listener);
				document.addEventListener("touchstart", listener);
				return () => {
					document.removeEventListener("mousedown", listener);
					document.removeEventListener("touchstart", listener);
				};
			},
			[ref, handler]
		);
	}

	useOnClickOutside(ref, () => setShowPopup(false));

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
						<div className={styles.box}><Link to={""} className={styles.box}>Vault</Link></div>
						<div className={styles.box2}><Link to={"/settings"} className={styles.box2}>Settings</Link></div>
					</div>
				</div>
				<div className={styles.content}>
					<h1>Welcome, {localStorage.getItem("token")}</h1>
					{showPopup && (
						<div ref={ref} className={styles.popup}>
							<div className={styles.close} onClick={togglePopup}>x</div>
							<h2>New Item</h2>
							<form noValidate method="post" onSubmit={handleNew}>
								{error && <div className={styles.error_message}>{error}</div>}
								<div>
									<input
										type="text"
										name="title"
										placeholder="Title"
										required
										onChange={handleChange}
										value={data.passwords.title}
										className={styles.input}
									/>
								</div>
								<br />
								<div>
									<input
										type="text"
										name="username"
										placeholder="Username"
										required
										onChange={handleChange}
										value={data.passwords.username}
										className={styles.input}
									/>
								</div>
								<br />
								<div>
									<input
										type="password"
										name="password"
										placeholder="Password"
										required
										onChange={handleChange}
										value={data.passwords.password}
										className={styles.input}
									/>
								</div>
								<br />
								<div>
									<input
										type="text"
										name="url"
										placeholder="URL"
										required
										onChange={handleChange}
										value={data.passwords.url}
										className={styles.input}
									/>
								</div>
								<div>
									<button type="submit">
										Add password
									</button>
								</div>
							</form>
						</div>
					)}
				</div>
			</div>
			<div className={styles.navbar}>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
				<button className={styles.new_btn} onClick={togglePopup}>
					+ New
				</button>
			</div>
			
		</>
	);
};

export default Main;