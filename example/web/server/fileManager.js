const fs = require('fs-extra');
const baseFilePath = fs.realpathSync(process.cwd());
const target = '/src/pages/preview-page/components/Preview/preview.css';

const fileManager = {
    rewriteContent: async (content) => {
        const baseFilePath = fs.realpathSync(process.cwd());
        fs.writeFile(`${baseFilePath}${target}`, content, function(err) {
            if (err) {
                return Promise.reject('error', err);
            } else {
                return Promise.resolve('success');
            }
        })
    },
    cleanCssContent: async (content) => {
        fs.writeFile(`${baseFilePath}${target}`, '', function(err) {
            if (err) {
                return Promise.reject('error', err);
            } else {
                return Promise.resolve('success');
            }
        })
    }
}

module.exports = fileManager;