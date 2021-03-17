import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import HouseholdView from "../HouseholdView";
import Box from "@material-ui/core/Box";
import SimOnlyBasket from "./SimOnlyBasket";


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
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
    },
    basket: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 370
    },

});

class FinaliseSimOnly extends Component {

    render() {

        const {classes, fixedHeightPaper, state, onNewCTNClicked} = this.props

        return (
           <div>
               <Grid container spacing={2}>
                   <Grid item xs={12} md={8} lg={8}>
                       <Paper className={fixedHeightPaper}>
                           <Box>
                                <h1>Dscount and spend caps </h1>
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
                               <h1>VALIDATIONS</h1>
                           </Box>
                       </Paper>
                   </Grid>
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={classes.basket}>
                           <SimOnlyBasket onDeleteTariffClicked={this.props.onDeleteTariffClicked}/>
                       </Paper>
                   </Grid>
               </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(FinaliseSimOnly)