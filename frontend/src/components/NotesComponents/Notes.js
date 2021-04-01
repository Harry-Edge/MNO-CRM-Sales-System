import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DashboardIcon from "@material-ui/icons/Dashboard";
import SimCardIcon from "@material-ui/icons/SimCard";
import SmartphoneIcon from "@material-ui/icons/Smartphone";
import PeopleIcon from "@material-ui/icons/People";
import AddIcon from '@material-ui/icons/Add';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import {CircularProgress} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

const styles = (theme) => ({
    currentlySelected: {
        backgroundColor: '#f2f2f2'
    },
    text: {
        color: 'grey',

    },
    test: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    },
    boldFont :{
        fontWeight: 650
    },
    progressLoader: {
          color:'#009999',
          position: 'relative',
          marginTop: '20px',
          marginLeft: '45%'
    },
    addNoteTextField: {
        width: '100%',
        borderColor: 'grey'
    },
    button: {
        color: 'white',
        textTransform: 'none',
        backgroundColor: '#009999',
        borderColor: '#009999',
        marginTop: 9,
        height: 30,
        marginBottom: 9,
        width: '100%',

        '&:hover': {
          backgroundColor: '#008080',
          borderColor: '#008080'
         },
    },

});

class Notes extends Component {
    state = {allNotes: null,
             newNoteContent: ''}

    componentDidMount() {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({id: this.props.customer.id})
        }
        fetch("http://127.0.0.1:8000/api/get-customer-notes", requestOptions)
             .then((response) => response.json())
             .then((data) =>
                this.setState({allNotes: data}))
    }

    handleNewNote = () => {
        console.log(this.state.newNoteContent)
        this.setState({newNoteContent: ''})
    }

    render() {

        const {classes,} = this.props

        return (
           <Grid container spacing={2}>
               <Grid item xs={3}>
                   <Paper>
                       <Box className={classes.test}>
                           <Typography className={classes.text}>Info</Typography>
                           <Divider/>
                           <br/>
                           <br/>
                           <br/>
                       </Box>
                   </Paper>
               </Grid>
                 <Grid item xs={6}>
                   <Paper>
                       <Box className={classes.test}>
                           <Typography className={classes.text}>Notes</Typography>
                           <Divider/>
                           <Box m={1}>
                           {
                               this.state.allNotes ?
                             <TableContainer>
                               <Table size='small'>
                               <TableBody>
                                   {
                                       this.state.allNotes.map((note, index) => {
                                           return (
                                              <TableRow hover={true} key={index}>
                                               <TableCell>{note.note_content}</TableCell>
                                               <TableCell align='right'>{note.date_created}</TableCell>
                                              </TableRow>
                                           )

                                       })
                                   }
                               </TableBody>
                               </Table>
                           </TableContainer>: <CircularProgress className={classes.progressLoader}/>
                           }
                           </Box>
                           <br/>
                       </Box>
                   </Paper>
               </Grid>
                 <Grid item xs={3}>
                   <Paper>
                       <Box className={classes.test}>
                           <Typography className={classes.text}>Add Note</Typography>
                          <Divider/>
                          <Box m={1}>
                                  <TextField
                                    className={classes.addNoteTextField}
                                    onChange={(e) => this.setState({newNoteContent: e.target.value})}
                                    variant='outlined'
                                    multiline
                                    value={this.state.newNoteContent}
                                    rows={4}/>
                                    <Button
                                        onClick={() => this.handleNewNote()}
                                        className={classes.button}>Add Note</Button>
                          </Box>
                       </Box>
                   </Paper>
               </Grid>
           </Grid>
        )
    }
}
export default withStyles(styles)(Notes)