import React, { useState } from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
import { PartyToken, DamlHubLogin } from '@daml/hub-react';
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Fade from "@material-ui/core/Fade";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useUserDispatch, loginUser, loginDablUser } from "../../context/UserContext";
import { getPartiesJSON, storeParties } from "../../parties";
import { isLocalDev } from "../../config";
import useStyles from "./styles";
import logo from "./logo.svg";
import { Divider } from "@material-ui/core";

const Login = (props : RouteComponentProps) => {
  const classes = useStyles();
  const userDispatch = useUserDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [loginValue, setLoginValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [parties, setParties] = useState<PartyToken[]>();
  const [selectedPartyId, setSelectedPartyId] = useState('');

  const handleParties = async (parties: PartyToken[], store?: boolean) => {
    if (parties.length > 0) {
      setParties(parties);
      setSelectedPartyId(parties[0].party);
      store && storeParties(parties);
    }
  };

  const handleLogin = () => {
    const partyDetails = parties?.find(p => p.party === selectedPartyId);

    if (partyDetails) {
      loginUser(userDispatch, partyDetails.party, partyDetails.partyName, partyDetails.token, props.history, setIsLoading, setError);
    } else {
      console.error('Failed to Login', 'No parties.json or party selected');
    }
  };

  return (
    <Grid container className={classes.container}>
      <div className={classes.logotypeContainer}>
        <img src={logo} alt="logo" className={classes.logotypeImage} />
        <Typography className={classes.logotypeText}>App Template</Typography>
      </div>
      <div className={classes.formContainer}>
        <div className={classes.form}>
            <>
              <DamlHubLogin
                options={{
                  method: {
                    file: {
                      render: () => (
                        <label className={classes.customFileUpload}>
                          {' '}
                          <AttachFileIcon />
                          <p className="dark">Load Parties</p>
                        </label>
                      ),
                    },
                  },
                }}
                partiesJson={getPartiesJSON()}
                onPartiesLoad={(creds, err) => {
                  if (creds) {
                    handleParties(creds, true);
                  } else if (err) {
                    console.error(err)
                  }
                }}
              />
              <Select className={classes.partySelect} disabled={!parties} placeholder="Choose a party" value={selectedPartyId} onChange={(e => setSelectedPartyId(e.target.value as string))}>
                {parties?.map(p =>
                  <MenuItem key={p.party} value={p.party}>{p.partyName}</MenuItem>
                )}
              </Select>
              <div className={classes.formButtons}>
                <Button variant="contained" onClick={(handleLogin)}>Login</Button>
              </div>
              <Divider />
              {!isLocalDev &&
                <>
                  <Button className={classes.dablLoginButton} variant="contained" color="primary" size="large" onClick={loginDablUser}>
                    Log in with DABL
                  </Button>
                  <Divider />
                </>}
              <Fade in={error}>
                <Typography color="secondary" className={classes.errorMessage}>
                  Something is wrong with your login or password :(
                </Typography>
              </Fade>
              <TextField
                id="email"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={loginValue}
                onChange={e => setLoginValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    loginUser(
                      userDispatch,
                      loginValue,
                      loginValue,
                      passwordValue,
                      props.history,
                      setIsLoading,
                      setError,
                    )
                  }
                }}
                margin="normal"
                placeholder="Username"
                type="email"
                fullWidth
              />
              <TextField
                id="password"
                InputProps={{
                  classes: {
                    underline: classes.textFieldUnderline,
                    input: classes.textField,
                  },
                }}
                value={passwordValue}
                onChange={e => setPasswordValue(e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    loginUser(
                      userDispatch,
                      loginValue,
                      loginValue,
                      passwordValue,
                      props.history,
                      setIsLoading,
                      setError,
                    )
                  }
                }}
                margin="normal"
                placeholder="Password"
                type="password"
                fullWidth
              />
              <div className={classes.formButtons}>
                {isLoading ?
                  <CircularProgress size={26} className={classes.loginLoader} />
                : <Button
                    disabled={loginValue.length === 0}
                    onClick={() =>
                      loginUser(
                        userDispatch,
                        loginValue,
                        loginValue,
                        passwordValue,
                        props.history,
                        setIsLoading,
                        setError,
                      )
                    }
                    variant="contained"
                    color="primary"
                    size="large"
                  >
                    Login
                  </Button>}
              </div>
            </>
        </div>
      </div>
    </Grid>
  );
}

export default withRouter(Login);
