import React,{ Component }  from 'react';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import FeedsList from './components/FeedsList';
import Providers from './components/Providers';
import Navbar from './components/Navbar';
import { bigIntLiteral } from '@babel/types';

class  App extends Component{
  constructor(){
    super()
    this.state={ 
      action:'provider',
      providerID:null,
      interval:600000,
    }
  }
  componentDidMount(){

  }
  showFeeds=(id)=>{
    this.setState({action:'feeds', providerID:id})    
  }
  
  render(){
    
    const {action,providerID,interval}=this.state;

    let component=<Providers showFeeds={(id)=>this.showFeeds(id)} />;
    switch(action){
      case 'provider':
        component=<Providers showFeeds={(id)=>this.showFeeds(id)} />
        break;
      case 'feeds':
        component=<FeedsList data={{id:providerID}}/>
        break;
      default:
        break;
    }
  return (
    <Provider store={store}>
      <div className="App">
        <Navbar />
        {component}
      </div>
    </Provider>

  );
}
}

export default App;
