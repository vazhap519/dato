'use strict';

const { files, relativeFile, isEditable, normalizeJsxText, copyKey } = require('./explore-copy-config.cjs');

/**
 * Build-time Babel transform: replace visible Russian strings with
 * readExploreCopy(stable_key, original_text).
 *
 * Admin changes live in PostgreSQL and arrive through Inertia props. Therefore
 * changing copy in Filament does NOT require rebuilding the JavaScript bundle.
 *
 * Only the specifically listed pages and their UI components are touched.
 */
module.exports = function exploreCopyBabelPlugin({ types: t }) {
    const expression = (key, original) => t.callExpression(
        t.identifier('__exploreText'),
        [t.stringLiteral(key), t.stringLiteral(original)],
    );

    return {
        name: 'explore-editable-copy',
        visitor: {
            Program: {
                enter(_p, state) {
                    state.exploreFile = state.file?.opts?.filename || '';
                    state.exploreEligible = !!files[relativeFile(state.exploreFile)];
                    state.exploreUsesCopy = false;
                },
                exit(p, state) {
                    if (!state.exploreEligible || !state.exploreUsesCopy) return;

                    p.unshiftContainer('body', t.importDeclaration(
                        [t.importSpecifier(t.identifier('__exploreText'), t.identifier('readExploreCopy'))],
                        t.stringLiteral('../lib/exploreCms.js'),
                    ));
                },
            },
            JSXText(p, state) {
                if (!state.exploreEligible) return;
                const value = normalizeJsxText(p.node.value);
                if (!isEditable(value)) return;

                const key = copyKey(state.exploreFile, p.node, 'jsx');
                state.exploreUsesCopy = true;
                p.replaceWith(t.jsxExpressionContainer(expression(key, value)));
                p.skip();
            },
            JSXAttribute(p, state) {
                if (!state.exploreEligible || !t.isStringLiteral(p.node.value)) return;
                const value = p.node.value.value;
                if (!isEditable(value)) return;

                const key = copyKey(state.exploreFile, p.node.value, 'attr');
                state.exploreUsesCopy = true;
                p.node.value = t.jsxExpressionContainer(expression(key, value));
                p.skip();
            },
            StringLiteral(p, state) {
                if (!state.exploreEligible || !isEditable(p.node.value)) return;
                if (p.parentPath.isImportDeclaration() || p.parentPath.isExportNamedDeclaration()) return;
                if (p.parentPath.isObjectProperty() && p.key === 'key' && !p.parent.computed) return;
                if (p.parentPath.isJSXAttribute()) return;
                const key = copyKey(state.exploreFile, p.node, 'str');
                state.exploreUsesCopy = true;
                p.replaceWith(expression(key, p.node.value));
                p.skip();
            },
            TemplateLiteral(p, state) {
                if (!state.exploreEligible) return;
                if (p.parentPath.isTaggedTemplateExpression()) return;
                const pieces = p.node.quasis;
                if (!pieces.some(piece => isEditable(piece.value.cooked))) return;

                const exprs = [];
                for (let i = 0; i < pieces.length; i++) {
                    const piece = pieces[i];
                    const value = piece.value.cooked ?? piece.value.raw;
                    exprs.push(isEditable(value)
                        ? expression(copyKey(state.exploreFile, piece, 'template'), value)
                        : t.stringLiteral(value));
                    if (i < p.node.expressions.length) exprs.push(p.node.expressions[i]);
                }
                const combined = exprs.slice(1).reduce((left, right) =>
                    t.binaryExpression('+', left, right), exprs[0]);
                state.exploreUsesCopy = true;
                p.replaceWith(combined);
                p.skip();
            },
        },
    };
};
