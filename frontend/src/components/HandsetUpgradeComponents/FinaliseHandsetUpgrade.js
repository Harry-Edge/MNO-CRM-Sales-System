import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import HouseholdView from "../HouseholdView";
import HandsetBasket from "./HandsetBasket";
import OrderValidations from "../GlobalComponents/OrderValidations";
import SpendCaps from "../GlobalComponents/SpendCaps";
import HandsetInsurance from "../GlobalComponents/HandsetInsurance";
import StockControl from "../GlobalComponents/StockControl";

const styles = (theme) => ({
    header: {
        fontWeight: 650,
        color: 'grey'
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 450
    },
    saveToolsText: {
        color: 'grey',
        fontSize: 12,
        fontWeight: 650,
    },
});

class FinaliseHandset extends Component {

    state = {renderBasket: true,
             ctn: this.props.state.mobileAccount.number,
             capSelected: null,
             insuranceSelected: null,
             orderReadyForValidation: false,
             orderReadyForSubmission: false}

    handleCapSelected = (capName) => {
        this.setState({capSelected: capName})
    }
    handleAddSpendCap = (spendCapId) =>{
         const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({id: spendCapId, ctn: this.state.ctn})
         }

        fetch('http://127.0.0.1:8000/api/add-spend-cap-to-handset-order', requestOptions)
            .then((response) => response.json()
                .then((data) => {
                    console.log(data)
                    this.setState({renderBasket: false})
                    this.setState({renderBasket: true})
                }))
    }
    handleInsuranceSelected = (insuranceName) => {
        this.setState({insuranceSelected: insuranceName})
    }
    handleAddInsurance = (insuranceId) => {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({id: insuranceId, ctn: this.props.state.mobileAccount.number})
         }

        fetch('http://127.0.0.1:8000/api/add-insurance-to-handset-order', requestOptions)
            .then((response) => response.json()
                .then((data) => {
                    console.log(data)
                    this.setState({renderBasket: false})
                    this.setState({renderBasket: true})
                }))
    }
    handleMakeOrderReadyForValidation = () => {
        this.setState({orderReadyForValidation: true})
    }
    handleMakeOrderReadyForSubmission = () => {
        this.setState({orderReadyForSubmission: true})
    }

    render() {

        const {classes, fixedHeightPaper, state, onNewCTNClicked} = this.props

        return (
           <div>
               <Grid container spacing={2}>
                   <Grid item xs={12} md={8} lg={8}>
                       <Paper className={fixedHeightPaper}>
                           <Box>
                               <Typography variant='h6' className={classes.header}>Add Ons</Typography>
                               <Divider/>
                               <Box m={1}>
                                   <Grid container spacing={2}>
                                         <Grid item xs={6} >
                                            <Paper>
                                            <Box m={1}>
                                            <Typography className={classes.header}>Spend Caps</Typography>
                                            <SpendCaps capSelected={this.state.capSelected}
                                                       onSpendCapSelected={this.handleAddSpendCap}/>
                                            </Box>
                                            </Paper>
                                        </Grid>
                                         <Grid item xs={6} >
                                            <Paper>
                                            <Box m={1}>
                                            <Typography className={classes.header}>Insurance</Typography>
                                            <HandsetInsurance orderCtn={this.state.ctn}
                                                              insuranceSelected={this.state.insuranceSelected}
                                                              onInsuranceSelected={this.handleAddInsurance}/>
                                            </Box>
                                            </Paper>
                                        </Grid>
                                   </Grid>
                               </Box>
                           </Box>
                       </Paper>
                   </Grid>
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={fixedHeightPaper}>
                           <HouseholdView customer={state.customer}
                                          onNewCTNClicked={onNewCTNClicked}
                                          otherLines={state.otherLines}
                                          currentCTN={state.mobileAccount.number}/>
                       </Paper>
                   </Grid>
                   <Grid item xs={12} md={8} lg={8}>
                       <Paper className={classes.paper}>
                            <Typography variant='h6' className={classes.header}>Order Validations & Stock Control</Typography>
                            <Divider/>
                            <Box m={1}>
                                <br/>
                                <StockControl orderCTN={this.state.ctn}/>
                                <br/>
                                <br/>
                                <OrderValidations
                                    orderReadyForValidation={this.state.orderReadyForValidation}
                                    onReadyForSubmission={this.handleMakeOrderReadyForSubmission}
                                    state={state}/>
                            </Box>
                       </Paper>
                   </Grid>
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={classes.paper}>
                           {
                               this.state.renderBasket ?
                               <HandsetBasket
                                   onCapSelected={this.handleCapSelected}
                                   onInsuranceSelected={this.handleInsuranceSelected}
                                   currentStage={this.props.currentStage}
                                   onHandsetOrderDeleted={this.props.onHandsetOrderDeleted}
                                   onReadyForValidation={this.handleMakeOrderReadyForValidation}
                                   readyForSubmission={this.state.orderReadyForSubmission}
                                   handsetChosen={this.state.handsetChosen}
                                   onReturnToDashboard={this.props.onReturnToDashboard}
                                   ctn={this.props.state.mobileAccount.number}/> : null
                           }
                       </Paper>
                   </Grid>
               </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(FinaliseHandset)