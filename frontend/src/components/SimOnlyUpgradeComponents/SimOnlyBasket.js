import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme) => ({
    textSuccess: {
        color: 'green'
    },
    basketTable: {
        backgroundColor: '#fdfcfe',
    },
     finaliseButton: {
        color: 'white',
        fontWeight: 650,
        float: 'right',
        backgroundColor: '#009999',
        borderColor: '#009999',

        '&:hover': {
          backgroundColor: '#008080',
          borderColor: '#008080'
         },
    },
    bold: {
        fontWeight: 650,
    },
    progressLoader: {
          color:'#009999',
          position: 'relative',
          marginTop: '20px',
          marginLeft: '45%'
    },
});

class SimOnlyBasket extends Component {

    state = {basketItems: null,
             finaliseSim: null,
             basketTotals: null,
             submittingOrder: false,
             timer: 0}

    componentDidMount() {
        this.setState({finaliseSim: this.props.finaliseSim})

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.props.ctn})
        }

          fetch("http://127.0.0.1:8000/api/sim-only-order", requestOptions)
             .then((response) => response.json())
             .then((data) => {

                 this.setState({basketItems: data.sim_order_items, basketTotals: data.basket_totals})
                 //Code here is pretty terrible

                 if (this.state.finaliseSim) {
                      if (this.state.basketItems.existing_insurance){
                            this.props.onInsuranceSelected(this.state.basketItems.existing_insurance.insurance_name)
                     }
                     if (this.state.basketItems.cap){
                         this.props.onCapSelected(this.state.basketItems.cap_name)
                     }
                 }
                 // Changes the state of the parent component if the order has a cap and the insurance
                 // option has been selected
                 if (this.props.onReadyForValidation) {
                     this.props.onReadyForValidation(this.state.basketItems.existing_insurance)
                 }

             }
         )
    }

    handleDeleteSimOnlyOrder() {

         const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.state.basketItems.ctn})
         }

        fetch("http://127.0.0.1:8000/api/sim-only-order", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                 this.setState({basketItems: null})
             }
         )
    }
    handleSubmitOrder = () => {
       this.setState({submittingOrder: true})


       const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({number: this.state.basketItems.ctn})
        }

        fetch('http://127.0.0.1:8000/api/submit-sim-only-order', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.props.onReturnToDashboard()
        })
    }
    countUp = () => {
        this.setState({timer: this.state.timer += 1})
    }
    startTimer = () => {
        setInterval((this.countUp),1000)
    }

    render() {

        const {classes, } = this.props

        return (
               <Box className={classes.basket}>
                   { this.state.basketItems ?
                       <Box m={1} className={classes.basketTable}>
                           <Table size="small">
                               <TableHead>
                                   <TableRow>
                                       <TableCell className={classes.bold}>Description</TableCell>
                                       <TableCell className={classes.bold} align='right'>Upfront</TableCell>
                                       <TableCell className={classes.bold} align='right'>Monthly</TableCell>
                                   </TableRow>
                               </TableHead>
                               <TableBody>
                                   <TableRow hover={true}>
                                       <TableCell>EE {this.state.basketItems.contract_type}</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                   </TableRow>
                                    <TableRow hover={true}>
                                       <TableCell>EE {this.state.basketItems.contract_length} Month</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                   </TableRow>
                                    <TableRow hover={true}>
                                       <TableCell>{this.state.basketItems.plan_type} {this.state.basketItems.tariff_data === '1000' ? 'ULTD' : this.state.basketItems.tariff_data}GB</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                       <TableCell align='right'>£{this.state.basketItems.tariff_mrc}</TableCell>
                                   </TableRow>
                                   {
                                       this.state.basketItems.cap_name ?
                                           <TableRow hover={true}>
                                               <TableCell>{this.state.basketItems.cap_name}</TableCell>
                                               <TableCell align='right'>£0</TableCell>
                                               <TableCell align='right'>£0</TableCell>
                                           </TableRow> : null
                                   }
                                   {
                                       this.state.basketItems.existing_insurance ?
                                           <TableRow hover={true}>
                                               <TableCell>{this.state.basketItems.existing_insurance.insurance_name}</TableCell>
                                               <TableCell align='right'>£0</TableCell>
                                               <TableCell align='right'>£{this.state.basketItems.existing_insurance.insurance_mrc}</TableCell>
                                           </TableRow> : null
                                   }
                                   <TableRow hover={true}>
                                       <TableCell className={classes.bold}> TOTAL:</TableCell>
                                       <TableCell className={classes.bold} align='right'>£{this.state.basketTotals.upfront}</TableCell>
                                       <TableCell className={classes.bold} align='right'>£{this.state.basketTotals.mrc}</TableCell>
                                   </TableRow>

                               </TableBody>
                           </Table>
                       </Box> : <CircularProgress className={classes.progressLoader}/>
                   }
                   <br/>
                   { this.state.basketItems ?
                       <Box m={1}>
                           <Grid container>
                                 {
                                   this.state.submittingOrder ?
                                       <box>
                                            <Typography>Submitting... <strong>Waiting:{this.state.timer}</strong></Typography>
                                            <br/>
                                       </box>
                                       : null
                                 }
                               <Grid item xs={6}>
                                   <Button className={classes.bold} color='secondary' size='small'
                                           variant='contained'
                                           onClick={() =>
                                           {   this.props.onDeleteTariffClicked()
                                               this.handleDeleteSimOnlyOrder()}}>Delete</Button>
                               </Grid>
                               <Grid item xs={6} className={classes.basketButtons}>
                                   {
                                       this.state.finaliseSim ?
                                           <Button className={classes.finaliseButton} size='small' variant='contained'
                                                   disabled={!this.props.readyForSubmission}
                                                   onClick={() => {
                                                       this.startTimer()
                                                       this.handleSubmitOrder()}}
                                           >Submit</Button>:
                                           <Button className={classes.finaliseButton} size='small' variant='contained'
                                           onClick={() => {
                                               this.props.onFinaliseSimOnlyClicked()}}>Finalise</Button>
                                   }
                               </Grid>
                           </Grid>
                       </Box> : null
                   }
               </Box>
        )
    }
}
export default withStyles(styles)(SimOnlyBasket)