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
      basketTitle: {
        display: 'flex',
        justifyContent: 'center',
        fontWeight: 650
    },

});

class FinaliseSimOnly extends Component {

    render() {

        const {classes, fixedHeightPaper, state, onNewCTNClicked} = this.props

        return (
           <div>
               <Grid container spacing={2}>
                   {/* Extras */}
                   <Grid item xs={12} md={8} lg={8}>
                       <Paper className={fixedHeightPaper}>
                           <Box>
                                <Typography variant='h6' className={classes.tableHeader}>Add Ons</Typography>
                                <Divider/>
                                
                                <Typography>Spend Caps</Typography>
                           </Box>
                       </Paper>
                   </Grid>
                   {/* HouseHold View */}
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={fixedHeightPaper}>
                           <HouseholdView customer={state.customer}
                                          onNewCTNClicked={onNewCTNClicked}
                                          otherLines={state.otherLines}/>
                       </Paper>
                   </Grid>
                   {/* Validations */}
                   <Grid item xs={12} md={8} lg={8}>
                       <Paper className={classes.paper}>
                           <Box>
                               <Typography>Validations</Typography>
                           </Box>
                       </Paper>
                   </Grid>
                   {/* Basket */}
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={classes.basket}>
                         <Box>
                           <Typography variant='h6' className={classes.basketTitle}>Basket</Typography>
                           <Divider/>
                           <SimOnlyBasket onDeleteTariffClicked={this.props.onDeleteTariffClicked}
                                          finaliseSim={this.props.finaliseSim}  />
                         </Box>
                       </Paper>
                   </Grid>
               </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(FinaliseSimOnly)