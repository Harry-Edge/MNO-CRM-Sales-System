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
    table: {
         height: 350,
        overflow: 'scroll',
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
    },
    textSuccess: {
        color: 'green',
        fontWeight: 650
    },
    textDanger: {
        color: 'red',
        fontWeight: 650
    },
    textWarning: {
        color: '#e6ac00',
        fontWeight: 650
    },
    progressLoader: {
      color:'#009999',
       position: 'relative',
      marginTop: '20px',
      marginLeft: '45%'
  },
});

class ChooseHandset extends Component {

    state = {handsets: null,
             selectedColour: '',
             modelSelectedId: null,
             modelSelected: '',
             handsetChosen: false,
             ctn: this.props.state.mobileAccount.number}

    componentDidMount() {
          fetch("http://127.0.0.1:8000/api/get-handsets")
             .then((response) => response.json())
             .then((data) =>
                 this.setState({handsets: data}))

          const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.state.ctn})
          }
         fetch("http://127.0.0.1:8000/api/handset-order", requestOptions)
             .then((response) => {
                 if (response.ok){
                     return response.json()
                 }else{
                     throw new Error('No Order Found')
                 }
             })
             .then((data) => {
                 if (data === 'No Order'){
                     console.log(data)
                 }else {
                    this.setState({handsetChosen: true})}
             }
         ).catch((error) => {
             console.log(error)
             })
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
    }

    handleColourSelected(event, model){
        console.log(model)

        this.setState({selectedColour: event.target.value, modelSelected: model})
    }
    handleAddModelToBasket = () => {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({handset: this.state.modelSelectedId, ctn: this.props.state.mobileAccount.number})
        }
        fetch("http://127.0.0.1:8000/api/create-handset-order", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                 console.log(data)
                 this.setState({handsetChosen: false})
                 this.setState({handsetChosen: true})})
    }
    handleDeleteHandsetOrder = () => {
        this.setState({handsetChosen: false})
    }

    handleStockColour = (stock) => {
        if (stock >= 2) {
            return this.props.classes.textSuccess
        }else if (stock >= 1) {
            return this.props.classes.textWarning
        }else{
            return this.props.classes.textDanger
        }
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
                                          otherLines={state.otherLines}
                                          currentCTN={state.mobileAccount.number}/>
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
                                           <TableContainer className={classes.table}>
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
                                                                       <TableCell className={this.handleStockColour(handset.total_stock)}>{handset.total_stock}</TableCell>
                                                                       <TableCell>
                                                                           <FormControl>
                                                                               <Select displayEmpty
                                                                                       onChange={(event) => this.handleColourSelected(event, handset.model)}
                                                                                       value={this.state.modelSelected === handset.model ? this.state.selectedColour: ''}>
                                                                               <MenuItem value=''>
                                                                                   <em>Select Colour</em>
                                                                               </MenuItem>
                                                                               {
                                                                                   handset.colours.map((colour, index) => {
                                                                                       return(
                                                                                           <MenuItem className={this.handleStockColour(Object.values(colour)[0].stock)} key={index} onClick={() =>
                                                                                               this.setState({modelSelectedId: Object.values(colour)[0].id})}
                                                                                                     value={Object.keys(colour)[0]}>{Object.keys(colour)[0]} ({Object.values(colour)[0].stock})</MenuItem>
                                                                                       )
                                                                                   })
                                                                               }
                                                                               </Select>
                                                                           </FormControl>
                                                                       </TableCell>
                                                                       <TableCell align='right' ><Button
                                                                           className={classes.tableButton}
                                                                           size='small' variant='contained'
                                                                           onClick={() => this.handleAddModelToBasket()} >
                                                                                          Add</Button></TableCell>
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
                           {
                               this.state.handsetChosen ?
                               <HandsetBasket
                                currentStage={this.props.currentStage}
                                onChooseHandsetTariffClicked={this.props.onChooseHandsetTariffClicked}
                                onHandsetOrderDeleted={this.handleDeleteHandsetOrder}
                                handsetChosen={this.state.handsetChosen}
                                state={state.mobileAccount}
                                ctn={this.props.state.mobileAccount.number}/>: null
                           }
                       </Paper>
                   </Grid>
               </Grid>
           </div>
        )
    }
}
export default withStyles(styles)(ChooseHandset)