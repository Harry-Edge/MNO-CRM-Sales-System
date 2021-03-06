import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button"

const styles = () => ({
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
    coloursSelecter: {
        paddingTop: 7
    }

});

class AddLineRecommendations extends Component {

    render() {

        const {classes} = this.props

        return (
            <Box>
                <Typography className={classes.title} >Add-Line Recommendations</Typography>
                <Divider/>
                <Box m={0}>
                    <Grid container spacing={4}>
                       <Grid item xs={4}>
                            <Paper>
                                <Box m={2}>
                                    <div>
                                        <br/>
                                    </div>
                                    <Divider/>
                                    <Typography
                                        className={classes.text}>
                                        Data: <strong> 200 GB</strong></Typography>
                                    <Typography
                                        className={classes.text}>
                                        Mrc: <strong>£20.30pm</strong></Typography>
                                    <Typography
                                         className={classes.text}>
                                         Contract Length:
                                         <strong>24 Months</strong></Typography>
                                    <div>
                                        <br/>
                                    </div>
                                   <Button className={classes.button}
                                           fullWidth={true}
                                           size='small'
                                           variant='contained'
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
                        <Grid item xs={4}>
                            <Paper>
                                <Box m={2}>
                                    <div>
                                        <br/>
                                    </div>
                                    <Divider/>
                                    <Typography
                                        className={classes.text}>
                                        Data: <strong> 0.25 GB</strong></Typography>
                                    <Typography
                                        className={classes.text}>
                                        Mrc: <strong>£8.10pm</strong></Typography>
                                    <Typography
                                         className={classes.text}>
                                         Contract Length:
                                         <strong>24 Months</strong></Typography>
                                    <div>
                                        <br/>
                                    </div>
                                   <Button className={classes.button}
                                           fullWidth={true}
                                           size='small'
                                           variant='contained'
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
                          <Grid item xs={4}>
                            <Paper>
                                <Box m={2}>
                                    <div>
                                        <br/>
                                    </div>
                                    <Divider/>
                                    <Typography
                                        className={classes.text}>
                                        Data: <strong> 160 GB</strong></Typography>
                                    <Typography
                                        className={classes.text}>
                                        Mrc: <strong>£18pm</strong></Typography>
                                    <Typography
                                         className={classes.text}>
                                         Contract Length:
                                         <strong>24 Months</strong></Typography>
                                    <div>
                                        <br/>
                                    </div>
                                   <Button className={classes.button}
                                           fullWidth={true}
                                           size='small'
                                           variant='contained'
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
                    </Grid>
                </Box>
            </Box>
        )
    }
}
export default withStyles(styles)(AddLineRecommendations)