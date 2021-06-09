import { useEffect, useRef } from "react";
import Parser from '@bodymovin-parser/compiler-core';
import JSONFormatter from 'json-formatter-js';
import "./index.css";

function HtmlPreview(props) {
  const wrapperRef = useRef(null);
  
  useEffect(() => {
    if (props.data && Object.keys(props.data).length) {
      parseByMarkdown(props.data);
    }
  }, [props.data])

  const parseByMarkdown = (content) => {
    const parsedJSON = new Parser({json: content}).outputJSON();
    const prettierJSON = new JSONFormatter(parsedJSON);
    wrapperRef.current.appendChild(prettierJSON.render());
  }

  return (
    <div
        className="preview-container"
        ref={wrapperRef}
    />
  );
}

export default HtmlPreview;
