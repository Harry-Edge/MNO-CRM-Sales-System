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

const styles = (theme) => ({
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
        basketItems: null,
        basketTotals: null,
        submittingOrder: false,
        timer: 0
    }

    componentDidMount() {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.props.ctn})
        }

        fetch("http://127.0.0.1:8000/api/handset-order", requestOptions)
            .then((response) => response.json())
            .then((data) => {
                this.setState({basketItems: data.handset_order_items, basketTotals: data.basket_totals})
            })
    }


    render() {

        const {classes,} = this.props

        return (
            <Box>
                <Typography variant='h6' className={classes.basketTitle}>Basket</Typography>
                <Divider/>
                <Box>
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
                                       <TableCell>{this.state.basketItems.handset}</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                       <TableCell align='right'>£0</TableCell>
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
                                           >Delete</Button>
                               </Grid>
                               <Grid item xs={6} className={classes.basketButtons}>
                                   <Button className={classes.finaliseButton} size='small' variant='contained'
                                   >Choose Tariff</Button>
                               </Grid>
                           </Grid>
                       </Box> : null
                    }
                </Box>
            </Box>
        )

    }
}
export default withStyles(styles)(HandsetBasket)


