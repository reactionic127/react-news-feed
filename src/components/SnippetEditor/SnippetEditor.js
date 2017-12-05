import { Editor, Raw, Html } from 'slate';
import React from 'react';
import isUrl from 'is-url';
import isImage from 'is-image';
import SideMenuPortal from './SideMenuPortal';
import MediaMenuPortal from './MediaMenuPortal';
import SelectionMenu from './SelectionMenu';

import './style.css';

import {
  getSelectionBoundaryElement,
  getTopLevelParagraphWithNoChildren,
  getLastTopLevelParagraphWithChildren,
  isEmptyDocument,
} from './snippetEditorUtil';

import {
  DEFAULT_NODE,
  createEmptySnippetState,
  SCHEMA,
  RULES,
} from './snippetEditorConstants';

const htmlSerializer = new Html({ rules: RULES });

class SnippetEditor extends React.Component {
  constructor(props) {
    super(props);
    const state = props.content
      ? Raw.deserialize(props.content, { terse: true })
      : Raw.deserialize(createEmptySnippetState(), { terse: true });

    this.state = {
      state,
      trackedSnippetIndex: null,
    };
  }

  hasLinks = () => {
    // Check whether the current selection has a link in it.
    return this.state.state.inlines.some(inline => inline.type === 'link');
  };

  hasBlock = type => {
    // Check if the any of the currently selected blocks are of `type`.
    return this.state.state.blocks.some(node => node.type === type);
  };

  onChange = state => {
    // On change, save the new state.
    this.setState(
      {
        state,
      },
      () => {
        this.props.onChange(state, Raw);
      },
    );
  };

  onSelectionChange = (selection, state) => {
    const mediaMenu = getTopLevelParagraphWithNoChildren(state);
    const sideMenu = getLastTopLevelParagraphWithChildren(state);

    this.setState({
      mediaMenu,
      sideMenu,
    });

    this.setState({ state });
  };

  onBlur = () => {
    setTimeout(() => {
      this.setState({
        mediaMenu: null,
        sideMenu: null,
        trackedSnippetIndex: null,
      });
    }, 0);
  };

  getAltMenuNode = () => {
    let rect;

    try {
      rect = getSelectionBoundaryElement(true);
    } catch (er) {}

    return rect;
  };

  onClickLink = e => {
    // When clicking a link, if the selection has a link in it, remove the link.
    // Otherwise, add a new link with an href and text.
    e.preventDefault();
    let { state } = this.state;
    const hasLinks = this.hasLinks();

    if (hasLinks) {
      state = state.transform().unwrapInline('link').apply();
    } else if (state.isExpanded) {
      const href = window.prompt('Enter the URL of the link:');
      state = state
        .transform()
        .wrapInline({
          type: 'link',
          data: { href },
        })
        .collapseToEnd()
        .apply();
    } else {
      const href = window.prompt('Enter the URL of the link:');
      const text = window.prompt('Enter the text for the link:');
      state = state
        .transform()
        .insertText(text)
        .extend(0 - text.length)
        .wrapInline({
          type: 'link',
          data: { href },
        })
        .collapseToEnd()
        .apply();
    }

    this.setState({ state });
  };

  onKeyDown = (e, data, state) => {
    // On key down, if it's a formatting command toggle a mark.
    if (data.key === 'backspace') {
      const empty = isEmptyDocument(state);
      this.props.onBackspaceDown(state, empty);
    }

    if (!data.isMod) return;
    let mark;

    switch (data.key) {
      case 'b':
        mark = 'bold';
        break;
      case 'i':
        mark = 'italic';
        break;
      case 'u':
        mark = 'underlined';
        break;
      case '`':
        mark = 'code';
        break;
      default:
        return;
    }

    state = state.transform().toggleMark(mark).apply();

    e.preventDefault();

    return state;
  };

  onClickMark = (e, type) => {
    // When a mark button is clicked, toggle the current mark.
    e.preventDefault();
    let { state } = this.state;

    state = state.transform().toggleMark(type).apply();

    this.setState({ state });
  };

  onClickBlock = (e, type) => {
    // When a block button is clicked, toggle the block type.
    e.preventDefault();
    let { state } = this.state;
    const transform = state.transform();
    const { document } = state;

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        transform
          .setBlock(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        transform.setBlock(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = state.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });

      if (isList && isType) {
        transform
          .setBlock(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        transform
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list',
          )
          .wrapBlock(type);
      } else {
        transform.setBlock('list-item').wrapBlock(type);
      }
    }

    state = transform.apply();
    this.setState({ state });
  };

  // onPaste = (e, data, state) => {
  //   // On paste, if the text is a link, wrap the selection in a link.
  //   if (state.isCollapsed) return
  //   if (data.type != 'text' && data.type != 'html') return
  //   if (!isUrl(data.text)) return
  //
  //   const transform = state.transform()
  //
  //   if (this.hasLinks()) {
  //     transform.unwrapInline('link')
  //   }
  //
  //   return transform
  //     .wrapInline({
  //       type: 'link',
  //       data: {
  //         href: data.text
  //       }
  //     })
  //     .collapseToEnd()
  //     .apply()
  // }

  onPaste = (e, data, state, editor) => {
    // On paste, if the pasted content is an image URL, insert it.
    switch (data.type) {
      case 'files':
        return this.onDropOrPasteFiles(e, data, state, editor);
      case 'text':
        return this.onPasteText(e, data, state);
      case 'html':
        return this.onPasteHtml(e, data, state);
      default:
        console.log(e, data, data.type, state);
        return this.onPasteText(e, data, state);
    }
  };

  onDropOrPasteFiles = (e, data, state, editor) => {
    // On drop or paste files, read and insert the image files.
    for (const file of data.files) {
      const reader = new FileReader();
      const [type] = file.type.split('/');
      if (type !== 'image') continue;
      // reader.addEventListener('load', () => {

      // });
      state = editor.getState();
      state = this.insertImage(state, reader.result);
      editor.onChange(state);
      reader.readAsDataURL(file);
    }
  };

  onPasteText = (e, data, state) => {
    // On paste text, if the pasted content is an image URL, insert it.
    if (!isUrl(data.text)) return;
    if (!isImage(data.text)) return;
    return this.insertImage(state, data.text);
  };

  onPasteHtml = (e, data, state) => {
    // On paste text, if the pasted content is an image URL, insert it.
    if (isUrl(data.text) || isImage(data.text)) {
      return this.insertImage(state, data.text);
    }

    const { document } = htmlSerializer.deserialize(data.html);

    return state
      .transform()
      .insertFragment(document)
      .apply();
  };

  insertImage = (state, src) => {
    // Insert an image with `src` at the current selection.
    return state
      .transform()
      .insertBlock({
        type: 'image',
        isVoid: true,
        data: { src },
      })
      .apply();
  };

  insertVideo = (state, src) => {
    // Insert an video with `src` at the current selection.
    return state
      .transform()
      .insertBlock({
        type: 'video',
        isVoid: true,
        data: { src },
      })
      .apply();
  };

  onClickImage = e => {
    // On clicking the image button, prompt for an image and insert it.
    e.preventDefault();
    const src = window.prompt('Enter the URL of the image:');
    if (!src) return;
    let { state } = this.state;
    state = this.insertImage(state, src);
    this.onChange(state);
  };

  onClickVideo = e => {
    // On clicking the image button, prompt for an image and insert it.
    e.preventDefault();
    const src = window.prompt('Enter the URL of the video:');
    if (!src) return;
    let { state } = this.state;
    state = this.insertVideo(state, src);
    this.onChange(state);
  };

  onClickAddSnippet = e => {
    e.preventDefault();

    if (this.state.trackedSnippetIndex) {
      const {trackedSnippetIndex} = this.state;
      this.setState(
        () => {
          return {
            trackedSnippetIndex: null,
          };
        },
        () => {
          this.props.onDeleteSnippet(trackedSnippetIndex);
        },
      );

      return;
    }

    this.setState(() => {
      const trackedSnippetIndex = this.props.index + 1;
      this.props.onAddSnippet(trackedSnippetIndex);
      return {
        trackedSnippetIndex,
      };
    });
  };

  render() {
    let mediaMenuPortal;
    if (this.state.mediaMenu) {
      mediaMenuPortal = (
        <MediaMenuPortal
          node={this.state.mediaMenu}
          onClickImage={this.onClickImage}
          onClickVideo={this.onClickVideo}
          onClickBlock={this.onClickBlock}
          editorState={this.state.state}
        />
      );
    }

    let sideMenuPortal;
    if (!this.state.mediaMenu && this.state.sideMenu) {
      sideMenuPortal = (
        <SideMenuPortal
          node={this.state.sideMenu}
          trackedSnippetIndex={this.state.trackedSnippetIndex}
          onClickAddSnippet={this.onClickAddSnippet}
          editorState={this.state.state}
        />
      );
    }

    return (
      <div>
        <SelectionMenu
          onClickBlock={this.onClickBlock}
          onClickMark={this.onClickMark}
          onClickLink={this.onClickLink}
          editorState={this.state.state}
        />
        <div className="SnippetEditor-container">
          <Editor
            placeholder="Type here..."
            placeholderStyle={{
              color: '#C7C7CD',
            }}
            schema={SCHEMA}
            state={this.state.state}
            onChange={this.onChange}
            onSelectionChange={this.onSelectionChange}
            onPaste={this.onPaste}
            onKeyDown={this.onKeyDown}
            onBlur={this.onBlur}
          />
          {mediaMenuPortal}
          {sideMenuPortal}
        </div>
      </div>
    );
  }
}

export default SnippetEditor;
