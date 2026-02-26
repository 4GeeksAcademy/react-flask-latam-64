import { Link } from "react-router-dom";
import FavoriteFormDropdown from "./FavoriteFormDropdown";
import LoginFormDropdown from "./LoginFormDropdown"
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {

	const { store, actions } = useGlobalReducer()

	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container-fluid">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="flex-grow">
					{store.token ?
						<div className="d-flex gap-1 align-items-center">
							<span>Hola {store.userFullName}</span>
							<FavoriteFormDropdown />
							<button type="button" className="btn btn-primary" onClick={() => actions.logout()}>
								Cerrar sesion
							</button>
						</div> :
						<LoginFormDropdown />
					}

				</div>
			</div>
		</nav>
	);
};