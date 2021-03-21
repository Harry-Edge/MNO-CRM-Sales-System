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
    textSuccess: {
        color: 'green'
    },
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
    },
    basket: {
        padding: theme.spacing(1),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 370
    },
      basketTitle: {
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 650
    },
    boxColour: {
        backgroundColor: '#fdfcfe'
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
        paddingBottom: '15px'

    },
    mobValidation: {
        minWidth: '65%',
        paddingRight: '10px',
        paddingBottom: '15px',
        height: '55px',

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

});

class FinaliseSimOnly extends Component {

    state = {ctn: this.props.state.mobileAccount.number,
             spendCaps: null,
             renderBasket: true,
             orderReadyForValidation: false,
             postcode: '',
             postcodeValidated: false,
             postcodeError: '',}

    componentDidMount() {
           fetch("http://127.0.0.1:8000/api/get-spend-caps")
             .then((response) => response.json())
             .then((data) => {
                 this.setState({spendCaps: data})

             }
         )
    }

    handleMakeOrderReadyForValidation = (insuranceOptionChosen) => {
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
            headers: {'Content-Type': 'application/json'},
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
            headers: {'Content-Type': 'application/json'},
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
        console.log(this.state.postcode)

    }
    handleValidatePostcode = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({string: this.state.postcode})
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
                                    <Grid container >
                                        <Grid item xs={6} className={classes.boxColour}>
                                            <Typography className={classes.header}>Spend Caps</Typography>
                                            {
                                                this.state.spendCaps?
                                                      <Box className={classes.spendCapList}>
                                                        <List>
                                                            {this.state.spendCaps.map((spendCap, index) => {
                                                                    return(
                                                                        <ListItem key={index} button onClick={() => this.handleAddSpendCap(spendCap.id)}>
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
                                        </Grid>
                                        {
                                            state.mobileAccount.insurance ?
                                                <Grid item xs={6} className={classes.boxColour}>
                                                    <Typography className={classes.header}>Insurance</Typography>
                                                    <Box>
                                                        <List>
                                                            <ListItem button onClick={() => this.handleKeepOrCancelInsurance('keep')}>
                                                                <ListItemText classes={{primary:classes.listItem}}  primary='Rollover Existing Insurance'/>
                                                                <ListItemIcon >
                                                                    <AddCircleOutlineIcon/>
                                                                </ListItemIcon>
                                                            </ListItem>
                                                            <ListItem button onClick={() => this.handleKeepOrCancelInsurance('cancel')}>
                                                                <ListItemText classes={{primary:classes.listItem}}  primary='Cancel Insurance'/>
                                                                <ListItemIcon >
                                                                    <AddCircleOutlineIcon/>
                                                                </ListItemIcon>
                                                            </ListItem>
                                                        </List>
                                                    </Box>
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
                           <HouseholdView customer={state.customer}
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
                                              <FormControl variant="outlined" className={classes.mobValidation}>
                                                <InputLabel id="mob">Month Of Birth</InputLabel>
                                                <Select
                                                  labelId="mob"
                                                  label="Age"
                                                  disabled={!this.state.postcodeValidated}
                                                >
                                                  <MenuItem value='none'>
                                                    <em>None</em>
                                                  </MenuItem>
                                                  <MenuItem value={10}>Janurary</MenuItem>
                                                  <MenuItem value={20}>Twenty</MenuItem>
                                                  <MenuItem value={30}>Thirty</MenuItem>
                                                </Select>

                                              </FormControl>
                                             <Button className={classes.button} color='secondary'
                                                     variant='contained'
                                                     disabled={!this.state.postcodeValidated}
                                                     type='submit'>Submit</Button>

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
                                         <SimOnlyBasket onDeleteTariffClicked={this.props.onDeleteTariffClicked}
                                          finaliseSim={this.props.finaliseSim}
                                          ctn={this.props.state.mobileAccount.number}
                                          onReadyForValidation={this.handleMakeOrderReadyForValidation} />: null
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