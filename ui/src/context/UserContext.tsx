import React from "react";
import { History } from 'history';
import { createToken, dablLoginUrl, damlPartyKey, damlPartyNameKey, damlTokenKey } from "../config";

type AuthenticatedUser = {
  isAuthenticated : true
  token : string
  party : string
  partyName: string
}

type UnAthenticated = {
  isAuthenticated : false
}

type UserState = UnAthenticated | AuthenticatedUser

type LoginSuccess = {
  type : "LOGIN_SUCCESS"
  token : string
  party : string
  partyName: string
}

type LoginFailure = {
  type : "LOGIN_FAILURE"
}

type SignoutSuccess = {
  type : "SIGN_OUT_SUCCESS"
}

type LoginAction = LoginSuccess | LoginFailure | SignoutSuccess

const UserStateContext = React.createContext<UserState>({ isAuthenticated: false });
const UserDispatchContext = React.createContext<React.Dispatch<LoginAction>>({} as React.Dispatch<LoginAction>);

function userReducer(state : UserState, action : LoginAction) : UserState {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return { isAuthenticated: true, token: action.token, party: action.party, partyName: action.partyName };
    case "LOGIN_FAILURE":
      return { isAuthenticated: false };
    case "SIGN_OUT_SUCCESS":
      return { isAuthenticated: false };
  }
}

const UserProvider : React.FC = ({ children }) => {
  const party = localStorage.getItem(damlPartyKey);
  const partyName = localStorage.getItem(damlPartyNameKey);
  const token = localStorage.getItem(damlTokenKey);

  const initState : UserState = (!!party && !!token && !!partyName) ? { isAuthenticated : true, token, party, partyName } : { isAuthenticated : false };
  const [state, dispatch] = React.useReducer<React.Reducer<UserState,LoginAction>>(userReducer, initState);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  const context = React.useContext<UserState>(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  const context = React.useContext<React.Dispatch<LoginAction>>(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}


// ###########################################################

function loginUser(
    dispatch : React.Dispatch<LoginAction>,
    party : string,
    partyName: string,
    userToken : string,
    history : History,
    setIsLoading : React.Dispatch<React.SetStateAction<boolean>>,
    setError : React.Dispatch<React.SetStateAction<boolean>>) {
  setError(false);
  setIsLoading(true);

  if (!!party) {
    const token = userToken || createToken(party)
    localStorage.setItem(damlPartyKey, party);
    localStorage.setItem(damlPartyNameKey, partyName);
    localStorage.setItem(damlTokenKey, token);

    dispatch({ type: "LOGIN_SUCCESS", token, party, partyName });
    setError(false);
    setIsLoading(false);
    history.push("/app");
  } else {
    dispatch({ type: "LOGIN_FAILURE" });
    setError(true);
    setIsLoading(false);
  }
}

const loginDablUser = () => {
  window.location.assign(`https://${dablLoginUrl}`);
}

function signOut(dispatch : React.Dispatch<LoginAction>, history : History) {
  localStorage.removeItem(damlPartyKey);
  localStorage.removeItem(damlPartyNameKey);
  localStorage.removeItem(damlTokenKey);

  dispatch({ type: "SIGN_OUT_SUCCESS" });
  history.push("/login");
}

export { UserProvider, useUserState, useUserDispatch, loginUser, loginDablUser, signOut };
