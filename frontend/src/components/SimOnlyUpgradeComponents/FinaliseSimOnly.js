import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import HouseholdView from "../HouseholdView";
import Box from "@material-ui/core/Box";
import SimOnlyBasket from "./SimOnlyBasket";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItem from "@material-ui/core/ListItem";
import List from '@material-ui/core/List'
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import TextField from '@material-ui/core/TextField'
import Button from "@material-ui/core/Button";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl'

const styles = (theme) => ({
    header: {
        fontWeight: 650
    },
     tableColor:{
        backgroundColor: '#fdfcfe'
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 400
    },
    basket: {
        padding: theme.spacing(1),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 400
    },
      basketTitle: {
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 650
    },
    boxColour: {
        backgroundColor: '#fdfcfe',
        borderColor: 'blue'
    },
    spendCapList: {
        height: '16vh',
        width: '95%',
        overflow: 'scroll',

    },
    listItem: {
        fontSize: '0.9em'
    },
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
    otpCtnSelect: {
        width: '50%'
    },
    currentlySelected: {
        backgroundColor: '#f2f2f2'
    }

});

class FinaliseSimOnly extends Component {

    state = {ctn: this.props.state.mobileAccount.number,
             spendCaps: null,
             renderBasket: true,
             capSelected: null,
             continueInsurance: null,
             orderReadyForValidation: false,
             postcode: '',
             postcodeValidated: false,
             postcodeError: '',
             monthOfBirth: '',
             monthOfBirthValidated: false,
             mobError: '',
             otpCTN: '',
             oneTimePin: '',
             oneTimePinInputted: '',
             oneTimePinError: '',
             orderReadyForSubmission: false}

    componentDidMount() {
           fetch("http://127.0.0.1:8000/api/get-spend-caps")
             .then((response) => response.json())
             .then((data) => {
                 this.setState({spendCaps: data})
             }
         )
    }

    handleCapSelected = (capName) => {
        this.setState({capSelected: capName})
    }
    handleInsuranceSelected = (insuranceName) => {
        if (insuranceName === 'No Insurance'){
            this.setState({continueInsurance: false})
        }else {
            this.setState({continueInsurance: true})
        }
    }
    handleMakeOrderReadyForValidation = (insuranceOptionChosen) => {

        // Called in the basket component if a Spend Cap has been selected
        // the below also checks if the current ctn has insurance and wont let the order
        // got to the validation stage unless an option has been selected

        const ctnHasExistingInsurance = this.props.state.mobileAccount.insurance

        if (ctnHasExistingInsurance){
            if (insuranceOptionChosen){
                this.setState({orderReadyForValidation: true})
            }
        }
        else {
            this.setState({orderReadyForValidation: true})
        }
    }

    handleAddSpendCap = (spendCapId) =>{
         const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({id: spendCapId, ctn: this.state.ctn})
         }

        fetch('http://127.0.0.1:8000/api/add-spend-cap-to-sim-only-order', requestOptions)
            .then((response) => response.json()
                .then((data) => {
                    console.log(data)
                    this.setState({renderBasket: false})
                    this.setState({renderBasket: true})
                }))
    }
    handleKeepOrCancelInsurance = (option) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({keep_or_cancel_insurance: option, ctn:this.state.ctn})
        }

        fetch('http://127.0.0.1:8000/api/keep-or-cancel-insurance', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.setState({renderBasket: false})
                this.setState({renderBasket: true})
            })
    }
    handlePostcodeInput = (event) => {
        event.preventDefault()
        this.setState({postcode: event.target.value})

    }
    handleValidatePostcode = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({string: this.state.postcode, ctn: this.state.ctn})
        }

        fetch('http://127.0.0.1:8000/api/validate-postcode', requestOptions)
            .then((response) => {
                if (response.ok){
                    this.setState({postcodeValidated: true, postcodeError: ''})
                }else{
                    this.setState({postcodeError: 'Incorrect Postcode'})
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
            this.setState({orderReadyForSubmission: true, oneTimePinError: ""})

        }else{
            this.setState({oneTimePinError: "Invalid Pin"})
        }
    }

    render() {

        const {classes, fixedHeightPaper, state, onNewCTNClicked} = this.props

        return (
           <div>
               <Grid container spacing={2}>
                   {/* Extras */}
                   <Grid item xs={12} md={8} lg={8}>
                       <Paper className={fixedHeightPaper}>
                           <Box>
                                <Typography variant='h6' className={classes.header}>Add Ons</Typography>
                                <Divider/>
                                <Box m={1}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6} >
                                            <Paper>
                                            <Box m={1}>
                                            <Typography className={classes.header}>Spend Caps</Typography>
                                            {
                                                this.state.spendCaps?

                                                      <Box className={classes.spendCapList}>
                                                        <List>
                                                            {this.state.spendCaps.map((spendCap, index) => {

                                                                    return(
                                                                        <ListItem key={index} button onClick={() => this.handleAddSpendCap(spendCap.id)}
                                                                                  className={this.state.capSelected === spendCap.cap_name ? classes.currentlySelected : null}  >
                                                                            <ListItemText  classes={{primary:classes.listItem}} primary={spendCap.cap_name}/>
                                                                            <ListItemIcon >
                                                                                <AddCircleOutlineIcon/>
                                                                            </ListItemIcon>
                                                                        </ListItem>
                                                                    )
                                                                 })
                                                            }
                                                        </List>
                                                      </Box>
                                                    : <CircularProgress className={classes.progressLoader}/>
                                            }
                                            </Box>
                                            </Paper>
                                        </Grid>
                                        {
                                            state.mobileAccount.insurance ?
                                                <Grid item xs={6}>
                                                    <Paper >
                                                    <Box m={1}>
                                                    <Typography className={classes.header}>Insurance</Typography>
                                                    <Box>
                                                        <List>
                                                            <ListItem button onClick={() => this.handleKeepOrCancelInsurance('keep')}
                                                                             className={this.state.continueInsurance ? classes.currentlySelected : null}>
                                                                <ListItemText classes={{primary:classes.listItem}}  primary='Rollover Existing Insurance'/>
                                                                <ListItemIcon >
                                                                    <AddCircleOutlineIcon/>
                                                                </ListItemIcon>
                                                            </ListItem>
                                                            <ListItem button onClick={() => this.handleKeepOrCancelInsurance('cancel')}
                                                                             className={this.state.continueInsurance === false ? classes.currentlySelected: null}>
                                                                <ListItemText classes={{primary:classes.listItem}}  primary='Cancel Insurance'/>
                                                                <ListItemIcon >
                                                                    <AddCircleOutlineIcon/>
                                                                </ListItemIcon>
                                                            </ListItem>
                                                        </List>
                                                    </Box>
                                                    </Box>
                                                    </Paper>
                                                </Grid> : null
                                        }
                                    </Grid>
                                </Box>
                           </Box>
                       </Paper>
                   </Grid>
                   {/* HouseHold View */}
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={fixedHeightPaper}>
                           <HouseholdView currentCTN={state.mobileAccount.number}
                                          customer={state.customer}
                                          onNewCTNClicked={onNewCTNClicked}
                                          otherLines={state.otherLines}/>
                       </Paper>
                   </Grid>
                   {/* Validations */}
                   <Grid item xs={12} md={8} lg={8}>
                       <Paper className={classes.paper}>
                           <Box>
                                <Typography variant='h6' className={classes.header}>Order Validations</Typography>
                                <Divider/>
                                <Box m={2}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <br/>
                                            <br/>
                                            <TextField size='small' className={classes.postcodeValidation} variant='outlined'
                                                       label='Last 3 Characters of Postcode'
                                                       error={this.state.postcodeError}
                                                       disabled={!this.state.orderReadyForValidation}
                                                       onChange={(e) => this.handlePostcodeInput(e)} />
                                             <Button className={classes.button} color='secondary'
                                                     variant='contained'
                                                     type='submit'
                                                     disabled={!this.state.orderReadyForValidation}
                                                     onClick={() => this.handleValidatePostcode()}>Submit</Button>

                                        </Grid>
                                         <Grid item xs={12}>
                                              <FormControl variant="outlined"  margin='dense' className={classes.mobValidation}>
                                                <InputLabel id="mob">Month Of Birth</InputLabel>
                                                <Select
                                                  labelId="mob"
                                                  label="mob"
                                                  error={this.state.mobError}
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
                                                           error={this.state.oneTimePinError}
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
                                </Box>
                           </Box>
                       </Paper>
                   </Grid>
                   {/* Basket */}
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={classes.basket}>
                         <Box>
                           <Typography variant='h6' className={classes.basketTitle}>Basket</Typography>
                           <Divider/>
                             {
                                 this.state.renderBasket ?
                                         <SimOnlyBasket
                                          onCapSelected={this.handleCapSelected}
                                          onInsuranceSelected={this.handleInsuranceSelected}
                                          onDeleteTariffClicked={this.props.onDeleteTariffClicked}
                                          finaliseSim={this.props.finaliseSim}
                                          ctn={this.props.state.mobileAccount.number}
                                          onReadyForValidation={this.handleMakeOrderReadyForValidation}
                                          readyForSubmission={this.state.orderReadyForSubmission}
                                          onReturnToDashboard={this.props.onReturnToDashboard}/>: null
                             }
                         </Box>
                       </Paper>
                   </Grid>
               </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(FinaliseSimOnly)