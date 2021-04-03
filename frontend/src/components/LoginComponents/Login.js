import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(23),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  title:  {
    fontWeight: 650
  },

  avatar: {
    margin: theme.spacing(3),
    backgroundColor: '#009999',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2),
  },
  signUp: {
    fontWeight: 600
  },
  signInButton: {
    margin: theme.spacing(3, 0, 2),
    color: 'white',
    borderBottom: '1px solid black',
    backgroundColor: '#009999',
       fontWeight: 550,
        '&:hover': {
            backgroundColor: '#008080',
        }
  },

});

class Login extends Component {

    state = {
      username: '',
      password: '',
      credentialsError: '',

    };

   handleLogin = (e) => {

    e.preventDefault();

    const data = {'username': this.state.username, 'password': this.state.password}

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }

    fetch('http://localhost:8000/token-auth/', requestOptions)
      .then((response) => response.json())
      .then((data) => {

        if (data.token) {
            localStorage.setItem('token', data.token);
            this.props.onLogin()
        }else{
            console.log("error")
            this.setState({credentialsError: 'Invalid Username or Password'})
        }
      });
  };


  render() {

    const {classes} = this.props

    return (
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography className={classes.title} component="h2" variant="h3">
               Excalibur Pro
            </Typography>
            <form className={classes.form} onSubmit={(e) => this.handleLogin(e)} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                error={this.state.credentialsError}
                required
                fullWidth
                id="employee Username"
                label="Employee Username"
                name="employee Username"
                autoComplete="employee Username"
                autoFocus
                onChange={(e) =>{
                    this.setState({username: e.target.value})
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                error={this.state.credentialsError}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e) =>{
                    this.setState({password: e.target.value})
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className={classes.signInButton}
              >
                Sign In
              </Button>
            </form>
          </div>
        </Container>
    )
  }
}
export default withStyles(styles)(Login)