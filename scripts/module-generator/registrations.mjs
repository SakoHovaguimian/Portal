import ts from 'typescript';

import { sourceLiteral } from '../initializer/catalog.mjs';
import { initializerError } from '../initializer/options.mjs';

// Insert at declaration boundaries. Reprinting a source file would also rewrite
// users' comments, imports, and project-specific configuration.
export function editRegistration(path, source, register) {

  const file = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true);
  const edits = [];

  function required(node) {

    if (!node) { throw initializerError('wiringHint', { path }); }
    return node;

  }

  if (file.parseDiagnostics.length) { throw initializerError('wiringHint', { path }); }

  function variable(name) {

    for (const statement of file.statements) {

      if (!ts.isVariableStatement(statement)) { continue; }
      const item = statement.declarationList.declarations.find((value) => value.name.text === name);
      if (item) { return required(item.initializer); }

    }
    throw initializerError('wiringHint', { path });

  }

  function named(nodes, name) {

    const node = nodes?.find((value) => value.name?.text === name);
    return required(node);

  }

  function rejectDuplicate(exists) {

    if (exists) { throw initializerError('conflictHint', { path }); }

  }

  function insert(at, value) {
    edits.push({ at, value });
  }

  function after(node) {
    return ts.getTrailingCommentRanges(source, node.end)?.at(-1)?.end ?? node.end;
  }

  function append(node, value, indent, key) {

    const entries = required(node?.properties ?? node?.elements);
    rejectDuplicate(entries.some((entry) => (entry.name?.text ?? entry.text) === key));
    const last = entries.at(-1);
    if (last && !entries.hasTrailingComma) { insert(last.end, ','); }
    const close = node.getLastToken(file).getStart(file);
    const line = source.lastIndexOf('\n', close - 1) + 1;
    if (/^[ \t]*$/.test(source.slice(line, close))) {
      insert(line, `${indent}${value},\n`);
    } else {
      insert(close, `\n${indent}${value},\n${indent.slice(2)}`);
    }

  }

  function reserveIdentifier(symbol) {

    function visit(node) {

      rejectDuplicate(ts.isIdentifier(node) && node.text === symbol);
      ts.forEachChild(node, visit);

    }

    visit(file);

  }

  function addImport(slug, symbol, statement, heading = '') {

    reserveIdentifier(symbol);
    const imports = file.statements.filter(ts.isImportDeclaration);
    const nextModule = imports.find((item) => item.moduleSpecifier.text.startsWith('@/modules/') && item.moduleSpecifier.text.split('/')[2] > slug);
    const previous = nextModule ? file.statements[file.statements.indexOf(nextModule) - 1] : required(imports.at(-1));
    const at = previous ? after(previous) : 0;
    const prefix = heading ? `\n\n// ${heading}\n` : '\n';
    insert(at, `${prefix}${statement}`);

  }

  const edit = { file, variable, named, required, rejectDuplicate, reserveIdentifier, append, insert, after, addImport };
  register(edit);
  let result = source;
  // Apply from the end so every insertion uses original source offsets.
  // For equal positions the last scheduled insertion is applied first.
  for (const { at, value } of edits.reverse().sort((left, right) => right.at - left.at)) {
    result = result.slice(0, at) + value + result.slice(at);
  }
  return result;

}

export function moduleRegistrations({ key, name, slug, label }, recordCopy) {

  const quoted = `'${key}'`;
  const registrations = {
    'src/config/models/projectConfiguration.ts': ({ file, named, required, rejectDuplicate, insert, after }) => {

      const model = named(file.statements.filter(ts.isInterfaceDeclaration), 'ProjectConfiguration');
      const flags = named(model.members, 'modules').type;
      const lastFlag = required(flags.members?.at(-1));
      rejectDuplicate(flags.members.some((flag) => flag.name?.text === key));
      insert(after(lastFlag), `\n    ${key}: boolean;`);
      const nav = named(model.members, 'navigation').type;
      // readonly (A | B | ...)[] in the project's configuration model.
      const union = nav.type?.elementType?.type;
      const lastId = required(union?.types?.at(-1));
      rejectDuplicate(union.types.some((type) => type.literal?.text === key));
      insert(after(lastId), `\n    | ${quoted}`);

    },
    'src/config/projectConfiguration.ts': ({ variable, named, append }) => {

      const configuration = variable('projectConfiguration');
      append(named(configuration.properties, 'modules').initializer, `${key}: true`, '    ', key);
      append(named(configuration.properties, 'navigation').initializer, quoted, '    ', key);

    },
    'scripts/initializer/configuration.mjs': ({ variable, append }) => {

      append(variable('moduleIds'), quoted, '  ', key);
      append(variable('navigationModules'), `${key}: ${quoted}`, '  ', key);
      append(variable('defaultNavigation'), quoted, '  ', key);

    },
    'src/config/portalModuleRegistry.ts': ({ variable, append, addImport }) => {

      addImport(slug, `${key}Module`, `import { ${key}Module } from '@/modules/${slug}/${key}Module';`);
      append(variable('portalModuleRegistry'), `${key}Module`, '  ', `${key}Module`);

    },
    'src/clientContainer.ts': ({ file, named, rejectDuplicate, insert, after, addImport }) => {

      addImport(slug, `${name}Service`, `import { ${name}Service } from '@/modules/${slug}/services/${key}Service';`, label);
      const container = named(file.statements.filter(ts.isClassDeclaration), 'ClientServiceContainer');
      rejectDuplicate(container.members.some((member) => member.name?.text === `${key}Service`));
      const api = named(container.members, 'apiClient');
      insert(after(api), `\n  readonly ${key}Service = new ${name}Service(this.apiClient);`);

    },
    'src/proxy.ts': ({ variable, named, append }) => {

      const matcher = named(variable('config').properties, 'matcher').initializer;
      append(matcher, `'/${slug}/:path*'`, '    ', `/${slug}/:path*`);

    },
    'src/strings.ts': ({ file, reserveIdentifier, insert }) => {

      const symbol = `portal${name}Strings`;
      reserveIdentifier(symbol);
      const separator = file.text.endsWith('\n') ? '\n' : '\n\n';
      const catalog = sourceLiteral({ title: label, ...recordCopy });
      insert(file.end, `${separator}export const ${symbol} = ${catalog};\n`);

    },
  };

  return registrations;

}
