import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import HouseholdView from "../HouseholdView";
import Box from "@material-ui/core/Box";
import SimOnlyBasket from "./SimOnlyBasket";
import ListItem from "@material-ui/core/ListItem";
import List from '@material-ui/core/List'
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import OrderValidations from "../GlobalComponents/OrderValidations";
import SpendCaps from "../GlobalComponents/SpendCaps";

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
    currentlySelected: {
        backgroundColor: '#f2f2f2'
    }
});

class FinaliseSimOnly extends Component {

    state = {ctn: this.props.state.mobileAccount.number,
             renderBasket: true,
             capSelected: null,
             continueInsurance: null,
             orderReadyForValidation: false,
             orderReadyForSubmission: false}

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

    handleMakeOrderReadyForSubmission = () => {
        this.setState({orderReadyForSubmission: true})
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
                                            <SpendCaps capSelected={this.state.capSelected}
                                                       onSpendCapSelected={this.handleAddSpendCap}/>
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
                                    <OrderValidations orderReadyForValidation={this.state.orderReadyForValidation}
                                                      onOrderReadyForSubmission={this.handleMakeOrderReadyForValidation}
                                                      onReadyForSubmission={this.handleMakeOrderReadyForSubmission}
                                                      state={state}/>
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