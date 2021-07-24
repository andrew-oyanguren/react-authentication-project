import { useRef, useContext } from 'react';

import { useHistory } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {
  const history = useHistory();

  const authCtx = useContext(AuthContext);

  const newPasswordInputRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault(AuthContext);

    const enteredNewPassword = newPasswordInputRef.current.value;

    // Add Validation (optional)

    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyCh58qTyq6d-A0LvAWeb-sSvs3NYMnOw8c',
      {
        method: 'POST',
        body: JSON.stringify({      // JSON.stringify to convert our javascript object to JSON data
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnSecureToken: false,
        }),
        headers: {
          'Content-Type': 'application/json'      // Tells server the type of data you are sending
        }
      }
    ).then((res) => {
      // assumption: Always Succeeds!

      history.replace('/auth');
    });

  };

  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' minLength="7" ref={newPasswordInputRef} />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;


/* 

* Notes:

1) use useRef to handle form inputs:

* connect to inputs with the 'ref' props.

2) create form submission handler:

* pass in event, to prevent default() and avoid an http request/page reload.

==Inside Handler ==

We want to create entered password by accessing 'current.value' on our input ref,
and storing it into a constant.



=== Send Request with New Password data ===

Inside out submit handler we need to send a request for new password.

What the Server wants:

We need to send a configuration object, and our mthod needs to be a 'POST',
and application/json data.

== body ==

The server wants three pieces of data in the body:

1. idToken: Id Token recieved after authentication precess (sign in).
2. password: New user Password.
3. returnSecureToken: whether or not to return an ID and refresh token.

== idToken ==

Our idToken is stored in our context, so that we have access to it from aywhere in our app,
and we need to use useContext as well as import our main context file, to access our idToken.

== useContext ==

Call useContext() and pass our context files AuthContex into it,
and then store it into a constant (authCtx) which allows us to access our context object.


=== Handle error cases in our fetch() call ===

We want to make sure our new password is validated, for example if it's too short,
then we want to handle that returned error.

* Since we have already done this practice in this project, we will simply add the
'minLength' prop, that automatically enforces a minimum length of whatever numbered value we give it.



=== Noted for sending token to API's ===

Different API's may have other ways in sending a user's idToken.

1. May need to send token in the headers section
2. May need to send token with a query attached to the api url path (&token=)
3. Or in the body like in firebase.

* It depends on the API rules.



=== Redirect User ===

We want to import and use useHistory to call replace on the history object,
and redirect the user away after successfully creating a new password.

*/