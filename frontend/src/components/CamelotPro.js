import React, { Component } from 'react';
import Dashboard from "./Dashboard";
import Login from "./LoginComponents/Login";

class CamelotPro extends Component {

    state = {
      loggedIn: false,
      initialCTN: ''
    }

  handleLogin = (e, username, password) => {

    e.preventDefault();

    const data = {'username': username, 'password': password}

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
            this.setState({loggedIn: true,});
        }
      });
  };

  handleLogout = () => {
    localStorage.removeItem('token');
    this.setState({ loggedIn: false});
  };

  handleInitialCtn = (CTN) => {
      this.setState({initialCTN: CTN})
  }

  render() {
    return (
      <div>
          {
              this.state.loggedIn ?
                  <Dashboard initialCTN={this.state.initialCTN} onLogout={this.handleLogout}/>

                  :  <Login onInitialCTN={this.handleInitialCtn} onLogin={this.handleLogin}/>
          }
      </div>
    );
  }
}
export default CamelotPro;