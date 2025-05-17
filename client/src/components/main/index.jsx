import styles from "./styles.module.css";
import { useState, useRef, useEffect, Fragment } from "react";
import axios from "axios";
import { Link, resolvePath, useNavigate } from "react-router-dom";
import eyeIcon from "../../assets/icons/eye.svg";
import eyeOff from "../../assets/icons/eye-slash.svg";

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

	const [editIndex, setEditIndex] = useState(null);
    const [editData, setEditData] = useState({
        _id: "",
		title: "",
        username: "",
        password: "",
        url: ""
    });

	const [passwordList, setPasswordList] = useState([]);
	const [error, setError] = useState("");
	const [notification, setNotification] = useState("");
	const [showPopup, setShowPopup] = useState(false);
	const [popupClosing, setPopupClosing] = useState(false);

	const [showDetailPopup, setShowDetailPopup] = useState(false);
    const [selectedPassword, setSelectedPassword] = useState(null);

	const [selectedRows, setSelectedRows] = useState([]);
	const [showEditPassword, setShowEditPassword] = useState(false);
	const [showNewPassword, setShowNewPassword] = useState(false);
	const [showDropdownPassword, setShowDropdownPassword] = useState(false);

	const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRows(passwordList.map((_, idx) => idx));
        } else {
            setSelectedRows([]);
        }
    };

    const handleCheckboxChange = (idx) => {
        setSelectedRows((prev) =>
            prev.includes(idx)
                ? prev.filter((i) => i !== idx)
                : [...prev, idx]
        );
    };

	const handleChange = ({ currentTarget: input }) => {
		setData({
			...data,
			passwords: {
				...data.passwords,
				[input.name]: input.value
			}
		});
	};

	const ref = useRef(null);
	const detailRef = useRef(null);

	useEffect(() => {
        const fetchPasswords = async () => {
            try {
                const url = "http://localhost:5000/api/showPassword";
                const { data: res } = await axios.post(url, { userEmail: localStorage.getItem("token") });
                setPasswordList(res.passwords);
            } catch (err) {
                setPasswordList([]);
            }
        };
        fetchPasswords();
    }, [notification]);

	const handleNew = async (e) => {
		e.preventDefault();
		try {
			const url = "http://localhost:5000/api/addPassword";
			const { data: res } = await axios.post(url, data);
			console.log(res.message);
			setData({
				userEmail: localStorage.getItem("token"),
				passwords: {
					title: "",
					username: "",
					password: "",
					url: ""
				},
			});
			setError("");
			setNotification("Password added/updated successfully!");
			setPopupClosing(true);
			setTimeout(() => {
				setShowPopup(false);
				setPopupClosing(false);
			}, 300);
            setTimeout(() => setNotification(""), 2500);
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

	const handleEditClick = (idx) => {
        setEditIndex(idx);
        setEditData({
			_id: passwordList[idx]._id,
			title: passwordList[idx].title,
			username: passwordList[idx].username,
			password: passwordList[idx].password,
			url: passwordList[idx].url
		});
    };

	const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

	const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/addPassword", {
                userEmail: localStorage.getItem("token"),
                passwords: editData
            });
            const updatedList = [...passwordList];
            updatedList[editIndex] = { ...editData };
            setPasswordList(updatedList);
            setEditIndex(null);
			setEditData({
				_id: "",
				title: "",
				username: "",
				password: "",
				url: ""
			});
            setNotification("Password updated successfully!");
			setPopupClosing(true);
			setTimeout(() => {
				setShowPopup(false);
				setPopupClosing(false);
			}, 300);
            setTimeout(() => setNotification(""), 2500);
        } catch (err) {
            setNotification("Failed to update password.");
            setTimeout(() => setNotification(""), 2000);
        }
    };

	const handleDeleteSelected = async () => {
        if (selectedRows.length === 0) return;
        const toDelete = selectedRows.map(idx => passwordList[idx]);
        try {
            await axios.post("http://localhost:5000/api/deletePassword", {
                userEmail: localStorage.getItem("token"),
                passwords: toDelete.map(item => ({
                    title: item.title,
                    username: item.username,
                    url: item.url
                }))
            });
            setPasswordList(passwordList.filter((_, idx) => !selectedRows.includes(idx)));
            setSelectedRows([]);
            setNotification("Deleted selected passwords!");
            setTimeout(() => setNotification(""), 2000);
        } catch (err) {
            setNotification("Failed to delete selected passwords.");
            setTimeout(() => setNotification(""), 2000);
        }
    };

	const togglePopup = () => {
		if (showPopup) {
            setPopupClosing(true);
            setTimeout(() => {
                setShowPopup(false);
                setPopupClosing(false);
            }, 300);
        } else {
            setShowPopup(true);
        }
	};

	const openDetailPopup = (password) => {
        setSelectedPassword(password);
        setShowDetailPopup(true);
    };
    const closeDetailPopup = () => {
        setShowDetailPopup(false);
        setSelectedPassword(null);
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

	useOnClickOutside(ref, () => {
		if (editIndex !== null) setEditIndex(null);
        if (showPopup) togglePopup();
    });
	useOnClickOutside(detailRef, () => {
        if (showDetailPopup) closeDetailPopup();
    });

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
					{notification && (
                        <div className={styles.notification}>{notification}</div>
                    )}
					<div className={styles.passwordList}>
                        <h2>Your Passwords</h2>
						{selectedRows.length > 0 && (
							<button
								className={styles.delete_btn}
								onClick={handleDeleteSelected}
								style={{
									marginBottom: "12px",
									background: "#d32f2f",
									color: "#fff",
									border: "none",
									borderRadius: "8px",
									padding: "8px 18px",
									cursor: "pointer",
									fontWeight: "bold",
									position: "fixed",
									fontFamily: "Poppins",
									right: 0,
									margin: "5px"
								}}
							>
								Delete
							</button>
						)}
                        {passwordList.length === 0 ? (
                            <p>No passwords found, please add one.</p>
                        ) : (
                            <table className={styles.passwordTable}>
                                <thead>
                                    <tr>
										<th style={{ width: "40px", textAlign: "center" }}>
											<input
												type="checkbox"
												checked={selectedRows.length === passwordList.length && passwordList.length > 0}
												onChange={handleSelectAll}
												aria-label="Select all"
											/>
										</th>
										<th>Name</th>
									</tr>
                                </thead>
                                <tbody>
									{passwordList.map((item, idx) => (
										<Fragment key={idx}>
											<tr>
												<td style={{ width: "40px", textAlign: "center" }}>
													<input
														type="checkbox"
														checked={selectedRows.includes(idx)}
														onChange={() => handleCheckboxChange(idx)}
													/>
												</td>
												<td colSpan={2} style={{ padding: 0, border: "none" }}>
													<div
														className={styles.passwordRow}
														style={{
															padding: "16px 24px",
															borderRadius: "12px",
															background: "#fff",
															marginBottom: "8px",
															boxShadow: "0 2px 8px rgba(89,65,169,0.08)",
															cursor: "pointer",
														}}
														onClick={() => setSelectedPassword(selectedPassword === idx ? null : idx)}
													>
														<div style={{ fontWeight: 600, color: "#5941A9", fontSize: "17px" }}>
															{item.title}
														</div>
														<div style={{ color: "#888", fontSize: "14px", marginTop: "2px" }}>
															{item.username}
														</div>
													</div>
												</td>
											</tr>
											{selectedPassword === idx && (
												<tr>
													<td colSpan={2} className={styles.dropdownRow}>
														<div className={styles.dropdownContent}>
															<strong>Password:</strong>
															<span className={styles.dropdown_password_wrapper}>
																<input
																	type={showDropdownPassword ? "text" : "password"}
																	value={item.password}
																	readOnly
																	className={styles.dropdown_password_input}
																	style={{
																		border: "none",
																		background: "transparent",
																		fontSize: "15px",
																		color: "#333",
																		padding: 0,
																		outline: "none",
																		width: "auto",
																		minWidth: "80px"
																	}}
																/>
																<button
																	type="button"
																	className={styles.dropdown_eye_btn}
																	onClick={() => setShowDropdownPassword(v => !v)}
																	tabIndex={-1}
																	aria-label={showDropdownPassword ? "Hide password" : "Show password"}
																>
																	<img
																		src={showDropdownPassword ? eyeOff : eyeIcon}
																		alt={showDropdownPassword ? "Hide password" : "Show password"}
																		style={{ width: 20, height: 20 }}
																	/>
																</button>
															</span>
															<br />
															<strong>URL:</strong> {item.url}
														</div>
													</td>
													<button
														className={styles.edit_btn}
														onClick={(e) => {
															e.stopPropagation();
															handleEditClick(idx);
														}}
													>
														Edit
													</button>
												</tr>
											)}
											{editIndex !== null && (
												<div ref={ref} className={`${styles.popup} ${popupClosing ? styles.popupClosing : ""}`}>
													<div className={styles.close} onClick={() => setEditIndex(null)}>x</div>
													<h2 style={{
														marginTop: "16px",
														fontSize: "24px",
														fontWeight: "600",
														color: "#44327f",
														textAlign: "center"
													}}>Edit Password</h2>
													<form noValidate method="post" onSubmit={handleEditSubmit}>
														{error && <div className={styles.error_message}>{error}</div>}
														<div>
															<input
																type="text"
																name="title"
																placeholder="Title"
																required
																onChange={handleEditChange}
																value={editData.title}
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
																onChange={handleEditChange}
																value={editData.username}
																className={styles.input}
															/>
														</div>
														<br />
														<div className={styles.inputWrapper}>
															<input
																type={showEditPassword ? "text" : "password"}
																name="password"
																placeholder="Password"
																required
																onChange={handleEditChange}
																value={editData.password}
																className={`${styles.input} ${styles.inputWithIcon}`}
															/>
															<button
																type="button"
																className={styles.eyeBtnEdit}
																onClick={() => setShowEditPassword(v => !v)}
																tabIndex={-1}
																aria-label={showEditPassword ? "Hide password" : "Show password"}
															>
																<img
																	src={showEditPassword ? eyeOff : eyeIcon}
																	alt={showEditPassword ? "Hide password" : "Show password"}
																	style={{ width: 22, height: 22 }}
																/>
															</button>
														</div>
														<br />
														<div>
															<input
																type="text"
																name="url"
																placeholder="URL"
																required
																onChange={handleEditChange}
																value={editData.url}
																className={styles.input}
															/>
														</div>
														<div>
															<button type="submit" className={styles.save_btn}>
																Save
															</button>
															<button
																type="button"
																className={styles.cancel_btn}
																onClick={() => setEditIndex(null)}
															>
																Cancel
															</button>
														</div>
													</form>
												</div>
											)}
										</Fragment>
									))}
								</tbody>
                            </table>
                        )}
                    </div>
					{showPopup && (
						<div ref={ref} className={`${styles.popup} ${popupClosing ? styles.popupClosing : ""}`}>
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
								<div className={styles.inputWrapper}>
									<input
										type={showNewPassword ? "text" : "password"}
										name="password"
										placeholder="Password"
										required
										onChange={handleChange}
										value={data.passwords.password}
										className={`${styles.input} ${styles.inputWithIcon}`}
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
									<button
										type="button"
										className={styles.eyeBtnNew}
										onClick={() => setShowNewPassword(v => !v)}
										tabIndex={-1}
										aria-label={showNewPassword ? "Hide password" : "Show password"}
									>
										<img
											src={showNewPassword ? eyeOff : eyeIcon}
											alt={showNewPassword ? "Hide password" : "Show password"}
											style={{ width: 22, height: 22 }}
										/>
									</button>
								</div>
								<div>
									<button type="submit">
										Add password
									</button>
								</div>
							</form>
						</div>
					)}
					{showDetailPopup && selectedPassword && (
					<div ref={detailRef} className={styles.detailDropdown}>
						<div className={styles.close} onClick={closeDetailPopup}>×</div>
						<h2>Password Details</h2>
						<div><strong>Title:</strong> {selectedPassword.title}</div>
						<div><strong>Username:</strong> {selectedPassword.username}</div>
						<div><strong>Password:</strong> {selectedPassword.password}</div>
						<div><strong>URL:</strong> {selectedPassword.url}</div>
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