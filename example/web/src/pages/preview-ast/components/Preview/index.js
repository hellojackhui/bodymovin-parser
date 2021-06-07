import { useEffect, useState } from "react";
import Prettier from 'prettier/standalone';
import HTMLPlugins from 'prettier/parser-html';
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
      parseByMarkdown(props.data.domContent);
    }
  }, [props.data])

  const parseByMarkdown = (content) => {
    const prettierHTML = Prettier.format(content, {
      parser: "html",
      plugins: [HTMLPlugins],
    })
    const output = markdownInstance.render(prettierHTML);
    setHtmlContent(output);
  }

  return (
    <div className="preview">
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
