#!/usr/bin/env node
'use strict';

// Verify the three corrected languages before replacing the production bundle.
// Only checks source integrity, not browser rendering.
const fs = require('node:fs');
const parser = require('@babel/parser');
const paths = [
 'resources/js/components/ExploreThreeDepth.jsx',
 'resources/js/components/ExploreDeepExperience.jsx',
 'resources/js/Pages/ExploreLifeLanguage.jsx',
];
for (const file of paths) {
  const code = fs.readFileSync(file, 'utf8');
  parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  console.log('JSX OK:', file);
}
const expected = {
  relationships: ['RelationshipDepth','Мастерская диалога'],
  body: ['BodyDepth','Атлас ощущений'],
  choice: ['ChoiceDepth','Лаборатория выбора'],
};
const three = fs.readFileSync(paths[0], 'utf8');
const original = fs.readFileSync(paths[1], 'utf8');
for (const [slug, labels] of Object.entries(expected)) {
  const atlas = JSON.parse(fs.readFileSync('resources/data/' + slug + '-atlas.json', 'utf8'));
  if (atlas.situations.length !== 10) throw Error(slug + ': требуется 10 ситуаций');
  const ids = new Set();
  let deepCount = 0;
  for (const situation of atlas.situations) {
    if (ids.has(situation.id)) throw Error(slug + ': повтор id ' + situation.id);
    ids.add(situation.id);
    if (situation.options.length !== 3) throw Error(slug + ': ожидаются три варианта');
    for (const option of situation.options) {
      if (!option.deep?.consequence || !option.deep?.step || !option.reflection) {
        throw Error(slug + ': пустой разбор ' + situation.id + ' ' + option.id);
      }
      deepCount++;
    }
    if (new Set(situation.options.map(option => option.deep.consequence)).size !== 3) {
      throw Error(slug + ': повторяющиеся пояснения ' + situation.id);
    }
  }
  if (!three.includes('function ' + labels[0] + '(')) throw Error(slug + ': отдельный инструмент не найден');
  if (!original.includes(slug + ':' + (slug === 'relationships' ? 'RelationshipCombined' : labels[0]))) {
    throw Error(slug + ': отдельный инструмент не подключён');
  }
  console.log(slug + ': ' + deepCount + ' разных подробных разборов');
}
console.log('Проверка трёх переработанных направлений пройдена.');
