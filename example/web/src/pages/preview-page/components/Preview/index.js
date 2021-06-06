import { useEffect, useState } from "react";
import "./index.css";
import "./preview.css";

function PreView(props) {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    setHtmlContent(props.data.domContent);
  }, [props.data]);

  

  return (
    <div className="preview">
      <header className="preview-header">预览效果</header>
      <section className="preview-wrapper">
        <div
          className="preview-container"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        ></div>
      </section>
    </div>
  );
}

export default PreView;
