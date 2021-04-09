import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import {TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import HandsetInsurance from "./HandsetInsurance";

const styles = () => ({
    imeiValidation: {
        width: '65%',
        paddingRight: '10px',
        paddingBottom: '20px'

    },
      button: {
        color: 'white',
        textTransform: 'none',
        backgroundColor: '#009999',
        borderColor: '#009999',

        '&:hover': {
        backgroundColor: '#008080',
        borderColor: '#008080'
        },
    },
});


class StockControl extends Component {

    state = {imeiInput: null,
             imeiError: ''}

    componentDidMount() {
        fetch("http://127.0.0.1:8000/api/get-spend-caps")
             .then((response) => response.json())
             .then((data) => {
                 this.setState({spendCaps: data})
             }
         )
    }
    handleImeiInput = (event) =>  {
        event.preventDefault()
        this.setState({imeiInput: event.target.value})
    }

    handleValidateImei = () => {

        console.log(this.props.orderCTN)
        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({imei: this.state.imeiInput, ctn: this.props.orderCTN})
         }

        fetch('http://127.0.0.1:8000/api/validate-handset-imei', requestOptions)
            .then((response) => response.json()
                .then((data) => {
                    console.log(data)
                }))
    }

    render() {

        const {classes} = this.props

        return (
                  <Grid item xs={12}>
                        <TextField size='small' className={classes.imeiValidation} variant='outlined'
                                   label='Enter IMEI'
                                   error={this.state.imeiError}
                                   onChange={(event) => this.handleImeiInput(event)} />
                         <Button className={classes.button} color='secondary'
                                 variant='contained'
                                 type='submit'
                                 onClick={() => this.handleValidateImei()}>Submit</Button>
                    </Grid>
        )
    }
}
export default withStyles(styles)(StockControl)