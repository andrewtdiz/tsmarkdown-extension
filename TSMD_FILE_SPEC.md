# tsmd Syntax Specification

## 1. Overview
tsmd extends TypeScript with markdown first literals called TSM blocks. Files contain regular TypeScript code plus blocks that produce markdown strings. A TSM block is a parenthesized markdown segment that can appear wherever an expression is valid, most commonly as the operand of `return`.

## 2. TSM blocks
- Start with `return (\n` or arrow notation and end with `)`; the body is parsed line by line using markdown rules plus the tsmd constructs described below.
- Blocks may span multiple lines or be single line statements such as `return (**API Error**)`.
- Blocks can be used in any expression position (function returns, variable assignments, conditional branches, ternaries).
- Content inside a block is evaluated in order from top to bottom.

## 3. Plain markdown content
- Any text outside the reserved syntax tokens is emitted verbatim and treated as markdown (headings, lists, emphasis, code blocks, and so on).
- Empty lines generate blank markdown lines. Indentation is preserved.
- To include literal sequences that resemble control tokens (`{{` or `<@`), split the text with interpolations or restructure the content; there is no dedicated escape prefix.

## 4. Interpolations `{{ ... }}`
- `{{` begins an interpolation and `}}` ends it. Optional whitespace may surround the inner expression.
- The inner expression must be valid TypeScript with balanced delimiters.
- At runtime the value is converted to text: strings are passed through, numbers and booleans are stringified, and falsy values (`false`, `null`, `undefined`, empty string) emit nothing and do not add whitespace.
- Interpolations can appear inline with other text or stand on their own lines.
- Parenthesized expressions inside an interpolation can introduce nested TSM blocks, enabling multi line conditional content.

### 4.1 Conditional forms inside interpolations
- Conditional logic uses standard TypeScript operators within the interpolation.
- Supported idioms:
  - `{{ condition ? ( ...block... ) : ( ...block... ) }}` selects one of two nested blocks.
  - `{{ condition && ( ...block... ) }}` renders the nested block only when the condition is truthy.
  - `{{ !condition && ( ...block... ) }}` renders the block when the condition is falsy.
- Nested blocks inside these expressions follow all block rules and may contain text, components, or further interpolations.

### 4.2 Line erase sentinel
- `{{ null }}` acts as a directive to remove the most recently emitted empty line. Use it after conditional sections when a blank line would otherwise remain.

## 5. Component tags `<@Component>`
- Component tags start with `<@` and end with `>` or `/>`. The component name must be a valid TypeScript identifier and the closing tag must match exactly (`</@ComponentName>`).
- Self closing form: `<@ComponentName />`.
- Block form: `<@ComponentName attr="value"> ...child content... </@ComponentName>`.
- Children are parsed as normal TSM lines and can include any tsmd constructs.
- Attributes use JSX style syntax:
  - `name="string"` for literal values.
  - `name={ expression }` for dynamic values.
- Attribute names follow identifier rules. Boolean shorthand without a value is not part of the syntax.

## 6. Structural wrapper tags `<tag>`
- Tags without the `@` sigil (for example `<content> ... </content>`) act as logical groupings.
- Wrapper tags use the same attribute rules as components.
- Wrappers do not render their own text; only their children are emitted.
- Wrapper tags must always have an explicit closing tag.

## 7. Whitespace rules
- Markdown text keeps the original spaces and indentation.
- Interpolations that evaluate to no output do not leave placeholder spaces or blank lines.
- Trailing newlines appear in the final output only if the block source ends with a newline.
- Use `{{ null }}` to aggressively remove stray blank lines when needed.

## 8. Interaction with surrounding TypeScript
- Outside of TSM blocks, the file is standard TypeScript: imports, variable declarations, control flow, and helper functions work unchanged.
- Functions may return `false` (or another falsy value) to signal that nothing should be rendered.
- TSM blocks can appear anywhere a string result is expected (return statements, variable initializers, expression branches).

## 9. Examples

### 9.1 Basic return
```ts
export function renderUser(user: User) {
  return (
    # {{ user.name }}
    - Email: {{ user.email }}
    {{ user.bio && (
      Bio:
      {{ user.bio }}
    ) }}
  )
}
```

### 9.2 Components and wrappers
```ts
return (
  <content>
    <@Callout tone="info">
      **Heads up:** data refreshes every {{ refreshInterval }} minutes.
    </@Callout>

    <@Dashboard filters={filters} />
  </content>
)
```
