const { exec, execFile, execFileSync } = require('child_process');
const iconv = require('iconv-lite');
const path = require('path');

const wmic = path.join(process.env.SystemRoot, 'System32', 'wbem', 'WMIC.exe');

const aliasList = execFileSync(wmic, ['ALIAS', 'LIST', 'BRIEF']);
const aliasLines = iconv.decode(aliasList, 'GB2312').split(/\r\n/);
const aliasItems = aliasLines.slice(1, aliasLines.length - 2).map(line => line.split(/\s{2,}/)[0]);

const data = {};

// 获取系统默认编码
let defaultEncoding = 'gbk';
exec('chcp', (error, stdout, stderr) => {
  if (error) {
      console.error(`exec error: ${error}`);
      return;
  }
  if (stdout.toString().includes('65001')) {
      defaultEncoding = 'utf8';
      console.log("日志 ~ exec ~ defaultEncoding:", defaultEncoding)
  }
  console.log(stdout);
});

for (let aliasItem of aliasItems) {
  data[aliasItem] = () =>
    new Promise((resolve, reject) => {
      execFile(wmic, [aliasItem, 'get', '/VALUE'], { encoding: 'binary' }, (err, stdout, stderr) => {
        const convertedData = iconv.decode(Buffer.from(stdout, 'binary'), defaultEncoding);
        if (err || stderr) {
          reject(err || stderr);
        }

        const group = convertedData.trim().split(/[\r\r\n]{5,}/);
        const jsonGroup = [];
        for (const item of group) {
          const list = item.split(/\r\r\n/);
          const jsonItem = {};
          for (const d of list) {
            const eqPos = d.indexOf('=');
            jsonItem[d.slice(0, eqPos)] = d.slice(eqPos + 1);
          }
          jsonGroup.push(jsonItem);
        }
        resolve(jsonGroup);
      });
    });
}

module.exports = data;
