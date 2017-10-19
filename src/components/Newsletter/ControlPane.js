import React from 'react';
import {
  Col,
  Row,
  Button,
  Alert,
  MenuItem,
  DropdownButton,
} from 'react-bootstrap';

import { dateToString } from '../../utils/dateUtils';

import './ControlPane.css';

// const getDisplayName = (fullName) => {
//   const firstName = fullName.split(' ').slice(0, -1).join(' ');
//   return firstName || fullName;
// };

const ControlPane = ({
  newsletter,
  errorMessage,
  isSaving,
  lastTimeSaved,
  changePreviewStatus,
  onSaveNewsletter,
  previewMode,
  onDesktopPreviewClick,
  onMobilePreviewClick,
}) => {
  let maybeScheduler = (
    <div className="newsletter-schedule">
      <Button bsStyle="default" bsSize="sm" onClick={changePreviewStatus}>
        Schdule Preview
      </Button>
    </div>
  );

  const shouldSave = true;

  if (newsletter.previewAt) {
    maybeScheduler = (
      <Row>
        <Col xs={12}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            <Button bsStyle="default" bsSize="sm" onClick={onSaveNewsletter}>
              Publish
            </Button>
          </div>
        </Col>
      </Row>
    );
  }

  if (shouldSave || newsletter.publishAt) {
    maybeScheduler = null;
  }

  let maybeErrorMessage;
  if (errorMessage) {
    maybeErrorMessage = (
      <Alert style={{ margin: 0, marginTop: '10px' }} bsStyle="danger">
        <p>Opps! {errorMessage}</p>
      </Alert>
    );
  }

  let maybeSaveButton;
  if (shouldSave) {
    maybeSaveButton = (
      <Button
        disabled={!shouldSave || isSaving}
        bsSize="sm"
        bsStyle="danger"
        onClick={onSaveNewsletter}
      >
        {isSaving ? 'Saving...' : lastTimeSaved ? `Saved at ${lastTimeSaved}` : 'Save'}
      </Button>
    );
  }

  let maybeInfoMessage;
  if (newsletter.publishAt) {
    const publishDate = dateToString(newsletter.publishAt);
    maybeErrorMessage = (
      <Alert style={{ margin: 0, marginTop: '10px' }} bsStyle="info">
        <p>
          Scheduled for publication on
          {' '}
          {`${publishDate.date} at ${publishDate.time}`}
        </p>
      </Alert>
    );
  }

  return (
    <div>
      <Row>
        <Col xs={6}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
            }}
          >
            <DropdownButton
              id="previewMode"
              bsSize="sm"
              bsStyle={'default'}
              title={previewMode}
            >
              <MenuItem eventKey="1" onClick={onDesktopPreviewClick}>
                Desktop
              </MenuItem>
              <MenuItem eventKey="2" onClick={onMobilePreviewClick}>
                Mobile
              </MenuItem>
            </DropdownButton>
          </div>
        </Col>

        <Col xs={6}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {maybeScheduler}
            {maybeSaveButton}
          </div>
        </Col>

      </Row>
      <Row>
        <Col xs={12}>
          {maybeErrorMessage}
          {maybeInfoMessage}
        </Col>
      </Row>

    </div>
  );
};

export default ControlPane;
