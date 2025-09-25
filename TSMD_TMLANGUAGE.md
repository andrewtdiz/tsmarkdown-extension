# TSMD TextMate Language Grammar Analysis

## Overview
The `tsmd.tmLanguage.json` file defines a TextMate grammar for TypeScript-Markdown (TSMD) files. This grammar combines TypeScript/TSX syntax highlighting with Markdown formatting and introduces custom TSMD-specific constructs.

## File Structure

### Basic Configuration
- **Display Name**: "TypeScript-Markdown"
- **Name**: "tsmd"
- **Scope Name**: "source.tsmd"
- **File Types**: ["tsmd"]

### Main Pattern Hierarchy
The grammar follows a hierarchical pattern structure where the main patterns include:

1. **TSMD-specific patterns** (highest priority)
2. **TypeScript/TSX patterns** (inherited from source.tsx)
3. **Standard language constructs**

## Core TSMD Constructs

### 1. TSM Blocks (`#tsm-block`)
- **Purpose**: Main container for TSMD content
- **Trigger**: `return (` or `=> (`
- **End**: `)`
- **Contains**: Markdown, interpolation, components, XML groups, comments

### 2. TSM Interpolation (`#tsm-interpolation`)
- **Purpose**: Dynamic content injection
- **Syntax**: `{{ ... }}`
- **Features**:
  - Null sentinel support (`null`)
  - Conditional blocks (`?`, `&&`, `!`)
  - Nested components and XML groups
  - Full TypeScript expression support

### 3. TSM Components (`#tsm-component`)
- **Purpose**: Custom component syntax
- **Syntax**: `<@ComponentName>...</@ComponentName>` or `<@ComponentName />`
- **Features**:
  - Attribute support with string interpolation
  - Expression attributes `{...}`
  - Nested components and XML groups

### 4. TSM XML Groups (`#tsm-xml-group`)
- **Purpose**: Standard XML/HTML elements
- **Syntax**: `<element>...</element>` or `<element />`
- **Features**: Similar to components but for standard HTML elements

### 5. TSM Conditional Blocks (`#tsm-conditional-block`)
- **Purpose**: Conditional rendering
- **Syntax**: `(?|&&|!) (content)`
- **Operators**: `?` (ternary), `&&` (logical AND), `!` (negation)

## Markdown Support (`#tsm-markdown`)

### Headings
- H1-H6: `#`, `##`, `###`, `####`, `#####`, `######`
- Individual patterns for each level

### Text Formatting
- **Bold**: `**text**`
- **Italic**: `*text*`
- **Inline Code**: `` `code` ``
- **Links**: `[text](url)`
- **Images**: `![alt](url)`

### Lists
- **Unordered**: `-`, `*`, `+` followed by space
- **Ordered**: `1.`, `2.`, etc. followed by space

### Other Elements
- **Blockquotes**: `> text`
- **Code Blocks**: ``` or ~~~
- **Quotes**: `"text"` and `'text'`
- **Whitespace**: Preserved indentation

## TypeScript Integration

### Inherited Patterns
The grammar heavily leverages TypeScript/TSX patterns:
- **Expressions**: Full TypeScript expression support
- **Functions**: Arrow functions, function declarations
- **Types**: Classes, interfaces, type aliases, enums
- **Keywords**: Storage, modifiers, control flow, operators
- **Literals**: Strings, numbers, booleans, regex
- **JSX**: Full JSX support for components

### Custom TypeScript Features
- **Type Annotations**: `: type`
- **Generics**: `<T>`
- **Type Operators**: `&`, `|`, `?`
- **Template Strings**: Backtick strings with `${}` interpolation

## Expression Handling

### TSM Expression (`#tsm-expression`)
Comprehensive TypeScript expression support including:
- All TSX expression patterns
- Function calls and declarations
- Object and array literals
- Type annotations and generics
- Control statements (if, switch, for, etc.)
- JSX elements and attributes

### Template Interpolation
- **Syntax**: `${expression}`
- **Support**: Full TypeScript expressions within template strings

## Component System

### Component Attributes (`#tsm-component-attributes`)
- **Named attributes**: `name="value"`
- **String interpolation**: `"{{expression}}"`
- **Expression attributes**: `{expression}`
- **Quoted strings**: Both single and double quotes supported

### Nested Content
Components and XML groups support:
- Nested interpolation
- Nested components
- Nested XML groups
- Comments
- Markdown content

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

### TypeScript Scopes
- Inherits all standard TypeScript/TSX scopes
- Custom TSMD variants for enhanced highlighting

## Key Features

### 1. Hybrid Language Support
- Seamless integration of TypeScript and Markdown
- Context-aware syntax highlighting
- Nested content support

### 2. Dynamic Content
- Expression interpolation with `{{}}`
- Conditional rendering
- Component composition

### 3. Rich Markdown
- Full Markdown syntax support
- Custom TSMD extensions
- Preserved whitespace and indentation

### 4. TypeScript Integration
- Complete TypeScript language support
- JSX/TSX compatibility
- Type system integration

## Pattern Matching Strategy

### Priority Order
1. TSMD-specific constructs (blocks, interpolation, components)
2. TypeScript/TSX language features
3. Standard Markdown elements
4. Comments and whitespace

### Nested Pattern Support
- Recursive component nesting
- Interpolation within interpolation
- Markdown within TypeScript expressions
- TypeScript within Markdown content

This grammar provides a comprehensive foundation for a TypeScript-Markdown hybrid language, enabling rich content creation with both programming constructs and document formatting.
