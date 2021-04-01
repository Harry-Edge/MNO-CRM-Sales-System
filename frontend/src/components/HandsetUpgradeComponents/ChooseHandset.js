import React,  {Component} from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import HouseholdView from "../HouseholdView";
import {withStyles} from "@material-ui/core/styles";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import SearchBar from "material-ui-search-bar";
import {setRef} from "@material-ui/core";
import HandsetBasket from "./HandsetBasket";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const styles = (theme) => ({
    headingText: {
        fontWeight: 650
    },
    tableHeader: {
        fontWeight: 650
    },
    tableColor:{
        backgroundColor: '#fdfcfe'
    },
     tableButton: {
        color: 'white',
        textTransform: 'none',
        backgroundColor: '#009999',
        borderColor: '#009999',

        '&:hover': {
          backgroundColor: '#008080',
          borderColor: '#008080'
         },
    },
    paper: {
        padding: theme.spacing(2),
        display: 'flex',
        overflow: 'auto',
        flexDirection: 'column',
        height: 450
    },
    searchBox: {
        height: 50,
        marginBottom: '15px'
    },
    handsetsBox: {
        height: '100%',
    }
});

class ChooseHandset extends Component {

    state = {handsets: null,
             selectedColour: ''}

    componentDidMount() {
          fetch("http://127.0.0.1:8000/api/get-handsets")
             .then((response) => response.json())
             .then((data) =>
                 this.setState({handsets: data}))
                 console.log(this.state)
     }

     handleSearchHandset = (searchTerm) => {
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({model: searchTerm})
        }
        fetch("http://127.0.0.1:8000/api/get-handsets", requestOptions)
             .then((response) => response.json())
             .then((data) =>
                 this.setState({handsets: data}))
                console.log(this.state)
    }

    handleColourSelected(event){

        this.setState({selectedColour: event.target.value})

    }

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
                                   <Grid container spacing={2}>
                                       <Grid item xs={6}>
                                           <Paper>
                                               <Box m={1}>
                                               <Typography className={classes.tableHeader}>Current Deals</Typography>
                                               <Typography>- Pixel 4a £37pm 10GB</Typography>
                                               <Typography>- iPhone 11, £29pm 1GB £99 upfront </Typography>
                                               <Typography>- iPhone XR £34pm 10GB, £50 Upfront </Typography>
                                               </Box>

                                               <br/>
                                               <br/>
                                           </Paper>
                                       </Grid>
                                        <Grid item xs={6}>
                                           <Paper>
                                               <Box m={1}>
                                                   <Typography className={classes.tableHeader}>Other</Typography>
                                                  <Typography>- S21, £10 on Switch for every sale</Typography>
                                                  <Typography>- 12 Pro/12 Pro Max now in stock </Typography>
                                                  <Typography>- iPhone XR £34pm 10GB, £50 Upfront </Typography>
                                               </Box>
                                               <br/>
                                               <br/>
                                           </Paper>
                                       </Grid>
                                   </Grid>
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
                    <Grid item className={classes.paper} style={{height: 465}} xs={12} md={8} lg={8}>
                            <Paper className={classes.searchBox}>
                                <SearchBar placeholder='Search Model'
                                           onChange={(searchTerm) => this.handleSearchHandset(searchTerm)} />
                            </Paper>
                            <Paper className={classes.handsetsBox}>
                               <Box m={2}>
                                   { this.state.handsets ?
                                       <Box>
                                           <TableContainer>
                                               <Table size="small" className={classes.tableColor} >
                                                   <TableHead>
                                                       <TableRow>
                                                           <TableCell className={classes.tableHeader}>Manufacture</TableCell>
                                                           <TableCell className={classes.tableHeader}>Model</TableCell>
                                                           <TableCell className={classes.tableHeader}>Storage</TableCell>
                                                           <TableCell className={classes.tableHeader}>Speed</TableCell>
                                                           <TableCell className={classes.tableHeader}>Stock</TableCell>
                                                           <TableCell className={classes.tableHeader}>Colour</TableCell>
                                                           <TableCell className={classes.tableHeader} align='right'>Select</TableCell>
                                                       </TableRow>
                                                   </TableHead>
                                                   <TableBody>
                                                       {
                                                           this.state.handsets.map((handset, index) => {
                                                               return (
                                                                   <TableRow hover={true} key={index}>
                                                                       <TableCell>{handset.manufacture}</TableCell>
                                                                       <TableCell>{handset.model}</TableCell>
                                                                       <TableCell>{handset.storage}GB</TableCell>
                                                                       <TableCell>{handset.speed_type}</TableCell>
                                                                       <TableCell>1</TableCell>
                                                                       <TableCell>
                                                                           <FormControl>
                                                                               <Select displayEmpty
                                                                                       onChange={(event) => this.handleColourSelected(event)}
                                                                                       value={this.state.selectedColour}>
                                                                               <MenuItem value=''>
                                                                                   <em>Select Colour</em>
                                                                               </MenuItem>
                                                                               {
                                                                                   handset.colours.map((colour, index) => {
                                                                                       console.log(Object.keys(colour)[0])
                                                                                       console.log()
                                                                                       return(
                                                                                           <MenuItem value={1}>{Object.keys(colour)[0]}</MenuItem>
                                                                                       )
                                                                                   })
                                                                               }
                                                                               </Select>
                                                                           </FormControl>
                                                                       </TableCell>
                                                                       <TableCell align='right' ><Button className={classes.tableButton}
                                                                                          size='small' variant='contained'
                                                                       >
                                                                                          Select</Button></TableCell>
                                                                   </TableRow>
                                                               )
                                                           })
                                                       }
                                                   </TableBody>
                                               </Table>
                                           </TableContainer>
                                       </Box> : <CircularProgress className={classes.progressLoader}/>
                                   }
                               </Box>
                            </Paper>
                   </Grid>
                   <Grid item xs={12} md={8} lg={4}>
                       <Paper className={classes.paper}>
                           <HandsetBasket/>
                       </Paper>
                   </Grid>
               </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(ChooseHandset)