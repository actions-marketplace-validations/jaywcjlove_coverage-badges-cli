import path from 'path';
import fs from 'fs-extra';
import { setFailed, getInput, info, startGroup, endGroup } from '@actions/core';
import { badge, BadgeOption } from './badges';
import { Summary } from './create';

;(async () => {
  try {
    const output = path.resolve(process.cwd(), getInput('output') || 'coverage/badges.svg');
    const source = path.resolve(process.cwd(), getInput('source') || 'coverage/coverage-summary.json');
    const label = getInput('label') || 'coverage';
    const style = (getInput('style') || 'classic') as BadgeOption['style'];
    fs.ensureDirSync(path.dirname(output));
    if (!fs.existsSync(source)) {
      setFailed(`File \x1b[31m${source}\x1b[0m does not exist.\n please specify the file directory\n\x1b[35mnpm\x1b[0m coverage-badges-cli \x1b[33m--source\x1b[0m coverage/coverage-summary.json`);
      return
    }
    info(`Source Path: \x1b[32;1m${source}\x1b[0m`);
    info(`Output Path: \x1b[32;1m${output}\x1b[0m`);
    
    const sourceData: Summary = require(source);
    startGroup(`Source Path: \x1b[32;1m${source}\x1b[0m`);
    info(`${JSON.stringify(sourceData, null, 2)}`);
    endGroup();
    
    const svgStr = badge({ label, style }, sourceData);
    fs.writeFileSync(output, svgStr);
    info(`\nCreate Coverage Badges: \x1b[32;1m${path.relative(process.cwd(), output)}\x1b[0m\n`);
  } catch (error) {
    setFailed(error.message);
  }
})();