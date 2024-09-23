const fs = require('fs-extra');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const glob = require('glob');
const { exit } = require('process');

const { checkImageAlts } = require('./tests/image-alt');
const { checkImageDims } = require('./tests/image-dims');
const { checkLabelFors } = require('./tests/label-fors');
const { checkForEmptyActions } = require('./tests/empty-actions');
const { checkForUntabbableClickToggles } = require('./tests/click-toggles-on-untabbables');

const tests = [checkImageDims, checkImageAlts, checkLabelFors, checkForEmptyActions, checkForUntabbableClickToggles];

const replaceBetween = (str, [start, end], replace) => {
  const regexString = `${start}[^]*?${end}`;
  const regex = new RegExp(regexString, 'g');
  return str.replace(regex, replace);
};

const replaceWithNewlines = (str, [start, end]) => {
  const regexString = `${start}([^]*?)${end}`;
  const regex = new RegExp(regexString, 'g');
  return str.replace(regex, m => {
    const newLines = m.split(/\n/).length - 1;
    return Array.from({ length: newLines }).map(_line => '\n');
  });
};

const TAGS_TO_REMOVE = [
  ['{%- comment -%}', '{%- endcomment -%}'],
  ['{% comment %}', '{% endcomment %}'],
  // ['{%- capture -%}', '{%- endcapture -%}'],
  // ['{% capture %}', '{% endcapture %}'],
  ['{%', '%}'],
  ['{%-', '-%}']
];

const cleanLiquid = liquid => {
  const tagsRemoved = TAGS_TO_REMOVE.reduce((cleaning, [start, end]) => {
    return replaceWithNewlines(cleaning, [start, end]);
  }, liquid);
  const stringsReplaced = replaceBetween(tagsRemoved, ['{{', '}}'], 'somestringvalue');
  return stringsReplaced;
};

const testWrapper = (dom, { query, message }) => {
  const { document } = dom.window;
  const elements = query(document);
  const errors = [...elements].map(element => {
    const line = dom.nodeLocation(element).startLine;
    return {
      line,
      message
    };
  });
  return errors;
};

const lintFile = fileName => {
  const liquidString = fs.readFileSync(fileName, 'utf-8');
  const clean = cleanLiquid(liquidString);
  const dom = new JSDOM(clean, { includeNodeLocations: true });

  const createErrorLogger = ({ message, line }) => {
    const lines = liquidString.split('\n');
    if (lines[line - 2] && lines[line - 2].includes('@a11y-lint-ignore')) return [];
    return () => {
      console.log(`\x1b[31m ${message(fileName, line)}`);
      console.log(`\x1b[34m ${lines[line - 1].trim()}`);
      console.log(`\n`);
    };
  };

  return tests.flatMap(test => testWrapper(dom, test).flatMap(createErrorLogger));
};

glob('**/*.liquid', {}, (_er, files) => {
  const errorLoggers = files.flatMap(fileName => {
    return lintFile(fileName);
  });

  errorLoggers.forEach(log => log());

  if (errorLoggers.length > 0) {
    console.log(`\x1b[31m FAILED. ${errorLoggers.length} errors found!`);
    exit(1);
  } else {
    console.log(`\x1b[32m PASSED. No errors found! Nice work. Be sure to audit on rendered theme code too.`);
  }
});
