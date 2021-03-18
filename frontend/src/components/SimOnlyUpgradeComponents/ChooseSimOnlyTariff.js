import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import HouseholdView from "../HouseholdView";
import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import SimOnlyBasket from "./SimOnlyBasket";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme) => ({
    textSuccess: {
        color: 'green'
    },
    test: {
        backgroundColor: 'blue'
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
        height: 400
    },
    basket: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 400
    },
    progressLoader: {
          color:'#009999',
          position: 'relative',
          marginTop: '20px',
          marginLeft: '45%'
    },
      basketTitle: {
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 650
    },

});

class ChooseSimOnlyTariff extends Component {

    state = {
        simOnlyTariffs: null,
        tariffChosen: false
    }

    async componentDidMount() {
         await fetch("http://127.0.0.1:8000/api/get-sim-only-tariffs")
             .then((response) => response.json())
             .then((data) => {
                 this.setState({simOnlyTariffs: data})
             }
         )
        // Finds if an order already exists
         await fetch("http://127.0.0.1:8000/api/get-simo-only-order")
             .then((response) => {
                 if (response.ok){
                     return response.json()
                 }else{
                     throw new Error('No Order Found')
                 }
             })
             .then((data) => {
                 if (data === 'No Order'){
                     console.log(data)
                 }else {
                    this.setState({tariffChosen: true})}
             }
         ).catch((error) => {
             console.log(error)
             })
    }

    handleSelectSimTariff = (tariffCode) => {
         const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({tariff_code: tariffCode})
         }

        fetch('http://127.0.0.1:8000/api/create-sim-only-order', requestOptions)
            .then((response) => response.json()
                .then((data) => {
                    this.setState({tariffChosen: false})
                    this.setState({tariffChosen: true})
                }))
    }

    handleDeleteTariff = () => {
        this.setState({tariffChosen: false})
        return this.props.onDeleteTariffClicked
    }

    render() {

        const {classes, fixedHeightPaper, state, onNewCTNClicked} = this.props

        return (
           <div>
               <Grid container spacing={2}>
                   <Grid item xs={12} md={8} lg={8}>
                       <Paper className={fixedHeightPaper}>
                           <Box>
                               <Typography variant='h6' className={classes.tableHeader}>Announcements</Typography>
                               <Divider/>
                               <Box m={2}>
                                   <Typography>- March Sale: 200GB £20pm</Typography>
                                   <Typography>- ULTD £25pm Ending 20/03/2021</Typography>

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
                           <Box>
                               { this.state.simOnlyTariffs ?
                                   <Box>
                                       <TableContainer>
                                           <Table size="small" className={classes.tableColor} >
                                               <TableHead>
                                                   <TableRow>
                                                       <TableCell className={classes.tableHeader}>Plan</TableCell>
                                                       <TableCell className={classes.tableHeader}>Contract Length</TableCell>
                                                       <TableCell className={classes.tableHeader}>Data</TableCell>
                                                       <TableCell className={classes.tableHeader}>Mrc</TableCell>
                                                       <TableCell className={classes.tableHeader} align='right'>Select</TableCell>
                                                   </TableRow>
                                               </TableHead>
                                               <TableBody>
                                                   {
                                                       this.state.simOnlyTariffs.map((simOnlyTariff, index) => {
                                                           return (
                                                               <TableRow hover={true} key={index}>
                                                                   <TableCell>{simOnlyTariff.plan_type}</TableCell>
                                                                   <TableCell>{simOnlyTariff.contract_length} Months</TableCell>
                                                                   <TableCell>{simOnlyTariff.data_allowance}GB</TableCell>
                                                                   <TableCell>£{simOnlyTariff.mrc}pm</TableCell>
                                                                   <TableCell align='right' ><Button className={classes.tableButton}
                                                                                      value={simOnlyTariff.id}

                                                                                      size='small' variant='contained'
                                                                                      onClick={() => this.handleSelectSimTariff(simOnlyTariff.tariff_code)} >
                                                                                      Select</Button></TableCell>
                                                               </TableRow>
                                                           )
                                                       })
                                                   }
                                               </TableBody>
                                           </Table>
                                       </TableContainer>
                                   </Box> : <CircularProgress className={classes.progressLoader}/>
                               }
                           </Box>
                       </Paper>
                   </Grid>
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={classes.basket}>
                           <Box>
                               <Typography variant='h6' className={classes.basketTitle}>Basket</Typography>
                               <Divider/>
                           {
                               this.state.tariffChosen ? <SimOnlyBasket
                                                        onFinaliseSimOnlyClicked={this.props.onFinaliseSimOnlyClicked}
                                                        onDeleteTariffClicked={this.handleDeleteTariff}/>
                                                        : null
                           }
                           </Box>
                       </Paper>
                   </Grid>
               </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(ChooseSimOnlyTariff)