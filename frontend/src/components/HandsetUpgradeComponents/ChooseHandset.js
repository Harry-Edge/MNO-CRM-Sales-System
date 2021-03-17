import React,  {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import HouseholdView from "../HouseholdView";
import {withStyles} from "@material-ui/core/styles";

const styles = (theme) => ({
     headingText: {
        fontWeight: 650
    },
    tableHeader: {
        fontWeight: 650
    },

});

class ChooseHandset extends Component {

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
                                   <Typography className={classes.tableHeader}>- S21, £10 on Switch for every sale</Typography>
                                   <Typography className={classes.tableHeader}>- 12 Pro/12 Pro Max now in stock </Typography>
                                   <Typography className={classes.tableHeader}>- iPhone XR £34pm 10GB, £50 Upfront </Typography>

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
                       </Paper>
                   </Grid>
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={classes.basket}>
                           <h1>Basket</h1>
                       </Paper>
                   </Grid>
               </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(ChooseHandset)