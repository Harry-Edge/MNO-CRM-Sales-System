import Box from "@material-ui/core/Box";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CircularProgress from "@material-ui/core/CircularProgress";
import React, {Component} from "react";
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
    insuranceList: {
        height: 160,
        width: '95%',
        overflow: 'scroll',
    },
    listItem: {
        fontSize: '0.9em'
    },
    currentlySelected: {
        backgroundColor: '#f2f2f2'
    },
    progressLoader: {
          color:'#009999',
          position: 'relative',
          marginTop: '20px',
          marginLeft: '45%'
    },
});


class HandsetInsurance extends Component {

    state = {insuranceOptions: null}

    componentDidMount() {

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `JWT ${localStorage.getItem('token')}`},
            body: JSON.stringify({ctn: this.props.orderCtn, string: 'empty'})
         }

        fetch("http://127.0.0.1:8000/api/get-handset-insurance", requestOptions)
             .then((response) => response.json())
             .then((data) => {
                 console.log(data)
                 this.setState({insuranceOptions: data})
             }
         )
    }

    render() {

        const {classes} = this.props

        return (
            <div>
                {
                    this.state.insuranceOptions?
                          <Box className={classes.insuranceList}>
                            <List>
                                {this.state.insuranceOptions.map((insurance, index) => {
                                        return(
                                            <ListItem key={index}
                                                      button
                                                      style={{height: 45}}
                                                      onClick={() => this.props.onInsuranceSelected(insurance.id)}
                                                      className={this.props.insuranceSelected
                                                      === insurance.insurance_name ? classes.currentlySelected : null}>
                                                <ListItemText  classes={{primary:classes.listItem}}
                                                               primary={insurance.insurance_name}
                                                               secondary={ insurance.excess_fee ?
                                                                   '£' + insurance.excess_fee + ' Excess': null}
                                                />
                                                <ListItemIcon>
                                                    <AddCircleOutlineIcon/>
                                                </ListItemIcon>
                                            </ListItem>
                                        )
                                     })
                                }
                            </List>
                          </Box>
                        : <CircularProgress className={classes.progressLoader}/>
                    }
            </div>
        )
    }
}
export default withStyles(styles)(HandsetInsurance)