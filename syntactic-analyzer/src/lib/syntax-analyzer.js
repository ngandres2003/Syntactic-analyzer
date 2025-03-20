// Simple Java syntax analyzer implementation

// Token types
const TOKEN_TYPES = {
  KEYWORD: "KEYWORD",
  IDENTIFIER: "IDENTIFIER",
  OPERATOR: "OPERATOR",
  LITERAL: "LITERAL",
  SEPARATOR: "SEPARATOR",
  COMMENT: "COMMENT",
  WHITESPACE: "WHITESPACE",
  UNKNOWN: "UNKNOWN",
}

// Java keywords
const KEYWORDS = [
  "abstract",
  "assert",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "default",
  "do",
  "double",
  "else",
  "enum",
  "extends",
  "final",
  "finally",
  "float",
  "for",
  "if",
  "implements",
  "import",
  "instanceof",
  "int",
  "interface",
  "long",
  "native",
  "new",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "strictfp",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "try",
  "void",
  "volatile",
  "while",
]

// Operators
const OPERATORS = [
  "+",
  "-",
  "*",
  "/",
  "%",
  "=",
  "+=",
  "-=",
  "*=",
  "/=",
  "%=",
  "++",
  "--",
  "==",
  "!=",
  ">",
  "<",
  ">=",
  "<=",
  "&&",
  "||",
  "!",
  "&",
  "|",
  "^",
  "~",
  "<<",
  ">>",
  ">>>",
  "<<<",
  "&=",
  "|=",
  "^=",
  "<<=",
  ">>=",
  ">>>=",
]

// Separators
const SEPARATORS = ["(", ")", "{", "}", "[", "]", ";", ",", ".", ":", "?", "@"]

// Tokenize the input code
function tokenize(code) {
  const tokens = []
  const lines = code.split("\n")

  let lineNumber = 0

  for (const line of lines) {
    lineNumber++
    let columnNumber = 0
    let i = 0

    while (i < line.length) {
      columnNumber = i + 1
      const char = line[i]

      // Skip whitespace
      if (/\s/.test(char)) {
        i++
        continue
      }

      // Comments
      if (char === "/" && i + 1 < line.length) {
        // Line comment
        if (line[i + 1] === "/") {
          const commentText = line.substring(i)
          tokens.push({
            type: TOKEN_TYPES.COMMENT,
            value: commentText,
            line: lineNumber,
            column: columnNumber,
          })
          break // Rest of the line is a comment
        }

        // Block comment (simplified, doesn't handle multi-line)
        if (line[i + 1] === "*") {
          const endIndex = line.indexOf("*/", i + 2)
          if (endIndex !== -1) {
            const commentText = line.substring(i, endIndex + 2)
            tokens.push({
              type: TOKEN_TYPES.COMMENT,
              value: commentText,
              line: lineNumber,
              column: columnNumber,
            })
            i = endIndex + 2
            continue
          }
        }
      }

      // String literals
      if (char === '"') {
        let j = i + 1
        while (j < line.length && line[j] !== '"') {
          if (line[j] === "\\" && j + 1 < line.length) {
            j += 2 // Skip escaped character
          } else {
            j++
          }
        }

        if (j < line.length) {
          const stringLiteral = line.substring(i, j + 1)
          tokens.push({
            type: TOKEN_TYPES.LITERAL,
            value: stringLiteral,
            line: lineNumber,
            column: columnNumber,
          })
          i = j + 1
          continue
        }
      }

      // Character literals
      if (char === "'") {
        let j = i + 1
        while (j < line.length && line[j] !== "'") {
          if (line[j] === "\\" && j + 1 < line.length) {
            j += 2 // Skip escaped character
          } else {
            j++
          }
        }

        if (j < line.length) {
          const charLiteral = line.substring(i, j + 1)
          tokens.push({
            type: TOKEN_TYPES.LITERAL,
            value: charLiteral,
            line: lineNumber,
            column: columnNumber,
          })
          i = j + 1
          continue
        }
      }

      // Number literals
      if (/[0-9]/.test(char)) {
        let j = i
        let isFloat = false

        while (
          j < line.length &&
          (/[0-9]/.test(line[j]) ||
            line[j] === "." ||
            /[eE]/.test(line[j]) ||
            (/[eE]/.test(line[j - 1]) && /[+-]/.test(line[j])))
        ) {
          if (line[j] === ".") {
            isFloat = true
          }
          j++
        }

        const numLiteral = line.substring(i, j)
        tokens.push({
          type: TOKEN_TYPES.LITERAL,
          value: numLiteral,
          line: lineNumber,
          column: columnNumber,
        })
        i = j
        continue
      }

      // Identifiers and keywords
      if (/[a-zA-Z_$]/.test(char)) {
        let j = i
        while (j < line.length && /[a-zA-Z0-9_$]/.test(line[j])) {
          j++
        }

        const word = line.substring(i, j)

        if (KEYWORDS.includes(word)) {
          tokens.push({
            type: TOKEN_TYPES.KEYWORD,
            value: word,
            line: lineNumber,
            column: columnNumber,
          })
        } else {
          tokens.push({
            type: TOKEN_TYPES.IDENTIFIER,
            value: word,
            line: lineNumber,
            column: columnNumber,
          })
        }

        i = j
        continue
      }

      // Check for operators (multi-character)
      let foundOperator = false
      for (const op of OPERATORS) {
        if (line.substring(i, i + op.length) === op) {
          tokens.push({
            type: TOKEN_TYPES.OPERATOR,
            value: op,
            line: lineNumber,
            column: columnNumber,
          })
          i += op.length
          foundOperator = true
          break
        }
      }

      if (foundOperator) continue

      // Check for separators
      if (SEPARATORS.includes(char)) {
        tokens.push({
          type: TOKEN_TYPES.SEPARATOR,
          value: char,
          line: lineNumber,
          column: columnNumber,
        })
        i++
        continue
      }

      // Unknown token
      tokens.push({
        type: TOKEN_TYPES.UNKNOWN,
        value: char,
        line: lineNumber,
        column: columnNumber,
      })
      i++
    }
  }

  return tokens
}

// Simple parser to check for basic syntax errors
function parse(tokens) {
  const errors = []
  const ast = { type: "Program", children: [] }

  // Stack for tracking brackets
  const bracketStack = []

  // Check for mismatched brackets
  for (const token of tokens) {
    if (token.type === TOKEN_TYPES.SEPARATOR) {
      if (token.value === "(" || token.value === "{" || token.value === "[") {
        bracketStack.push({
          char: token.value,
          line: token.line,
          column: token.column,
        })
      } else if (token.value === ")" || token.value === "}" || token.value === "]") {
        const expected = token.value === ")" ? "(" : token.value === "}" ? "{" : "["

        if (bracketStack.length === 0) {
          errors.push({
            message: `Unexpected closing bracket '${token.value}'`,
            line: token.line,
            column: token.column,
          })
        } else {
          const lastBracket = bracketStack.pop()
          if (lastBracket?.char !== expected) {
            errors.push({
              message: `Mismatched bracket: expected '${lastBracket?.char === "(" ? ")" : lastBracket?.char === "{" ? "}" : "]"}' but found '${token.value}'`,
              line: token.line,
              column: token.column,
            })
          }
        }
      }
    }

    // Check for missing semicolons (simplified)
    if (
      token.type === TOKEN_TYPES.KEYWORD &&
      (token.value === "return" || token.value === "break" || token.value === "continue")
    ) {
      const nextNonCommentToken = tokens[tokens.indexOf(token) + 1]
      if (
        nextNonCommentToken &&
        nextNonCommentToken.type !== TOKEN_TYPES.SEPARATOR &&
        nextNonCommentToken.value !== ";"
      ) {
        errors.push({
          message: `Missing semicolon after '${token.value}' statement`,
          line: token.line,
          column: token.column + token.value.length,
        })
      }
    }
  }

  // Check for unclosed brackets
  if (bracketStack.length > 0) {
    for (const bracket of bracketStack) {
      errors.push({
        message: `Unclosed bracket '${bracket.char}'`,
        line: bracket.line,
        column: bracket.column,
      })
    }
  }

  // Build a simple AST (very simplified)
  let currentClass = null
  let currentMethod = null

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    // Class declaration
    if (token.type === TOKEN_TYPES.KEYWORD && token.value === "class" && i + 1 < tokens.length) {
      const nameToken = tokens[i + 1]
      if (nameToken.type === TOKEN_TYPES.IDENTIFIER) {
        currentClass = {
          type: "ClassDeclaration",
          name: nameToken.value,
          children: [],
        }
        ast.children.push(currentClass)
      }
    }

    // Method declaration (simplified)
    if (
      currentClass &&
      token.type === TOKEN_TYPES.KEYWORD &&
      (token.value === "public" || token.value === "private" || token.value === "protected")
    ) {
      // Look ahead for return type and method name
      let j = i + 1
      let returnType = null
      let methodName = null

      while (j < tokens.length) {
        if (tokens[j].type === TOKEN_TYPES.IDENTIFIER && !returnType) {
          returnType = tokens[j].value
        } else if (tokens[j].type === TOKEN_TYPES.IDENTIFIER && returnType) {
          methodName = tokens[j].value
          break
        } else if (tokens[j].type === TOKEN_TYPES.KEYWORD && !returnType) {
          returnType = tokens[j].value
        }
        j++
      }

      if (methodName && j + 1 < tokens.length && tokens[j + 1].value === "(") {
        currentMethod = {
          type: "MethodDeclaration",
          name: methodName,
          returnType: returnType,
          children: [],
        }
        currentClass.children.push(currentMethod)
      }
    }
  }

  return { errors, ast }
}

// Main analysis function
export function analyzeSyntax(code) {
  try {
    // Tokenize the code
    const tokens = tokenize(code)

    // Parse the tokens
    const { errors, ast } = parse(tokens)

    return {
      success: errors.length === 0,
      tokens,
      ast,
      errors,
    }
  } catch (error) {
    console.error("Syntax analysis error:", error)
    return {
      success: false,
      tokens: [],
      ast: null,
      errors: [
        {
          message: error instanceof Error ? error.message : "Unknown error occurred",
          line: 0,
          column: 0,
        },
      ],
    }
  }
}

