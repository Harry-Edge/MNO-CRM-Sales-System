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
        finaliseSim: null,
        basketTotals: null,
        submittingOrder: false,
        timer: 0
    }

    render() {

        const {classes,} = this.props

        return (
            <Box>
                <Typography variant='h6' className={classes.basketTitle}>Basket</Typography>
                <Divider/>
                <Box className={classes.test}>
                    {
                        this.state.basketItems ?
                            <h1>yeye</h1>:
                            null
                    }
                </Box>
            </Box>
        )

    }
}
export default withStyles(styles)(HandsetBasket)


