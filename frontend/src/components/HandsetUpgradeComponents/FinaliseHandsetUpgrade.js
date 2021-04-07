import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import HouseholdView from "../HouseholdView";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import HandsetBasket from "./HandsetBasket";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import OrderValidations from "../GlobalComponents/OrderValidations";
import SpendCaps from "../GlobalComponents/SpendCaps";


const styles = (theme) => ({
    header: {
        fontWeight: 650
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
    handsetCreditList: {
        height: '19vh',
        width: '95%',
        overflow: 'scroll',
    }

});

class FinaliseHandset extends Component {

    state = {renderBasket: true,
            ctn: this.props.state.mobileAccount.number,}

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
                                   <Grid container spacing={1}>
                                         <Grid item xs={6} >
                                            <Paper>
                                            <Box m={1}>
                                            <Typography className={classes.header}>Spend Caps</Typography>
                                            <SpendCaps capSelected={this.state.capSelected}
                                                       onSpendCapSelected={this.handleAddSpendCap}/>
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
                                          otherLines={state.otherLines}/>
                       </Paper>
                   </Grid>
                   <Grid item xs={12} md={8} lg={8}>
                       <Paper className={classes.paper}>
                            <Typography variant='h6' className={classes.header}>Order Validations</Typography>
                            <Divider/>
                            <Box m={1}>
                                <OrderValidations state={state}/>
                            </Box>
                       </Paper>
                   </Grid>
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={classes.paper}>
                           {
                               this.state.renderBasket ?
                               <HandsetBasket
                                   onCapSelected={this.handleCapSelected}
                                   currentStage={this.props.currentStage}
                                   onHandsetOrderDeleted={this.props.onHandsetOrderDeleted}
                                   handsetChosen={this.state.handsetChosen}
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