import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button"

const styles = (theme) => ({
    title: {
        fontWeight: 650,
        color: 'grey'
    },
    text: {
        paddingTop: 7
    },
    button: {
    textTransform: 'none',
    backgroundColor: '#009999',
    borderColor: '#009999',

    '&:hover': {
      backgroundColor: '#008080',
      borderColor: '#008080'
     },
    },

});

class SimOnlyRecommendations extends Component {

    addRecommendedSimToBasket = (tariffCode) => {
        console.log(tariffCode)
           const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({tariff_code: tariffCode, ctn: this.props.ctn})
         }

        fetch('http://127.0.0.1:8000/api/create-sim-only-order', requestOptions)
            .then((response) => response.json()
                .then((data) => {
                    console.log(data)
                    this.props.onSelectedRecommendation()
                }))
    }

    render() {

        const {classes} = this.props

        return (
            <Box>
                <Typography className={classes.title} >Sim-Only Recommendations</Typography>
                <Divider/>
                <Box m={0}>
                    <Grid container spacing={4}>
                        {
                            this.props.recommendedTariffs.map((tariff, index) => {
                                return (
                                       <Grid item xs={3} key={index}>
                                            <Paper>
                                                <Box m={2}>
                                                    <div>
                                                        <br/>
                                                    </div>
                                                    <Divider/>
                                                    <Typography
                                                        className={classes.text}>
                                                        Data: <strong>{tariff.data_allowance}GB</strong></Typography>
                                                    <Typography
                                                        className={classes.text}>
                                                        Mrc: <strong>£{tariff.mrc}pm</strong></Typography>
                                                    <Typography
                                                         className={classes.text}>
                                                         Contract Length:
                                                         <strong>{tariff.contract_length} Months</strong></Typography>
                                                    <div>
                                                        <br/>
                                                    </div>
                                                   <Button className={classes.button}
                                                           fullWidth={true}
                                                           size='small'
                                                           variant='contained'
                                                           onClick={() => this.addRecommendedSimToBasket(tariff.id)}
                                                           color="primary">Add To Basket</Button>
                                                    <div>
                                                        <br/>
                                                    </div>
                                                    <Divider/>
                                                    <div>
                                                        <br/>
                                                    </div>
                                                </Box>
                                            </Paper>
                                       </Grid>
                                )
                            })
                        }
                    </Grid>
                </Box>
            </Box>
        )
    }
}
export default withStyles(styles)(SimOnlyRecommendations)