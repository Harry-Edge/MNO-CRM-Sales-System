import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import HouseholdView from "../HouseholdView";
import Box from "@material-ui/core/Box";
import SimOnlyBasket from "./SimOnlyBasket";
import CircularProgress from "@material-ui/core/CircularProgress";
import ListItem from "@material-ui/core/ListItem";
import List from '@material-ui/core/List'
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';

const styles = (theme) => ({
    textSuccess: {
        color: 'green'
    },
    header: {
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
        padding: theme.spacing(1),
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
    boxColour: {
        backgroundColor: '#fdfcfe'
    },
    spendCapList: {
        height: '15vh',
        width: '95%',
        overflow: 'scroll',

    },
    listItem: {
        fontSize: '0.9em'
    }

});

class FinaliseSimOnly extends Component {

    state = {spendCaps: null,
             renderBasket: true}

    componentDidMount() {
           fetch("http://127.0.0.1:8000/api/get-spend-caps")
             .then((response) => response.json())
             .then((data) => {
                 this.setState({spendCaps: data})

             }
         )
    }
    handleAddSpendCap = (spendCapId) =>{
         const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: spendCapId})
         }

        fetch('http://127.0.0.1:8000/api/add-spend-cap-to-sim-only-order', requestOptions)
            .then((response) => response.json()
                .then((data) => {
                    console.log(data)
                    this.setState({renderBasket: false})
                    this.setState({renderBasket: true})
                }))
    }

    render() {

        const {classes, fixedHeightPaper, state, onNewCTNClicked} = this.props

        return (
           <div>
               <Grid container spacing={2}>
                   {/* Extras */}
                   <Grid item xs={12} md={8} lg={8}>
                       <Paper className={fixedHeightPaper}>
                           <Box>
                                <Typography variant='h6' className={classes.header}>Add Ons</Typography>
                                <Divider/>
                                <Box m={1}>
                                    <Grid container >
                                        <Grid item xs={6} className={classes.boxColour}>
                                            <Typography className={classes.header}>Spend Caps</Typography>
                                            {
                                                this.state.spendCaps?
                                                      <Box className={classes.spendCapList}>
                                                        <List>
                                                            {this.state.spendCaps.map((spendCap, index) => {
                                                                    return(
                                                                        <ListItem key={index} button onClick={() => this.handleAddSpendCap(spendCap.id)}>
                                                                            <ListItemText  classes={{primary:classes.listItem}} primary={spendCap.cap_name}/>
                                                                            <ListItemIcon >
                                                                                <AddCircleOutlineIcon/>
                                                                            </ListItemIcon>
                                                                        </ListItem>
                                                                    )
                                                                 })
                                                            }
                                                        </List>
                                                      </Box>
                                                    : <CircularProgress className={classes.progressLoader}/>
                                            }
                                        </Grid>
                                        <Grid item xs={6} className={classes.boxColour}>
                                            <Typography className={classes.header}>Insurance</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
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
                             {
                                 this.state.renderBasket ?
                                         <SimOnlyBasket onDeleteTariffClicked={this.props.onDeleteTariffClicked}
                                          finaliseSim={this.props.finaliseSim}/>: null
                             }

                         </Box>
                       </Paper>
                   </Grid>
               </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(FinaliseSimOnly)