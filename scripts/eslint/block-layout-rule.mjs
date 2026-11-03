const blockLayoutRule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [],
    messages: { padding: 'Use exactly one boundary blank line for expanded bodies and none for compact bodies.' },
  },
  create(context) {

    const source = context.sourceCode;

    function check(node) {

      const members = node.type === 'SwitchStatement' ? node.cases : node.body;
      if (!Array.isArray(members) || members.length === 0) {
        return;
      }

      const open = node.type === 'SwitchStatement'
        ? source.getTokenAfter(node.discriminant, (token) => token.value === '{')
        : source.getFirstToken(node);
      const close = source.getLastToken(node);
      const first = source.getTokenAfter(open, { includeComments: true });
      const last = source.getTokenBefore(close, { includeComments: true });
      const statement = members[0];
      const expanded = node.type === 'ClassBody'
        ? members.length > 1
        : members.length > 1 ||
          statement.loc.start.line !== statement.loc.end.line ||
          /^(If|For|While|DoWhile|Switch|Try|With|Block)/.test(statement.type);

      for (const [left, right] of [[open, first], [last, close]]) {

        const gap = source.text.slice(left.range[1], right.range[0]);
        if (!/^\s*$/.test(gap)) {
          continue;
        }

        const newlines = (gap.match(/\n/g) || []).length;
        const expected = expanded ? 2 : (newlines > 0 ? 1 : 0);
        if (newlines === expected) {
          continue;
        }

        const indent = gap.slice(gap.lastIndexOf('\n') + 1);
        context.report({
          node,
          messageId: 'padding',
          fix: (fixer) => fixer.replaceTextRange(
            [left.range[1], right.range[0]],
            '\n'.repeat(expected) + indent,
          ),
        });

      }

    }

    return {
      BlockStatement: check,
      ClassBody: check,
      StaticBlock: check,
      SwitchStatement: check,
    };

  },
};

export default blockLayoutRule;
