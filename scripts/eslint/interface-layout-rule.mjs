const interfaceLayoutRule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [],
    messages: { padding: 'Method-bearing interfaces need exactly one blank line at each body boundary.' },
  },
  create(context) {

    const source = context.sourceCode;

    const visitors = {
      TSInterfaceBody(node) {

        if (!node.body.some((member) =>
          member.type === 'TSMethodSignature' ||
          member.type === 'TSCallSignatureDeclaration' ||
          member.type === 'TSConstructSignatureDeclaration',
        )) {
          return;
        }

        const open = source.getFirstToken(node);
        const close = source.getLastToken(node);
        const first = source.getTokenAfter(open, { includeComments: true });
        const last = source.getTokenBefore(close, { includeComments: true });

        for (const [left, right] of [[open, first], [last, close]]) {

          const gap = source.text.slice(left.range[1], right.range[0]);
          if (/^\s*$/.test(gap) && (gap.match(/\n/g) || []).length !== 2) {

            const indent = gap.slice(gap.lastIndexOf('\n') + 1);
            context.report({
              node,
              messageId: 'padding',
              fix: (fixer) => fixer.replaceTextRange(
                [left.range[1], right.range[0]],
                '\n\n' + indent,
              ),
            });

          }

        }

      },
    };

    return visitors;

  },
};

export default interfaceLayoutRule;
