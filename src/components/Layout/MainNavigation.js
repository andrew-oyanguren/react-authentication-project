import { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthContext from '../../store/auth-context';
import classes from './MainNavigation.module.css';

const MainNavigation = () => {

  const authCtx = useContext(AuthContext);

  const isLoggedIn = authCtx.isLoggedIn;

  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          { !isLoggedIn && (
            <li>
              <Link to='/auth'>Login</Link>
            </li>
          )}
          { isLoggedIn && (
            <li>
              <Link to='/profile'>Profile</Link>
            </li>
          )}
          { isLoggedIn && (
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


/*

=== Logging a User out ===

* NOTE: When using the 'token' approach, the server does not store any information
about the login state of the user, it just returns a token. So we dont need to send any
request to the server.

== Clear our token ==

So we just need to make sure that we clear our token in our context state.

== Logout Handler ==

So we will access are logout function in our context, as it already sets our token to null,
we just have to call it in our logoutHandler.

Then only connect our handler to the button, is left, with the onClick event prop.

*/
