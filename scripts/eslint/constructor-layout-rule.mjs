const constructorLayoutRule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [],
    messages: { layout: 'Put each constructor parameter on its own line; align the closing parenthesis and omit the final comma.' },
  },
  create(context) {

    const source = context.sourceCode;

    const visitors = {
      MethodDefinition(node) {

        if (node.kind !== 'constructor' || node.value.params.length < 2) {
          return;
        }

        const params = node.value.params;
        const open = source.getTokenBefore(params[0]);
        const close = source.getTokenAfter(params.at(-1), (token) => token.value === ')');
        const indent = source.lines[node.loc.start.line - 1].match(/^\s*/)[0];

        for (const [index, param] of params.entries()) {

          const before = index === 0 ? open : source.getTokenBefore(param);
          const gap = source.text.slice(before.range[1], param.range[0]);
          const expected = '\n' + indent + '  ';
          if (/^\s*$/.test(gap) && gap !== expected) {

            context.report({
              node: param,
              messageId: 'layout',
              fix: (fixer) => fixer.replaceTextRange(
                [before.range[1], param.range[0]],
                expected,
              ),
            });

          }

        }

        const last = params.at(-1);
        const end = source.text.slice(last.range[1], close.range[0]);
        if (/^[\s,]*$/.test(end) && end !== '\n' + indent) {

          context.report({
            node,
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

export default constructorLayoutRule;
