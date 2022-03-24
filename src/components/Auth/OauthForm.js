import { useState, useRef, useContext } from "react";
import classes from "./AuthForm.module.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

const OauthForm = () => {
  const history = useHistory();
  const authCtx = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const userName = "demouser1";
  const userEmail = "demomail@test.com";
  const userId = "id_12345";

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);

    let bearerToken = "Bearer ";

    const reqConfig = {
      method: "post",
      url: "/api/lti/authorize?login_hint=1224&lti_message_hint=55555",
      data: { userName, userEmail, userId },
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await axios(reqConfig);
      setIsLoading(false);
      const data = response.data;
      console.log("token--", data.data.token);
      bearerToken = bearerToken + data.token;
      console.log("DATA IS---->", data);
      history.replace("/");
    } catch (err) {
      setIsLoading(false);
      console.log("FETCH ERROR-->", err);
    }
  };
  return (
    <section className={classes.auth}>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>Allow access to Platform</div>

        <div className={classes.actions}>
          <button>Allow</button>

          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            Reject
          </button>
        </div>
      </form>
    </section>
  );
};

export default OauthForm;
