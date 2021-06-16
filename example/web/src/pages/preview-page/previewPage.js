import { useEffect, useState } from "react";
import { message, Row, Col, PageHeader, Layout } from "antd";
import ParserToCSS from "@bodymovin-parser/compiler-web";
import UploadJSON from "./components/UploadJSON/index";
import PreView from "./components/Preview/index";
import HtmlPreview from './components/HTMLPreview/index';
import CSSPreview from './components/CSSPreview/index';

import "./previewPage.css";

const { Footer } = Layout;

function PreviewPage() {
  const [source, setSource] = useState({});

  const jsonChangeHandler = (data) => {
    parseToContent(JSON.parse(data.content));
  };

  useEffect(() => {
    setSource({});
    fetch('/clean', {
      method: 'GET'
    });
  }, [])
  

  const parseToContent = (data) => {
    try {
      if (!data || !Object.keys(data).length) {
        return;
      }
      const instance = new ParserToCSS({
        config: {
          mode: "html",
          assetsOrigin: 'https://s3plus.meituan.net/v1/mss_e2fc5719a5b64fa4b3686b72e677a48e/wmmp/lottie-test/loading/'
        },
      });
      Promise.resolve(instance.parseByJson(data)).then((res) => {
        const { cssContent, } = res;
        fetch("/css", {
          method: "POST",
          body: cssContent,
          headers: {
            "content-type": "text/plain",
          },
          mode: "cors",
          credentials: "include",
        }).then((response) => {
            message.success('预览加载完成');
            setSource(res);
        });
      });
    } catch (e) {
        fetch('/clean', {
            method: "GET",
        })
    }
  };

  return (
    <div className="preview-page">
      <PageHeader
        className="site-page-header"
        backIcon={false}
        title="bodymovin预览页面"
        subTitle="文件 -> 预览"
      >
      </PageHeader>
      <div className="container">
        <div className="top">
          <Row>
            <Col span={8}>
              <PreView data={source} />
            </Col>
            <Col span={8}>
              <HtmlPreview data={source} />
            </Col>
            <Col span={8}>
              <CSSPreview data={source} />
            </Col>
          </Row>
        </div>
        <div className="bottom">
          <Row>
            <Col span={24}>
              <UploadJSON onChange={jsonChangeHandler} />
            </Col>
          </Row>
        </div>
      </div>
      <Footer style={{ textAlign: "center" }}>
        Bodymovin-parse ©2021 Created by Jackhui
      </Footer>
    </div>
  );
}

export default PreviewPage;
