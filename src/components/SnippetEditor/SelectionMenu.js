import Portal from 'react-portal';
import React, { Component } from 'react';

class MediaMenuPortal extends Component {

  constructor(props) {
    super(props);

    this.state = {
      menu: null,
    };
  }

  componentWillMount() {
    this.hasBlock = this.hasBlock.bind(this);
    this.hasMark = this.hasMark.bind(this);
    this.hasLinks = this.hasLinks.bind(this);
    this.onOpen = this.onOpen.bind(this);
  }

  componentDidMount() {
    this.updateMenu();
  }

  componentDidUpdate() {
    this.updateMenu();
  }

  renderButton = (type, icon, isActive, handleMouseDown) => {
    // Render a mark-toggling toolbar button.
    const onMouseDown = e => handleMouseDown(e, type);
    const active = isActive(type);

    return (
      <span
        className="SnippetEditor-button"
        onMouseDown={onMouseDown}
        data-active={active}
      >
        <img
          src={`/images/editor-icons/${icon}.png`}
          alt="img"
          style={{
            width: '20px',
            height: '20px',
            opacity: active ? 1 : 0.5,
          }}
        />
      </span>
    );
  };

  onOpen(portal) {
    // When the portal opens, cache the menu element.
    this.setState({
      menu: portal.firstChild,
    });
  }

  updateMenu = () => {
    // Update the menu's absolute position.
    const { menu } = this.state;
    if (!menu) return;

    if (this.props.editorState.isBlurred || this.props.editorState.isCollapsed) {
      menu.removeAttribute('style');
      return;
    }

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    menu.style.opacity = 1;
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
    menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`;
  };

  hasBlock(type) {
    // Check if the any of the currently selected blocks are of `type`.
    return this.props.editorState.blocks.some(node => node.type === type);
  }

  hasLinks() {
    // Check whether the current selection has a link in it.
    return this.props.editorState.inlines.some(inline => inline.type === 'link');
  }

  hasMark(type) {
    // Check if the current selection has a mark with `type` in it.
    return this.props.editorState.marks.some(mark => mark.type === type);
  }

  render() {
    // {this.renderButton('code', 'Segment', this.props.hasMark, this.props.onClickMark)}
    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div className="SelectionMenu">
          {this.renderButton(
            'bold',
            'Bold',
            this.hasMark,
            this.props.onClickMark,
          )}
          {this.renderButton(
            'italic',
            'Italic',
            this.hasMark,
            this.props.onClickMark,
          )}
          {this.renderButton(
            'underlined',
            'Underlined',
            this.hasMark,
            this.props.onClickMark,
          )}
          {this.renderButton(
            'heading-one',
            'H1',
            this.hasBlock,
            this.props.onClickBlock,
          )}
          {this.renderButton(
            'heading-two',
            'H2',
            this.hasBlock,
            this.props.onClickBlock,
          )}
          {this.renderButton(
            'block-quote',
            'Quote',
            this.hasBlock,
            this.props.onClickBlock,
          )}
          {this.renderButton(
            'link',
            'Link',
            this.hasLinks,
            this.props.onClickLink,
          )}
        </div>
      </Portal>
    );
  }
}

export default MediaMenuPortal;
