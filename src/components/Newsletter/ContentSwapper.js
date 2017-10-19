import React from 'react';
import ReactCSSTransitionReplace from 'react-css-transition-replace';

class ContentSwapper extends React.Component {
  constructor(props) {
    super(props);

    this.state = { swapped: false };
    this.timer = null;
  }

  componentWillMount() {
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      this.setState({ swapped: !this.state.swapped });
    }, 4000);
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  handleClick() {
    this.setState({
      swapped: !this.state.swapped,
    });
  }

  render() {
    const content = React.Children.toArray(this.props.children);
    const { style = {} } = this.props;

    return (
      <ReactCSSTransitionReplace
        {...this.props}
        style={style}
        onClick={this.handleClick}
      >
        {this.state.swapped ? content[1] : content[0]}
      </ReactCSSTransitionReplace>
    );
  }
}

export default ContentSwapper;
