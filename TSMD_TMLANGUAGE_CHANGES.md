# Recommended Changes to TSMD TextMate Language Grammar

## Overview
Based on the implementation specification in `TSMD_IMPLEMENTATION.md`, several critical changes are needed to align the TextMate grammar with the actual TSM language semantics and syntax requirements.

## 1. Critical Block Detection Issues

### Current Problem
The current `tsm-block` pattern uses regex `(\\breturn\\s+\\(\\s*\\n?|=>\\s*\\()` which is too restrictive and doesn't match the specification.

### Required Changes
- **Fix Block Detection**: The spec requires detection of `return (\n ... )` where the `(` is followed by a newline before any non-whitespace content
- **Add Single-Line Support**: Support `return "**API Error**"` as a single-line block
- **Improve Pattern Matching**: The current regex doesn't properly handle the newline requirement

### Recommended Pattern
```json
"tsm-block": {
  "name": "meta.tsm-block.tsmd",
  "begin": "(\\breturn\\s+\\(\\s*\\n|=>\\s*\\(\\s*\\n)",
  "beginCaptures": {
    "1": {
      "name": "keyword.control.return.tsmd"
    },
    "2": {
      "name": "storage.type.function.arrow.tsmd"
    }
  },
  "end": "\\)",
  "endCaptures": {
    "0": {
      "name": "punctuation.section.block.end.tsmd"
    }
  }
}
```

## 2. Context-Aware Interpolation Highlighting

### Current Problem
The grammar doesn't distinguish between inline and block context for interpolations, which is crucial for proper syntax highlighting.

### Required Changes
- **Inline Context Detection**: Interpolations with non-whitespace before `{{` on the same line
- **Block Context Detection**: Interpolations where `{{` is the first non-whitespace character
- **Different Scoping**: Different scope names for inline vs block interpolations

### Recommended Patterns
```json
"tsm-interpolation-inline": {
  "name": "meta.interpolation.inline.tsmd",
  "begin": "(?<!^\\s*)\\{\\{",
  "end": "\\}\\}",
  "patterns": [
    { "include": "#tsm-expression" }
  ]
},
"tsm-interpolation-block": {
  "name": "meta.interpolation.block.tsmd", 
  "begin": "^\\s*\\{\\{",
  "end": "\\}\\}",
  "patterns": [
    { "include": "#tsm-expression" }
  ]
}
```

## 3. Enhanced Conditional Block Support

### Current Problem
The current `tsm-conditional-block` pattern is too simplistic and doesn't handle the full range of conditional expressions specified.

### Required Changes
- **Ternary Support**: `{{ cond ? (Block) : (Block) }}`
- **Logical AND**: `{{ cond && (Block) }}`
- **Logical NOT**: `{{ !cond && (Block) }}`
- **Nested Block Support**: Conditional blocks can contain nested TSM blocks

### Recommended Pattern
```json
"tsm-conditional-block": {
  "name": "meta.conditional-block.tsmd",
  "begin": "(\\?|&&|!)\\s*\\(",
  "beginCaptures": {
    "1": {
      "name": "keyword.operator.conditional.tsmd"
    }
  },
  "end": "\\)",
  "patterns": [
    { "include": "#tsm-interpolation" },
    { "include": "#tsm-component" },
    { "include": "#tsm-xml-group" },
    { "include": "#tsm-comment" },
    { "include": "#tsm-markdown" },
    { "include": "#tsm-block" }
  ]
}
```

## 4. Component Attribute Enhancements

### Current Problem
The current component attribute patterns don't fully support the specification requirements.

### Required Changes
- **Expression Attributes**: Support `{expr}` syntax for dynamic attributes
- **String Interpolation**: Support `"{{expr}}"` within attribute values
- **Type Safety**: Better highlighting for different attribute types

### Recommended Pattern
```json
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
      "patterns": [
        { "include": "#tsm-interpolation" }
      ]
    },
    {
      "name": "meta.attribute-expression.tsmd",
      "begin": "\\{",
      "end": "\\}",
      "patterns": [
        { "include": "#tsm-expression" }
      ]
    }
  ]
}
```

## 5. Comment Handling Inside Blocks

### Current Problem
The specification requires that lines beginning with `//` inside TSM blocks are treated as authoring comments and not emitted.

### Required Changes
- **Comment Detection**: Identify `//` comments within TSM blocks
- **Special Scoping**: Different scope names for TSM block comments vs regular TypeScript comments
- **Preserve Newlines**: Comments should preserve their trailing newlines for visual separation

### Recommended Pattern
```json
"tsm-comment": {
  "name": "comment.line.double-slash.tsmd",
  "match": "^\\s*//.*$"
}
```

## 6. Enhanced Markdown Support

### Current Problem
The current markdown patterns are basic and don't fully support the rich markdown features specified.

### Required Changes
- **Better Heading Detection**: More robust heading patterns
- **List Item Support**: Enhanced list item detection with proper nesting
- **Code Block Support**: Better fenced code block detection
- **Link and Image Support**: Enhanced link and image pattern matching

### Recommended Patterns
```json
"tsm-markdown": {
  "patterns": [
    {
      "name": "markup.heading.tsmd",
      "match": "^(#{1,6})\\s+(.+)$",
      "captures": {
        "1": { "name": "punctuation.definition.heading.tsmd" },
        "2": { "name": "entity.name.section.markdown.tsmd" }
      }
    },
    {
      "name": "markup.list.unnumbered.tsmd",
      "match": "^\\s*[-*+]\\s+(.+)$"
    },
    {
      "name": "markup.list.numbered.tsmd", 
      "match": "^\\s*\\d+\\.\\s+(.+)$"
    },
    {
      "name": "markup.fenced_code.block.tsmd",
      "begin": "^(\\s*)(```|~~~)([^`~]*)$",
      "end": "^(\\s*)(```|~~~)\\s*$"
    }
  ]
}
```

## 7. Null Sentinel Support

### Current Problem
The specification includes special handling for `null` values that remove the previous line, but this isn't properly highlighted.

### Required Changes
- **Null Sentinel Detection**: Special highlighting for `{{ null }}` expressions
- **Context Awareness**: Different highlighting based on inline vs block context

### Recommended Pattern
```json
"tsm-null-sentinel": {
  "name": "keyword.control.null-sentinel.tsmd",
  "match": "\\bnull\\b"
}
```

## 8. Indentation and Whitespace Handling

### Current Problem
The current grammar doesn't properly handle the complex indentation rules specified.

### Required Changes
- **Baseline Indent Detection**: Identify the baseline indent for each TSM region
- **Preserve Extra Spaces**: Maintain spaces beyond the baseline indent
- **Empty Line Preservation**: Preserve intentional empty lines within blocks

### Recommended Pattern
```json
"tsm-whitespace": {
  "name": "punctuation.whitespace.tsmd",
  "match": "^\\s+$"
}
```

## 9. Error Handling and Diagnostics

### Current Problem
The grammar doesn't provide scope names that would help with error detection and diagnostics.

### Required Changes
- **Error Scope Names**: Add scope names for common error patterns
- **Unbalanced Delimiters**: Detect unbalanced `{{ }}` or `</>` tags
- **Missing Imports**: Highlight undefined component references

### Recommended Patterns
```json
"tsm-error-unbalanced": {
  "name": "invalid.illegal.unbalanced.tsmd",
  "match": "\\{\\{[^}]*$"
},
"tsm-error-unclosed": {
  "name": "invalid.illegal.unclosed.tsmd", 
  "match": "<@[A-Za-z_][A-Za-z0-9_]*[^/>]*$"
}
```

## 10. Performance and Maintainability

### Current Problem
The current grammar has some performance issues and could be better organized.

### Required Changes
- **Pattern Optimization**: Reorder patterns for better performance
- **Reduce Redundancy**: Eliminate duplicate patterns
- **Better Organization**: Group related patterns together
- **Documentation**: Add comments explaining complex patterns

## Implementation Priority

### High Priority (Critical)
1. Fix block detection pattern
2. Add context-aware interpolation highlighting
3. Enhance conditional block support
4. Add proper comment handling

### Medium Priority (Important)
5. Improve component attribute patterns
6. Enhance markdown support
7. Add null sentinel support
8. Improve whitespace handling

### Low Priority (Nice to Have)
9. Add error handling patterns
10. Optimize performance and organization

## Testing Recommendations

### Grammar Testing
- Test all block detection scenarios
- Verify context-aware interpolation highlighting
- Test conditional block patterns
- Validate markdown pattern matching

### Integration Testing
- Test with real TSM files
- Verify syntax highlighting accuracy
- Test edge cases and error conditions
- Validate performance with large files

## Conclusion

These changes will align the TextMate grammar with the TSM language specification, providing accurate syntax highlighting and better developer experience. The changes focus on the core language constructs while maintaining compatibility with existing TypeScript and Markdown patterns.
