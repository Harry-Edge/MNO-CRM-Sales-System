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
    spendCapList: {
        height: 165,
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


class SpendCaps extends Component {

    state = {spendCaps: null}

    componentDidMount() {
        fetch("http://127.0.0.1:8000/api/get-spend-caps")
             .then((response) => response.json())
             .then((data) => {
                 this.setState({spendCaps: data})
             }
         )
    }

    render() {

        const {classes} = this.props

        return (
            <div>
                {
                    this.state.spendCaps?
                          <Box className={classes.spendCapList}>
                            <List>
                                {this.state.spendCaps.map((spendCap, index) => {
                                        return(
                                            <ListItem key={index}
                                                      button
                                                      onClick={() => this.props.onSpendCapSelected(spendCap.id)}
                                                      className={this.props.capSelected === spendCap.cap_name ? classes.currentlySelected : null}>
                                                <ListItemText  classes={{primary:classes.listItem}} primary={spendCap.cap_name}/>
                                                <ListItemIcon >
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

export default withStyles(styles)(SpendCaps)