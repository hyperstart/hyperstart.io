// this file is used to avoid to import typescript's types

/**
 * A linked list of formatted diagnostic messages to be used as part of a multiline message.
 * It is built from the bottom up, leaving the head to be the "main" diagnostic.
 * While it seems that DiagnosticMessageChain is structurally similar to DiagnosticMessage,
 * the difference is that messages are all preformatted in DMC.
 */
export interface DiagnosticMessageChain {
  messageText: string
  category: DiagnosticCategory
  code: number
  next?: DiagnosticMessageChain
}

export interface Diagnostic {
  messageText: string | DiagnosticMessageChain
  category: DiagnosticCategory
  code: number
  source?: string
  file?: any
  start?: number
  length?: number
}

export enum DiagnosticCategory {
  Warning = 0,
  Error = 1,
  Message = 2
}

export interface EmitOutput {
  outputFiles: OutputFile[]
  emitSkipped: boolean
}

export interface OutputFile {
  name: string
  writeByteOrderMark: boolean
  text: string
}

export interface LanguageService {
  cleanupSemanticCache(): void
  getSyntacticDiagnostics(fileName: string): Diagnostic[]
  getSemanticDiagnostics(fileName: string): Diagnostic[]
  getCompilerOptionsDiagnostics(): Diagnostic[]
  // import only if necessary...
  // /**
  //  * @deprecated Use getEncodedSyntacticClassifications instead.
  //  */
  // getSyntacticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
  // /**
  //  * @deprecated Use getEncodedSemanticClassifications instead.
  //  */
  // getSemanticClassifications(fileName: string, span: TextSpan): ClassifiedSpan[];
  // getEncodedSyntacticClassifications(fileName: string, span: TextSpan): Classifications;
  // getEncodedSemanticClassifications(fileName: string, span: TextSpan): Classifications;
  // getCompletionsAtPosition(fileName: string, position: number, options: GetCompletionsAtPositionOptions | undefined): CompletionInfo;
  // getCompletionEntryDetails(fileName: string, position: number, name: string, options: FormatCodeOptions | FormatCodeSettings | undefined, source: string | undefined): CompletionEntryDetails;
  // getCompletionEntrySymbol(fileName: string, position: number, name: string, source: string | undefined): Symbol;
  // getQuickInfoAtPosition(fileName: string, position: number): QuickInfo;
  // getNameOrDottedNameSpan(fileName: string, startPos: number, endPos: number): TextSpan;
  // getBreakpointStatementAtPosition(fileName: string, position: number): TextSpan;
  // getSignatureHelpItems(fileName: string, position: number): SignatureHelpItems;
  // getRenameInfo(fileName: string, position: number): RenameInfo;
  // findRenameLocations(fileName: string, position: number, findInStrings: boolean, findInComments: boolean): RenameLocation[];
  // getDefinitionAtPosition(fileName: string, position: number): DefinitionInfo[];
  // getTypeDefinitionAtPosition(fileName: string, position: number): DefinitionInfo[];
  // getImplementationAtPosition(fileName: string, position: number): ImplementationLocation[];
  // getReferencesAtPosition(fileName: string, position: number): ReferenceEntry[];
  // findReferences(fileName: string, position: number): ReferencedSymbol[];
  // getDocumentHighlights(fileName: string, position: number, filesToSearch: string[]): DocumentHighlights[];
  // /** @deprecated */
  // getOccurrencesAtPosition(fileName: string, position: number): ReferenceEntry[];
  // getNavigateToItems(searchValue: string, maxResultCount?: number, fileName?: string, excludeDtsFiles?: boolean): NavigateToItem[];
  // getNavigationBarItems(fileName: string): NavigationBarItem[];
  // getNavigationTree(fileName: string): NavigationTree;
  // getOutliningSpans(fileName: string): OutliningSpan[];
  // getTodoComments(fileName: string, descriptors: TodoCommentDescriptor[]): TodoComment[];
  // getBraceMatchingAtPosition(fileName: string, position: number): TextSpan[];
  // getIndentationAtPosition(fileName: string, position: number, options: EditorOptions | EditorSettings): number;
  // getFormattingEditsForRange(fileName: string, start: number, end: number, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
  // getFormattingEditsForDocument(fileName: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
  // getFormattingEditsAfterKeystroke(fileName: string, position: number, key: string, options: FormatCodeOptions | FormatCodeSettings): TextChange[];
  // getDocCommentTemplateAtPosition(fileName: string, position: number): TextInsertion;
  // isValidBraceCompletionAtPosition(fileName: string, position: number, openingBrace: number): boolean;
  // getSpanOfEnclosingComment(fileName: string, position: number, onlyMultiLine: boolean): TextSpan;
  // getCodeFixesAtPosition(fileName: string, start: number, end: number, errorCodes: number[], formatOptions: FormatCodeSettings): CodeAction[];
  // applyCodeActionCommand(action: CodeActionCommand): Promise<ApplyCodeActionCommandResult>;
  // applyCodeActionCommand(action: CodeActionCommand[]): Promise<ApplyCodeActionCommandResult[]>;
  // applyCodeActionCommand(action: CodeActionCommand | CodeActionCommand[]): Promise<ApplyCodeActionCommandResult | ApplyCodeActionCommandResult[]>;
  // /** @deprecated `fileName` will be ignored */
  // applyCodeActionCommand(fileName: string, action: CodeActionCommand): Promise<ApplyCodeActionCommandResult>;
  // /** @deprecated `fileName` will be ignored */
  // applyCodeActionCommand(fileName: string, action: CodeActionCommand[]): Promise<ApplyCodeActionCommandResult[]>;
  // /** @deprecated `fileName` will be ignored */
  // applyCodeActionCommand(fileName: string, action: CodeActionCommand | CodeActionCommand[]): Promise<ApplyCodeActionCommandResult | ApplyCodeActionCommandResult[]>;
  // getApplicableRefactors(fileName: string, positionOrRaneg: number | TextRange): ApplicableRefactorInfo[];
  // getEditsForRefactor(fileName: string, formatOptions: FormatCodeSettings, positionOrRange: number | TextRange, refactorName: string, actionName: string): RefactorEditInfo | undefined;
  // getEmitOutput(fileName: string, emitOnlyDtsFiles?: boolean): EmitOutput;
  // getProgram(): Program;
  // dispose(): void;
}
