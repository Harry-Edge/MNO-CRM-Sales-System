import React, {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";

const styles = () => ({
      postcodeValidation: {
        width: '65%',
        paddingRight: '10px',
        paddingBottom: '20px'

    },
    mobValidation: {
        minWidth: '65%',
        marginTop: 0,
        paddingRight: '10px',
        paddingBottom: '15px',
        height: '53px',

    },
    button: {
        color: 'white',
        textTransform: 'none',
        backgroundColor: '#009999',
        borderColor: '#009999',

        '&:hover': {
        backgroundColor: '#008080',
        borderColor: '#008080'
        },
    },
    boxColour: {
        backgroundColor: '#fdfcfe',
        borderColor: 'blue'
    },
    header: {
        fontWeight: 650
    },

});

class OrderValidations extends Component {

    state = {
             orderReadyForValidation: this.props.orderReadyForValidation,
             postcode: '',
             postcodeValidated: false,
             postcodeError: false,
             monthOfBirth: '',
             monthOfBirthValidated: false,
             mobError: '',
             otpCTN: '',
             oneTimePin: '',
             oneTimePinInputted: '',
             oneTimePinError: '',
             ctn: this.props.state.mobileAccount.number
    }
    handlePostcodeInput = (event) => {
        event.preventDefault()
        this.setState({postcode: event.target.value})

    }
    handleValidatePostcode = () => {
        console.log(this.state.postcode)
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({string: this.state.postcode, ctn: this.state.ctn})
        }

        fetch('http://127.0.0.1:8000/api/validate-postcode', requestOptions)
            .then((response) => {
                if (response.ok){
                    this.setState({postcodeValidated: true, postcodeError: false})
                }else{
                    this.setState({postcodeError: true})
                }
            }).catch((error)=> {
                console.log(error)
            }
          )
    }

    handleMonthOfBirth = (event) => {
        this.setState({monthOfBirth: event.target.value})
    }
    handleValidateMOB = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({string: this.state.monthOfBirth, ctn: this.state.ctn})
        }

         fetch('http://127.0.0.1:8000/api/validate-mob', requestOptions)
            .then((response) => {
                if (response.ok){
                    this.setState({monthOfBirthValidated: true, mobError: ''})
                }else{
                    this.setState({mobError: 'Incorrect Month of Birth'})
                }
            }).catch((error)=> {
                console.log(error)
            }
          )
    }
    handleSelectOneTimePinNumber = (event) => {
        this.setState({otpCTN: event.target.value})
    }
    handleSendOneTimePin = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({number: this.state.otpCTN})
        }

        fetch('http://127.0.0.1:8000/api/send-one-time-pin', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({oneTimePin: data.pin})
        })
    }
    handleValidateOneTimePin = () => {

        if (this.state.oneTimePin === this.state.oneTimePinInputted){
            this.setState({oneTimePinError: ""})
            this.props.onReadyForSubmission()
        }else{
            this.setState({oneTimePinError: "Invalid Pin"})
        }
    }

    render() {

        const {classes, state} = this.props

        return (
                 <Grid container>
                    <br/>
                    <br/>
                    <Grid item xs={12}>
                        <TextField size='small' className={classes.postcodeValidation} variant='outlined'
                                   label='Last 3 Characters of Postcode'
                                   error={this.state.postcodeError}
                                   disabled={!this.props.orderReadyForValidation}
                                   onChange={(e) => this.handlePostcodeInput(e)} />
                         <Button className={classes.button} color='secondary'
                                 variant='contained'
                                 type='submit'
                                 disabled={!this.props.orderReadyForValidation}
                                 onClick={() => this.handleValidatePostcode()}>Submit</Button>

                    </Grid>
                     <Grid item xs={12}>
                          <FormControl variant="outlined"  margin='dense' className={classes.mobValidation}>
                            <InputLabel id="mob">Month Of Birth</InputLabel>
                            <Select
                              labelId="mob"
                              label="mob"
                              error={!!this.state.mobError}
                              value={this.state.monthOfBirth}
                              disabled={!this.state.postcodeValidated}
                              onChange={(e) => this.handleMonthOfBirth(e)}
                            >
                              <MenuItem value=''>
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value={1}>January</MenuItem>
                              <MenuItem value={2}>February</MenuItem>
                              <MenuItem value={3}>March</MenuItem>
                              <MenuItem value={4}>April</MenuItem>
                              <MenuItem value={5}>May</MenuItem>
                              <MenuItem value={6}>June</MenuItem>
                              <MenuItem value={7}>July</MenuItem>
                              <MenuItem value={8}>August</MenuItem>
                              <MenuItem value={9}>September</MenuItem>
                              <MenuItem value={10}>October</MenuItem>
                              <MenuItem value={11}>November</MenuItem>
                              <MenuItem value={12}>December</MenuItem>
                            </Select>
                          </FormControl>
                         <Button className={classes.button} color='secondary'
                                 variant='contained'
                                 disabled={!this.state.postcodeValidated}
                                 onClick={() => this.handleValidateMOB()}
                                 type='submit'>Submit</Button>

                    </Grid>
                    <Grid item xs={12} className={classes.boxColour}>
                        <Typography className={classes.header} style={{paddingLeft: 3}}>One-Time Pin</Typography>
                        <Box m={1}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Box m={1}>
                                        <FormControl className={classes.otpCtnSelect}>
                                            <Select
                                                onChange={(event) => this.handleSelectOneTimePinNumber(event)}
                                                displayEmpty
                                                disabled={!this.state.monthOfBirthValidated}
                                                value={this.state.otpCTN}>
                                                      <MenuItem value="">
                                                        <em>Select CTN</em>
                                                      </MenuItem>
                                                     {
                                                        state.otherLines.map((otherLine, index) => {
                                                            return (
                                                                <MenuItem value={otherLine.number}
                                                                    key={index}>{otherLine.number}</MenuItem>
                                                                )
                                                            })
                                                     }

                                            </Select>
                                        </FormControl>
                                            <Button
                                                className={classes.button}
                                                style={{marginLeft: '15px'}} color='secondary'
                                                variant='contained'
                                                disabled={!this.state.otpCTN}
                                                onClick={() => this.handleSendOneTimePin()}
                                             >Send</Button>
                                    </Box>
                                </Grid>
                                 <Grid item xs={6} style={{marginTop: 4}}>
                                       <TextField size='small' className={classes.postcodeValidation} variant='outlined'
                                       label='Pin'
                                       error={!!this.state.mobError}
                                       onChange={(event) => {this.setState({oneTimePinInputted: event.target.value})}}
                                       disabled={!this.state.oneTimePin}/>
                                        <Button className={classes.button} style={{marginLeft: '15px'}} color='secondary'
                                         variant='contained'
                                         disabled={!this.state.oneTimePinInputted}
                                         onClick={() => this.handleValidateOneTimePin()}
                                         type='submit'>Confirm</Button>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
        )
    }
}
export default withStyles(styles)(OrderValidations)