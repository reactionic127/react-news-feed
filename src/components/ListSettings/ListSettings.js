import React, { Component } from 'react';
import { Grid, Col, Row, Button, Label, Image, FormControl, DropdownButton, MenuItem, PageHeader } from 'react-bootstrap';
import { connect } from 'react-redux';
import Spinner from 'react-spinkit';
import Dropzone from 'react-dropzone'

// const LineChart = require("react-chartjs").Line;

import { fetchImageUrl, getAllLists, updateList, getUploadSession } from '../../actions/lists';
// import Switch from 'react-toggle-switch'
import './ListSettings.css';
import './switch.min.css';

/*
const linechartData = {
	labels: ["0", "01", "02", "03", "04", "05", "06", "07"],
	datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(191,204,210,0.36)",
            strokeColor: "rgba(157,61,100,0.5)",
            pointColor: "rgba(164,28,83,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [4.1, 5.2, 5.1, 3.1, 1.2, 2.5, 3.7, 4.1]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(191,204,210,0.36)",
            strokeColor: "rgba(157,61,100,0.5)",
            pointColor: "rgba(164,28,83,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(229,233,239,1)",
            data: [2.1, 4.1, 5.5, 4.8, 2.9, 1.4, 1.8, 2.8]
        },
		{
			label: "My Third dataset",
            fillColor: "rgba(191,204,210,0.36)",
            strokeColor: "rgba(156,168,182,0.5)",
            pointColor: "rgba(164,28,83,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(193,203,210,1)",
            data: [1.6, 2.2, 2.9, 3.5, 3.9, 2.5, 1.8, 2.2]
		},
		{
			label: "My Fourth dataset",
            fillColor: "rgba(191,204,210,0.36)",
            strokeColor: "rgba(157,61,100,0.5)",
            pointColor: "rgba(164,28,83,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(155,169,181,1)",
            data: [1.4, 1.4, 1.5, 1.8, 2.5, 3.5, 3.7, 2.2]
        }
    ]
}

const linechartOptions = {
	responsive: true,
	maintainAspectRatio: true,
	scaleOverride: true,
    scaleStartValue: 0,
    scaleSteps: 7,
    scaleStepWidth: 1
}
*/

class ListSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
		switched: false,
		width: '750', 
		height: '300',
		isOnline: this.props.list.isOnline,
		name: this.props.list.name,
		image: this.props.list.imageUrl,
		files: []
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
		console.log(e.target.value)
		this.setState({
			name: e.target.value
		})
	}

	onOnlineClick() {
		this.setState({
			isOnline: true
		})
		this.props.updateList({ 
			isOnline: true,
			listId: this.props.match.params.listId,
			orgId: this.props.currentOrg.id
		});
	}

	onOfflineClick() {
		this.setState({
			isOnline: false
		})
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
		// this.props.updateList({ 
		// 	imageUrl: 'http://cms-dev.debutapp.com/images/reliable-sources-3x.png',
		// 	listId: this.props.match.params.listId,
		// 	orgId: this.props.currentOrg.id
		// });
		// this.props.getUploadSession({ 
		// 	image: this.state.image
		// });
		this.props.fetchImageUrl({ 
			image: this.state.image
		});
		// console.log("url", this.props.imageUrl)
	}

	onDrop(files) {
		console.log(files)
		this.setState({
			files
		});
	}
	render() {
		let {isLoading, lists} =  this.props
		if (isLoading || lists === null) {
			return (
				<Grid>
				  <PageHeader>
				    <Spinner spinnerName="three-bounce" />
				  </PageHeader>
				</Grid>
			);
	    }else {
	    	let { name, numberOfSubscribers } = lists[this.props.listId]
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
										src={ this.state.image }
									/>
									<Button bsStyle="default" bsSize="sm" className="upload-button" onClick={()=>this.onListImageUpdate()}>
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
								value={ this.state.name }
								onChange={this.onNameChange.bind(this)}/>
							<Button bsStyle="default" bsSize="sm" className="save-button" onClick={()=>this.onNameUpdate()}>
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
								<i className="fa fa-user fa-lg gray"/>
								<Label className="option-number">
									{numberOfSubscribers}
								</Label>
							</Col>
							<Col md={6} className="align-right">
								<DropdownButton
					              id="previewMode"
					              bsSize="sm"
					              bsStyle={'default'}
					              title={this.state.isOnline ? "Online" : "Offline"}
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
  const listId = props.match.params.listId;
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
