import React, { Component } from 'react';
import ReactFlipCard from 'react-flipcard';
import ListCard from './ListCard';
import NewsletterCard from './NewsletterCard';

import './FlipCard.css';

class FlipCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      flipped: false,
    };
  }

  componentWillMount() {
    this.handleFlip = this.handleFlip.bind(this);
  }

  handleFlip() {
    this.setState(prevState => ({
      flipped: !prevState.flipped,
    }));
  }

  render() {
    const { newsletter, list } = this.props;

    return (
      <ReactFlipCard
        disabled
        flipped={this.state.flipped}
      >
        <div className="Home-cardWrapper">
          <NewsletterCard newsletter={newsletter} list={list} onOptionsClick={this.handleFlip} />
        </div>
        <div className="Home-cardWrapper">
          <ListCard newsletter={newsletter} list={list} onOptionsClick={this.handleFlip} />
        </div>
      </ReactFlipCard>
    );
  }
}

export default FlipCard;
