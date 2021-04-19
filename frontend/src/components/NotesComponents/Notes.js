import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import {CircularProgress} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

const styles = () => ({
    currentlySelected: {
        backgroundColor: '#f2f2f2'
    },
    text: {
        color: 'grey',

    },
    test: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 10
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
    noteTable: {
        height: 155,
        overflow: 'scroll',
    },
    button: {
        color: 'white',
        textTransform: 'none',
        backgroundColor: '#009999',
        borderColor: '#009999',
        marginTop: 11,
        height: 30,
        width: '100%',

        '&:hover': {
          backgroundColor: '#008080',
          borderColor: '#008080'
         },
    },
    accessedText: {
        fontSize: 15,
        color: 'grey',
        fontWeight: 650
    },
    openOrdersTable: {
        height: 80,
        overflow: 'scroll',
    },
    openOrdersTableText: {
        fontSize: 12,
        fontWeight: 650,

    }

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

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({id: this.props.customer.id,
                                        note_content: this.state.newNoteContent,
                                        created_by: this.props.employee.username })
        }
        fetch("http://127.0.0.1:8000/api/add-note", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                 console.log(data)
                 this.setState({newNoteContent: '', allNotes: [data, ...this.state.allNotes]})
             })
    }

    render() {

        const {classes,} = this.props

        return (
           <Grid container spacing={2}>
               <Grid item xs={4}>
                   <Paper style={{height: 216}}>
                       <Box className={classes.test}>
                           <Typography className={classes.text}>Info</Typography>
                           <Divider/>
                           <Box m={1}>
                               <Typography className={classes.accessedText}>Account Last Accessed By:</Typography>
                               <Box m={1}>
                                   <Typography className={classes.openOrdersTableText}>
                                       {this.props.customer.account_last_accessed_by} - {this.props.customer.account_last_accessed_date_time}
                                   </Typography>
                               </Box>
                           </Box>
                           <Box m={1}>
                               <Typography className={classes.accessedText}>Open Orders</Typography>
                               <Box className={classes.openOrdersTable}>
                                   <TableContainer>
                                       <Table size='small'>
                                           <TableBody>
                                               {
                                                   this.props.customer.open_orders.map((order, index) => {
                                                       return (
                                                           <TableRow key={index}>
                                                               <TableCell className={classes.openOrdersTableText}>{order.number}</TableCell>
                                                               <TableCell className={classes.openOrdersTableText}>{order.type}</TableCell>
                                                           </TableRow>
                                                       )
                                                   })
                                               }
                                           </TableBody>
                                       </Table>
                                   </TableContainer>
                               </Box>
                           </Box>
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
                           <Box className={classes.noteTable} m={1}>
                           {
                               this.state.allNotes ?
                             <TableContainer>
                               <Table className={classes.noteTable} size='small'>
                               <TableBody>
                                   {
                                       this.state.allNotes.map((note, index) => {
                                           return (
                                              <TableRow hover={true} key={index}>
                                               <TableCell style={{width: 400}}>{note.note_content}</TableCell>
                                               <TableCell style={{width: 120}}>{note.date_created}</TableCell>
                                               <TableCell align='right'>{note.created_by}</TableCell>
                                              </TableRow>
                                           )

                                       })
                                   }
                               </TableBody>
                               </Table>
                           </TableContainer>: <CircularProgress className={classes.progressLoader}/>
                           }
                           </Box>
                       </Box>
                   </Paper>
               </Grid>
                 <Grid item xs={2}>
                   <Paper>
                       <Box className={classes.test}>
                           <Typography className={classes.text}>Add Note</Typography>
                          <Divider/>
                          <Box m={1}>
                                  <TextField
                                    className={classes.addNoteTextField}
                                    onChange={(e) =>
                                        this.setState({newNoteContent: e.target.value})}
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