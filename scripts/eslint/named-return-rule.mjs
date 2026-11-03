const namedReturnRule = {
  meta: {
    type: 'suggestion',
    fixable: 'whitespace',
    schema: [],
    messages: {
      result: 'Name this callback-based computation or returned function before returning it; preserve await and closure scope.',
      spacing: 'Keep a single-line named result adjacent to its return; separate a multiline result with one blank line.',
    },
  },
  create(context) {

    const source = context.sourceCode;

    function hasClosure(node) {

      if (!node || node.type === 'JSXElement' || node.type === 'JSXFragment') {
        return false;
      }
      if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') {
        return true;
      }
      if (
        node.type === 'CallExpression' &&
        node.callee.type === 'MemberExpression' &&
        /^(map|flatMap|filter|reduce|reduceRight|find|findLast|findIndex|findLastIndex|some|every|sort|toSorted)$/.test(node.callee.property.name || '')
      ) {
        return true;
      }

      const containsClosure = (source.visitorKeys[node.type] || []).some((key) => {

        const value = node[key];
        const children = Array.isArray(value) ? value : [value];
        const hasClosureChild = children.some((child) =>
          child && typeof child.type === 'string' && hasClosure(child),
        );

        return hasClosureChild;

      });

      return containsClosure;

    }

    const visitors = {
      ReturnStatement(node) {

        if (hasClosure(node.argument)) {
          context.report({ node, messageId: 'result' });
        }

        const statements = node.parent.body;
        if (!Array.isArray(statements) || node.argument?.type !== 'Identifier') {
          return;
        }

        const previous = statements[statements.indexOf(node) - 1];
        const declaration = previous?.type === 'VariableDeclaration' && previous.declarations.length === 1
          ? previous.declarations[0]
          : null;
        if (
          declaration?.id.type !== 'Identifier' ||
          declaration.id.name !== node.argument.name ||
          !hasClosure(declaration.init)
        ) {
          return;
        }

        const gap = source.text.slice(previous.range[1], node.range[0]);
        const expected = previous.loc.start.line === previous.loc.end.line ? 1 : 2;
        if (/^\s*$/.test(gap) && (gap.match(/\n/g) || []).length !== expected) {

          const indent = gap.slice(gap.lastIndexOf('\n') + 1);
          context.report({
            node,
            messageId: 'spacing',
            fix: (fixer) => fixer.replaceTextRange(
              [previous.range[1], node.range[0]],
              '\n'.repeat(expected) + indent,
            ),
          });

        }

      },
      ArrowFunctionExpression(node) {

        if (node.body.type !== 'BlockStatement' && hasClosure(node.body)) {
          context.report({ node: node.body, messageId: 'result' });
        }

      },
    };

    return visitors;

  },
};

export default namedReturnRule;
