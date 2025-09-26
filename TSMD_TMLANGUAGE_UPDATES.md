# TSMD TextMate Language Grammar - Recommended Updates

## Overview
Based on analysis of the current `tsmd.tmLanguage.json` implementation against the `TSMD_FILE_SPEC.md` requirements, this document outlines high-level recommended updates to improve syntax highlighting accuracy and completeness.

## Critical Issues Requiring Immediate Attention

### 1. TSM Block Detection Enhancement
**Current Issue**: TSM blocks are only recognized after `return (` or `=> (` but the spec allows them in any expression position.

**Current Pattern**: `(\\breturn\\s+\\(|=>\\s*\\()`
**Problems**:
- Missing support for TSM blocks in variable assignments, conditional branches, or ternaries
- Pattern doesn't handle newlines properly (`return (\n`)
- Limited to specific contexts only

**Recommended Fix**:
```json
{
  "tsm-block": {
    "name": "meta.tsm-block.tsmd",
    "begin": "\\(\\s*\\n?",
    "beginCaptures": {
      "0": {
        "name": "punctuation.section.block.begin.tsmd"
      }
    },
    "end": "\\)",
    "endCaptures": {
      "0": {
        "name": "punctuation.section.block.end.tsmd"
      }
    },
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

**Alternative Approach**: Create a context-aware pattern that recognizes TSM blocks when they contain markdown content:
```json
{
  "tsm-block": {
    "name": "meta.tsm-block.tsmd",
    "begin": "\\(\\s*(?=\\s*#|\\s*\\*|\\s*-|\\s*\\d+\\.|\\s*>|\\s*`|\\s*\\[|\\s*!)",
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

### 2. Conditional Block Syntax Completeness
**Current Issue**: Only supports `?` operator, missing `&&` and `!` operators, and incomplete ternary syntax.

**Current Pattern**: `(\\?|&&|!)\\s*\\(`
**Problems**:
- Missing support for full ternary: `condition ? block : block`
- Missing `&&` and `!` operator support
- Doesn't handle the `:` branch of ternary expressions

**Recommended Fix**:
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
  },
  "tsm-ternary-else": {
    "name": "meta.ternary-else.tsmd",
    "begin": "\\:\\s*\\(",
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

### 3. Component Tag End Pattern Fix
**Current Issue**: Malformed end pattern that doesn't properly validate component name matching.

**Current Pattern**: `(/>)|(</@([A-Za-z_][A-Za-z0-9_]*>)`
**Problems**:
- Missing back-reference to ensure closing tag matches opening tag
- Pattern structure is incorrect

**Recommended Fix**:
```json
{
  "tsm-component": {
    "name": "meta.component.tsmd",
    "begin": "<@([A-Za-z_][A-Za-z0-9_]*)",
    "beginCaptures": {
      "0": { "name": "punctuation.definition.tag.begin.tsmd" },
      "1": { "name": "entity.name.tag.component.tsmd" }
    },
    "end": "(/>)|(</@\\1>)",
    "endCaptures": {
      "1": { "name": "punctuation.definition.tag.self-closing.end.tsmd" },
      "2": { "name": "punctuation.definition.tag.end.tsmd" }
    },
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

### 4. XML Group (Wrapper) Tag Validation
**Current Issue**: Accepts self-closing syntax (`/>`) when wrapper tags must always have explicit closing tags.

**Current Pattern**: `(/>)|(</\\1>)`
**Problem**: Should only allow explicit closing tags for wrapper elements

**Recommended Fix**:
```json
{
  "tsm-xml-group": {
    "name": "meta.xml-group.tsmd",
    "begin": "<([A-Za-z_][A-Za-z0-9_]*)",
    "beginCaptures": {
      "0": { "name": "punctuation.definition.tag.begin.tsmd" },
      "1": { "name": "entity.name.tag.xml-group.tsmd" }
    },
    "end": "(</\\1>)",
    "endCaptures": {
      "1": { "name": "punctuation.definition.tag.end.tsmd" }
    },
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

## Enhancement Recommendations

### 5. Null Sentinel Highlighting
**Missing Feature**: Special highlighting for `{{ null }}` sentinel for line erasure.

**Recommended Addition**:
```json
{
  "tsm-null-sentinel": {
    "name": "keyword.control.null-sentinel.tsmd",
    "match": "\\{\\{\\s*null\\s*\\}\\}"
  }
}
```

### 6. Indentation-Aware Markdown Patterns
**Current Issue**: Markdown patterns require elements at column 0, but spec allows indented content.

**Current Pattern**: `^#{1}\\s+(.+)$`
**Problem**: Doesn't handle indented headings like `  # Title`

**Recommended Fix**:
```json
{
  "tsm-markdown": {
    "patterns": [
      {
        "name": "markup.heading.1.tsmd",
        "match": "^\\s*#{1}\\s+(.+)$"
      },
      {
        "name": "markup.heading.2.tsmd", 
        "match": "^\\s*#{2}\\s+(.+)$"
      },
      {
        "name": "markup.heading.3.tsmd",
        "match": "^\\s*#{3}\\s+(.+)$"
      },
      {
        "name": "markup.heading.4.tsmd",
        "match": "^\\s*#{4}\\s+(.+)$"
      },
      {
        "name": "markup.heading.5.tsmd",
        "match": "^\\s*#{5}\\s+(.+)$"
      },
      {
        "name": "markup.heading.6.tsmd",
        "match": "^\\s*#{6}\\s+(.+)$"
      }
    ]
  }
}
```

### 7. Whitespace Preservation Patterns
**Missing Feature**: Explicit patterns for whitespace preservation and empty line handling.

**Recommended Addition**:
```json
{
  "tsm-whitespace": {
    "patterns": [
      {
        "name": "markup.whitespace.preserved.tsmd",
        "match": "^\\s*$"
      },
      {
        "name": "markup.whitespace.indentation.tsmd",
        "match": "^(\\s+)(.+)$",
        "captures": {
          "1": { "name": "punctuation.whitespace.indentation.tsmd" },
          "2": { "name": "markup.content.tsmd" }
        }
      }
    ]
  }
}
```

### 8. Enhanced Expression Context Awareness
**Current Issue**: TSM expressions need better context awareness for different usage scenarios.

**Recommended Enhancement**:
```json
{
  "tsm-expression-context": {
    "patterns": [
      {
        "include": "#tsm-expression-in-interpolation"
      },
      {
        "include": "#tsm-expression-in-attribute"
      },
      {
        "include": "#tsm-expression-in-template"
      }
    ]
  }
}
```

## Pattern Optimization Recommendations

### 9. Consolidate Duplicate Markdown Patterns
**Current Issue**: Multiple similar markdown patterns scattered throughout the grammar.

**Recommendation**: Consolidate all markdown patterns under `#tsm-markdown` and remove duplicates.

### 10. Improve Pattern Performance
**Recommendations**:
- Use more specific lookahead patterns to avoid unnecessary backtracking
- Optimize regex patterns for better performance
- Consider using `beginCaptures` and `endCaptures` more consistently

### 11. Enhanced Error Recovery
**Recommendation**: Add patterns for malformed syntax to provide better error highlighting:
```json
{
  "tsm-error-recovery": {
    "patterns": [
      {
        "name": "invalid.illegal.tsmd",
        "match": "\\{\\{[^}]*$"
      },
      {
        "name": "invalid.illegal.tsmd", 
        "match": "<@[^>]*$"
      }
    ]
  }
}
```

## Implementation Priority

### Phase 1 (Critical - Immediate)
1. Fix TSM block detection for all expression contexts
2. Complete conditional block syntax support (`&&`, `!`, ternary `:`)
3. Fix component tag end pattern validation
4. Remove self-closing syntax from XML group tags

### Phase 2 (Important - Next Sprint)
5. Add null sentinel highlighting
6. Fix indentation-aware markdown patterns
7. Add whitespace preservation patterns
8. Consolidate duplicate patterns

### Phase 3 (Enhancement - Future)
9. Enhanced expression context awareness
10. Pattern performance optimization
11. Error recovery patterns
12. Advanced whitespace handling

## Testing Recommendations

### Test Cases to Add
1. **TSM Block Context Tests**:
   - `const content = ( # Title )`
   - `condition ? ( # Branch A ) : ( # Branch B )`
   - `value && ( - Item )`

2. **Conditional Syntax Tests**:
   - `{{ condition && ( # Content ) }}`
   - `{{ !condition && ( # Alternative ) }}`
   - `{{ condition ? ( # True ) : ( # False ) }}`

3. **Component Validation Tests**:
   - `<@Component>...</@Component>` (valid)
   - `<@Component>...</@Other>` (invalid - should highlight error)
   - `<content>...</content>` (valid wrapper)
   - `<content />` (invalid - should highlight error)

4. **Indentation Tests**:
   - `  # Indented Heading`
   - `    - Indented List Item`
   - `  > Indented Quote`

This comprehensive update plan addresses the major gaps between the current implementation and the specification requirements, providing a roadmap for improving the TSMD syntax highlighting accuracy and completeness.



