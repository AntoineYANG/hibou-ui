/*
 * @Author: Kanata You 
 * @Date: 2022-06-13 17:09:35 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-13 18:25:05
 */

// 为某一个/多个或所有组件更新文档.

const path = require('path');
const fs = require('fs');

const curVersion = require('../package.json').version;


/**
 * @param {text} compName
 * @param {text} string
 */
const findPropsDefinition = (compName, text) => {
  const start = new RegExp(
    `export interface ${compName}Props \\{`
  ).exec(text);

  if (start?.[0]) {
    let origin = '';
    let flag = 0;

    for (const char of text.slice(start.index)) {
      origin += char;

      if (char === '{') {
        flag += 1;
      } else if (char === '}') {
        flag -= 1;

        if (flag === 0) {
          break;
        }
      }
    }

    const props = [];

    while (origin) {
      const next = /(?<doc>\/\*\*?[^\/]+\*\/)\s*(?<name>[a-zA-Z]+)(?<optional>\??): ?(?<type>[^;]+;)/m.exec(origin);

      if (!next?.groups) {
        break;
      }

      origin = origin.slice(next.index + next[0].length);
      
      props.push({
        name: next.groups.name,
        type: next.groups.type.replace(/;$/, ''),
        optional: Boolean(next.groups.optional),
        desc: next.groups.doc.replace(/[\s( +\* *)(\/\*+ *)( *\*+\/)]{2,}/g, ' ').trim(),
      });
    }

    return props.sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  return [];
};

/**
 * @param {name} string
 */
const update = name => {
  const entry = path.join(dir, name, 'index.tsx');

  // 连字符转大驼峰
  const compName = name.replace(/(^[a-z])|(-[a-z])/g, a => a.replace(/^-/, '').toUpperCase());

  const props = findPropsDefinition(compName, fs.readFileSync(
    entry, {
      encoding: 'utf-8'
    }
  ));

  // console.log(name, props);

  ['en'].forEach(lang => {
    const target = path.join(dir, name, `${name}${lang === 'en' ? '' : `-${lang}`}.md`);

    fs.writeFileSync(target, `# Hibou.${compName}

(desc)

## Props

|Name|Required|Type|Default Value|Description|Version|
|:-:|:-:|:-:|:-:|:-:|:-:|
${props.map(p => `|${p.name}|${
  p.optional ? 'optional' : 'required'
}|${p.type.replace(/[\|\<\>]/g, c => `\\${c}`)}|(default)|${p.desc}|${
  curVersion
}|`).join('\n')}

`, {
      encoding: 'utf-8'
    });
  });
};

const dir = path.resolve('../src/components/');

/**
 * @returns {string[]}
 */
const getComponentNames = () => {
  const names = [];

  process.argv.slice(2).forEach(name => {
    const entry = path.join(dir, name, 'index.tsx');

    if (!fs.existsSync(entry)) {
      throw new Error(`Cannot find "${entry}".`);
    }

    names.push(name);
  });

  if (names.length === 0) {
    // find all
    fs.readdirSync(dir).forEach(name => {
      const entry = path.join(dir, name, 'index.tsx');

      if (!fs.existsSync(entry)) {
        throw new Error(`Cannot find "${entry}".`);
      }
  
      names.push(name);
    });
  }

  return names;
};

if (require.main === module) {
  const components = getComponentNames();

  components.forEach(update);
}
