#!/bin/bash

echo "🔄 Updating TS Markdown extension..."

# Package the extension
echo "📦 Packaging extension..."
vsce package

# Install the updated extension
echo "⬇️ Installing updated extension..."
code --install-extension tsmarkdown-extension-1.0.5.vsix --force

echo "✅ Extension updated successfully!"
echo "💡 You may need to reload Cursor to see changes in existing files."
