import React from 'react';
import { Block, Raw } from 'slate';

// https://github.com/ianstormtaylor/slate/issues/713
export const createEmptySnippetState = () => ({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [{ kind: 'text', text: '' }],
    },
  ],
});

export const DEFAULT_NODE = 'paragraph';

export const DEFAULT_BLOCK = {
  type: 'paragraph',
  isVoid: false,
  data: {},
};

const BLOCK_TAGS = {
  p: 'paragraph',
  li: 'list-item',
  ul: 'bulleted-list',
  ol: 'numbered-list',
  blockquote: 'quote',
  pre: 'code',
  h1: 'heading-one',
  h2: 'heading-two',
  h3: 'heading-three',
  h4: 'heading-four',
  h5: 'heading-five',
  h6: 'heading-six',
};

export const MARK_TAGS = {
  strong: 'bold',
  em: 'italic',
  u: 'underline',
  s: 'strikethrough',
  code: 'code',
};

export const RULES = [
  {
    deserialize(el, next) {
      const type = BLOCK_TAGS[el.tagName];
      if (!type) return;
      return {
        kind: 'block',
        type,
        nodes: next(el.children),
      };
    },
    serialize(object, children) {
      if (object.kind !== 'block') return;
      switch (object.type) {
        case 'code':
          return <pre><code>{children}</code></pre>;
        case 'paragraph':
          return <p>{children}</p>;
        case 'quote':
          return <blockquote>{children}</blockquote>;
        default:
          return <div></div>
      }
    },
  },
  // Add a new rule that handles marks...
  {
    deserialize(el, next) {
      const type = MARK_TAGS[el.tagName];
      if (!type) return;
      return {
        kind: 'mark',
        type: type,
        nodes: next(el.children),
      };
    },
    serialize(object, children) {
      if (object.kind !== 'mark') return;
      switch (object.type) {
        case 'bold':
          return <strong>{children}</strong>;
        case 'italic':
          return <em>{children}</em>;
        case 'underline':
          return <u>{children}</u>;
        default:
          return <div></div>
      }
    },
  },
];

export const SCHEMA = {
  marks: {
    bold: props => <strong>{props.children}</strong>,
    code: props => <code>{props.children}</code>,
    italic: props => <em>{props.children}</em>,
    underlined: props => <u>{props.children}</u>,
  },
  nodes: {
    'read-more': props => (
      <div className="SnippetEditor-readmore-container" {...props.attributes}>
        <div className="SnippetEditor-readmore">
          {props.children}
        </div>
      </div>
    ),
    'block-quote': props => (
      <blockquote {...props.attributes}>{props.children}</blockquote>
    ),
    'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    // https://github.com/ianstormtaylor/slate/issues/131
    // paragraph: props => <p {...props.attributes}>{props.children}</p>,
    link: (props) => {
      const { data } = props.node;
      const href = data.get('href');
      return (
        <a
          className="SnippetEditor-inline-link"
          {...props.attributes}
          href={href}
        >
          {props.children}
        </a>
      );
    },
    image: props => {
      const { node, state } = props;
      const active = state.isFocused && state.selection.hasEdgeIn(node);
      const src = node.data.get('src');
      const className = active ? 'active' : null;
      return <img src={src} className={className} alt="img" {...props.attributes} />;
    },
    video: props => {
      const { node, state } = props;
      const active = state.isFocused && state.selection.hasEdgeIn(node);
      const src = node.data.get('src');
      const className = active ? 'active' : null;
      console.log(props.attributes)
      return <iframe width="420" height="315" src={src} className={className} frameBorder="0" allowFullScreen {...props.attributes} />;
    },
  },
  rules: [
    // Rule to insert a paragraph block if the document is empty
    {
      match: node => {
        return node.kind === 'document';
      },
      validate: document => {
        return document.nodes.size ? null : true;
      },
      normalize: (transform, document) => {
        const block = Block.create(DEFAULT_BLOCK);
        transform.insertNodeByKey(document.key, 0, block);
      },
    },
    // Rule to insert a paragraph below a void node (the image)
    // if that node is the last one in the document
    {
      match: node => {
        return node.kind === 'document';
      },
      validate: document => {
        const lastNode = document.nodes.last();
        return lastNode && lastNode.isVoid ? true : null;
      },
      normalize: (transform, document) => {
        const block = Block.create(DEFAULT_BLOCK);
        transform.insertNodeByKey(document.key, document.nodes.size, block);
      },
    },
  ],
};

export const defaultBlock = {
  type: 'paragraph',
  isVoid: false,
  data: {},
};

export const schema = {
  marks: {
    bold: props => <strong>{props.children}</strong>,
    code: props => <code>{props.children}</code>,
    italic: props => <em>{props.children}</em>,
    underlined: props => <u>{props.children}</u>,
  },
  nodes: {
    'read-more': props => (
      <div className="SnippetEditor-readmore-container" {...props.attributes}>
        <div className="SnippetEditor-readmore">
          {props.children}
        </div>
      </div>
    ),
    'block-quote': props => (
      <blockquote {...props.attributes}>{props.children}</blockquote>
    ),
    'heading-one': props => <h1 {...props.attributes}>{props.children}</h1>,
    'heading-two': props => <h2 {...props.attributes}>{props.children}</h2>,
    // https://github.com/ianstormtaylor/slate/issues/131
    // paragraph: props => <p {...props.attributes}>{props.children}</p>,
    link: (props) => {
      const { data } = props.node;
      const href = data.get('href');
      return (
        <a
          className="SnippetEditor-inline-link"
          {...props.attributes}
          href={href}
        >
          {props.children}
        </a>
      );
    },
    image: props => {
      const { node, state } = props;
      const active = state.isFocused && state.selection.hasEdgeIn(node);
      const src = node.data.get('src');
      const className = active ? 'active' : null;
      return (
        <img src={src} className={className} alt="img" {...props.attributes} />
      );
    },
  },
  rules: [
    // Rule to insert a paragraph block if the document is empty
    {
      match: (node) => {
        return node.kind === 'document';
      },
      validate: (document) => {
        return document.nodes.size ? null : true;
      },
      normalize: (transform, document) => {
        const block = Block.create(defaultBlock);
        transform.insertNodeByKey(document.key, 0, block);
      },
    },
    // Rule to insert a paragraph below a void node (the image)
    // if that node is the last one in the document
    {
      match: (node) => {
        return node.kind === 'document';
      },
      validate: document => {
        const lastNode = document.nodes.last();
        return lastNode && lastNode.isVoid ? true : null;
      },
      normalize: (transform, document) => {
        const block = Block.create(defaultBlock);
        transform.insertNodeByKey(document.key, document.nodes.size, block);
      },
    },
  ],
};

export const initialState2 = Raw.deserialize(
  {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            text: 'In addition to block nodes, you can create inline nodes, like ',
          },

          {
            kind: 'inline',
            type: 'link',
            data: {
              href: 'https://en.wikipedia.org/wiki/Hypertext',
            },
            nodes: [
              {
                kind: 'text',
                text: 'hyperlinks',
              },
            ],
          },

          {
            kind: 'text',
            text: '!',
          },
        ],
      },

      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            text: 'In addition to nodes that contain editable text, you can also create other types of nodes, like images or videos.',
          },
        ],
      },

      {
        kind: 'block',
        type: 'image',
        isVoid: true,
        data: {
          src: 'http://cdn.thedailybeast.com/content/dailybeast/articles/2017/04/12/at-mar-a-lago-summit-with-xi-trump-served-up-a-nothing-burger/jcr:content/image.img.2000.jpg/1491997475412.cached.jpg',
        },
      },

      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            text: 'This example shows images in action. It features two ways to add images. You can either add an image via the toolbar icon above, or if you want in on a little secret, copy an image URL to your keyboard and paste it anywhere in the editor!',
          },
        ],
      },

      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            text: 'This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected.',
          },
        ],
      },
    ],
  },
  { terse: true },
);
