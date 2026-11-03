const separator = '// ' + '*'.repeat(38);

const serviceMarkRule = {
  meta: {
    type: 'layout',
    schema: [],
    messages: { mark: 'Add the exact three-line MARK block with an operation-specific uppercase label and one blank line before this declaration (before attached JSDoc).' },
  },
  create(context) {

    const source = context.sourceCode;
    const filename = context.filename.replaceAll('\\', '/');
    const serviceFile = /\/services\//.test(filename) &&
      !/\/(components|models)\//.test(filename) &&
      !/\.tsx$/.test(filename) &&
      !/\/use[A-Z][^/]*\.ts$/.test(filename);
    const helperFile = /\/(server|demo)\//.test(filename) && !/\/models\//.test(filename);
    const routeFile = /\/route\.[cm]?[jt]sx?$/.test(filename) || /\/src\/proxy\.ts$/.test(filename);

    function check(node) {

      let declaration = node;
      if (
        node.parent?.type === 'ExportNamedDeclaration' ||
        node.parent?.type === 'ExportDefaultDeclaration'
      ) {
        declaration = node.parent;
      }

      const comments = source.getCommentsBefore(declaration);
      const documentation = comments.at(-1)?.type === 'Block' && comments.at(-1).value.startsWith('*')
        ? comments.at(-1)
        : null;
      const anchor = documentation || declaration;
      const before = source.text.slice(0, anchor.range[0]);
      const indent = source.lines[declaration.loc.start.line - 1].match(/^\s*/)[0];
      const lines = before.trimEnd().split('\n');
      const exact = lines.at(-3)?.trim() === separator &&
        /^\/\/ MARK: - [A-Z0-9][A-Z0-9 /&'():-]*$/.test(lines.at(-2)?.trim() || '') &&
        lines.at(-1)?.trim() === separator &&
        lines.slice(-3).every((line) => line.startsWith(indent + '//')) &&
        /\n\s*\n[ \t]*$/.test(before) &&
        !/\n\s*\n\s*\n[ \t]*$/.test(before);

      if (!exact) {
        context.report({ node: declaration, messageId: 'mark' });
      }

    }

    const visitors = {
      MethodDefinition(node) {

        if (node.kind !== 'constructor' && serviceFile) {
          check(node);
        }

      },
      FunctionDeclaration(node) {

        const hook = /^use[A-Z]/.test(node.id?.name || '');
        if (!hook && (serviceFile || helperFile || routeFile)) {
          check(node);
        }

      },
      VariableDeclaration(node) {

        if (!serviceFile && !helperFile && !routeFile) {
          return;
        }

        const helper = node.declarations.some((declaration) =>
          declaration.id.type === 'Identifier' &&
          !/^use[A-Z]/.test(declaration.id.name) &&
          (declaration.init?.type === 'ArrowFunctionExpression' || declaration.init?.type === 'FunctionExpression'),
        );
        const handlerAlias = routeFile &&
          node.parent?.type === 'ExportNamedDeclaration' &&
          node.declarations.some((declaration) =>
            declaration.id.type === 'Identifier' &&
            /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/.test(declaration.id.name) &&
            declaration.init?.type === 'Identifier',
          );
        if (helper || handlerAlias) {
          check(node);
        }

      },
    };

    return visitors;

  },
};

export default serviceMarkRule;
