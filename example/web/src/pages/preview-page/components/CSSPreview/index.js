import { useEffect, useState } from "react";
import "./index.css";

function CSSPreview(props) {
  const [cssContent, setCssContent] = useState("");
  
  useEffect(() => {
    if (typeof props.data.cssContent === 'string' && props.data.cssContent) {
      setCssContent(props.data.cssContent);
    }
  }, [props.data])

  return (
    <div className="preview">
      <header className="preview-header">css代码展示</header>
      <section>
        <textarea 
          className="preview-container"
          style={{height: '100%'}}
          defaultValue={cssContent}
        />
      </section>
    </div>
  );
}

export default CSSPreview;
