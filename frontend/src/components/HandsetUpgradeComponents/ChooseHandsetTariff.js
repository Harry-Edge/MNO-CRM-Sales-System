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

const styles = (theme) => ({
   textSuccess: {
        color: 'green'
    },
    textDanger: {
        color: 'red'
    },
    textWarning: {
        color: '#e6ac00'
    },
    headingText: {
        fontWeight: 650
    },
    tableHeader: {
        fontWeight: 650
    },
    table: {
         height: 400,
        overflow: 'scroll',
    },
    tableColor:{
        backgroundColor: '#fdfcfe',
    },
     tableButton: {
        color: 'white',
        textTransform: 'none',
        backgroundColor: '#009999',
        borderColor: '#009999',

        '&:hover': {
          backgroundColor: '#008080',
          borderColor: '#008080'
         },
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
        height: 165,
        width: '95%',
        overflow: 'scroll',
    }

});

class ChooseHandsetTariff extends Component {

    state = {handsetTariffs: null,
             renderBasket: true,
             handsetCredits: [],
             handsetCreditSelected: null,
             tariffSelected: false,
             ctn: this.props.state.mobileAccount.number,}

    async componentDidMount() {
          const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.state.ctn})
          }

          fetch("http://127.0.0.1:8000/api/get-handset-tariffs", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                   this.setState({handsetTariffs: data})
                   console.log(data)}
               )

          // Generates Handset Credit amounts
          let credit = []
          for (let i = 10; i <= 300; i += 10){
              credit.push({handsetCreditName: 'Handset Credit £' + i, value: i})
          }
          this.setState({handsetCredits: credit})

    }
    handleAddTariffToHandsetOrder = (upfront, mrc, dataAllowance) => {

         const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.state.ctn, upfront: upfront, mrc: mrc, data_allowance: dataAllowance})
          }

         fetch("http://127.0.0.1:8000/api/add-handset-tariff-to-order", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                   this.setState({renderBasket: false})
                   this.setState({renderBasket: true, tariffSelected: true})})
    }
    handleAddHandsetCreditToOrder = (creditAmount) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.state.ctn, string: creditAmount})
        }

        fetch("http://127.0.0.1:8000/api/add-handset-credit-to-order", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                 console.log(data)
                 this.setState({renderBasket: false})
                 this.setState({renderBasket: true})
             })
    }
    handleAddFriendsAndFamily = () => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.state.ctn})
        }

        fetch("http://127.0.0.1:8000/api/add-handset-friends-and-family", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                 console.log(data)
             })
    }
    handleCalculateValue = (contractLength, mrc, upfront) => {
            return (parseInt(contractLength, 10) * mrc) + parseInt(upfront, 10)
    }
    handleValueColour = (value) => {
        if (value >= 1500) {
            return this.props.classes.textSuccess
        }else if (value >= 1200) {
            return this.props.classes.textWarning
        }else{
            return this.props.classes.textDanger
        }
    }

    render() {

        const {classes, fixedHeightPaper, state, onNewCTNClicked} = this.props

        return (
           <div>
               <Grid container spacing={2}>
                   <Grid item xs={12} md={8} lg={8}>
                       <Paper className={fixedHeightPaper}>
                           <Box>
                               <Typography variant='h6' className={classes.tableHeader}>Save Tools</Typography>
                               <Divider/>
                               <Box m={1}>
                                   <Grid container spacing={1}>
                                       <Grid item xs={6}>
                                           <Paper>
                                               <Box m={1}>
                                                   <Typography className={classes.saveToolsText}>Retail Closing Tool</Typography>
                                                         <Box className={classes.handsetCreditList}>
                                                             <List>
                                                                 {
                                                                     this.state.handsetCredits.map((handsetCredit, index) => {
                                                                         return (
                                                                             <ListItem key={index} button disabled={!this.state.tariffSelected}
                                                                                       style={{height: 40}}
                                                                                onClick={() => this.handleAddHandsetCreditToOrder(handsetCredit.value)}>
                                                                                <ListItemText classes={{primary:classes.listItem}} primary={handsetCredit.handsetCreditName}/>
                                                                                <ListItemIcon >
                                                                                    <AddCircleOutlineIcon/>
                                                                                </ListItemIcon>
                                                                            </ListItem>
                                                                         )
                                                                     })
                                                                 }
                                                            </List>
                                                        </Box>
                                               </Box>
                                           </Paper>
                                       </Grid>
                                       <Grid item xs={6}>
                                           <Paper>
                                               <Box m={1}>
                                                   <Typography className={classes.saveToolsText}>Other</Typography>
                                                   <Box>
                                                       <List>
                                                           <ListItem button disabled={!this.state.tariffSelected}
                                                                    onClick={() => this.handleAddFriendsAndFamily()}>
                                                               <ListItemText primary='Friend and Family 30%'/>
                                                               <ListItemIcon>
                                                                   <AddCircleOutlineIcon/>
                                                               </ListItemIcon>
                                                           </ListItem>
                                                       </List>
                                                   </Box>
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
                           <Box m={1}>
                               {
                                   this.state.handsetTariffs ?
                                       <Box>
                                           <TableContainer className={classes.table}>
                                               <Table size="small" className={classes.tableColor} >
                                                   <TableHead>
                                                       <TableRow>
                                                           <TableCell className={classes.tableHeader}>Plan Type</TableCell>
                                                           <TableCell className={classes.tableHeader}>Data Allowance</TableCell>
                                                           <TableCell className={classes.tableHeader}>Contract Length</TableCell>
                                                           <TableCell className={classes.tableHeader}>Value</TableCell>
                                                           <TableCell className={classes.tableHeader}>Mrc</TableCell>
                                                           <TableCell className={classes.tableHeader}>Upfront</TableCell>
                                                           <TableCell className={classes.tableHeader} align='right'>Select</TableCell>
                                                       </TableRow>
                                                   </TableHead>
                                                   <TableBody>
                                                       {
                                                           this.state.handsetTariffs.map((tariff, index) => {
                                                               const value = this.handleCalculateValue(tariff.contract_length, tariff.mrc, tariff.upfront)

                                                               const valueColour = this.handleValueColour(value)

                                                               return (
                                                                   <TableRow hover={true} key={index}>
                                                                       <TableCell>{tariff.plan_type}</TableCell>
                                                                       <TableCell>{tariff.data_allowance}GB </TableCell>
                                                                       <TableCell>{tariff.contract_length} Months</TableCell>
                                                                       <TableCell className={valueColour}>£{value}</TableCell>
                                                                       <TableCell style={{fontWeight: 650}}>£{tariff.mrc}</TableCell>
                                                                       <TableCell style={{fontWeight: 650}}>£{tariff.upfront}</TableCell>
                                                                       <TableCell align='right'><Button
                                                                           className={classes.tableButton}
                                                                           onClick={() =>
                                                                               this.handleAddTariffToHandsetOrder(tariff.upfront, tariff.mrc, tariff.data_allowance)}
                                                                           size='small' variant='contained'>
                                                                                          Select</Button></TableCell>
                                                                   </TableRow>
                                                               )
                                                           })
                                                       }
                                                   </TableBody>
                                               </Table>
                                           </TableContainer>
                                       </Box>
                                       : <CircularProgress/>
                               }
                           </Box>
                       </Paper>
                   </Grid>
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={classes.paper}>
                           {
                               this.state.renderBasket ?
                               <HandsetBasket
                                   currentStage={this.props.currentStage}
                                   onHandsetOrderDeleted={this.props.onHandsetOrderDeleted}
                                   handsetChosen={this.state.handsetChosen}
                                   onFinaliseHandsetClicked={this.props.onFinaliseHandsetClicked}
                                   ctn={this.props.state.mobileAccount.number}/> : null

                           }
                       </Paper>
                   </Grid>
               </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(ChooseHandsetTariff)