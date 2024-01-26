import "./debug.scss";

const Debug = () => {
	return (
		<div className="debug">
			<div>You are connecting to localhost!</div>
			<p
				onClick={() => {
					localStorage.clear();
					window.location.reload();
				}}
			>
				Clear Localstorage
			</p>
		</div>
	);
};

export default Debug;
