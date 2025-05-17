import styles from "./styles.module.css";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Settings = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.location.reload();
    };

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            return;
        }
        try {
            const url = "http://localhost:5000/api/changePassword";
            const { data: res } = await axios.post(url, {
                userEmail: localStorage.getItem("token"),
                oldPassword,
                newPassword,
            });
            setSuccess(res.message || "Password changed successfully.");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            if (
                error.response &&
                error.response.status >= 400 &&
                error.response.status <= 500
            ) {
                setError(error.response.data.message);
            } else {
                setError("An error occurred. Please try again.");
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
                <div className={styles.content}>
                    <h1>Welcome, {localStorage.getItem("token")}</h1>
                    <h2 style={{ marginTop: 32 }}>Change Password</h2>
                    <form className={styles.changePasswordForm} onSubmit={handleChangePassword} autoComplete="off">
                        <div>
                            <input
                                type="password"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={e => setOldPassword(e.target.value)}
                                className={styles.input}
                                autoComplete="current-password"
                            />
                        </div>
                        <br />
                        <div>
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className={styles.input}
                                autoComplete="new-password"
                            />
                        </div>
                        <br />
                        <div>
                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className={styles.input}
                                autoComplete="new-password"
                            />
                        </div>
                        <br />
                        {error && <div className={styles.error_message}>{error}</div>}
                        {success && <div className={styles.success_message}>{success}</div>}
                        <button type="submit" className={styles.save_btn}>Change Password</button>
                    </form>
                </div>
            </div>
            <div className={styles.navbar}>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </>
    );
};

export default Settings;