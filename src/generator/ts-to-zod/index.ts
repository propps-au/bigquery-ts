import ts, { factory as f } from 'typescript'
import { printNode } from 'zod-to-ts'
import { generateZodSchemaVariableStatement } from './generate'

export function processNode(node: ts.TypeLiteralNode, label: string): string {
  const alias = f.createTypeAliasDeclaration(
    undefined,
    [f.createModifier(ts.SyntaxKind.ExportKeyword)],
    label,
    undefined,
    node
  )

  const t = generateZodSchemaVariableStatement({
    node: alias,
    varName: `${label}Schema`,
  })

  return printNode(t)
}
