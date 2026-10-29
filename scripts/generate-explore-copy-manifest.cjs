#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const { files, isEditable, normalizeJsxText, copyManifestEntry } = require('./explore-copy-config.cjs');

const pages = {};
for (const [file, page] of Object.entries(files)) {
    const filename = path.resolve(process.cwd(), file);
    if (!fs.existsSync(filename)) {
        throw new Error('Нет файла для контент-редактора: ' + file);
    }
    const content = fs.readFileSync(filename, 'utf8');
    const ast = parser.parse(content, { sourceType: 'module', plugins: ['jsx'] });
    const snippets = [];
    const add = (node, value, category, p) => {
        if (!isEditable(value)) return;
        snippets.push(copyManifestEntry(filename, node, value, category, p));
    };
    traverse(ast, {
        JSXText(p) {
            add(p.node, normalizeJsxText(p.node.value), 'jsx', p);
        },
        JSXAttribute(p) {
            if (p.node.value?.type === 'StringLiteral') {
                add(p.node.value, p.node.value.value, 'attr', p);
            }
        },
        StringLiteral(p) {
            if (p.parentPath.isImportDeclaration() || p.parentPath.isExportNamedDeclaration()) return;
            if (p.parentPath.isObjectProperty() && p.key === 'key' && !p.parent.computed) return;
            if (p.parentPath.isJSXAttribute()) return;
            add(p.node, p.node.value, 'str', p);
        },
        TemplateElement(p) {
            if (p.findParent(q => q.isTaggedTemplateExpression())) return;
            add(p.node, p.node.value.cooked ?? p.node.value.raw, 'template', p);
        },
    });
    pages[page] ??= [];
    pages[page].push(...snippets);
    console.log(page.padEnd(12), file.padEnd(57), snippets.length + ' editable phrases');
}

const keys = Object.values(pages).flatMap(items => items.map(entry => entry.key));
if (new Set(keys).size !== keys.length) {
    throw new Error('Обнаружен повтор идентификатора текста; остановка');
}
const manifest = {
    version: 1,
    note: 'Each field contains the exact existing page copy. Do not edit keys or source references.',
    pages,
};
const output = path.resolve(process.cwd(), 'resources/data/explore-copy-manifest.json');
fs.writeFileSync(output, JSON.stringify(manifest, null, 2) + '\n');
console.log('Редактируемых фрагментов:', keys.length, 'Записано:', output);
if (keys.length < 180) throw new Error('Недостаточно текстовых полей: похоже, генерация неполная');
