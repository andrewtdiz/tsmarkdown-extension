# TSMD TextMate Language Grammar High-Level Specification

## Overview
This document provides a high-level specification for the TypeScript-Markdown (TSMD) TextMate language grammar, outlining the core structure and patterns that define this hybrid language's syntax highlighting capabilities.

## Basic Configuration

```json
{
  "displayName": "TypeScript-Markdown",
  "name": "tsmd",
  "scopeName": "source.tsmd",
  "fileTypes": ["tsmd"]
}
```

## Main Pattern Hierarchy

The grammar follows a hierarchical structure with the following priority order:

1. **TSMD-specific constructs** (highest priority)
2. **TypeScript/TSX patterns** (inherited from source.tsx)
3. **Standard language constructs**

```json
{
  "patterns": [
    { "include": "#tsm-block" },
    { "include": "source.tsx#directives" },
    { "include": "source.tsx#statements" },
    { "include": "source.tsx#shebang" },
    { "include": "#comment-block" },
    { "include": "#comment-line" },
    // ... additional TypeScript patterns
  ]
}
```

## Core TSMD Constructs

### 1. TSM Blocks (`#tsm-block`)
**Purpose**: Main container for TSMD content
**Scope**: `meta.tsm-block.tsmd`
**Triggers**: `return (` or `=> (`
**End**: `)`

```json
{
  "tsm-block": {
    "name": "meta.tsm-block.tsmd",
    "begin": "(\\breturn\\s+\\(\\s*\\n?|=>\\s*\\()",
    "end": "\\)",
    "patterns": [
      { "include": "#tsm-markdown" },
      { "include": "#tsm-interpolation" },
      { "include": "#tsm-component" },
      { "include": "#tsm-xml-group" },
      { "include": "#tsm-comment" }
    ]
  }
}
```

### 2. TSM Interpolation (`#tsm-interpolation`)
**Purpose**: Dynamic content injection
**Scope**: `meta.interpolation.tsmd`
**Syntax**: `{{ ... }}`

```json
{
  "tsm-interpolation": {
    "name": "meta.interpolation.tsmd",
    "begin": "\\{\\{",
    "end": "\\}\\}",
    "patterns": [
      { "include": "#tsm-null-sentinel" },
      { "include": "#tsm-conditional-block" },
      { "include": "#tsm-component" },
      { "include": "#tsm-xml-group" },
      { "include": "#tsm-comment" },
      { "include": "#tsm-markdown" },
      { "include": "#tsm-expression" }
    ]
  }
}
```

### 3. TSM Components (`#tsm-component`)
**Purpose**: Custom component syntax
**Scope**: `meta.component.tsmd`
**Syntax**: `<@ComponentName>...</@ComponentName>` or `<@ComponentName />`

```json
{
  "tsm-component": {
    "name": "meta.component.tsmd",
    "begin": "<@([A-Za-z_][A-Za-z0-9_]*)",
    "end": "(/>)|(</@\\1>)",
    "patterns": [
      { "include": "#tsm-component-attributes" },
      { "include": "#tsm-interpolation" },
      { "include": "#tsm-component" },
      { "include": "#tsm-xml-group" },
      { "include": "#tsm-comment" },
      { "include": "#tsm-markdown" }
    ]
  }
}
```

### 4. TSM XML Groups (`#tsm-xml-group`)
**Purpose**: Standard XML/HTML elements
**Scope**: `meta.xml-group.tsmd`
**Syntax**: `<element>...</element>` or `<element />`

```json
{
  "tsm-xml-group": {
    "name": "meta.xml-group.tsmd",
    "begin": "<([A-Za-z_][A-Za-z0-9_]*)",
    "end": "(/>)|(</\\1>)",
    "patterns": [
      { "include": "#tsm-component-attributes" },
      { "include": "#tsm-interpolation" },
      { "include": "#tsm-component" },
      { "include": "#tsm-xml-group" },
      { "include": "#tsm-comment" },
      { "include": "#tsm-markdown" }
    ]
  }
}
```

### 5. TSM Conditional Blocks (`#tsm-conditional-block`)
**Purpose**: Conditional rendering
**Scope**: `meta.conditional-block.tsmd`
**Syntax**: `(?|&&|!) (content)`

```json
{
  "tsm-conditional-block": {
    "name": "meta.conditional-block.tsmd",
    "begin": "(\\?|&&|!)\\s*\\(",
    "end": "\\)",
    "patterns": [
      { "include": "#tsm-interpolation" },
      { "include": "#tsm-component" },
      { "include": "#tsm-xml-group" },
      { "include": "#tsm-comment" },
      { "include": "#tsm-markdown" }
    ]
  }
}
```

## Markdown Support (`#tsm-markdown`)

### Headings (H1-H6)
```json
{
  "markup.heading.1.tsmd": { "match": "^#{1}\\s+(.+)$" },
  "markup.heading.2.tsmd": { "match": "^#{2}\\s+(.+)$" },
  "markup.heading.3.tsmd": { "match": "^#{3}\\s+(.+)$" },
  "markup.heading.4.tsmd": { "match": "^#{4}\\s+(.+)$" },
  "markup.heading.5.tsmd": { "match": "^#{5}\\s+(.+)$" },
  "markup.heading.6.tsmd": { "match": "^#{6}\\s+(.+)$" }
}
```

### Text Formatting
```json
{
  "markup.bold.tsmd": { "match": "\\*\\*([^*]+)\\*\\*" },
  "markup.italic.tsmd": { "match": "\\*([^*]+)\\*" },
  "markup.inline.raw.tsmd": { "match": "`([^`]+)`" },
  "markup.underline.link.tsmd": { "match": "\\[([^\\]]+)\\]\\(([^)]+)\\)" },
  "markup.underline.link.image.tsmd": { "match": "!\\[([^\\]]*)\\]\\(([^)]+)\\)" }
}
```

### Lists and Quotes
```json
{
  "markup.list.unnumbered.tsmd": { "match": "^\\s*[-*+]\\s+(.+)$" },
  "markup.list.numbered.tsmd": { "match": "^\\s*\\d+\\.\\s+(.+)$" },
  "markup.quote.tsmd": { "match": "^\\s*>\\s*(.+)$" }
}
```

### Code Blocks
```json
{
  "markup.raw.block.tsmd": {
    "begin": "```",
    "end": "```"
  },
  "markup.raw.block.tsmd": {
    "begin": "~~~",
    "end": "~~~"
  }
}
```

## TypeScript Integration

### Expression Handling (`#tsm-expression`)
Comprehensive TypeScript expression support including all TSX patterns:

```json
{
  "tsm-expression": {
    "patterns": [
      { "include": "source.tsx#expression" },
      { "include": "source.tsx#expression-operators" },
      { "include": "source.tsx#ternary-expression" },
      { "include": "source.tsx#function-call" },
      { "include": "source.tsx#function-declaration" },
      { "include": "source.tsx#function-expression" },
      { "include": "source.tsx#arrow-function" },
      { "include": "source.tsx#class-declaration" },
      { "include": "source.tsx#interface-declaration" },
      { "include": "source.tsx#enum-declaration" },
      { "include": "source.tsx#object-literal" },
      { "include": "source.tsx#array-literal" },
      { "include": "source.tsx#type-annotation" },
      { "include": "source.tsx#type-parameters" },
      { "include": "source.tsx#template" },
      { "include": "source.tsx#template-substitution-element" },
      { "include": "source.tsx#jsx" }
    ]
  }
}
```

### Template Interpolation
```json
{
  "template-interpolation": {
    "name": "meta.embedded.expression.template.tsx",
    "begin": "\\$\\{",
    "end": "\\}",
    "patterns": [
      { "include": "#comment-block" },
      { "include": "#comment-line" },
      { "include": "#string" },
      { "include": "#template-string" },
      { "include": "#number" },
      { "include": "#storage-keyword" },
      { "include": "#modifier-keyword" },
      { "include": "#control-keyword" },
      { "include": "#operator-keyword" },
      { "include": "#type-builtin" },
      { "include": "#boolean-literal" },
      { "include": "#function-declaration" },
      { "include": "#arrow-function" },
      { "include": "#spread-operator" },
      { "include": "#type-annotation" },
      { "include": "#jsx-tag" }
    ]
  }
}
```

## Component System

### Component Attributes (`#tsm-component-attributes`)
```json
{
  "tsm-component-attributes": {
    "name": "meta.attributes.tsmd",
    "patterns": [
      {
        "name": "entity.other.attribute-name.tsmd",
        "match": "\\b([A-Za-z_][A-Za-z0-9_]*)\\s*="
      },
      {
        "name": "string.quoted.double.tsmd",
        "begin": "\"",
        "end": "\"",
        "patterns": [{ "include": "#tsm-interpolation" }]
      },
      {
        "name": "string.quoted.single.tsmd",
        "begin": "'",
        "end": "'",
        "patterns": [{ "include": "#tsm-interpolation" }]
      },
      {
        "name": "meta.attribute-expression.tsmd",
        "begin": "\\{",
        "end": "\\}",
        "patterns": [{ "include": "#tsm-expression" }]
      }
    ]
  }
}
```

## TypeScript Language Features

### Keywords and Storage Types
```json
{
  "storage-keyword": {
    "name": "storage.type.variable.tsx",
    "match": "\\b(const|let|var)\\b"
  },
  "modifier-keyword": {
    "name": "storage.modifier.tsx",
    "match": "\\b(public|private|protected|readonly|static|abstract|declare|override|async)\\b"
  },
  "control-keyword": {
    "name": "keyword.control.flow.tsx",
    "match": "\\b(if|else|switch|case|default|for|while|do|break|continue|return|yield|throw|try|catch|finally|await)\\b"
  },
  "type-keyword": {
    "name": "storage.type.tsx",
    "match": "\\b(class|interface|type|enum|namespace|module|extends|implements|super|this)\\b"
  }
}
```

### Literals and Primitives
```json
{
  "boolean-literal": {
    "name": "constant.language.boolean.tsx",
    "match": "\\b(true|false)\\b"
  },
  "number": {
    "name": "constant.numeric.tsx",
    "match": "(?<![$\\w])(0[xX][0-9A-Fa-f_]+|0[bB][01_]+|0[oO][0-7_]+|\\d[\\d_]*(\\\\.\\d[\\d_]*)?([eE][+-]?\\d[\\d_]*)?)(?![$\\w])"
  },
  "type-builtin": {
    "name": "support.type.primitive.tsx",
    "match": "\\b(string|number|boolean|any|unknown|never|void|null|undefined|object|symbol|bigint)\\b"
  }
}
```

### Strings and Templates
```json
{
  "string": {
    "patterns": [
      {
        "name": "string.quoted.double.tsx",
        "begin": "\"",
        "end": "\"",
        "patterns": [{ "name": "constant.character.escape.tsx", "match": "\\\\." }]
      },
      {
        "name": "string.quoted.single.tsx",
        "begin": "'",
        "end": "'",
        "patterns": [{ "name": "constant.character.escape.tsx", "match": "\\\\." }]
      }
    ]
  },
  "template-string": {
    "name": "string.template.tsx",
    "begin": "`",
    "end": "`",
    "patterns": [
      { "name": "constant.character.escape.tsx", "match": "\\\\." },
      { "include": "#template-interpolation" }
    ]
  }
}
```

## Syntax Highlighting Scope Names

### TSMD-Specific Scopes
- `meta.tsm-block.tsmd`
- `meta.interpolation.tsmd`
- `meta.component.tsmd`
- `meta.xml-group.tsmd`
- `meta.conditional-block.tsmd`
- `meta.attributes.tsmd`

### Markdown Scopes
- `markup.heading.N.tsmd` (N = 1-6)
- `markup.bold.tsmd`
- `markup.italic.tsmd`
- `markup.underline.link.tsmd`
- `markup.list.unnumbered.tsmd`
- `markup.list.numbered.tsmd`
- `markup.quote.tsmd`
- `markup.raw.block.tsmd`
- `markup.inline.raw.tsmd`

### TypeScript Scopes
- Inherits all standard TypeScript/TSX scopes
- Custom TSMD variants for enhanced highlighting

## Key Features Summary

1. **Hybrid Language Support**: Seamless integration of TypeScript and Markdown
2. **Dynamic Content**: Expression interpolation with `{{}}`
3. **Conditional Rendering**: Support for `?`, `&&`, `!` operators
4. **Component System**: Custom components with `<@ComponentName>`
5. **Rich Markdown**: Full Markdown syntax support
6. **TypeScript Integration**: Complete TypeScript language support
7. **Nested Patterns**: Recursive component and interpolation nesting
8. **Context-Aware Highlighting**: Priority-based pattern matching

This specification provides the foundation for a comprehensive TypeScript-Markdown hybrid language grammar that enables rich content creation with both programming constructs and document formatting.