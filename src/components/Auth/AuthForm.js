import { useState, useRef, useContext } from 'react';

import { useHistory } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import classes from './AuthForm.module.css';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // Optional Validation:
    setIsLoading(true);
    let url;
    if (isLogin) {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCh58qTyq6d-A0LvAWeb-sSvs3NYMnOw8c';
    } else {
      url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCh58qTyq6d-A0LvAWeb-sSvs3NYMnOw8c';
    }

    fetch(
      url,
      {
        method: 'POST',
        body: JSON.stringify({
          email: enteredEmail,
          password: enteredPassword,
          returnSecureToken: true
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    ).then((res) => {
      setIsLoading(false);
      if (res.ok) {
        return res.json();
      } else {
        return res.json().then((data) => {
          let errorMessage = 'Authentication Failed';
          if (data && data.error && data.error.message) {
            errorMessage = data.error.message;
          }
          throw new Error(errorMessage);
        });
      }
    }).then((data) => {
      const expirationTime = new Date(new Date().getTime() + (+data.expiresIn * 1000));         // '+' to convert string numer to a number, * 1000 to convert to milliseconds
      authCtx.login(data.idToken, expirationTime.toISOString());      // 'toISOString' converts number into string
      history.replace('/');      // Just slash redirects to the starting page.
    }).catch((err) => {
      alert(err.message);
    });
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
          {isLoading && <p>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;


/*

=== Redirectiing if fetch is successful ===

We want to focuse on redirecting the user after the login successfully.

=== useHistory ===

We can of course import and use the 'useHistory' hook in order to redirect the user.

We can create a history object by calling useHistory,
and then we can use the history object in our .then() successful block,
to call '.replace()' on that history object, and replace the current page.

* NOTE: Because this is a login, authentication page, we want to use replace(),
and not push() because we don't want the user to be able to go back in the browser.

*/