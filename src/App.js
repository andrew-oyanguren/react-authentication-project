import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import AuthContext from './store/auth-context';
import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

function App() {
  const authCtx = useContext(AuthContext);

  const { isLoggedIn } = authCtx;

  return (
    <Layout>
      <Switch>
        <Route path='/' exact>
          <HomePage />
        </Route>
        {!isLoggedIn && (
          <Route path='/auth'>
            <AuthPage />
          </Route>
        )}
        
        <Route path='/profile'>
          { isLoggedIn && <UserProfile /> }
          { !isLoggedIn && <Redirect to='/auth' /> }
        </Route>
       
        <Route path='*'>
          <Redirect to='/' />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;


/*

* NOTES: 

We need to store our returned token so that it is accesible in other areas of our app.
It should be some app-wide state.

=== Ading Navigation Gaurds ===

We want to protect certain pages from loading when the user does not have access to it,
because a user can just manually enter the path file to (for example) the user profile page,
and we want to stop that from being possible.

* NOTE: It's much simpler than it sounds! It's just about dynamically rendering <Route>'s,
in our main app, when the user is logged in or not.

== Concept ==

We can render a route conditionally, and that route will only be accessible if that condition is true.

* We can use the user's current authentication status as the condition to render these routes, 
and or make them available.

== Rendering Routes Conditionally ==

1. We need to import useContext from react, and the AuthContext from the store.
2. Then we need to create an authCtx constant object, and use the 'isLoggedIn' state
to add conditional statements and dynamically render protected routes.

* NOTE: Remember you can get really creative and dynamically render your routes
and or the components in those routes, based on the authentication status!



=== Dealing with losing authentication status ===

Every time we reload the page or enter an address manually we lose our authentication state, 
the context state gets reset to its initial state.

* We don't want to lose this current state, and we don't want our user to lose their login status,
at least for a certain amount of time.

It's typical for a token to expire after a certain amount of time, and we get that duration time in the response
object from the server, when we send our http authentication request and sign in.

=== We need to Store the Token ===

We can store this into browser memory:

1) cookies
2) localstorage

Here we will use localstorage.

=== Local Storage ===

The goal is that when we log in, not only do we want to set our token from the response data,
and set our isLoggedIn local state to true, we want to create some state and store it into local storage.

* All in our loginHandler, where this happens.

=== Using Local storage ===

We want to do 3 things:

1. Login: On the localStorage api we want to setItem() and create a state variable
2. Logout: On the localStorage ap we want to removeItem() to clear that localstorage variable.
3. We want to check local storage on page load and dynamically set isLoggedIn state variable to true
if there is an isLogged in variable in local storage, meaning the user already logged in.

== Set Local Storage ==

On Login, we want to call setItem() on localStorage, and setItem takes two arguments:

1. Key
2. Value

* NOTES: these must be strings or numbers (simple Javascript)


== Remove Local Storage ==

On Logout, we want to call either clear() or removeItem() on localStorage.

* Clear: will completely remove and clear the entire local state.
* RemoveItem: wants the key name, and removes only that key/value pair.


*/