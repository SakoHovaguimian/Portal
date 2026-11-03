import ts from 'typescript';

export function readLiteral(node) {

  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) { return node.text; }
  if (ts.isNumericLiteral(node)) { return Number(node.text); }
  if (node.kind === ts.SyntaxKind.TrueKeyword) { return true; }
  if (node.kind === ts.SyntaxKind.FalseKeyword) { return false; }
  if (node.kind === ts.SyntaxKind.NullKeyword) { return null; }
  if (ts.isArrayLiteralExpression(node)) {

    const values = node.elements.map(readLiteral);
    return values;

  }
  if (ts.isObjectLiteralExpression(node)) {

    const result = Object.create(null);
    for (const property of node.properties) {

      if (!ts.isPropertyAssignment(property) || !property.name || ts.isComputedPropertyName(property.name)) { throw new Error('catalogHint'); }
      const key = property.name.text;
      if (Object.hasOwn(result, key) || ['__proto__', 'prototype', 'constructor'].includes(key)) { throw new Error('catalogHint'); }
      result[key] = readLiteral(property.initializer);

    }
    return result;

  }
  throw new Error('catalogHint');

}

export function readExport(source, name) {

  const file = ts.createSourceFile('catalog.ts', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  if (file.parseDiagnostics.length) { throw new Error('catalogHint'); }
  const declarations = file.statements.flatMap((statement) => ts.isVariableStatement(statement) ? [...statement.declarationList.declarations] : []);
  const declaration = declarations.find((item) => ts.isIdentifier(item.name) && item.name.text === name);
  if (!declaration?.initializer) { throw new Error('catalogHint'); }
  return readLiteral(declaration.initializer);

}

export function markedBlock(source, marker) {

  const startMarker = `// ${marker}_START`;
  const endMarker = `// ${marker}_END`;
  const start = source.indexOf(startMarker);
  const end = source.indexOf(endMarker);
  if (start < 0 || end <= start || source.indexOf(startMarker, start + 1) >= 0 || source.indexOf(endMarker, end + 1) >= 0) { throw new Error('catalogHint'); }
  return { start: start + startMarker.length, end, source: source.slice(start + startMarker.length, end) };

}

export function sourceLiteral(value, depth = 0) {

  if (typeof value === 'string') { return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')}'`; }
  if (value === null || typeof value === 'boolean' || typeof value === 'number') { return String(value); }
  const padding = '  '.repeat(depth);
  const childPadding = `${padding}  `;
  if (Array.isArray(value)) {

    if (!value.length) { return '[]'; }
    const entries = value.map((item) => `${childPadding}${sourceLiteral(item, depth + 1)},`);
    return `[\n${entries.join('\n')}\n${padding}]`;

  }
  const entries = Object.entries(value).map(([key, item]) => `${childPadding}${/^[A-Za-z_$][\w$]*$/.test(key) ? key : sourceLiteral(key)}: ${sourceLiteral(item, depth + 1)},`);
  return `{\n${entries.join('\n')}\n${padding}}`;

}

export function formatInitializerCopy(copy, key, values = {}) {

  const template = copy[key];
  if (typeof template !== 'string') { throw new Error('catalogHint'); }
  const message = template.replace(/\{(\w+)\}/g, (_, name) => String(values[name] ?? ''));
  return message;

}
