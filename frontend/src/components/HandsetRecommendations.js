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
        paddingTop: 12
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

class HandsetRecommendations extends Component {

    render() {

        const {classes} = this.props

        return (
            <Box>
                <Typography className={classes.title} >Handset Recommendations</Typography>
                <Divider/>
                <Box m={0}>
                    <Grid container spacing={4}>
                        {
                            this.props.recommendedTariffs.map((tariff, index) =>{
                                return (
                                      <Grid item xs={3} key={index}>
                                        <Paper>
                                            <Box m={2}>
                                                <div>
                                                    <br/>
                                                </div>
                                                <Divider/>
                                                <Typography className={classes.text}>Handset: <strong>{tariff.handset}</strong></Typography>
                                                 <Typography className={classes.text}>Data: <strong>{tariff.data}GB</strong></Typography>
                                                <Typography className={classes.text}>Mrc: <strong>£{tariff.mrc}pm</strong></Typography>
                                                 <Typography className={classes.text}>Upfront: <strong>£{tariff.upfront}</strong></Typography>
                                                   <div>
                                                    <br/>
                                                </div>
                                               <Button className={classes.button}
                                                       fullWidth={true}
                                                       size='small'
                                                       variant='contained'
                                                       color="primary">Select</Button>
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
export default withStyles(styles)(HandsetRecommendations)