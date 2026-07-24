const userFacingAttributes = new Set([
  'alt',
  'aria-label',
  'description',
  'label',
  'placeholder',
  'title',
])

function containsWords(value) {
  return /[A-Za-z]{2,}/.test(value)
}

export const noRawUserFacingStrings = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require interface copy to come from the application string catalog.',
    },
    messages: {
      catalog: 'Move user-facing copy to src/content/strings.ts and reference it from this component.',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXText(node) {
        if (containsWords(node.value)) {
          context.report({ node, messageId: 'catalog' })
        }
      },
      JSXAttribute(node) {
        if (
          node.name.type === 'JSXIdentifier'
          && userFacingAttributes.has(node.name.name)
          && node.value?.type === 'Literal'
          && typeof node.value.value === 'string'
          && containsWords(node.value.value)
        ) {
          context.report({ node: node.value, messageId: 'catalog' })
        }
      },
      JSXExpressionContainer(node) {
        if (
          node.expression.type === 'Literal'
          && typeof node.expression.value === 'string'
          && containsWords(node.expression.value)
        ) {
          context.report({ node: node.expression, messageId: 'catalog' })
        }
      },
    }
  },
}
