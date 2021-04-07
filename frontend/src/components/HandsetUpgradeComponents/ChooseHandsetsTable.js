import React, {Component} from "react";
import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";


const styles = (theme) => ({
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
})


class ChooseHandsetsTable extends Component {

    state = {handsets: null}

    componentDidMount() {
         fetch("http://127.0.0.1:8000/api/get-handsets")
         .then((response) => response.json())
         .then((data) =>
             this.setState({handsets: data}))
    }


    render() {
        const {classes} = this.props

        return (
                 <Box>
                     {
                         this.state.handsets ?
                             <TableContainer>
                                 <Table size="small" className={classes.tableColor}>
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
                                                                         onChange={(event) => this.handleColourSelected(event, handset.model)}
                                                                         value={this.state.modelSelected === handset.model ? this.state.selectedColour : ''}>
                                                                     <MenuItem value=''>
                                                                         <em>Select Colour</em>
                                                                     </MenuItem>
                                                                     {
                                                                         handset.colours.map((colour, index) => {
                                                                             return (
                                                                                 <MenuItem key={index} onClick={() =>
                                                                                     this.setState({modelSelectedId: Object.values(colour)[0].id})}
                                                                                           value={Object.keys(colour)[0]}>{Object.keys(colour)[0]} ({Object.values(colour)[0].stock})</MenuItem>
                                                                             )
                                                                         })
                                                                     }
                                                                 </Select>
                                                             </FormControl>
                                                         </TableCell>
                                                         <TableCell align='right'><Button
                                                             className={classes.tableButton}
                                                             size='small' variant='contained'
                                                             onClick={() => this.handleAddModelToBasket()}>
                                                             Add</Button></TableCell>
                                                     </TableRow>
                                                 )
                                             })
                                         }
                                     </TableBody>
                                 </Table>
                             </TableContainer> : null
                     }
               </Box>
        )
    }
}
export default withStyles(styles)(ChooseHandsetsTable)





