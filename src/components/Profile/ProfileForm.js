import classes from "./ProfileForm.module.css";
import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router";

const ProfileForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const newPasswordInputRef = useRef();
  const submitHandler = (event) => {
    event.preventDefault();
    const newEnteredPassword = newPasswordInputRef.current.value;
    const url =
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCEbZF6oV6y4jFQMiCHk64MKUvAKY6VMAI";

    fetch(url, {
      method: "POST",
      body: JSON.stringify({
        idToken: authCtx.token,
        password: newEnteredPassword,
        returnSecureToken: false,
      }),
      headers: { "Content-type": "application/json" },
    }).then((res) => {
      history.replace("/");
    });
  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
