import React,{Component} from 'react';

export default class App extends Component{
    constructor(props){
        super(props);
        this.state={
            counter:0,
        };
}
increment=()=>{
  this.setState(({counter})=>({
    counter: counter+1,
  }));
};
decrement=()=>{
  this.setState(({counter})=>({
    counter: counter+1,
  }));
};

render(){
    console.log('render');
    const {counter,greet}= this.state;
    return(
        <div>
          <h1>{great</h1>
        <button type="button" onClick={()=>{
            this.setState(({counter})=>({
                counter:counter+1,
            }));
          }}
          >
          +
          </button>
          <p>{counter}</p>
        )
}