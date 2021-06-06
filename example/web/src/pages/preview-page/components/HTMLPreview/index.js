import { useEffect, useState } from "react";
import Markdown from 'markdown-it';
import "./index.css";

const markdownInstance = new Markdown({
  linkify: true,
  typographer: true
});

function HtmlPreview(props) {
  const [htmlContent, setHtmlContent] = useState("");
  
  useEffect(() => {
    if (typeof props.data.domContent === 'string' && props.data.domContent) {
      parseByMarkdown(props.data.domContent);
    }
  }, [props.data])

  const parseByMarkdown = (content) => {
    const output = markdownInstance.render(content);
    setHtmlContent(output);
  }

  return (
    <div className="preview">
      <header className="preview-header">html代码展示</header>
      <section>
        <div
          className="preview-container"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
      </section>
    </div>
  );
}

export default HtmlPreview;
