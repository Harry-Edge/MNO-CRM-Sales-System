import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField";

const styles = () => ({
    title: {
        fontWeight: 650,
        color: 'grey'
    },
    text: {
        paddingTop: 7
    },
    button: {
        color: 'white',
        textTransform: 'none',
        backgroundColor: '#009999',
        borderColor: '#009999',
        height: 40,
        width: '100%',
        '&:hover': {
          backgroundColor: '#008080',
          borderColor: '#008080'
         },
    },
    coloursSelecter: {
        paddingTop: 7
    }

});

class Bill extends Component {

    render() {

        const {classes} = this.props

        return (
            <Box style={{height: 262}}>
                <Typography className={classes.title} >Bill</Typography>
                <Divider/>
                <Box m={1} style={{paddingTop: 10}}>
                    <Typography>Latest Bill: <strong>£{this.props.bill}</strong></Typography>
                    <Typography>Bill Date: <strong>10/03/21</strong></Typography>
                    <Typography>Payment Date: <strong>18/03/21</strong></Typography>
                    <Typography>Previous Bill: <strong>£{this.props.bill}</strong></Typography>
                    <Typography>Average Bill: <strong>£{this.props.bill}</strong></Typography>
                    <Typography>Payment Type: <strong>Direct Debit</strong></Typography>
                    <Grid container style={{paddingTop: 20}}>
                        <Grid item xs={9}>
                                <TextField id="outlined-basic" label="Enter Payment Amount" variant="outlined"
                                    size='small'/>
                        </Grid>
                        <Grid item xs={3}>
                                      <Button className={classes.button}>Pay</Button>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        )
    }
}
export default withStyles(styles)(Bill)