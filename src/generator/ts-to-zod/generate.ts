/**
 * Modified implementation from ts-to-zod package
 */

import camel from 'camelcase'
import ts, { NodeFlags, SyntaxKind } from 'typescript'

const { factory: f } = ts

export type ZodProperty = {
  identifier: string
  expressions?: ts.Expression[]
}

export interface GenerateZodSchemaProps {
  /**
   * Name of the exported variable
   */
  varName: string

  /**
   * Interface or type node
   */
  node: ts.InterfaceDeclaration | ts.TypeAliasDeclaration | ts.EnumDeclaration

  /**
   * Zod import value.
   *
   * @default "z"
   */
  zodImportValue?: string
}
/**
 * Getter for schema dependencies (Type reference inside type)
 *
 * @param identifierName Name of the identifier
 * @returns string
 */
function getDependencyName(identifierName: string) {
  return camel(`${identifierName}Schema`, { pascalCase: true })
}

/**
 * Generate zod schema declaration
 *
 * ```ts
 * export const ${varName} = ${zodImportValue}.object(…)
 * ```
 */
export function generateZodSchemaVariableStatement({
  node,
  varName,
  zodImportValue = 'z',
}: GenerateZodSchemaProps): ts.VariableStatement {
  let schema:
    | ts.CallExpression
    | ts.Identifier
    | ts.PropertyAccessExpression
    | undefined

  if (ts.isTypeAliasDeclaration(node)) {
    if (node.typeParameters) {
      throw new Error('Type with generics are not supported!')
    }

    schema = buildZodPrimitive({
      z: zodImportValue,
      typeNode: node.type,
      isOptional: false,
    })
  }

  return f.createVariableStatement(
    node.modifiers,
    f.createVariableDeclarationList(
      [
        f.createVariableDeclaration(
          f.createIdentifier(varName),
          undefined,
          undefined,
          schema
        ),
      ],
      NodeFlags.Const
    )
  )
}

function buildZodProperties({
  members,
  zodImportValue: z,
}: {
  members: ts.NodeArray<ts.TypeElement> | ts.PropertySignature[]
  zodImportValue: string
}) {
  const properties = new Map<
    ts.Identifier | ts.StringLiteral,
    ts.CallExpression | ts.Identifier | ts.PropertyAccessExpression
  >()
  for (const member of members) {
    if (
      !ts.isPropertySignature(member) ||
      !member.type ||
      !(ts.isIdentifier(member.name) || ts.isStringLiteral(member.name))
    ) {
      break
    }

    const isOptional = Boolean(member.questionToken)

    properties.set(
      member.name,
      buildZodPrimitive({
        z,
        typeNode: member.type,
        isOptional,
      })
    )
  }

  return properties
}

function buildZodPrimitive({
  z,
  typeNode,
  isOptional,
  isNullable,
  isPartial,
  isRequired,
}: {
  z: string
  typeNode: ts.TypeNode
  isOptional: boolean
  isNullable?: boolean
  isPartial?: boolean
  isRequired?: boolean
}): ts.CallExpression | ts.Identifier | ts.PropertyAccessExpression {
  const zodProperties = toZodProperties(
    isOptional,
    Boolean(isPartial),
    Boolean(isRequired),
    Boolean(isNullable)
  )

  if (ts.isParenthesizedTypeNode(typeNode)) {
    return buildZodPrimitive({
      z,
      typeNode: typeNode.type,
      isOptional,
    })
  }

  if (ts.isTypeReferenceNode(typeNode) && ts.isIdentifier(typeNode.typeName)) {
    const identifierName = typeNode.typeName.text

    const dependencyName = getDependencyName(identifierName)
    const zodSchema: ts.Identifier | ts.CallExpression =
      f.createIdentifier(dependencyName)
    return withZodProperties(zodSchema, zodProperties)
  }

  if (ts.isUnionTypeNode(typeNode)) {
    const hasNull = typeNode.types.some(
      (i) =>
        ts.isLiteralTypeNode(i) && i.literal.kind === SyntaxKind.NullKeyword
    )

    const nodes = typeNode.types.filter((element) => isNotNull(element))

    const values = nodes.map((i) =>
      buildZodPrimitive({
        z,
        typeNode: i,
        isOptional: false,
        isNullable: false,
      })
    )

    // Handling null value outside of the union type
    if (hasNull) {
      zodProperties.push({
        identifier: 'nullable',
      })
    }

    return buildZodSchema(
      z,
      'union',
      [f.createArrayLiteralExpression(values)],
      zodProperties
    )
  }

  if (ts.isArrayTypeNode(typeNode)) {
    return buildZodSchema(
      z,
      'array',
      [
        buildZodPrimitive({
          z,
          typeNode: typeNode.elementType,
          isOptional: false,
        }),
      ],
      zodProperties
    )
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    return withZodProperties(
      buildZodObject({
        typeNode,
        z,
      }),
      zodProperties
    )
  }

  if (ts.isLiteralTypeNode(typeNode)) {
    return buildZodSchema(z, typeNode.literal.getText(), [], zodProperties)
  }

  switch (typeNode.kind) {
    case SyntaxKind.StringKeyword:
      return buildZodSchema(z, 'string', [], zodProperties)
    case SyntaxKind.BooleanKeyword:
      return buildZodSchema(z, 'boolean', [], zodProperties)
    case SyntaxKind.UndefinedKeyword:
      return buildZodSchema(z, 'undefined', [], zodProperties)
    case SyntaxKind.NumberKeyword:
      return buildZodSchema(z, 'number', [], zodProperties)
    case SyntaxKind.AnyKeyword:
      return buildZodSchema(z, 'any', [], zodProperties)
    case SyntaxKind.BigIntKeyword:
      return buildZodSchema(z, 'bigint', [], zodProperties)
    case SyntaxKind.VoidKeyword:
      return buildZodSchema(z, 'void', [], zodProperties)
    case SyntaxKind.NeverKeyword:
      return buildZodSchema(z, 'never', [], zodProperties)
  }

  console.warn(
    ` »   Warning: '${
      SyntaxKind[typeNode.kind]
    }' is not supported, fallback into 'z.any()'`
  )
  return buildZodSchema(z, 'any', [], zodProperties)
}

/**
 * Build a zod schema.
 *
 * @param z zod namespace
 * @param callName zod function
 * @param args Args to add to the main zod call, if any
 * @param properties An array of flags that should be added as extra property calls such as optional to add .optional()
 */
function buildZodSchema(
  z: string,
  callName: string,
  args?: ts.Expression[],
  properties?: ZodProperty[]
) {
  const zodCall = f.createCallExpression(
    f.createPropertyAccessExpression(
      f.createIdentifier(z),
      f.createIdentifier(callName)
    ),
    undefined,
    args
  )
  return withZodProperties(zodCall, properties)
}

/**
 * Apply zod properties to an expression (as `.optional()`)
 *
 * @param expression
 * @param properties
 */
function withZodProperties(
  expression: ts.Expression,
  properties: ZodProperty[] = []
) {
  return properties.reduce(
    (expressionWithProperties, property) =>
      f.createCallExpression(
        f.createPropertyAccessExpression(
          expressionWithProperties,
          f.createIdentifier(property.identifier)
        ),
        undefined,
        property.expressions ? property.expressions : undefined
      ),
    expression
  ) as ts.CallExpression
}

function buildZodObject({
  typeNode,
  z,
}: {
  typeNode: ts.TypeLiteralNode | ts.InterfaceDeclaration
  z: string
}) {
  const properties = typeNode.members.filter(
    (member): member is ts.PropertySignature => ts.isPropertySignature(member)
  )

  let objectSchema: ts.CallExpression | undefined

  if (properties.length > 0) {
    const parsedProperties = buildZodProperties({
      members: properties,
      zodImportValue: z,
    })

    objectSchema = buildZodSchema(z, 'object', [
      f.createObjectLiteralExpression(
        [...parsedProperties.entries()].map(([key, tsCall]) => {
          return f.createPropertyAssignment(key, tsCall)
        }),
        true
      ),
    ])
  }

  if (objectSchema) {
    return objectSchema
  }

  return buildZodSchema(z, 'object', [f.createObjectLiteralExpression()])
}

export function toZodProperties(
  isOptional: boolean,
  isPartial: boolean,
  isRequired: boolean,
  isNullable: boolean
): ZodProperty[] {
  const zodProperties: ZodProperty[] = []
  if (isOptional) {
    zodProperties.push({
      identifier: 'optional',
    })
  }

  if (isNullable) {
    zodProperties.push({
      identifier: 'nullable',
    })
  }

  if (isPartial) {
    zodProperties.push({
      identifier: 'partial',
    })
  }

  if (isRequired) {
    zodProperties.push({
      identifier: 'required',
    })
  }

  return zodProperties
}

export function isNotNull(node: ts.TypeNode): boolean {
  return (
    !ts.isLiteralTypeNode(node) || node.literal.kind !== SyntaxKind.NullKeyword
  )
}
