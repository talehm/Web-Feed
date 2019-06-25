import React,{ Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { confirmAlert } from 'react-confirm-alert';
import Fab from '@material-ui/core/Fab';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import CardHeader from '@material-ui/core/CardHeader';
import ShareIcon from '@material-ui/icons/Share';
import LinkIcon from '@material-ui/icons/Link';
import BlockIcon from '@material-ui/icons/Block';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import clsx from 'clsx';
import merge from 'lodash/merge';
import EditIcon from '@material-ui/icons/Edit'
import DoneIcon from '@material-ui/icons/Done'

import DeleteIcon from '@material-ui/icons/Delete'
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import dateFormat from 'dateformat';

import { red } from '@material-ui/core/colors';
import Collapse from '@material-ui/core/Collapse';
import RssFeed from '@material-ui/icons/RssFeed'
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { fetchProviders,setProviders,editProvider,fetchSettings,deleteProvider,enableProvider } from '../actions/Actions';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import AddIcon from '@material-ui/icons/Add';
import ModalContainer from './Modal';

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));


 

class  Providers extends Component{
    constructor(props){
        super(props)
        this.state={ 
          expanded:false,
          open:false,
          openMenu:false,
          anchorEl:null,
          modalAction:null,
          activeProvider:null,
          errorText:null,
          textfield:{
            name:null,
            url:null,
          }
        }
      }
      componentDidMount(){
        this.props.fetchSettings();
        this.props.fetchProviders();

        setTimeout(()=>{ 
          this.props.settings.map((value)=>{           
           setInterval(()=> {
              this.props.fetchProviders()
            },value.interval)   
          })
        }, 1000);
    
        
  
      }
      handleExpandClick=()=> {
        this.setState({expanded:!this.state.expanded});
      }
      openModal=()=>{

        this.setState({open:true,modalAction:'add',textField:null,});
      }
      handleClose=()=>{
        this.setState({ open: false });
      }
      handleCloseMenu=()=> {
        this.setState({ anchorEl: null });
      }
      handleClick = placement => event => {
        const { currentTarget } = event;
        this.setState(state => ({
          anchorEl: currentTarget,
          openMenu: state.placement !== placement || !state.openMenu,
          placement,
        }));
      };

      addNewProvider=()=>{
        var name=document.getElementById("outlined-name").value
        var url=document.getElementById("outlined-url").value
        if(name && url){
          this.props.setProviders(name,url);
          this.setState({ open: false });
        }
        else{
          this.setState({errorText:"Please fill the Form"})
        }
        
      }
      updateProvider=()=>{
        var name=document.getElementById("outlined-name").value
        var url=document.getElementById("outlined-url").value
        if(name && url){
          this.props.editProvider(this.state.activeProvider,name,url);
          this.setState({ open: false });
        }
        else{
          this.setState({errorText:"Please fill the Form"})
        }
      }
      handleEditProvider=(id,name,url)=>{
        this.setState({open:true,textfield:{name:name,url:url},modalAction:'update',activeProvider:id});
        
      }
      enableProvider=(id,active)=>{
        this.props.enableProvider(id,active);
 
      }

      handleTextField=(event,field)=>{
        this.setState({textfield:merge({}, this.state.textfield, {[field]:event.target.value})})
      }
      handleDeleteProvider=(id)=>{
        confirmAlert({
          customUI: ({ onClose }) => {
            return (
              <div className='confirm_dialog'>
                <h1>Are you sure?</h1>
                <p>You want to delete this file?</p>
                <button onClick={onClose}>No</button>
                <button
                  onClick={() => {
                    this.props.deleteProvider(id);    
                    onClose();
                  }}
                >
                  Yes, Delete it!
                </button>
              </div>
            );
          }
        });
      }
      render(){
//        console.log(this.props.data.interval);

        //console.log(document.querySelectorAll(".providerGrid").clientHeight);
       //console.log(this.props.data.interval);
       //this.props.changeInterval(5000);

        const classes=this.props;
        const {expanded,open,modalAction,errorText} = this.state;
        const {providers}=this.props;
        switch(modalAction){
          case 'add':
            var modalActionBtn=<Button variant="contained" color="primary" className={classes.button} onClick={this.addNewProvider}>
            Add
          </Button>
          break;
          case 'update':
              var modalActionBtn=<Button variant="contained" color="primary" className={classes.button} onClick={this.updateProvider}>
              Update
            </Button>
          break;
          default:
            break;
        }
        const provider=providers.map((value,key)=>
          <Grid key={key} item xs={3} className="providerGrid" >  
            <Card>
              <CardHeader
                avatar={
                  <Avatar aria-label="Recipe" >
                    News
                  </Avatar>
                }
                action={value.active==1 && <Fab size="small" style={{backgroundColor:'green', color:'white'}} aria-label="Add" className={classes.margin} onClick={()=>this.enableProvider(value.id,value.active)}>
                <DoneIcon />
              </Fab> || <Fab size="small" color="secondary" aria-label="Add" className={classes.margin} onClick={()=>this.enableProvider(value.id,value.active)}>
                <BlockIcon />
              </Fab> }
                title={<Typography variant="h5" color="primary" component="p">{value.name}</Typography>}
                subheader={<Typography variant="h6" color="textSecondary" component="p">{dateFormat(value.lastUpdate,'dd mmm yyyy HH:mm:ss')}</Typography>}
              />
              
              <CardContent>
                <Typography variant="body1" color="primary" component="p">
                  {value.title!=null && value.title.includes("Error") && <span style={{color:'red'}}>{value.title}</span> || <span >{value.title}</span>}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                {value.active==1 && <IconButton aria-label="Add to favorites" onClick={()=>this.props.showFeeds(value.id)}>
                  <RssFeed/>
                </IconButton> }
                
                
                <IconButton aria-label="Share" onClick={()=>this.handleEditProvider(value.id,value.name,value.url)}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="Share" onClick={()=>this.handleDeleteProvider(value.id)}>
                  <DeleteIcon style={{color:'red'}} />
                </IconButton>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                  })}
                  onClick={this.handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="Show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
                
                
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>
                    Link: <a href={value.link} target="_blank">{value.link}</a>
                  </Typography>
                  <Typography paragraph>
                   Last Build Date: {value.lastBuildDate}
                  </Typography>
                  
                </CardContent>
              </Collapse>
            </Card>
          </Grid>)
        const addProviderContent=<Grid container  spacing={5} justify="center" alignItems="center"  >
          <Grid item xs={12}>
          <Typography variant="h6" component="h2" align="center" >
                  Add New Provider
          </Typography>
          </Grid>
          <Grid item >
          <RssFeed style={{fontSize:'40px', color:'cyan'}}/>

            </Grid>
        <Grid item xs={10} >
            <TextField
            id="outlined-name"
            label="Name"
            className={clsx(classes.textField, classes.dense)}
            margin="dense"
            variant="outlined"
            fullWidth={true}
            value={this.state.textfield.name}
            onChange={(event)=>this.handleTextField(event,"name")}
          />
      </Grid>
      <Grid item >
          <LinkIcon style={{fontSize:'40px', color:'cyan'}}/>
      </Grid>
      <Grid item xs={10} >
        <TextField
          id="outlined-url"
          label="URL"
          className={clsx(classes.textField, classes.dense)}
          margin="dense"
          variant="outlined"
          fullWidth={true}
          value={this.state.textfield.url}
          onChange={(event)=>this.handleTextField(event,"url")}

        />
      </Grid>
      <Grid item xs={12} >

      <Typography variant="subtitle1" component="p" color="secondary" align="center" >
                  {errorText}
          </Typography></Grid>
      {modalActionBtn}
        </Grid>;
          return(<>
                    <ModalContainer data={{open:open, content:addProviderContent}} handleClose={this.handleClose}/>
                    
                    <Grid container  spacing={5} justify="center" style={{marginTop:'20px'}} >
                      <Grid item xs={2} className="addProvider" onClick={this.openModal} >
                        <Paper  className="" elevation={1} style={{height:'100%'}}>
                          <Grid container spacing={0} justify="center" style={{height:'100%',minHeight:'200px'}} alignItems='center'>
                            <AddIcon/>
                          </Grid>
                        </Paper>
                      </Grid>
                      {provider}
                      <Grid item xs={12}>
                      <Fab variant="extended" style={{fontSize:30}} color="primary" aria-label="Delete" className={classes.fab} onClick={()=>this.props.showFeeds("all")}>
        
        <RssFeed className={classes.extendedIcon}  style={{fontSize:30}} />
        All Feeds
      </Fab></Grid>
                    </Grid>
                  </>);
      }
}

Providers.propTypes = {
  fetchProviders: PropTypes.func.isRequired,
  setProviders:PropTypes.func.isRequired,
  deleteProvider:PropTypes.func.isRequired,
  fetchSettings:PropTypes.func.isRequired,
  providers: PropTypes.array.isRequired,
  settings: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  providers: state.redux.providers,
  settings:state.redux.settings,
});

export default connect(mapStateToProps, { fetchProviders, setProviders,editProvider,deleteProvider,enableProvider,fetchSettings })(Providers);

