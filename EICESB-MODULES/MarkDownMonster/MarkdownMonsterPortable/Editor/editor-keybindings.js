var te = window.textEditor;

te.keyBindings = {
    setupKeyBindings: function () {
        setTimeout(function () {
            var kbJson = te.mm.GetKeyBindingsJson();  // sync!

            var keyBindings = JSON.parse(kbJson);

            for (var i = 0; i < keyBindings.length; i++) {
                var kb = keyBindings[i];

                if (!kb.CommandName)
                    continue;

                var handlerName = kb.CommandName[0].toLowerCase() + kb.CommandName.substr(1);
                var handler = eval("te.keyBindings." + handlerName);
                if (!handler)
                    continue;

                //console.log(kb.CommandName + ": " + kb.Key + " - " + typeof (handler));

                te.editor.commands.addCommand({
                    name: kb.Id,
                    bindKey: { win: kb.Key },
                    exec: handler,
                    hint: kb.CommandParameter
                });
            }
        }, 500);
    },
    // generic editor commands (bold, italic, href etc.) - hint is the action
    editorCommand: function () {
        var cmd = this;
        te.keyboardCommand("EditorCommand", cmd.hint);
        return null;
    },
    // donothing
    doNothing: function () { return null; },
    // this one requires explicit handling in WPF
    insertCodeBlock: function () {
        te.keyboardCommand("InsertCodeBlock");
    },
    saveDocument: function () {
        //te.mm.textbox.IsDirty(true); // force document to update
        te.keyboardCommand("SaveDocument");
    },
    newDocument: function () {
        te.keyboardCommand("NewDocument");
        // do nothing but:
        // keep ctrl-n browser behavior from happening
        // and let WPF handle the key
    },
    openDocument: function () {
        te.editor.blur(); // HACK: avoid letter o insertion into document IE bug
        te.keyboardCommand("OpenDocument");
        setTimeout(function () { te.editor.focus(); }, 20);
    },
    reloadEditor: function () {
        te.editor.blur(); // HACK: avoid letter internal F5 insertion into document IE bug
        te.keyboardCommand("ReloadEditor");
        setTimeout(function () { te.editor.focus(); }, 20);
        return null;
    },
    showHelp: function () { te.keyboardCommand("ShowHelp") },

    find: function () {
        te.editor.execCommand("find");
    },
    // find again redirect
    findNext: function () {
        te.editor.execCommand("findnext");
    },
    findPrevious: function () {
        te.editor.execCommand("findprevious");
    },
    deleteCurrentLine: function () { te.deleteCurrentLine(); },

    // try to move between tabs
    nextTab: function () { te.keyboardCommand("NextTab"); },
    previousTab: function () { te.keyboardCommand("PreviousTab"); },

    // take over Zoom keys and manually zoom
    zoomEditorDown: function () {
        te.keyboardCommand("ZoomEditorDown");
        return null;
    },
    zoomEditorUp: function () {
        te.keyboardCommand("ZoomEditorUp");
        return null;
    },


    // remove markdown formatting
    removeMarkdownFormatting: function () { te.keyboardCommand("RemoveMarkdownFormatting"); },

    // Capture paste operation in WPF to handle Images
    paste: function (editor, args) {
        te.mmAsync.PasteOperation();
    },
    paste2: function () {
        te.mmAsync.PasteOperation();
    },
    copy: function () {
        te.mmAsync.CopyOperation();
    },
    cut: function () {
        te.mmAsync.CutOperation();
    },
    nextSpellCheckError: function () {
        var pos = te.getCursorPosition();
        var markers = te.editor.session.getMarkers(true);

        var range;
        for (var key in markers) {
            range = markers[key].range;
            if (range.end.row > pos.row || range.end.row === pos.row && range.end.column > pos.column) {
                te.editor.scrollToLine(range.end.row);
                var sel = te.editor.getSelection();
                sel.setSelectionRange(range);
                return;
            }
        }

        if (te.editor.renderer.getLastVisibleRow() >= te.editor.session.getLength() - 1)
            return;

        te.editor.gotoPageDown();
        sc.contentModified = true;
        sc.spellCheck();

        setTimeout(te.keyBindings.nextSpellCheckError, 200);
    },
    previousSpellCheckError: function () {
        var pos = te.getCursorPosition();
        var markers = te.editor.session.getMarkers(true);

        var keys = [];
        for (var key in markers)
            keys.push(key);

        while (true) {
            var key = keys.pop();
            if (!key)
                break;

            var range = markers[key].range;
            if (range.end.row < pos.row || range.end.row === pos.row && range.end.column < pos.column) {
                te.editor.scrollToLine(range.end.row);
                te.setSelectionRange(range);
                return;
            }
        }

        if (te.editor.renderer.getFirstVisibleRow() < 2)
            return;

        te.editor.gotoPageUp();
        sc.contentModified = true;
        sc.spellCheck();
        setTimeout(te.keyBindings.nextSpellCheckError, 200);
    }
};
