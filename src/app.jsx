import React, { Component } from 'react';

import Child1 from './child1';
import Child2 from './child2';

export default class App extends Component {
  constructor(props) {
    console.log('constructor');
    super(props);

    this.state = {
      counter: 0,
      todoItem: null,
      // greet:`Hello ${props.name}`,
    };
    // this.increment = this.increment.bind(this);
    // this.decrement = this.decrement.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('getDerivedStateFromProps');
    return {
      greet: `Hello ${nextProps.name}`,
    };
  }

  async componentDidMount() {
  //  const heading = document.getElementById('heading');
  //  console.log(heading);
  //  heading.style.color = 'blue';

    //  document.getElementById('heading').style.color = 'blue';
    // document.addEventListener("mouseover",()=>{
    // console.log("mouseover...");
    // })

    //  document.addEventListener('mouseover', () => {
    //    console.log('mouse enter on heading...');
    //  });

    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos/1');
      const json = await res.json();
      this.setState({ todoItem: json });
    } catch (error) {}
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.counter === 2) {
      const pTag = document.getElementsByTagName('p');
      if (pTag.length > 0) {
        pTag[0].style.color = 'red';
      }
    }
  }

  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  componentDidCatch(error,errorInfo) {
    console.log(error.ComponentStack);
  }

  increment = () => {
    this.setState(({ counter }) => ({
      counter: counter + 1,
    }));
  };

  decrement = () => {
    this.setState(({ counter }) => ({
      counter: counter - 1,
    }));
  };

  render() {
    console.log('render');

    const { counter, todoItem, error } = this.state;

    if (error) {
      return <h1>{error.message}</h1>;
    }

    const { name } = this.props;
    return (
      <div>
        <h1 id="heading">{name}</h1>
        <h2>{todoItem?.title}</h2>
        <button
          type="button"
          onClick={this.increment}
        >
          +
        </button>
        <p>{ counter }</p>
        <button
          type="button"
          onClick={this.decrement}
        >
          -
        </button>
        {counter < 10 && <Child1 counter={counter} />}
        <Child2 />
      </div>
    );
  }
}
