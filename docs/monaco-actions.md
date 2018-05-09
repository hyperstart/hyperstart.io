```javascript
const actions = [
  {
    id: "editor.action.moveCarretLeftAction",
    label: "Move Caret Left",
    alias: "Move Caret Left",
    _precondition: e
  },
  {
    id: "editor.action.moveCarretRightAction",
    label: "Move Caret Right",
    alias: "Move Caret Right",
    _precondition: e
  },
  {
    id: "editor.action.transposeLetters",
    label: "Transpose Letters",
    alias: "Transpose Letters",
    _precondition: e
  },
  {
    id: "editor.action.commentLine",
    label: "Toggle Line Comment",
    alias: "Toggle Line Comment",
    _precondition: e
  },
  {
    id: "editor.action.addCommentLine",
    label: "Add Line Comment",
    alias: "Add Line Comment",
    _precondition: e
  },
  {
    id: "editor.action.removeCommentLine",
    label: "Remove Line Comment",
    alias: "Remove Line Comment",
    _precondition: e
  },
  {
    id: "editor.action.blockComment",
    label: "Toggle Block Comment",
    alias: "Toggle Block Comment",
    _precondition: e
  },
  { id: "actions.find", label: "Find", alias: "Find", _precondition: null },
  {
    id: "editor.action.nextMatchFindAction",
    label: "Find Next",
    alias: "Find Next",
    _precondition: null
  },
  {
    id: "editor.action.previousMatchFindAction",
    label: "Find Previous",
    alias: "Find Previous",
    _precondition: null
  },
  {
    id: "editor.action.nextSelectionMatchFindAction",
    label: "Find Next Selection",
    alias: "Find Next Selection",
    _precondition: null
  },
  {
    id: "editor.action.previousSelectionMatchFindAction",
    label: "Find Previous Selection",
    alias: "Find Previous Selection",
    _precondition: null
  },
  {
    id: "editor.action.startFindReplaceAction",
    label: "Replace",
    alias: "Replace",
    _precondition: null
  },
  {
    id: "editor.action.addSelectionToNextFindMatch",
    label: "Add Selection To Next Find Match",
    alias: "Add Selection To Next Find Match",
    _precondition: null
  },
  {
    id: "editor.action.addSelectionToPreviousFindMatch",
    label: "Add Selection To Previous Find Match",
    alias: "Add Selection To Previous Find Match",
    _precondition: null
  },
  {
    id: "editor.action.moveSelectionToNextFindMatch",
    label: "Move Last Selection To Next Find Match",
    alias: "Move Last Selection To Next Find Match",
    _precondition: null
  },
  {
    id: "editor.action.moveSelectionToPreviousFindMatch",
    label: "Move Last Selection To Previous Find Match",
    alias: "Move Last Selection To Previous Find Match",
    _precondition: null
  },
  {
    id: "editor.action.selectHighlights",
    label: "Select All Occurrences of Find Match",
    alias: "Select All Occurrences of Find Match",
    _precondition: null
  },
  {
    id: "editor.action.changeAll",
    label: "Change All Occurrences",
    alias: "Change All Occurrences",
    _precondition: e
  },
  {
    id: "find.history.showNext",
    label: "Show Next Find Term",
    alias: "Show Next Find Term",
    _precondition: t
  },
  {
    id: "find.history.showPrevious",
    label: "Show Previous Find Term",
    alias: "Find Show Previous Find Term",
    _precondition: t
  },
  {
    id: "editor.action.copyLinesUpAction",
    label: "Copy Line Up",
    alias: "Copy Line Up",
    _precondition: e
  },
  {
    id: "editor.action.copyLinesDownAction",
    label: "Copy Line Down",
    alias: "Copy Line Down",
    _precondition: e
  },
  {
    id: "editor.action.moveLinesUpAction",
    label: "Move Line Up",
    alias: "Move Line Up",
    _precondition: e
  },
  {
    id: "editor.action.moveLinesDownAction",
    label: "Move Line Down",
    alias: "Move Line Down",
    _precondition: e
  },
  {
    id: "editor.action.sortLinesAscending",
    label: "Sort Lines Ascending",
    alias: "Sort Lines Ascending",
    _precondition: e
  },
  {
    id: "editor.action.sortLinesDescending",
    label: "Sort Lines Descending",
    alias: "Sort Lines Descending",
    _precondition: e
  },
  {
    id: "editor.action.trimTrailingWhitespace",
    label: "Trim Trailing Whitespace",
    alias: "Trim Trailing Whitespace",
    _precondition: e
  },
  {
    id: "editor.action.deleteLines",
    label: "Delete Line",
    alias: "Delete Line",
    _precondition: e
  },
  {
    id: "editor.action.indentLines",
    label: "Indent Line",
    alias: "Indent Line",
    _precondition: e
  },
  {
    id: "editor.action.outdentLines",
    label: "Outdent Line",
    alias: "Outdent Line",
    _precondition: e
  },
  {
    id: "editor.action.insertLineBefore",
    label: "Insert Line Above",
    alias: "Insert Line Above",
    _precondition: e
  },
  {
    id: "editor.action.insertLineAfter",
    label: "Insert Line Below",
    alias: "Insert Line Below",
    _precondition: e
  },
  {
    id: "deleteAllLeft",
    label: "Delete All Left",
    alias: "Delete All Left",
    _precondition: e
  },
  {
    id: "deleteAllRight",
    label: "Delete All Right",
    alias: "Delete All Right",
    _precondition: e
  },
  {
    id: "editor.action.joinLines",
    label: "Join Lines",
    alias: "Join Lines",
    _precondition: e
  },
  {
    id: "editor.action.transpose",
    label: "Transpose characters around the cursor",
    alias: "Transpose characters around the cursor",
    _precondition: e
  },
  {
    id: "editor.action.transformToUppercase",
    label: "Transform to Uppercase",
    alias: "Transform to Uppercase",
    _precondition: e
  },
  {
    id: "editor.action.transformToLowercase",
    label: "Transform to Lowercase",
    alias: "Transform to Lowercase",
    _precondition: e
  },
  {
    id: "editor.action.insertCursorAbove",
    label: "Add Cursor Above",
    alias: "Add Cursor Above",
    _precondition: null
  },
  {
    id: "editor.action.insertCursorBelow",
    label: "Add Cursor Below",
    alias: "Add Cursor Below",
    _precondition: null
  },
  {
    id: "editor.action.insertCursorAtEndOfEachLineSelected",
    label: "Add Cursors to Line Ends",
    alias: "Add Cursors to Line Ends",
    _precondition: null
  },
  {
    id: "editor.action.smartSelect.grow",
    label: "Expand Select",
    alias: "Expand Select",
    _precondition: null
  },
  {
    id: "editor.action.smartSelect.shrink",
    label: "Shrink Select",
    alias: "Shrink Select",
    _precondition: null
  },
  {
    id: "editor.action.toggleHighContrast",
    label: "Toggle High Contrast Theme",
    alias: "Toggle High Contrast Theme",
    _precondition: null
  },
  {
    id: "editor.action.toggleTabFocusMode",
    label: "Toggle Tab Key Moves Focus",
    alias: "Toggle Tab Key Moves Focus",
    _precondition: null
  },
  {
    id: "editor.action.jumpToBracket",
    label: "Go to Bracket",
    alias: "Go to Bracket",
    _precondition: null
  },
  {
    id: "editor.action.inPlaceReplace.up",
    label: "Replace with Previous Value",
    alias: "Replace with Previous Value",
    _precondition: e
  },
  {
    id: "editor.action.inPlaceReplace.down",
    label: "Replace with Next Value",
    alias: "Replace with Next Value",
    _precondition: e
  },
  {
    id: "editor.action.formatDocument",
    label: "Format Document",
    alias: "Format Document",
    _precondition: e
  },
  {
    id: "editor.action.formatSelection",
    label: "Format Selection",
    alias: "Format Code",
    _precondition: e
  },
  {
    id: "editor.action.showContextMenu",
    label: "Show Editor Context Menu",
    alias: "Show Editor Context Menu",
    _precondition: null
  },
  {
    id: "editor.action.quickCommand",
    label: "Command Palette",
    alias: "Command Palette",
    _precondition: null
  },
  {
    id: "editor.action.diffReview.next",
    label: "Go to Next Difference",
    alias: "Go to Next Difference",
    _precondition: e
  },
  {
    id: "editor.action.diffReview.prev",
    label: "Go to Previous Difference",
    alias: "Go to Previous Difference",
    _precondition: e
  },
  {
    id: "editor.action.clipboardCutAction",
    label: "Cut",
    alias: "Cut",
    _precondition: e
  },
  {
    id: "editor.action.clipboardCopyAction",
    label: "Copy",
    alias: "Copy",
    _precondition: null
  },
  {
    id: "editor.action.clipboardCopyWithSyntaxHighlightingAction",
    label: "Copy With Syntax Highlighting",
    alias: "Copy With Syntax Highlighting",
    _precondition: null
  },
  {
    id: "editor.unfold",
    label: "Unfold",
    alias: "Unfold",
    _precondition: null
  },
  {
    id: "editor.unfoldRecursively",
    label: "Unfold Recursively",
    alias: "Unfold Recursively",
    _precondition: null
  },
  { id: "editor.fold", label: "Fold", alias: "Fold", _precondition: null },
  {
    id: "editor.foldRecursively",
    label: "Fold Recursively",
    alias: "Fold Recursively",
    _precondition: null
  },
  {
    id: "editor.foldAll",
    label: "Fold All",
    alias: "Fold All",
    _precondition: null
  },
  {
    id: "editor.unfoldAll",
    label: "Unfold All",
    alias: "Unfold All",
    _precondition: null
  },
  {
    id: "editor.foldLevel1",
    label: "Fold Level 1",
    alias: "Fold Level 1",
    _precondition: null
  },
  {
    id: "editor.foldLevel2",
    label: "Fold Level 2",
    alias: "Fold Level 2",
    _precondition: null
  },
  {
    id: "editor.foldLevel3",
    label: "Fold Level 3",
    alias: "Fold Level 3",
    _precondition: null
  },
  {
    id: "editor.foldLevel4",
    label: "Fold Level 4",
    alias: "Fold Level 4",
    _precondition: null
  },
  {
    id: "editor.foldLevel5",
    label: "Fold Level 5",
    alias: "Fold Level 5",
    _precondition: null
  },
  {
    id: "editor.foldLevel6",
    label: "Fold Level 6",
    alias: "Fold Level 6",
    _precondition: null
  },
  {
    id: "editor.foldLevel7",
    label: "Fold Level 7",
    alias: "Fold Level 7",
    _precondition: null
  },
  {
    id: "editor.foldLevel8",
    label: "Fold Level 8",
    alias: "Fold Level 8",
    _precondition: null
  },
  {
    id: "editor.foldLevel9",
    label: "Fold Level 9",
    alias: "Fold Level 9",
    _precondition: null
  },
  {
    id: "editor.action.showHover",
    label: "Show Hover",
    alias: "Show Hover",
    _precondition: null
  },
  {
    id: "editor.action.openLink",
    label: "Open Link",
    alias: "Open Link",
    _precondition: null
  },
  {
    id: "editor.action.triggerParameterHints",
    label: "Trigger Parameter Hints",
    alias: "Trigger Parameter Hints",
    _precondition: t
  },
  {
    id: "editor.action.quickFix",
    label: "Quick Fix",
    alias: "Quick Fix",
    _precondition: e
  },
  {
    id: "editor.action.rename",
    label: "Rename Symbol",
    alias: "Rename Symbol",
    _precondition: e
  },
  {
    id: "editor.action.triggerSuggest",
    label: "Trigger Suggest",
    alias: "Trigger Suggest",
    _precondition: e
  },
  {
    id: "editor.action.marker.next",
    label: "Go to Next Error or Warning",
    alias: "Go to Next Error or Warning",
    _precondition: e
  },
  {
    id: "editor.action.marker.prev",
    label: "Go to Previous Error or Warning",
    alias: "Go to Previous Error or Warning",
    _precondition: e
  },
  {
    id: "editor.action.goToDeclaration",
    label: "Go to Definition",
    alias: "Go to Definition",
    _precondition: e
  },
  {
    id: "editor.action.openDeclarationToTheSide",
    label: "Open Definition to the Side",
    alias: "Open Definition to the Side",
    _precondition: e
  },
  {
    id: "editor.action.previewDeclaration",
    label: "Peek Definition",
    alias: "Peek Definition",
    _precondition: e
  },
  {
    id: "editor.action.goToImplementation",
    label: "Go to Implementation",
    alias: "Go to Implementation",
    _precondition: e
  },
  {
    id: "editor.action.peekImplementation",
    label: "Peek Implementation",
    alias: "Peek Implementation",
    _precondition: e
  },
  {
    id: "editor.action.goToTypeDefinition",
    label: "Go to Type Definition",
    alias: "Go to Type Definition",
    _precondition: e
  },
  {
    id: "editor.action.peekTypeDefinition",
    label: "Peek Type Definition",
    alias: "Peek Type Definition",
    _precondition: e
  },
  {
    id: "editor.action.referenceSearch.trigger",
    label: "Find All References",
    alias: "Find All References",
    _precondition: e
  },
  {
    id: "editor.action.showAccessibilityHelp",
    label: "Show Accessibility Help",
    alias: "Show Accessibility Help",
    _precondition: null
  },
  {
    id: "editor.action.inspectTokens",
    label: "Developer: Inspect Tokens",
    alias: "Developer: Inspect Tokens",
    _precondition: null
  },
  {
    id: "editor.action.gotoLine",
    label: "Go to Line...",
    alias: "Go to Line...",
    _precondition: null
  },
  {
    id: "editor.action.quickOutline",
    label: "Go to Symbol...",
    alias: "Go to Symbol...",
    _precondition: t
  }
]
```
