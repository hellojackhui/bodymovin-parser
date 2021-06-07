import { useEffect, useState } from "react";
import { message, PageHeader, Layout } from "antd";
import Parser from "@bodymovin-parser/compiler-core";
import UploadJSON from "./components/UploadJSON/index";
import PreView from "./components/Preview/index";

import "./previewAst.css";

const { Footer } = Layout;

function PreviewAst() {
  const [source, setSource] = useState({});

  const jsonChangeHandler = (data) => {
    setSource(JSON.parse(data.content));
  };

  const textAreaHandler = (e) => {
    const value = e.target.value;
  };

  useEffect(() => {
    return () => {
      setSource({});
    };
  }, []);

  return (
    <div className="preview-ast-page">
      <PageHeader
        className="site-page-header"
        backIcon={false}
        title="bodymovin解析预览"
        subTitle="文件 -> ast"
      />
      <div className="container">
        <div className="area-a">
            <UploadJSON onChange={jsonChangeHandler} />
        </div>
        <div className="area-b">
            <div className="ast-wrapper"></div>
        </div>
        <div className="area-c">
            <textarea
                className="textarea-wrapper"
                onChange={textAreaHandler}
            />
        </div>
        <div className="area-d">
            <header className="preview-header">json输入</header>
        </div>
        <div className="area-e">
            <header className="preview-header">ast预览</header>
        </div>
      </div>
      <Footer style={{ textAlign: "center" }}>
        Bodymovin-parse ©2021 Created by Jackhui
      </Footer>
    </div>
  );
}

export default PreviewAst;
