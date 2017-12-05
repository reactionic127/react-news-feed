import React, { Component } from 'react';
import { findDOMNode } from 'slate';
import getOffsets from 'positions';
import Portal from 'react-portal';

class AnchoredPortal extends Component {
  static defaultProps = {
    offset: {
      x: 0,
      y: 0,
    },
    menuAnchor: 'top right',
    nodeAnchor: 'top left',
    onClose: null,
    onOpen: null,
    onUpdate: null,
  };

  componentWillMount() {
    this.handleOpen = this.handleOpen.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.update = this.update.bind(this);
  }

  update() {
    if (!this.portal) return;
    const { node, nodeAnchor, menuAnchor, offset: extraOffset } = this.props;

    const menuEl = this.portal.firstChild;
    menuEl.style.position = 'absolute';

    const nodeEl = findDOMNode(node);

    if (nodeEl) {
      const offset = getOffsets(menuEl, menuAnchor, nodeEl, nodeAnchor);
      menuEl.style.top = `${offset.top + extraOffset.y}px`;
      menuEl.style.left = `${offset.left + extraOffset.y}px`;
    }
  }

  handleOpen(portal) {
    this.portal = portal;
    this.update();
    if (this.props.onOpen) {
      this.props.onOpen(portal);
    }
  }

  handleUpdate() {
    this.update();
    if (this.props.onUpdate) {
      this.props.onUpdate();
    }
  }

  handleClose() {
    this.portal = null;

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    const { children, ...props } = this.props;

    return (
      <Portal
        isOpened
        {...props}
        onOpen={this.handleOpen}
        onUpdate={this.handleUpdate}
        onClose={this.handleClose}
      >
        {children}
      </Portal>
    );
  }
}

export default AnchoredPortal;
