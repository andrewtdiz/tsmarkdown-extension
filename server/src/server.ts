import {
    createConnection,
    ProposedFeatures,
    InitializeParams,
    InitializeResult,
    TextDocuments,
    TextDocumentSyncKind,
    CompletionItem,
    CompletionItemKind,
    TextDocumentPositionParams,
    Hover,
    MarkupKind,
  } from 'vscode-languageserver/node';
  
  import { TextDocument } from 'vscode-languageserver-textdocument';
  
  const connection = createConnection(ProposedFeatures.all);
  const documents = new TextDocuments(TextDocument);
  
  connection.onInitialize((params: InitializeParams): InitializeResult => {
    return {
      capabilities: {
        textDocumentSync: TextDocumentSyncKind.Incremental,
        completionProvider: { triggerCharacters: ['.', '{', '"', '\'', '`', '(', ':', '<'] },
        hoverProvider: true,
        definitionProvider: true,
        // add more as you implement
      }
    };
  });
  
  connection.onInitialized(() => {
    connection.console.log('TSMD server initialized');
  });
  
  // --- completions (stub) ---
  connection.onCompletion((_pos: TextDocumentPositionParams): CompletionItem[] => {
    // For now, a placeholder item so you know wiring works
    return [
      { label: 'tsmd:hello', kind: CompletionItemKind.Keyword, detail: 'Stub completion' }
    ];
  });
  
  // --- hover (stub) ---
  connection.onHover((_pos): Hover | null => {
    return {
      contents: { kind: MarkupKind.Markdown, value: 'TSMD language server is alive ✅' }
    };
  });
  
  documents.listen(connection);
  connection.listen();
  