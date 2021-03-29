import React, { Component } from 'react';
import Dashboard from "./Dashboard";
import Login from "./LoginComponents/Login";

class CamelotPro extends Component {

    state = {
      loggedIn: localStorage.getItem('token') ? true : false,
      initialCTN: ''
    }

  handleLogin = () => {
      this.setState({loggedIn: true})
  }

  handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentCTN');
    this.setState({ loggedIn: false});
  };

  render() {
    return (
      <div>
          {
              this.state.loggedIn ?
                  <Dashboard  onLogout={this.handleLogout}/>

                  :  <Login onLogin={this.handleLogin}/>
          }
      </div>
    );
  }
}
export default CamelotPro;