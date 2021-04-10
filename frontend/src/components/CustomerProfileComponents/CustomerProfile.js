import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Box from '@material-ui/core/Box'
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";


const styles = (theme) => ({
    textSuccess: {
        color: 'green'
    },
    mainText: {
        fontWeight: 650,
        color: 'grey',
        fontSize: 20,
        paddingBottom: 15
    },
    textEntryField: {
        width: 400,
        height: 30,
        paddingLeft: 20
    },
    textColour: {
        color: 'grey'
    },
    button: {
        color: 'white',
        fontWeight: 650,
        backgroundColor: '#009999',
        borderColor: '#009999',

        '&:hover': {
          backgroundColor: '#008080',
          borderColor: '#008080'
         },
    },

});

class CustomerProfile extends Component {

    state = {firstName: 'Boris',
             lastName: 'Johnson',
             customer: this.props.customer}

     componentDidMount() {
        console.log(this.props.customer)

     }

     handleChangeCustomerDetails = () => {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({id: this.state.customer.id,
                                        first_name: this.state.customer.first_name,
                                        last_name: this.state.customer.last_name,
                                        first_line_address: this.state.customer.first_line_address,
                                        postcode: this.state.customer.postcode,
                                        email: this.state.customer.email})
        }

        fetch('http://127.0.0.1:8000/api/update-customer-details', requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
        })
     }

    render() {
        const {classes, } = this.props

        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper>
                        <Box m={3}>
                            <Box style={{paddingTop: 30}}>
                                <Grid container >
                                    <Grid lg={2}>
                                          <Typography className={classes.mainText}>First Name: </Typography>
                                    </Grid>
                                    <Grid>
                                         <TextField className={classes.textEntryField}
                                                    size='small'
                                                    variant='outlined'
                                                    InputProps={{className: classes.textColour}}
                                                    onChange={(e) => {
                                                        this.setState(Object.assign(this.state.customer,
                                                            {first_name: e.target.value}))
                                                    }}
                                                    defaultValue={this.state.customer.first_name}/>
                                    </Grid>
                                </Grid>
                                 <Grid container style={{paddingBottom: 10}}>
                                    <Grid lg={2}>
                                          <Typography className={classes.mainText}>Last Name: </Typography>
                                    </Grid>
                                    <Grid>
                                         <TextField className={classes.textEntryField}
                                                    size='small'
                                                    variant='outlined'
                                                    InputProps={{className: classes.textColour}}
                                                    onChange={(e) => {
                                                        this.setState(Object.assign(this.state.customer,
                                                            {last_name: e.target.value}))
                                                    }}
                                                    defaultValue={this.state.customer.last_name}/>
                                    </Grid>
                                </Grid>
                                <Divider/>
                            </Box>
                            <Box style={{paddingTop: 30}}>
                                 <Grid container >
                                    <Grid lg={2}>
                                          <Typography className={classes.mainText}>First Line Address: </Typography>
                                    </Grid>
                                    <Grid>
                                         <TextField className={classes.textEntryField}
                                                    size='small'
                                                    variant='outlined'
                                                    InputProps={{className: classes.textColour}}
                                                     onChange={(e) => {
                                                        this.setState(Object.assign(this.state.customer,
                                                            {first_line_address: e.target.value}))
                                                    }}
                                                    defaultValue={this.state.customer.first_line_address}/>
                                    </Grid>
                                </Grid>
                                <Grid container >
                                    <Grid lg={2}>
                                          <Typography className={classes.mainText}>Postcode: </Typography>
                                    </Grid>
                                    <Grid>
                                         <TextField className={classes.textEntryField}
                                                    size='small'
                                                    variant='outlined'
                                                    InputProps={{className: classes.textColour}}
                                                    onChange={(e) => {
                                                        this.setState(Object.assign(this.state.customer,
                                                            {postcode: e.target.value}))
                                                    }}
                                                    defaultValue={this.state.customer.postcode}/>
                                    </Grid>
                                </Grid>
                                <Divider/>
                            </Box>
                            <Box style={{paddingTop: 30, paddingBottom: 50}}>
                                 <Grid container style={{paddingBottom: 10}} >
                                    <Grid lg={2}>
                                          <Typography className={classes.mainText}>Email: </Typography>
                                    </Grid>
                                    <Grid>
                                         <TextField className={classes.textEntryField}
                                                    size='small'
                                                    variant='outlined'
                                                    InputProps={{className: classes.textColour}}
                                                    onChange={(e) => {
                                                        this.setState(Object.assign(this.state.customer,
                                                            {email: e.target.value}))
                                                    }}
                                                    defaultValue={this.state.customer.email}/>
                                    </Grid>
                                     <Grid style={{paddingLeft: 90}}>
                                           <Button
                                            className={classes.button}
                                            onClick={() => this.handleChangeCustomerDetails()}>Update</Button>
                                     </Grid>
                                </Grid>
                                <Divider/>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        )
    }
}
export default withStyles(styles)(CustomerProfile)