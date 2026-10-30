'use strict';

const crypto = require('node:crypto');
const path = require('node:path');

const files = {
    'resources/js/Pages/Numbers.jsx': 'numbers',
    'resources/js/Pages/ExploreEmotions.jsx': 'emotions',
    'resources/js/Pages/ExploreEmotionDetail.jsx': 'emotions',
    'resources/js/components/EmotionCompass.jsx': 'emotions',
    'resources/js/components/EmotionNamingHelper.jsx': 'emotions',
    'resources/js/components/EmotionLayersExplorer.jsx': 'emotions',
    'resources/js/components/EmotionScenarioLibrary.jsx': 'emotions',
    'resources/js/components/EmotionPracticeLibrary.jsx': 'emotions',
    'resources/js/Pages/ExploreArchetypes.jsx': 'archetypes',
    'resources/js/Pages/ExploreArchetypeMirror.jsx': 'archetypes',
    'resources/js/components/ArchetypeSituationExperience.jsx': 'archetypes',
    'resources/js/Pages/ExploreDreams.jsx': 'dreams',
    'resources/js/Pages/ExploreDreamSymbol.jsx': 'dreams',
    'resources/js/Pages/ExplorePatterns.jsx': 'patterns',
    'resources/js/Pages/ExplorePatternDetail.jsx': 'patterns',
    'resources/js/Pages/ExplorePersonalityMirror.jsx': 'mirror',
    'resources/js/Pages/ExploreLifeLanguage.jsx': 'shared',
    'resources/js/components/ExploreLifeWorkbench.jsx': 'shared',
    'resources/js/components/ExploreConnections.jsx': 'shared',
    'resources/js/components/ExploreSectionNavigation.jsx': 'shared',
};

function relativeFile(filename) {
    if (!filename) return '';
    return path.relative(process.cwd(), filename.replace(/\?.*$/, '')).replaceAll(path.sep, '/');
}

function isEditable(value) {
    return typeof value === 'string' && /[А-Яа-яЁё]/.test(value)
        && value.trim().length > 1 && value.trim() !== 'все';
}

// Matches the normal JSX whitespace handling so wrapping a text node in an
// expression does not create strange line breaks or indentation in the DOM.
function normalizeJsxText(raw) {
    const lines = raw.replace(/\t/g, ' ').split(/\r\n|\n|\r/);
    let last = 0;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].trim().length) last = i;
    }
    let result = '';
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        if (i !== 0) line = line.replace(/^\s+/, '');
        if (i !== lines.length - 1) line = line.replace(/\s+$/, '');
        if (line) {
            result += line;
            if (i !== last) result += ' ';
        }
    }
    return result;
}

function copyKey(filename, node, category = '') {
    const file = relativeFile(filename);
    return 'c' + crypto.createHash('sha1')
        .update([file, String(node.start), category].join(':'))
        .digest('hex')
        .slice(0, 16);
}

function sectionForPath(p) {
    let cursor = p;
    while (cursor) {
        if (cursor.isJSXElement?.()) {
            const opening = cursor.node.openingElement;
            const tag = opening.name?.name;
            const id = opening.attributes?.find(attribute => attribute.name?.name === 'id');
            const value = id?.value?.value;
            if (tag === 'header') return 'Шапка и меню';
            if (tag === 'footer') return 'Подвал и приглашение';
            if (typeof value === 'string') {
                return 'Раздел: ' + value;
            }
        }
        cursor = cursor.parentPath;
    }
    return 'Основные тексты и элементы интерфейса';
}

function copyManifestEntry(filename, node, text, category, p) {
    return {
        key: copyKey(filename, node, category),
        text,
        section: sectionForPath(p),
        label: text.trim().replace(/\s+/g, ' ').slice(0, 115),
        source: relativeFile(filename),
        line: node.loc?.start?.line || 0,
    };
}

module.exports = { files, relativeFile, isEditable, normalizeJsxText, copyKey, sectionForPath, copyManifestEntry };
