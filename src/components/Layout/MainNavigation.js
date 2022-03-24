import { Link } from "react-router-dom";
import { useContext } from "react";
import classes from "./MainNavigation.module.css";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router";

const MainNavigation = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const logoutHandler = () => {
    authCtx.logout();
    history.replace("/auth");
  };

  const userIsLoggedIn = authCtx.isLoggedIn;
  return (
    <header className={classes.header}>
      <Link to="/">
        <div className={classes.logo}>LTI Demo Tool</div>
      </Link>
      <nav>
        <ul>
          {!userIsLoggedIn && (
            <li>
              <Link to="/auth">Start Assignment</Link>
            </li>
          )}
          {userIsLoggedIn && (
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {userIsLoggedIn && (
            <li>
              <button onClick={logoutHandler}>Logout</button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
