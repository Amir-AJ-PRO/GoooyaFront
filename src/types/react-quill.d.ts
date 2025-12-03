declare module 'react-quill' {
  import { Component } from 'react';

  export interface QuillOptions {
    modules?: any;
    formats?: string[];
    placeholder?: string;
    theme?: string;
    [key: string]: any;
  }

  export interface ReactQuillProps extends QuillOptions {
    value?: string;
    defaultValue?: string;
    onChange?: (
      content: string,
      delta: any,
      source: any,
      editor: any
    ) => void;
    onChangeSelection?: (range: any, source: any, editor: any) => void;
    onFocus?: (range: any, source: any, editor: any) => void;
    onBlur?: (previousRange: any, source: any, editor: any) => void;
    onKeyPress?: (event: any) => void;
    onKeyDown?: (event: any) => void;
    onKeyUp?: (event: any) => void;
    readOnly?: boolean;
    style?: React.CSSProperties;
    className?: string;
    tabIndex?: number;
    bounds?: string | HTMLElement;
    scrollingContainer?: string | HTMLElement;
    preserveWhitespace?: boolean;
  }

  export default class ReactQuill extends Component<ReactQuillProps> {
    focus(): void;
    blur(): void;
    getEditor(): any;
  }
}

