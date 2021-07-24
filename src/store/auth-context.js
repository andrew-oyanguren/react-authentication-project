import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;

const AuthContext = React.createContext({
  token: '',
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {}
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjExpirationTime = new Date(expirationTime).getTime();

  const remainingTime = adjExpirationTime - currentTime;

  return remainingTime;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem('token');
  const storedExpirationDate = localStorage.getItem('expirationTime');

  const remainingTime = calculateRemainingTime(storedExpirationDate);

  if (remainingTime <= 3600) {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');
    return null;
  }

  return {
    token: storedToken,
    duration: remainingTime
  };
};

export const AuthContextProvider = (props) => {
  const tokenData = retrieveStoredToken();

  let initialToken;

  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [token, setToken] = useState(initialToken);

  // Helper Constant:
  const userIsLoggedIn = !!token // a 'not not' statment simply converts this to a boolean value.

  const logoutHandler = useCallback(() => {
    setToken(null);

    // Remove localStorage variable:
    localStorage.removeItem('token');
    localStorage.removeItem('expirationTime');

    // Check logoutTimer/settimeout
    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  // Called after logout so we can call logout in our function.
  const loginHandler = (token, expirationTime) => {
    setToken(token);

    // Create localStorage variable:
    localStorage.setItem('token', token);
    localStorage.setItem('expirationTime', expirationTime);

    // call calculateRemaing time function:
    const remainingTime = calculateRemainingTime(expirationTime);

    // Set our timeout function():
    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  const contextValue = {
    token: token,
    isLoggedIn: userIsLoggedIn,
    login: loginHandler,
    logout: logoutHandler
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


/*
== Auto setting login state ==

instead of using useEffect() on page load, we can create an initialToken constant.

initialToken: This is a helper constant that will call getItem() on the local storage and get the 'token'
key. Either it will have the token value or be undefined.

** Now we can use that initialToken to set our (local-state) token value initially.
So when it renders on load it is either already logged in or undefined.
This gives us the same behavior as using useEffect to check the localStorage data, 
and then manually setting it on page load.


=== Auto Loggin out ===

The Token, for security reasons, expires after a certain amount of time.
Now we want to also auto log the user out, when the token expires.

* The goal is to set a timer that matches the expiration time of the token,
and that expiration time is also included on the server response to a successful authentication.

* NOTE: We also want to set that timer in the localStorage so that when we reload the page the timer
still matches the expiration time.


=== Setting the ExpirationTime ===

So it makes sense that we also set the expirationTime in the login handler.

1. We then can calculate the remaining time by taking the current time,
and deducting it from the expiration time.

2. We then want to store the expiration time in local storage,
so if we reloaded we can re calculate that remaining time correctly.

=== Start with Setting Time ===

First we want to set the time when login handler is executed.

== Helper (calc) Function ==

We can create a helper function that will get passed in the expiration time as a parameter,
and we want to set the remaining time in milliseconds.
* Milliseconds so we can use that time in setTimeout().

* Inside Function:

== Get Current Time (milliseconds) ==

We can creat a new constant "currenTime" and set the equals to new Date().

new Date(): returns the current time stamp. 

Then we can call .getTime() on that Date() call,
and that will return that current time stamp in milliseconds.


== Convert expirationTime into milliseconds ==

We then can create a new adjusted expiration time constant,
and set that equals to calling new Date(), but then passing 
our expiration time into new Date(), to convert it to a date object,
and then calling getTime(), again, to convert the time stamp into milliseconds.

== Creating out remaing time and returning it ==

Then we can create our remaining time constant by taking our adjusted Expiration time,
and subtracting currentime from it.

lastly returning our new remaining time.

== Using our calcFunction in LodinHandler ==

Next we can call our calcfunction that returns the remaing time,
and pass into it the expiration time the loginhandler recieves,
and lastly store it in a remaining time constant.

== creating timeout function ==

Now we can call a timeout() in our loginhandler, that executes the logoutHandler,
* So we need to call login after logout so we can use it in out login handler,
and the second argument is our remaining time constant, which is in milliseconds.



=== Clearing Timeout ===

We also want to clear our setTimout() function if the user logged out manually.



*/