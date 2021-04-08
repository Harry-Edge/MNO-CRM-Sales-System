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
import Divider from "@material-ui/core/Divider";

const styles = () => ({
    basketTitle: {
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 650
    },
    textSuccess: {
        color: 'green'
    },
    basketTable: {
        backgroundColor: '#fdfcfe',
        height: 300,
        overflow: 'scroll'
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
    test: {
        backgroundColor: 'blue'
    }
});


class HandsetBasket extends Component {

    state = {
        finaliseHandset: false,
        basketItems: null,
        basketTotals: null,
        currentStage: 'chooseHandset',
        submittingOrder: false,
        timer: 0
    }

    componentDidMount() {
        this.setState({currentStage: this.props.currentStage})

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.props.ctn})
        }

        fetch("http://127.0.0.1:8000/api/handset-order", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({basketItems: data.handset_order_items, basketTotals: data.basket_totals})

                if (this.state.currentStage === 'finaliseHandset') {
                    // Updates the current selected CSS to match what is in the basket
                    if (this.state.basketItems.cap) {
                        this.props.onCapSelected(this.state.basketItems.cap_name)
                    }
                    if (this.state.basketItems.insurance){
                        this.props.onInsuranceSelected(this.state.basketItems.insurance)
                    }
                }
            })
    }
    handleDeleteHandsetOrder() {

         const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.state.basketItems.ctn})
         }

        fetch("http://127.0.0.1:8000/api/handset-order", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                 this.setState({basketItems: null})
             }
         )
    }

    render() {

        const {classes,} = this.props

        return (
            <Box>
                <Typography variant='h6' className={classes.basketTitle}>Basket</Typography>
                <Divider/>
                <Grid>
                    {
                        this.state.basketItems ?
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
                                       <TableCell>EE {this.state.basketItems.contract_type} Sale</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                   </TableRow>
                                    <TableRow hover={true}>
                                       <TableCell>EE {this.state.basketItems.contract_length} Month</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                   </TableRow>
                                    <TableRow hover={true}>
                                       <TableCell>{this.state.basketItems.handset}</TableCell>
                                       <TableCell align='right'>{this.state.basketItems.handset_tariff ? '£' + this.state.basketItems.upfront : '£0'}</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                   </TableRow>
                                   {
                                       this.state.basketItems.early_upgrade_fee ?
                                           <TableRow hover={true}>
                                               <TableCell>Early Upgrade Fee</TableCell>
                                               <TableCell align='right'>£{this.state.basketItems.early_upgrade_fee}</TableCell>
                                               <TableCell align='right'>£0</TableCell>
                                           </TableRow> : null

                                   }
                                   {
                                       this.state.basketItems.handset_tariff ?
                                           <TableRow hover={true}>
                                               <TableCell>{this.state.basketItems.plan_type} {this.state.basketItems.tariff_data}GB £{this.state.basketItems.tariff_mrc}</TableCell>
                                               <TableCell align='right'>£0</TableCell>
                                               <TableCell align='right'>£{this.state.basketItems.tariff_mrc}</TableCell>
                                           </TableRow> : null

                                   }
                                   {
                                       this.state.basketItems.handset_credit ?
                                           <TableRow hover={true}>
                                               <TableCell>Handset Credit £{this.state.basketItems.handset_credit}</TableCell>
                                               <TableCell align='right'> - £{this.state.basketItems.handset_credit}</TableCell>
                                               <TableCell align='right'>£0</TableCell>
                                           </TableRow> : null

                                   }
                                   {
                                       this.state.basketItems.cap_name ?
                                           <TableRow hover={true}>
                                               <TableCell>{this.state.basketItems.cap_name}</TableCell>
                                               <TableCell align='right'>£0</TableCell>
                                               <TableCell align='right'>£0</TableCell>
                                           </TableRow> : null
                                   }
                                   {
                                       this.state.basketItems.insurance ?
                                           <TableRow hover={true}>
                                               <TableCell>{this.state.basketItems.insurance}</TableCell>
                                               <TableCell align='right'>£0</TableCell>
                                               <TableCell align='right'>£{this.state.basketItems.insurance_mrc}</TableCell>
                                           </TableRow> : null
                                   }
                                   <TableRow hover={true}>
                                       <TableCell className={classes.bold}> TOTAL:</TableCell>
                                       <TableCell className={classes.bold} align='right'>£{this.state.basketTotals.upfront}</TableCell>
                                       <TableCell className={classes.bold} align='right'>£{this.state.basketTotals.mrc}</TableCell>
                                   </TableRow>
                               </TableBody>
                           </Table>
                       </Box>
                            : <CircularProgress className={classes.progressLoader}/>
                   }
                   <br/>
                   { this.state.basketItems ?
                       <Box m={1}>
                           <Grid container >
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
                                           onClick={() => {
                                               this.props.onHandsetOrderDeleted()
                                               this.handleDeleteHandsetOrder()
                                           }}
                                           >Delete</Button>
                               </Grid>
                               {
                                   this.state.currentStage === 'chooseHandset' ?
                                       <Grid item xs={6} className={classes.basketButtons}>
                                           <Button className={classes.finaliseButton} size='small' variant='contained'
                                                   onClick={() => this.props.onChooseHandsetTariffClicked()}
                                           >Choose Tariff</Button>
                                       </Grid>: null
                               }
                               {
                                   this.state.currentStage === "chooseHandsetTariff" ?
                                       <Grid item xs={6} className={classes.basketButtons}>
                                           <Button className={classes.finaliseButton} size='small' variant='contained'
                                                   onClick={() => this.props.onFinaliseHandsetClicked()}
                                           >Finalise</Button>
                                       </Grid>: null
                               }
                               {
                                   this.state.currentStage === "finaliseHandset" ?
                                   <Grid item xs={6} className={classes.basketButtons}>
                                           <Button className={classes.finaliseButton} size='small' variant='contained'
                                           >Submit</Button>
                                   </Grid>: null
                               }
                           </Grid>
                       </Box> : null
                    }
                </Grid>
            </Box>
        )

    }
}
export default withStyles(styles)(HandsetBasket)