import styles from "./styles.module.css";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	return (
		<>
			<div className={styles.wrapper}>
				<nav className={styles.navbar}>
					<h1>PassX</h1>
					<button className={styles.white_btn} onClick={handleLogout}>
						Logout
					</button>
					<button className={styles.new_btn}>
						+ New
					</button>
				</nav>
			</div>
		</>
	);
};

export default Main;