const zodEnumLayoutRule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [],
    messages: { layout: 'Put each Zod enum case on its own line.' },
  },
  create(context) {

    const source = context.sourceCode;

    const visitors = {
      CallExpression(node) {

        if (node.callee.type !== 'MemberExpression' || node.callee.property.name !== 'enum') {
          return;
        }

        const array = node.arguments[0];
        if (array?.type !== 'ArrayExpression' || !array.elements.length) {
          return;
        }

        const open = source.getFirstToken(array);
        const close = source.getLastToken(array);
        const indent = source.lines[node.loc.start.line - 1].match(/^\s*/)[0];
        const entries = array.elements.filter(Boolean);

        for (const [index, entry] of entries.entries()) {

          const before = index === 0 ? open : source.getTokenBefore(entry);
          const gap = source.text.slice(before.range[1], entry.range[0]);
          if (/^\s*$/.test(gap) && !gap.includes('\n')) {

            context.report({
              node: entry,
              messageId: 'layout',
              fix: (fixer) => fixer.replaceTextRange(
                [before.range[1], entry.range[0]],
                '\n' + indent + '  ',
              ),
            });

          }

        }

        const last = source.getTokenBefore(close);
        const gap = source.text.slice(last.range[1], close.range[0]);
        if (/^\s*$/.test(gap) && !gap.includes('\n')) {

          context.report({
            node: array,
            messageId: 'layout',
            fix: (fixer) => fixer.replaceTextRange(
              [last.range[1], close.range[0]],
              '\n' + indent,
            ),
          });

        }

      },
    };

    return visitors;

  },
};

export default zodEnumLayoutRule;
