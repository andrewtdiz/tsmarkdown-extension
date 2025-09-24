# TSMD Syntax Highlighting Discrepancies

## Overview
This document outlines discrepancies between the current syntax highlighting implementation in `tsmd.tmLanguage.json` and the requirements specified in `TSMD_FILE_SPEC.md`.

## Key Discrepancies

### 1. TSM Block Detection Issues

**Specification**: TSM blocks start with `return (\n` or arrow notation and end with `)`

**Current Implementation**: 
- Pattern: `(\\breturn\\s+\\(|=>\\s*\\()`
- Issues:
  - Only matches `return (` or `=> (` but spec allows `return (\n` (with newline)
  - Missing support for arrow functions that don't immediately follow `=>`
  - Doesn't handle cases where TSM blocks appear in other expression contexts

**Required Fix**: Update pattern to handle newlines and various expression contexts

### 2. Conditional Block Syntax Mismatch

**Specification**: Conditional logic uses `{{ condition ? ( ...block... ) : ( ...block... ) }}`

**Current Implementation**:
- Pattern: `\\?\\s*\\(` (matches `? (`)
- Issues:
  - Only matches the `?` operator, missing `&&` and `!` operators
  - Doesn't handle the full ternary syntax `condition ? block : block`
  - Missing support for `{{ condition && ( ...block... ) }}` and `{{ !condition && ( ...block... ) }}`

**Required Fix**: Add patterns for all conditional operators and full ternary syntax

### 3. Component Tag Syntax Issues

**Specification**: Component tags start with `<@` and end with `>` or `/>`

**Current Implementation**:
- Pattern: `<@([A-Za-z_][A-Za-z0-9_]*)`
- Issues:
  - Correctly matches `<@Component` but the end pattern is overly complex
  - End pattern: `(/>)|(</@([A-Za-z_][A-Za-z0-9_]*>)` 
  - The closing tag pattern doesn't properly validate that the component name matches

**Required Fix**: Simplify and fix the end pattern to properly match component names

### 4. XML Group (Wrapper) Tag Issues

**Specification**: Tags without `@` sigil act as logical groupings (e.g., `<content> ... </content>`)

**Current Implementation**:
- Pattern: `<([A-Za-z_][A-Za-z0-9_]*)`
- Issues:
  - Matches any tag without `@`, but doesn't distinguish between XML groups and regular HTML
  - No validation that wrapper tags must have explicit closing tags
  - Missing requirement that wrappers don't render their own text

**Required Fix**: Add validation for wrapper tag requirements

### 5. Interpolation Expression Handling

**Specification**: Interpolations contain valid TypeScript with balanced delimiters

**Current Implementation**:
- Pattern: `\\{\\{` to `\\}\\}`
- Issues:
  - The `#tsm-expression` pattern includes many TypeScript constructs
  - Missing specific handling for the `{{ null }}` line erase sentinel
  - No special highlighting for falsy value handling

**Required Fix**: Add specific patterns for `{{ null }}` and improve expression highlighting

### 6. Markdown Content Handling

**Specification**: Plain markdown content is emitted verbatim with preserved indentation

**Current Implementation**:
- Has separate patterns for markdown inside TSM blocks (`#tsm-markdown`) and outside (`#markdown-*`)
- Issues:
  - Duplicate markdown patterns that may conflict
  - No special handling for empty lines or indentation preservation
  - Missing support for literal sequences that resemble control tokens

**Required Fix**: Consolidate markdown patterns and add whitespace handling

### 7. Attribute Syntax Issues

**Specification**: Attributes use JSX style syntax with `name="string"` and `name={ expression }`

**Current Implementation**:
- Pattern in `#tsm-component-attributes`
- Issues:
  - Correctly handles string and expression attributes
  - Missing validation that boolean shorthand is not supported
  - No special highlighting for dynamic vs literal attributes

**Required Fix**: Add validation for boolean shorthand and improve attribute highlighting

### 8. Whitespace and Line Handling

**Specification**: 
- Markdown text keeps original spaces and indentation
- Interpolations that evaluate to no output don't leave placeholder spaces
- Use `{{ null }}` to remove stray blank lines

**Current Implementation**:
- Missing specific patterns for whitespace handling
- No special treatment for empty lines
- No highlighting for the `{{ null }}` sentinel

**Required Fix**: Add whitespace preservation patterns and null sentinel highlighting

## Priority Fixes

1. **High Priority**: Fix TSM block detection to handle newlines and various contexts
2. **High Priority**: Add support for all conditional operators (`?`, `&&`, `!`)
3. **Medium Priority**: Fix component tag end pattern validation
4. **Medium Priority**: Add `{{ null }}` sentinel highlighting
5. **Low Priority**: Consolidate duplicate markdown patterns
6. **Low Priority**: Add whitespace preservation highlighting

## Implementation Notes

- The current implementation has good coverage of basic TypeScript and markdown syntax
- Main issues are in the TSM-specific constructs (blocks, interpolations, components)
- Most TypeScript patterns are correctly inherited from `source.tsx`
- Need to focus on the unique TSM syntax elements that aren't standard TypeScript or markdown
