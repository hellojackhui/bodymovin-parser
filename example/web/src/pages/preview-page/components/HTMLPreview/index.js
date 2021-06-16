import { useEffect, useState } from "react";
import Markdown from 'markdown-it';
import "./index.css";

const markdownInstance = new Markdown({
  linkify: true,
  typographer: true,
  breaks: true,
});

function HtmlPreview(props) {
  const [htmlContent, setHtmlContent] = useState("");
  
  useEffect(() => {
    if (typeof props.data.domContent === 'string' && props.data.domContent) {
      setHtmlContent(props.data.domContent);
    }
  }, [props.data]);

  return (
    <div className="preview">
      <header className="preview-header">html代码展示</header>
      <section>
        <textarea 
          className="preview-container preview-html"
          style={{height: '100%'}}
          defaultValue={htmlContent}
        />
      </section>
    </div>
  );
}

export default HtmlPreview;
