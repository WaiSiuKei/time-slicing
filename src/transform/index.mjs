import babel from '@babel/core';
import * as  fs from 'node:fs';
import * as path from 'node:path';
import plugin from './plugin.mjs';
import * as process from 'node:process';
import * as recast from "recast";

import { fileURLToPath } from 'url';

//we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url));

var types = recast.types;
var n = types.namedTypes;

const content = fs.readFileSync(path.join(__dirname, '../../docs/es6.js'), 'utf8');
const runtime = fs.readFileSync(path.join(__dirname, '../runtime/runtime.js'), "utf8")
const transformOptions = {
  plugins: [
    [plugin, {functionName: 'program'}]
  ],
  parserOpts: {
    sourceType: "module",
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    strictMode: false
  }
};
let result = babel.transformSync(content, transformOptions);


result.code = runtime + "\n" + result.code;

console.log(result.code);

