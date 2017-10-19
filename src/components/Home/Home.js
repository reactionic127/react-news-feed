import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import { Grid, Col, Row, PageHeader } from 'react-bootstrap';

import { loadLists } from '../../actions/lists';
import LatestNewsletterCard from './LatestNewsletterCard';

import './Home.css';

class Home extends Component {

  componentDidMount() {
    this.props.loadLists(this.props.currentOrg.id);
  }

  render() {
    if (!this.props.lists) {
      return (
        <div className="Home">
          <Grid>
            <PageHeader>
              <Spinner spinnerName="three-bounce" />
            </PageHeader>
          </Grid>
        </div>
      );
    }

    const newsletters = this.props.lists.reduce((latestNewsletters, list) => {
      // if (!list.isOnline) {
      //   return latestNewsletters;
      // }

      const newsletter = this.props.newsletters.find(n => n.listId === list.id);

      const wrappedLatestNewsletter = (
        <Col key={list.id} xs={12} md={6}>
          <div
            style={{
              display: 'flex',
              minHeight: '300px',
              justifyContent: 'center',
            }}
          >
            <LatestNewsletterCard list={list} newsletter={newsletter} />
          </div>
        </Col>
      );

      return [
        ...latestNewsletters,
        wrappedLatestNewsletter,
      ];
    }, []);

    return (
      <div className="Home">
        <Grid>
          <PageHeader>
            <Row className="show-grid">
              <Col xs={12} sm={8}>
                CNN <small>Latest Newsletters</small>
              </Col>
            </Row>
          </PageHeader>
          <Row>
            {newsletters}
          </Row>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const lists = Object.values(state.entities.lists);
  const newsletters = Object.values(state.entities.newsletters);
  const currentOrg = state.userSession.org;
  return {
    lists,
    newsletters,
    currentOrg,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadLists: (...args) => dispatch(loadLists(...args))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
