import React,{ Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import DoneIcon from '@material-ui/icons/Done'

import Fab from '@material-ui/core/Fab';
import BlockIcon from '@material-ui/icons/Block';

import Iframe from 'react-iframe'
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Moment from 'react-moment';

import { fetchFeeds,enableFeeds } from '../actions/Actions';
import PropTypes from 'prop-types';
import '../assets/css/index.css';
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
}));
class  FeedsList extends Component{

    constructor(){
        super()
        this.state={ 
          feedUrl:null,
        }
        this.openFeed=this.openFeed.bind(this);
      }
      componentDidMount(){
        this.props.fetchFeeds(this.props.data.id);
        //console.log(this.props.data.id);
        //setInterval(()=>{console.log("sdf")},2000)

      }
      openFeed=(url)=>{
        url=url.replace(/["']/g, "");
        
        this.setState({feedUrl:url});
      }
      enableFeeds=(id,provider,active)=>{
        this.props.enableFeeds(id,provider,active);
        //console.log(id);
        
      }
      render(){
          //console.log(this.props.feeds);
          const {feedUrl}=this.state;
          
          const feed=this.props.feeds.map((feed,key)=>                             
                                                    <Card key={key}>
                                                      <CardContent>
                                                        <Typography variant="h6" component="h6">
                                                        {feed.active==1 &&
                                                        <Link
                                                        color="primary"
                                                        component="button"
                                                        variant="h6"
                                                        onClick={()=>this.openFeed(feed.url)}
                                                        
                                                      >
                                                       {key+1}.{feed.title} 
                                                      </Link>||
                                                          <Link
                                                          color="textSecondary"
                                                          component="button"
                                                          variant="h6"
                                                          
                                                          style={{pointerEvents:'none'}}
                                                        >
                                                        {key+1}.{feed.title} 
                                                        </Link>}
                                                        

                                                        </Typography>
                                                        <Typography  color="textSecondary">
                                                         {feed.contentSnippet}
                                                        </Typography>
                                                        <Typography  color="textSecondary">
                                                        Publish Date: <Moment format="DD MMM, YYYY HH:mm:ss">
                                                         {feed.pubDate}
                                                          </Moment>
                                                        
                                                        </Typography>
                                                        {feed.active==1 && <Fab size="small" style={{backgroundColor:'green', color:'white'}} aria-label="Add"  onClick={()=>this.enableFeeds(feed.id,feed.provider,feed.active)}>
                                                          <DoneIcon />
                                                        </Fab> || <Fab size="small" color="secondary" aria-label="Add"  onClick={()=>this.enableFeeds(feed.id,feed.provider,feed.active)}>
                                                          <BlockIcon />
                                                        </Fab> }
                                                       
                                                      </CardContent>  
                                                  <Divider variant="inset" component="li" /></Card>);
          
          return (       <Grid container spacing={3} justify="flex-start">  
                            <Grid item xs={3} id="feedsList">   
                                  {feed}
                                  </Grid>
                                  <Grid item xs={9}> 
                                  <Iframe url={feedUrl}
                                    width="100%"
                                    height={window.innerHeight}
                                    id="myId"
                                    className="myClassname"
                                    display="Hello"
                                    
                                    position="relative"/>  
                                  </Grid>
                                  
                                                      </Grid>);
      }
}

FeedsList.propTypes = {
  fetchFeeds: PropTypes.func.isRequired,
  feeds: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  feeds: state.redux.feeds,
});

export default connect(mapStateToProps, { fetchFeeds,enableFeeds })(FeedsList);

