# node-wmic

A Node.js wrapper around the WMIC. Transform every WMIC command output to JavaScript array. Optimize Chinese garbled characters.

Attention, this is the v2 version which support all WMIC command, and is not compatiable with v1 version. For 1.0.0+ version, checkout [master](https://github.com/wukenaihehualuoqu/node-wmic/tree/master) branch.

```js
var wmic = require('node-wmic');
```

## Install

```
npm install node-wmic --save
```

## Example

```js
const wmic = require('node-wmic');
wmic.CPU().then(([cpu]) => {
  console.log(cpu.AddressWidth);
  console.log(cpu.Level);
});

wmic.DiskDrive().then(items => {
  console.log(items.length);
  console.log(items[0].Description);
});
```
