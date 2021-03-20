import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
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
    deleteButton: {
        fontWeight: 650,

    },
    navButtons: {
        position: 'relative',
        bottom: -120,
        width: 300,
        backgroundColor: '#fdfcfe',
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
             finaliseSim: null}

    componentDidMount() {
        this.setState({finaliseSim: this.props.finaliseSim})

          fetch("http://127.0.0.1:8000/api/sim-only-order")
             .then((response) => response.json())
             .then((data) => {
                 this.setState({basketItems: data})
                 console.log(this.state.basketItems)
             }
         )
    }

    handleDeleteSimOnlyOrder() {

         const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ctn: this.state.basketItems.ctn})
         }

        fetch("http://127.0.0.1:8000/api/sim-only-order", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                 this.setState({basketItems: null})
             }
         )
    }

    render() {

        const {classes, } = this.props

        return (
           <div>
               <Box>
                   { this.state.basketItems ?
                       <Box m={1} className={classes.basketTable}>
                           <Table size="small">
                               <TableHead>
                                   <TableRow>
                                       <TableCell>Description</TableCell>
                                       <TableCell align='right'>One-Off</TableCell>
                                       <TableCell align='right'>Monthly</TableCell>
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
                                       <TableCell>{this.state.basketItems.plan_type} {this.state.basketItems.tariff_data}GB</TableCell>
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
                               </TableBody>
                           </Table>
                       </Box> : <CircularProgress className={classes.progressLoader}/>
                   }
                   { this.state.basketItems ?
                       <Box m={1} >
                           <Grid container >
                               <Grid item xs={6}>
                                   <Button className={classes.deleteButton} color='secondary' size='small'
                                           variant='contained'
                                           onClick={() =>
                                           {   this.props.onDeleteTariffClicked()
                                               this.handleDeleteSimOnlyOrder()}}>Delete</Button>
                               </Grid>
                               <Grid item xs={6}>
                                   {
                                       this.state.finaliseSim ?
                                           <Button className={classes.finaliseButton} size='small' variant='contained' disabled
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
           </div>
        )
    }
}
export default withStyles(styles)(SimOnlyBasket)