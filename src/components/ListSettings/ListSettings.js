import React, { Component } from 'react';
import { Grid, Col, Row, Button, Label, Image, FormControl, DropdownButton, MenuItem, PageHeader } from 'react-bootstrap';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import Dropzone from 'react-dropzone';
import { fetchImageUrl, getAllLists, updateList, getUploadSession } from '../../actions/lists';
import './ListSettings.css';
import './switch.min.css';

class ListSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnline: this.props.list.isOnline,
      name: this.props.list.name,
      image: this.props.list.imageUrl,
    };
  }

  componentWillMount() {
    this.onDrop = this.onDrop.bind(this);
    this.props.getAllLists(this.props.orgId);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.newsletter) {
      return;
    }

    if (nextProps.newsletter !== this.props.newsletter) {
      this.setState(() => ({
        newsletter: {
          ...nextProps.newsletter,
        },
      }));
    }
  }

  toggleSwitch = () => {
    this.setState(prevState => {
      return {
        switched: !prevState.switched
      };
    });
  };

  onNameChange(e) {
    console.log(e.target.value);
    this.setState({
      name: e.target.value
    });
  }

  onOnlineClick() {
    this.setState({
      isOnline: true
    });
    this.props.updateList({
      isOnline: true,
      listId: this.props.match.params.listId,
      orgId: this.props.currentOrg.id
    });
  }

  onOfflineClick() {
    this.setState({
      isOnline: false
    });
    this.props.updateList({
      isOnline: false,
      listId: this.props.match.params.listId,
      orgId: this.props.currentOrg.id
    });
  }

  onNameUpdate() {
    this.props.updateList({
      name: this.state.name,
      listId: this.props.match.params.listId,
      orgId: this.props.currentOrg.id
    });
  }

  onListImageUpdate() {
    this.props.fetchImageUrl({
      image: this.state.image
    });
    // console.log("url", this.props.imageUrl)
  }

  onDrop(files) {
  }

  render() {
    const {isLoading, lists} = this.props;
    if (isLoading || lists === null) {
      return (
        <Grid>
          <PageHeader>
            <Spinner spinnerName="three-bounce" />
          </PageHeader>
        </Grid>
      );
    } else {
      const { name, numberOfSubscribers } = lists[this.props.listId];
      return (
        <Grid>
          <Row>
            <Col md={12} className="no-left-padding">
              <Dropzone accept="image/png" onDrop={this.onDrop} className="image-upload">
                <div>
                  <Image
                    responsive
                    alt="banner"
                    className="banner-image"
                    src={this.state.image}
                        />
                  <Button bsStyle="default" bsSize="sm" className="upload-button" onClick={() => this.onListImageUpdate()}>
                                    Upload Image
                  </Button>
                </div>
              </Dropzone>
            </Col>
          </Row>
          <Row className="padding-t-20">
            <Col md={12} className="no-left-padding">
              <FormControl
                type="text"
                placeholder="Name"
                className="title-input"
                value={this.state.name}
                onChange={this.onNameChange.bind(this)} />
              <Button bsStyle="default" bsSize="sm" className="save-button" onClick={() => this.onNameUpdate()}>
                Save
              </Button>
            </Col>
            <Col md={12} className="gray-border">
              <Col md={6}>
                <Image
                  alt="edit"
                  src="/images/option.png"
                      />
                <Label className="option-text">
                  {name}
                </Label>
                <i className="fa fa-user fa-lg gray" />
                <Label className="option-number">
                  {numberOfSubscribers}
                </Label>
              </Col>
              <Col md={6} className="align-right">
                <DropdownButton
                  id="previewMode"
                  bsSize="sm"
                  bsStyle="default"
                  title={this.state.isOnline ? 'Online' : 'Offline'}
                  className="custom-dropdown"
                            >
                  <MenuItem eventKey="1" onClick={this.onOnlineClick.bind(this)}>
                                  Online
                  </MenuItem>
                  <MenuItem eventKey="2" onClick={this.onOfflineClick.bind(this)}>
                                  Offline
                  </MenuItem>
                </DropdownButton>
              </Col>
            </Col>
          </Row>
        </Grid>
      );
    }
  }
}

function mapStateToProps(state, props) {
  const {listId} = props.match.params;
  const currentOrg = state.userSession.org;
  const list = state.entities.lists[listId];
  return {
    listId: props.match.params.listId,
    lists: state.lists.lists,
    isLoading: state.lists.isLoading,
    orgId: state.userSession.org.id,
    uploadSession: state.lists.uploadSession || null,
    imageUrl: state.lists.imageUrl,
    list,
    currentOrg
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchImageUrl: (...args) => dispatch(fetchImageUrl(...args)),
    getAllLists: (...args) => dispatch(getAllLists(...args)),
    updateList: (...args) => dispatch(updateList(...args)),
    getUploadSession: (...args) => dispatch(getUploadSession(...args))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListSettings);
