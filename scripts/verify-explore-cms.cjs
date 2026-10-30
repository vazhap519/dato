#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const babel = require('@babel/core');
const plugin = require('./explore-copy-babel.cjs');
const { files } = require('./explore-copy-config.cjs');

const manifest = JSON.parse(fs.readFileSync('resources/data/explore-copy-manifest.json', 'utf8'));
let total = 0;
for (const [file, page] of Object.entries(files)) {
    const filename = path.resolve(file);
    const source = fs.readFileSync(filename, 'utf8');
    const output = babel.transformSync(source, {
        filename,
        configFile: false,
        babelrc: false,
        parserOpts: { sourceType: 'module', plugins: ['jsx'] },
        plugins: [plugin],
    })?.code || '';

    const expected = (manifest.pages[page] || [])
        .filter(item => item.source === file)
        .map(item => item.key);
    const found = [...output.matchAll(/__exploreText\(["'](c[0-9a-f]{16})["']/g)].map(m => m[1]);
    const missing = expected.filter(key => !found.includes(key));
    const extra = found.filter(key => !expected.includes(key));

    if (missing.length || extra.length) {
        throw new Error(file + ': несовпадение ключей текста. Нет: ' +
            missing.join(', ') + ', лишние: ' + extra.join(', '));
    }
    total += found.length;
    console.log('OK', file, found.length, 'текстов');
}
if (total < 180) throw new Error('Редактируемых текстов неожиданно мало: ' + total);

const docs = [
    'emotion-atlas','emotion-practices','emotion-situations',
    'archetype-guides','archetype-situations','archetype-mirror-questions',
    'dream-atlas','pattern-atlas','personality-mirror',
    'relationships-atlas','body-atlas','choice-atlas','beliefs-atlas','values-atlas',
    'fears-atlas','time-atlas','conflicts-atlas','attention-atlas',
];
for (const key of docs) {
    const data = JSON.parse(fs.readFileSync('resources/data/' + key + '.json', 'utf8'));
    if (!data.version || Object.keys(data).length < 2) {
        throw new Error('Неверный справочник: ' + key);
    }
    if (['relationships-atlas','body-atlas','choice-atlas','beliefs-atlas','values-atlas','fears-atlas','time-atlas','conflicts-atlas','attention-atlas'].includes(key)) {
        if (data.situations?.length !== 10 || !Array.isArray(data.feature?.fields)) {
            throw new Error('Некорректные интерактивные материалы: ' + key);
        }
        for (const scenario of data.situations) {
            if (scenario.options?.length !== 3 || !scenario.reflection || !scenario.question || !scenario.practice) {
                throw new Error('Неполная ситуация в ' + key + ': ' + scenario.id);
            }
        }
    }
}
console.log('ПРОВЕРКА CMS ПРОЙДЕНА:', total, 'редактируемых фраз,', docs.length, 'справочников.');
