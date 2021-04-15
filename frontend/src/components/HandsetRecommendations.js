import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button"
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TableCell from "@material-ui/core/TableCell";
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
    coloursSelecter: {
        paddingTop: 7
    }

});

class HandsetRecommendations extends Component {

    state = {modelSelected: '',
             modelSelectedId: null,
             selectedColour: '',
             upfrontChosen: null,
             mrcChosen: null,
             dataChosen: null}

    componentDidMount() {
        console.log(this.props.recommendedTariffs)
    }

    addRecommendedHandsetAndTariffToBasket = async () => {
        const handsetRequestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({handset: this.state.modelSelectedId, ctn: this.props.ctn})
         }

        await fetch('http://127.0.0.1:8000/api/create-handset-order', handsetRequestOptions)
            .then((response) => response.json()
                .then((data) => {
                    console.log(data)
                }))

        const tariffRequestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.props.ctn, upfront: this.state.upfrontChosen, mrc: this.state.mrcChosen, data_allowance: this.state.dataChosen})
        }

         await fetch("http://127.0.0.1:8000/api/add-handset-tariff-to-order", tariffRequestOptions)
             .then((response) => response.json())
             .then((data) => {
                   console.log(data)
                   this.props.onSelectedRecommended()})
    }

    handleTariffAndModelSelected(event, model, upfront, mrc, dataAllowance){
        this.setState({selectedColour: event.target.value, modelSelected: model, upfrontChosen: upfront,
                              mrcChosen: mrc, dataChosen: dataAllowance})
    }

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
                                              <FormControl>
                                                   <Select displayEmpty
                                                           className={classes.coloursSelecter}
                                                           onChange={(event) => this.handleTariffAndModelSelected(event,
                                                                                                                                                        tariff.handset,
                                                                                                                                                        tariff.upfront,
                                                                                                                                                        tariff.mrc,
                                                                                                                                                        tariff.data)}
                                                           value={this.state.modelSelected === tariff.handset ? this.state.selectedColour: ''}>
                                                   <MenuItem value=''>
                                                       <em>Select Colour</em>
                                                   </MenuItem>
                                                   {
                                                       tariff.colours_available.map((colour, index) => {
                                                           return(
                                                               <MenuItem key={index} onClick={() => this.setState({modelSelectedId: Object.values(colour)[0].id})}
                                                                         value={Object.keys(colour)[0]}>{Object.keys(colour)[0]} ({Object.values(colour)[0].stock})</MenuItem>
                                                           )
                                                       })
                                                   }
                                                   </Select>
                                               </FormControl>
                                               <div>
                                                    <br/>
                                                </div>
                                               <Button className={classes.button}
                                                       fullWidth={true}
                                                       size='small'
                                                       variant='contained'
                                                       onClick={() => this.addRecommendedHandsetAndTariffToBasket()}
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