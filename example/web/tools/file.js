const fs = require('fs');
const path = require('path');

const sourcePath = path.resolve(__dirname, '../../../lib/bundle.es.js');
const target = path.resolve(__dirname, '../src/bundle.js');

const sourceJsonPath = path.resolve(__dirname, '../../../mock/loading.json');
const targetJson = path.resolve(__dirname, '../src/loading.json');

const copyBundle = async () => {
    try {
        await findFile(target);
        // await findFile(targetJson);
        fs.copyFile(sourcePath, target, () => {
            console.log('success');
        })
        fs.copyFile(sourceJsonPath, targetJson, () => {
            console.log('success');
        })
    } catch(e) {
        fs.writeFile(target, 'hello', {flag: 'w+'}, () => {
            console.log('enter');
            copyBundle();
        });
    }
}

function findFile(path) {
    return new Promise((resolve, reject) => {
        fs.lstat(path, (res) => {
            console.log(res);
            if (res && res.errno === -2) {
                reject(-2);
            } else {
                resolve();
            }
        })
    })
}

copyBundle();