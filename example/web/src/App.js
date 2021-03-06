import { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Layout, Menu } from "antd";
import {
  UploadOutlined,
  IeOutlined,
  GithubOutlined,
} from "@ant-design/icons";

import PreviewPage from "./pages/preview-page/previewPage";
import PreviewAst from './pages/preview-ast/previewAst';
import WebComponent from './pages/web-component/index';
import "./App.css";

const { Sider } = Layout;

function App() {
  const [state, setState] = useState("1");

  useEffect(() => {
    return () => {
      fetch('http://localhost:3000/clean', {
        method: 'GET',
      });
    }
  }, [])

  const handleClick = ({ key }) => {
    setState(key);
  };

  return (
    <div className="App">
      <Layout>
        <Sider
          breakpoint="lg"
          className="sider"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo">bodymovin调试中心</div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={[state]}
            onClick={handleClick}
          >
            <Menu.Item key="1" icon={<IeOutlined />}>
              web预览
            </Menu.Item>
            <Menu.Item key="2" icon={<GithubOutlined />}>
              核心库调试
            </Menu.Item>
            <Menu.Item key="3" icon={<GithubOutlined />}>
              webcomponent调试
            </Menu.Item>
            {/* <Menu.Item key="3" icon={<UploadOutlined />}>
              nav 3
            </Menu.Item>
            <Menu.Item key="4" icon={<IeOutlined />}>
              nav 4
            </Menu.Item> */}
          </Menu>
        </Sider>
        <Layout>
          {state === "1" && <PreviewPage />}
          {state === "2" && <PreviewAst />}
          {state === "3" && <WebComponent />}
          </Layout>
      </Layout>
      ,
    </div>
  );
}

export default App;
