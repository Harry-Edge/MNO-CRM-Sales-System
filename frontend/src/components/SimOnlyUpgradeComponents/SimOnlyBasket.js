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


const styles = (theme) => ({
    textSuccess: {
        color: 'green'
    },
    title: {
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 650
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
    }
});

class SimOnlyBasket extends Component {

    state = {basketItems: null}

    componentDidMount() {
          fetch("http://127.0.0.1:8000/api/get-simo-only-order")
             .then((response) => response.json())
             .then((data) => {
                 this.setState({basketItems: data})
             }
         )
    }

    handleDeleteSimOnlyOrder() {

         const requestOptions = {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ctn: this.state.basketItems.ctn})
         }

        fetch("http://127.0.0.1:8000/api/delete-sim-only-order", requestOptions)
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
                   <Typography variant='h6' className={classes.title}>Basket</Typography>
                   <Divider/>
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
                                       <TableCell>{this.state.basketItems.plan_type} {this.state.basketItems.tariff_data}</TableCell>
                                       <TableCell align='right'>£0</TableCell>
                                       <TableCell align='right'>£{this.state.basketItems.tariff_mrc}</TableCell>
                                   </TableRow>
                               </TableBody>
                           </Table>
                       </Box> : null
                   }
                   { this.state.basketItems ?
                       <Box m={1} className={classes.navButtons}>
                           <Grid container >
                               <Grid item xs={6}>
                                   <Button className={classes.deleteButton} color='secondary' size='small'
                                           variant='contained'
                                           onClick={() => this.handleDeleteSimOnlyOrder()}>Delete</Button>
                               </Grid>
                               <Grid item xs={6}>
                                   <Button className={classes.finaliseButton} size='small'
                                           variant='contained'>Finalise</Button>
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