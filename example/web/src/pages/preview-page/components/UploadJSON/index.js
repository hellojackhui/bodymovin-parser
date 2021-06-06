import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import './index.css';

const { Dragger } = Upload;

const ReadStatus = {
  OK: 1,
  ERR: -1,
};

function UploadJSON(props) {
  const getContentJSONString = (info) => {
    return new Promise((resolve, reject) => {
      const fileData = info.file.originFileObj;
      const reader = new FileReader();
      reader.readAsText(fileData);
      reader.onload = function () {
        resolve({
          status: ReadStatus.OK,
          content: this.result,
        });
      };
      reader.onerror = function () {
        reject({
          status: ReadStatus.ERR,
          content: "error",
        });
      };
    });
  };

  const draggerProps = {
    name: "file",
    multiple: true,
    action: "http://localhost:3000/upload",
    async onChange(info) {
      const { status, percent } = info.file;
      if (status === "uploading" && percent === 100) {
        let res = await getContentJSONString(info);
        const { onChange } = props;
        onChange && onChange(res);
      }
    },
  };

  return (
    <div className="upload">
      <Dragger {...draggerProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">点击或拖拽json到此区域完成解析</p>
        <p className="ant-upload-hint">支持单json文件进行bodymovin动效预览</p>
      </Dragger>
    </div>
  );
}

export default UploadJSON;
