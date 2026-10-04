import ts from 'typescript';

const displayProperties = new Set([
  'label',
  'labelText',
  'title',
  'description',
  'placeholder',
  'alt',
  'aria-label',
  'aria-description',
  'loadingMessage',
  'emptyMessage',
  'badge',
  'caption',
  'eyebrow',
  'header',
  'confirmLabel',
  'cancelLabel',
  'actionLabel',
  'footerPrompt',
  'footerAction',
  'mockHint',
  'answer',
  'question',
  'display_name',
  'display_name_singular',
  'first_name',
  'last_name',
  'source',
  'message',
  'value',
  'delta',
  'revenue',
  'visitors',
  'sales',
  'conversion',
  'year',
]);
const technicalProperties = new Set([
  'authorization',
  'className',
  'class',
  'id',
  'key',
  'href',
  'src',
  'type',
  'd',
  'fill',
  'stroke',
  'viewBox',
  'style',
  'name',
  'method',
  'role',
  'code',
  'device_type',
  'event_type',
  'data-theme',
  'data-accent',
  'autoComplete',
  'color',
  'direction',
  'foreign_key',
  'display_field',
  'date_field',
  'label_field',
  'external_id',
  'user_id',
  'email',
  'phone_number',
]);
function propertyName(node) {
  const parent = node.parent;
  if (ts.isJsxAttribute(parent)) return parent.name.getText();
  if (ts.isPropertyAssignment(parent) && parent.initializer === node)
    return parent.name.getText().replace(/^['"]|['"]$/g, '');
  if (ts.isJsxExpression(parent) && ts.isJsxAttribute(parent.parent))
    return parent.parent.name.getText();
  if (
    (ts.isBindingElement(parent) || ts.isVariableDeclaration(parent)) &&
    parent.initializer === node &&
    ts.isIdentifier(parent.name)
  )
    return parent.name.text;
  return null;
}
function technicalContext(node) {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (
      ts.isImportDeclaration(parent) ||
      ts.isExportDeclaration(parent) ||
      ts.isLiteralTypeNode(parent) ||
      ts.isTypeNode(parent)
    )
      return true;
    if (
      ts.isCallExpression(parent) &&
      ts.isIdentifier(parent.expression) &&
      ['cn', 'clsx', 'twMerge'].includes(parent.expression.text)
    )
      return true;
    if (
      ts.isCallExpression(parent) &&
      ts.isPropertyAccessExpression(parent.expression) &&
      ['enum', 'literal'].includes(parent.expression.name.text)
    )
      return true;
    if (ts.isJsxAttribute(parent))
      return !displayProperties.has(parent.name.getText());
    if (
      ts.isExpressionStatement(parent) ||
      ts.isVariableDeclaration(parent) ||
      ts.isReturnStatement(parent)
    )
      break;
  }
  return false;
}
export function displayLiteral(node) {
  if (ts.isJsxText(node)) return Boolean(node.text.trim());
  if (
    !ts.isStringLiteral(node) &&
    !ts.isNoSubstitutionTemplateLiteral(node) &&
    !ts.isTemplateExpression(node)
  )
    return false;
  const directProperty = propertyName(node);
  if (directProperty && displayProperties.has(directProperty)) return true;
  if (technicalContext(node)) return false;
  if (
    ts.isStringLiteral(node) &&
    /Demo|demo|LoginScreen/.test(node.getSourceFile().fileName) &&
    (/^[^ @]+@[^ @]+\.[^ @]+$/.test(node.text) ||
      /^\+1 /.test(node.text) ||
      node.text === 'password123')
  )
    return true;
  const prop = propertyName(node);
  if (prop && displayProperties.has(prop)) return true;
  if (prop && technicalProperties.has(prop)) return false;
  const value = ts.isTemplateExpression(node)
    ? node.head.text +
      node.templateSpans.map((span) => span.literal.text).join('')
    : node.text;
  if (!value.trim() || value === 'use client' || value === 'use server')
    return false;
  // Paths, identifiers, CSS, SVG, worker/program text, and protocol values are not translatable copy.
  if (
    /^(?:@|\.|\/|#|https?:|var\(|rgba?\(|hsl|translate|scale|rotate|url\()/.test(
      value,
    ) ||
    /[{};=]/.test(value)
  )
    return false;
  if (/^(?:M|L)\s/.test(value) || /^(?:\d|%|px|ms|rem|vh|vw|s)$/.test(value))
    return false;
  if (
    /^(?:[\w:]+-)?(?:bg|text|border|rounded|flex|grid|gap|p|m|px|py|mx|my|w|h|min-w|max-w|items|justify|from|to|via|shadow|ring|absolute|relative|fixed|inset|left|right|top|bottom|overflow|opacity|z|transition)(?:[-:[\s]|$)/.test(
      value,
    )
  )
    return false;
  if (ts.isTemplateExpression(node))
    return (
      /[a-zA-Z]{2,}\s|\s[a-zA-Z]{2,}/.test(value) &&
      !/className|style|d=/.test(node.parent.getText().slice(0, 25))
    );
  if (
    (ts.isBinaryExpression(node.parent) &&
      [
        ts.SyntaxKind.EqualsEqualsEqualsToken,
        ts.SyntaxKind.ExclamationEqualsEqualsToken,
        ts.SyntaxKind.EqualsEqualsToken,
        ts.SyntaxKind.ExclamationEqualsToken,
      ].includes(node.parent.operatorToken.kind)) ||
    ts.isCaseClause(node.parent) ||
    ts.isElementAccessExpression(node.parent)
  )
    return false;
  return (
    /^[A-Z][a-z]{2} \d{2}$/.test(value) ||
    /[a-zA-Z]{2,}\s+[a-zA-Z]/.test(value) ||
    /^[A-Z][a-z]+(?:[ .][A-Za-z]+)*[.!?…:]*$/.test(value)
  );
}
export function jsxText(text) {
  const lines = text.split(/\r\n|\n|\r/);
  let result = '';
  let last = 0;
  lines.forEach((line, i) => {
    if (/[^ \t]/.test(line)) last = i;
  });
  lines.forEach((line, i) => {
    let value = line.replace(/\t/g, ' ');
    if (i !== 0) value = value.replace(/^ +/, '');
    if (i !== lines.length - 1) value = value.replace(/ +$/, '');
    if (value) {
      if (i !== last) value += ' ';
      result += value;
    }
  });
  return result;
}
export function sourceFile(path, source) {
  return ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    path.endsWith('tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}
