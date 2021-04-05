import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import ChooseHandset from "./ChooseHandset";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import HouseholdView from "../HouseholdView";
import SearchBar from "material-ui-search-bar";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import HandsetBasket from "./HandsetBasket";

const styles = (theme) => ({
     headingText: {
        fontWeight: 650
    },
    tableHeader: {
        fontWeight: 650
    },
    tableColor:{
        backgroundColor: '#fdfcfe'
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
    searchBox: {
        height: 50,
        marginBottom: '15px'
    },
    handsetsBox: {
        height: '100%',
    }

});

class ChooseHandsetTariff extends Component {

    state = {handsetTariffs: null,
             ctn: this.props.state.mobileAccount.number}

    componentDidMount() {
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
    }

    handleAddTariffToHandsetOrder = (upfront, tariffId) => {
        console.log(upfront)
        console.log(tariffId)

         const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({id: tariffId})
          }

         fetch("http://127.0.0.1:8000/api/add-handset-tariff-to-order", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                   console.log(data)})
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
                           <Box m={1}>
                               {
                                   this.state.handsetTariffs ?
                                       <Box>
                                           <TableContainer>
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
                                                               return (
                                                                   <TableRow hover={true} key={index}>
                                                                       <TableCell>{tariff.plan_type}</TableCell>
                                                                       <TableCell>{tariff.data_allowance}GB </TableCell>
                                                                       <TableCell>{tariff.contract_length} Months</TableCell>
                                                                       <TableCell>£1000</TableCell>
                                                                       <TableCell>£{tariff.mrc}</TableCell>
                                                                       <TableCell>£{tariff.upfront}</TableCell>
                                                                       <TableCell align='right'><Button
                                                                           className={classes.tableButton}
                                                                           onClick={() => this.handleAddTariffToHandsetOrder(tariff.upfront, tariff.id)}
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
                                       :null
                               }
                           </Box>
                       </Paper>
                   </Grid>
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={classes.paper}>
                               <HandsetBasket
                                currentStage={this.props.currentStage}
                                onHandsetOrderDeleted={this.props.onHandsetOrderDeleted}
                                handsetChosen={this.state.handsetChosen}
                                ctn={this.props.state.mobileAccount.number}/>

                       </Paper>
                   </Grid>
               </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(ChooseHandsetTariff)