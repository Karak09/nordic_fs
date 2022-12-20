import React, { Component } from 'react';
import shallowCompare from 'react-addons-shallow-compare';

// export default class Child1 extends PureComponent {
export default class Child1 extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState);

    // return false;
    // console.log(nextProps);
    // console.log(this.props);

    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

static mouseMove = () => {
    console.log('mouse move');
  };

  componentDidMount() {
    document.addEventListener('mousemove', Child1.mouseMove);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', Child1.mouseMove);
  //  throw new error("somthig went error...");
  }

  render() {
    const { counter } = this.props;
    if (counter > 5) {
      throw new error("somthig went error...")
    }

    console.log('child 1 render');
    return (
      <div>
        <h1>Child1</h1>
        <h2>{counter}</h2>
      </div>
    );
  }
}
