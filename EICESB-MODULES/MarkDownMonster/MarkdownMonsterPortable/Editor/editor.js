/// <reference path="editorsettings.js"/>
/// <reference path="editorsettings.js"/>
/// <reference path="editorsettings.js"/>
/// <reference path="editorsettings.js"/>
/// <reference path="editorSpellcheck.js"/>
/// <reference path="editor-helpers.js" />
/// <reference path="scripts/ace/ace.js" />

// API Reference: https://ace.c9.io/#nav=api
(function () {    
    var Split = ace.require("ace/split").Split;
    ace.require("ace/ext/rtl");

    var allowSplitMode = true;
    var te = window.textEditor = {
        mm: null, // Markdown Monster MarkdownDocumentEditor COM object

        // Editor and Split instances
        isEditorSimple: true, // determines if this is a support code editor (Snippets, Code etc.) Initialized in InitializeInterop()
        splitInstance: null,
        editor: null, // Ace Editor instance - can be a split instance
        mainEditor: null, // The main editor instance (root instance)
        editorElement: null, // Ace Editor DOM element bount to
        updateDocument: null,
        previewRefreshTimeout: 300,
        previewRefreshTimeoutSlow: 2000,
        previewScrollTimeout: 400,
        lastAltkeyTime: 0,
        settings: editorSettings,
        lastError: null,
        dic: null,
        aff: null,
        isDirty: false,
        mousePos: { column: 0, row: 0 },
        spellcheck: null,
        // prevent editor scrolling from refreshing the preview recursively
        setCodeScrolled: function (ignored) {
            te.codeScrolled = new Date().getTime();
        },
        // checks if code was recently scrolled and shouldn't be scrolled again (also used for context menu)
        isCodeScrolled: function(timeout) {
            if (!timeout) timeout = previewScrollTimeout;
            return te.codeScrolled && te.codeScrolled > new Date().getTime() - timeout;
        },
        codeScrolled: 0,
        initialize: function (styleSettings) {
            if (!styleSettings)
              styleSettings = editorSettings;

            // attach ace to formatted code controls if they are loaded and visible
            var $el = $("#Editor");
            te.editorElement = $el[0];
            try {
                var codeLang = $el.attr('lang');

                if (!allowSplitMode)
                    te.editor = ace.edit(te.editorElement);
                else {
                    //Splitting
                    var theme = "ace/theme/" + styleSettings.theme;
                    var split = new Split(te.editorElement, theme, 1);
                    te.splitInstance = split;
                    te.editor = split.getEditor(0);
                    te.mainEditor = te.editor; // keep track of the main editor

                    // switch active document instance when focusing on different split view
                    split.on("focus",
                        function (editor) {
                            te.editor = editor;
                        });
                }                
                te.setlanguage(codeLang);
                te.configureAceEditor(te.editor, styleSettings);
                te.configureEvents();

            } catch (ex) {
                if (typeof console !== "undefined")
                    console.log("Failed to bind syntax: " + codeLang + " - " + ex.message);
            }
        },


        // Initial editor startup configuration
        configureAceEditor: function (editor, editorSettings) {
            if (!editor)
                editor = te.editor;
            if (!editorSettings)
                editorSettings = te.settings;

          var session = editor.getSession();
            session.name = "markdownmonster_" + new Date().getTime();

            editor.setReadOnly(false);

            editor.setOption("scrollPastEnd", 0.7); // will have additional scroll  0.7% of screen height
            editor.$blockScrolling = Infinity;
            session.setTabSize(editorSettings.tabSpaces);

            editor.setOptions({
                // fill entire view
                maxLines: 0,
                minLines: 0
                //wrapBehavioursEnabled: editorSettings.wrapText
            });

            te.setEditorStyle(editorSettings, editor);
            return editor;
        },

        setlanguage: function (lang) {

          if (!lang)
            lang = "txt";
          if (lang == "vfp")
            lang = "foxpro";
          if (lang == "c#")
            lang = "csharp";
          if (lang == "c++" || lang == "cpp")
            lang = "c_cpp";
          if (lang == "txt" || lang == "text" || lang == "none" || lang == "plain")
            lang = "text";

          te.editor.getSession().setMode("ace/mode/" + lang);
        },

        lastStyle: null,

        // This function configures the editor based on JSON or object map with 'editorSettings'
        // properties that configure the editor.
        setEditorStyle: function (styleJson, editor) {
            if (!editor)
                editor = te.editor;

            //setTimeout(function () {
            var style;
            if (typeof styleJson === "object")
                style = styleJson;
            else
                style = JSON.parse(styleJson);

            te.settings = style;
            te.lastStyle = style;

            editor.container.style.lineHeight = style.lineHeight;

            var activeTheme = editor.getTheme();
            var theme = "ace/theme/" + style.theme;
            if (activeTheme !== theme)
                editor.setTheme(theme);

            editor.setOptions({
                fontFamily: style.font,
                fontSize: style.fontSize
            });
            te.setRightToLeft(style.rightToLeft);

            var session = editor.getSession();

            session.setUseWrapMode(style.wrapText);
            session.setOption("indentedSoftWrap", true);


            session.setOptions({ useSoftTabs: style.useSoftTabs, tabSize: style.tabSize });
            // Disable Soft-Tab auto skip with arrow keys
            editor.selection.wouldMoveIntoSoftTab = te.returnFalse;

            session.setNewLineMode(style.linefeedMode);

            editor.setHighlightActiveLine(style.highlightActiveLine);

            editor.renderer.setShowGutter(style.showLineNumbers);
            editor.renderer.setShowInvisibles(style.showInvisibles);

            // these value are used in Resize to keep the editor size
            // limited to a max-width
            te.adjustPadding(true);

            if (style.showPrintMargin) {
                te.editor.setShowPrintMargin(true);
                te.editor.setPrintMarginColumn(style.printMargin + 1);
            } else {
                te.editor.setShowPrintMargin(false);
                te.editor.setPrintMarginColumn(style.printMargin + 1);
            }

            if (style.wrapMargin > 0)
                te.editor.session.setWrapLimitRange(style.wrapMarin, style.wrapMargin);
            else
                te.editor.session.setWrapLimitRange(null, null);

            //style.wrapMargin = 50;
            //if (style.wrapMargin > 0) {
            //
            //    te.editor.setShowPrintMargin(true);
            //    te.editor.setPrintMarginColumn(style.wrapMargin + 1);
            //} else {
            //    session.setWrapLimitRange(null, null);
            //    te.editor.setShowPrintMargin(false);
            //}

            var keyboardHandler = style.keyboardHandler;
            if (!keyboardHandler || keyboardHandler == "default" || keyboardHandler == "ace")
                te.editor.setKeyboardHandler("");
            else
                te.editor.setKeyboardHandler("ace/keyboard/" + keyboardHandler);

            if (te.lastStyle && te.lastStyle.noAutoComplete) {
              te.editor.setOptions({
                behavioursEnabled: false,
                enableBasicAutocompletion: false,
                enableLiveAutocompletion: false,
                enableSnippets: false
              });
            }

            if (!style.enableBulletAutoCompletion) {
                window.setTimeout(function() {
                    te.editor.session.getMode().getNextLineIndent = function(state, line) {
                        return this.$getIndent(line);
                    };
                }, 100);
            }

            window.setTimeout(te.updateDocumentStats, 30);
        },

        // one time event hook ups
        configureEvents: function() {
            var editor = te.editor;

            function setUpdateDocument() {
              te.updateDocument = debounce(async function(force) {
                if (!te.mm)
                  return;

                // retrieve document (in WPF) and check if the current state has changed
                te.isDirty  = await te.mmAsync.IsDirty(false, te.getvalue());

                if (force || te.isDirty) {
                    previewRefresh();
                    te.updateDocumentStats();
                }
              }, te.previewRefreshTimeout);
            }
            setUpdateDocument();

            var previewRefresh = debounce( () => {
                if (!te.mm || te.isEditorSimple) return;

              var noPreviewScrolling =te.settings.previewSyncMode == 3 || te.settings.previewSyncMode == 0 ? true : false;
              te.mm.PreviewMarkdownCallback(true, -1, noPreviewScrolling);
            }, 100);
            var scrollPreviewRefresh = debounce(async (editorLine, noScrollTimeout, noScrollTopAdjustment, force) => {
                if (!te.mm || te.isEditorSimple) return;

                if (force ||
                    te.settings.previewSyncMode === 2 ||
                    te.settings.previewSyncMode === 4) {

                    if (typeof editorLine !== "number")
                        editorLine = -1;

                    if (editorLine == -1)
                        editorLine = te.getLineNumber();

                    // by default there is a scroll timeout so we don't recursively scroll in two-way mode
                    noScrollTimeout = noScrollTimeout ? true : false;
                    noScrollTopAdjustment = noScrollTopAdjustment ? true : false;

                    if (!noScrollTimeout)
                        te.setCodeScrolled();

                    var res = await te.mmAsync.ScrollPreviewToEditorLineCallback(editorLine,
                        true,
                        noScrollTimeout,
                        noScrollTopAdjustment);
                }
            }, 100);
            
            te.lastAltkeyTime = 0;

            document.querySelector("pre[lang]").addEventListener("keyup",
               async (event) => {
                    //console.log('key', event.key, event.keyCode, event.altKey, event.ctrlKey, event.shiftKey,  event);

                    // check for Windows Alt-Menu behavior
                    // delay trigger menu so native alt- key processing can work                    
                    if (te.mm && event.key === "Alt" && !event.ctrlKey && !event.shiftKey) {
                        te.lastAltkeyTime = new Date().getTime();

                        // we always get in here
                        // console.log("alt key triggered #1.1");

                        // BUT THIS SETTIMEOUT DOES NOT FIRE FREQUENTLY!
                        setTimeout( async ()=> {
                            // console.log("Alt key triggered #2 (in timeout)");

                            var t = new Date().getTime();
                            //console.log('alt timeout: ' + (t - te.lastAltkeyTime), t, te.lastAltkeyTime);
                            // other key or more than 5 secs
                            if (te.lastAltkeyTime == 0 || t - te.lastAltkeyTime > 5000) {
                                te.lastAltkeyTime = 0;
                                return;
                            }
                            //console.log("Alt key triggered #3 (in timeout)");

                            await te.mmAsync.TriggerWindowAltMenu();
                        }, 500);

                        // console.log("alt key triggered #4 (setTimeout set)");
                    } else {
                        // console.log("non-alt key triggered");
                        te.lastAltkeyTime = 0;
                    }

                  // up and down handling - force a preview refresh
                  if(event.key === "ArrowUp" || event.key === "ArrowDown") {
                    scrollPreviewRefresh(-1, false, false, false);  // noScrollTopAdjustment,
                    te.updateDocumentStats();
                  }
                  // Ctrl-Key forces preview refresh and spellcheck
                  // handles for ctrl-y/z and copy/paste/cut ops to refresh
                  else if (event.key === "Control" ) {
                    previewRefresh();
                    te.updateDocumentStats();
                    // te.updateDocument();
                    // scrollPreviewRefresh(-1, false, false, true);  // noScrollTopAdjustment, force update
                    // te.updateDocumentStats();
                    if (te.spellcheck) te.spellcheck.spellCheck(true);
                  }
                  // left right
                  else if (event.key === "ArrowLeft" || event.key === "ArrorRight") {
                    te.updateDocumentStats();
                  }
                  else if (event.key === "ContextMenu")
                  {
                      event.stopPropagation();
                      event.preventDefault();

                      var pos = te.editor.getCursorPosition();
                      var pixelPos =  te.editor.renderer.textToScreenCoordinates(pos.row, pos.column)
                      //event.preventDefault = false;
                      //event.cancelBubble = false;
                      //var pos = te.editor.getCursorPosition();
                      await te.mmAsync.OpenEditorContextMenu(pixelPos.pageX, pixelPos.pageY);  // TODO: A way to get the cursorPosition()?

                  }
                  else if (te.editor.$keybindingId === "ace/keyboard/vim" &&
                    (event.keyCode === 74 || event.keyCode == 75)) {
                    if (!te.editor.state.cm.state.vim.insertMode) {
                      scrollPreviewRefresh();
                      te.updateDocumentStats();
                    }                 
                  } else {
                    // key typed into document
                    if (event.keyCode === 13 || event.keyCode === 8 || event.keyCode === 46) {
                      // Line feed, backspace, del should immediately spell check as errors shift
                      if (te.spellcheck) te.spellcheck.spellCheck(true);
                    }
                    // check number of lines and if over a certain number start refreshing less frequently
                    if (te.editor.session.getLength() > 5000 && te.previewRefreshTimeout != te.previewRefreshTimeoutSlow) {
                      te.previewRefreshTimeout = te.previewRefreshTimeoutSlow;
                      setUpdateDocument();
                    }

                    te.updateDocument();
                  }
                  te.setCodeScrolled();
                });


            var changeScrollTop = debounce(function (e) {

              // don't do anything if we moved without requesting
              // a document refresh (from preview refresh)
              if (te.isCodeScrolled(te.previewScrollTimeout)) // set in json file
                return;

              te.codeScrolled = 0;

              // if there is a selection don't set cursor position
              // or preview. Mouseup will scroll to position at end
              // of selection
              var sel = te.getselection();

              if (sel && sel.length > 0) {
                return;
              }

              setTimeout(function () {
                var firstRow = te.editor.renderer.getFirstVisibleRow();
                if (firstRow > 2)
                  firstRow += 3;
                else
                  firstRow = 0;

                // preview and highlight top of display
                scrollPreviewRefresh(firstRow);

                if (sc)
                  sc.contentModified = true;  // force spell check to run
              }, 10);

            }, 80);
            editor.session.on("changeScrollTop", changeScrollTop);


            // always have mouse position available when drop or paste
            editor.on("mousemove",
              function(e) {
                  te.mousePos = e.getDocumentPosition();
                  $(".ace_markup.ace_underline").attr("title", "Ctrl-Click to open this link in your Web browser");
              });
            editor.on("mouseup",
              function() {
                if (te.mm) {
                    // explicitly force Preview positioning (last (force) parm)
                    scrollPreviewRefresh(-1, undefined, undefined, true); // force
                }

                // spellcheck - force recheck on next cycle
                if (te.spellcheck)
                  te.spellcheck.contentModified = true;

                
                  te.updateDocumentStats();

                  // clear preview mode when you click
                  te.mm.SetPreviewMode(true);
              });

            if (editorSettings.clickableLinks) {
              editor.setOptions({
                enableLinking: true
              });

              // Ctrl-click to navigate on links
              editor.on("linkClick",
                  async (data) => {
                      if (te.mm) {
                          if (data &&
                              data.token &&
                              (data.token.type == "link" || data.token.type == "markup.underline"))
                              await te.mmAsync.PreviewLinkNavigation(data.token.value, data.token.value);
                      }
                  });
            }

            // Notify WPF of focus change
            editor.on("blur", te.onBlur);
            editor.on("focus", te.onGotFocus);

            // used to force mouse position to whatever the existing cursor position is
            // when dragging from explorer. Without this files are always dropped at the
            // end of the document. With this it's dropped at the current cursor position
            // (better but not optimal)
            window.ondragover = function (e) {                
                te.mousePos = te.editor.getCursorPosition();
                te.mousePos.dragMode =  e.dataTransfer.dropEffect;
              
                // HACK: without this OS file drop won't work (files will open in WV editor)
                event.preventDefault();
                return false;
            };


            
            // Let browser navigate events handle drop operations
            // in the WPF host application
            // handle file browser dragged files dropped
            // *** Don't Remove! Explorer dragging captures navigation event in WPF
            //     This captures requests from the Filebrowser
            window.ondrop = function (e) {                
                if (te.isEditorSimple) return true;

                // HACK! without this won't work
                e.preventDefault();
                e.stopPropagation();

                // these don't really have any effect'            
                var file = e.dataTransfer.getData('text');
                if (!file) {
                    if (e.dataTransfer.files.length > 0) {
                        file = e.dataTransfer.files[0].name;
                    }
                    else
                        return false;
                }

                // #hashes in format #hash|linkText
                if (file[0] == "#" && file.indexOf("|") > -1) {
                    setTimeout(async function () {
                        let dragMode = te.mousePos && te.mousePos.dragMode ? te.mousePos.dragMode : 'none';
                        await te.mmAsync.EmbedDroppedFileAsImage(file, dragMode == 'copy');
                    }, 1);
                    te.setselection(''); // just in case, kill initial selection

                    return false;
                }

                if (file.indexOf('|') > -1) {
                    file = file.split('|')[0];
                }

                // Any file with an extension - handle in MM
                if (/\..\w*$/.test(file)) {
                    // file has no path - pass binary
                    if (file.indexOf("/") == -1 && file.indexOf("\\") == -1) {                        
                        var reader = new FileReader();
                        var fl = e.dataTransfer.files[0];                        
                        reader.onload = async function (e) {
                            var obj = {                                
                                name: fl.name,
                                media: fl.type,
                                size: fl.size,
                                data: e.target.result
                            };
                            var data = "droppedfile:" + JSON.stringify(obj);                                                      
                            await te.mmAsync.EmbedDroppedFileAsImage(data, true);
                        };
                        reader.readAsDataURL(fl);
                    }
                    else {                   
                        setTimeout(async function () {
                            let dragMode = te.mousePos && te.mousePos.dragMode ? te.mousePos.dragMode : 'none';

                            if (te.mousePos.row > 0 || te.mousePos.col > 0)
                                te.setCursorPosition(te.mousePos.row, te.mousePos.column);

                            // embed the image or open the file
                            await te.mmAsync.EmbedDroppedFileAsImage(file, dragMode == 'copy');
                        },1);
                    }


                    // if it's a file that was dropped clear the selection -
                    // otherwise the filename is embedded (correct if dragging text in editor)
                    if (e.dataTransfer.files.length > 0)
                        te.setselection(''); // collapse and remove file name dragged into doc                        
                }

                return false;
            };
        },

        setShowLineNumbers: function (showLineNumbers) {
            te.editor.renderer.setShowGutter(showLineNumbers);
        },
        setShowInvisibles: function (showInvisibles) {
            te.editor.renderer.setShowInvisibles(showInvisibles);
        },
        setWordWrap: function (enable) {
            te.editor.session.setUseWrapMode(enable);
        },

        setRightToLeft: function (onOff) {
          //.editor.setOption("rtlText",onOff);
          //te.editor.session.$bidiHandler.setRtlDirection(te.editor,onOff);
        },
        setfont: function (size, fontFace, weight) {
          if (size)
            te.editor.setFontSize(size);
          if (fontFace)
            te.editor.setOption("fontFamily", fontFace);
          if (weight)
            te.editor.setOption("fontWeight", weight);
        },
        getfontsize: function () {
          var zoom = screen.deviceXDPI / screen.logicalXDPI;
          var fontsize = te.editor.getFontSize() * zoom;
          return fontsize;
        },
        getscrolltop: function (ignored) {
            var st = te.editor.getSession().getScrollTop();
            return st;
        },
        setscrolltop: function (scrollTop) {
            setTimeout(function () {
                return te.editor.getSession().setScrollTop(scrollTop);
            },100);
        },
        setReadOnly: function (status) {
          if (te.editor.readOnly == status)
            return;
          te.editor.setReadOnly(status);
          //.readOnly = status;
          if (status) {
            te.editor.container.style.opacity = 0.70;
            $(te.editor.container).on("dblclick", te.readOnlyDoubleClick);
          } else {
            $(te.editor.container).off("dblclick", te.readOnlyDoubleClick);
            te.editor.container.style.opacity = 1; // or use svg filter to make it gray
          }
        },
        readOnlyDoubleClick: async function () {
          if (!te.mm || te.isEditorSimple)
            return;

          await te.mmAsync.NotifyAddins("ReadOnlyEditorDoubleClick", null);
        },
        getvalue: function (ignored) {
            var text = te.editor.getSession().getValue();
            return text.toString();
        },
        setvalue: function (text, pos, keepUndo) {            
            if (!pos)
                pos = -1; // first line

            var offset = 0; // get cursor offset
            if (pos === -2) {
                try {
                    offset = te.editor.session.doc.positionToIndex(te.editor.selection.getCursor());
                } catch (ex) {
                    pos = -1; // go to top
                }
                if (offset == 0) // if 0 go to top
                    pos = -1;
            }

            te.editor.setValue(text, pos);
            if (offset > 0)
                te.setselposition(offset, 0);

            if (!keepUndo) {
                // load a new document
                te.editor.getSession().setUndoManager(new ace.UndoManager());
                setTimeout(function () {
                    te.editor.resize(true); //force a redraw
                }, 30);
            }
        },

        // replaces content without completely reloading the document
        // by using clipboard replacement
        // Leaves scroll position and undo buffer intact
        replaceContent: function (text) {
            // remember cursor position
            var pos = te.getCursorPosition();

            var sel = te.editor.getSelection();
            sel.selectAll();
            te.setselection(text);

            // reset cursor position
            setTimeout(function() {
                te.setCursorPosition(pos.row, pos.Col);
              }, 5);
        },
        refresh: function (ignored) {
            te.editor.resize(true); //force a redraw
        },
        keyboardCommand: async function (key, action) {
            if (te.mm)
                await te.mmAsync.KeyboardCommand(key, action);
        },
        editorSelectionOperation: async function (action, text) {
            if (te.mm)
                te.mmAsync.EditorSelectionOperation(action, text);
        },

        // noRefresh: Set true to prevent the editor from refreshing the preview
        //            and recursive bouncing in the editor.
        gotoLine: function (line, noRefresh, noSelection) {
            if (typeof(line) !== "number")
                return;

            line = line - 1;
            var maxLine = te.editor.session.getLength() - 1;
            if (line < 0)
                line = 0;
            else if (line > maxLine) {
              line = maxLine;
            }


            //te.editor.gotoLine(line, 0, true);
            te.editor.scrollToLine(line,
                false, // not centered
                true);

            if (!noSelection) {
                var sel = te.editor.getSelection();
                var range = sel.getRange();
                range.setStart({ row: line, column: 0 });
                range.setEnd({ row: line, column: 0 });
                sel.setSelectionRange(range);
            }
            if (!noRefresh)
              setTimeout(function() {
                  te.refreshPreview();
                  te.updateDocumentStats();
                },
                10);
            else
              // this keeps the editor from firing scrolled
              // events to update the preview again
              te.setCodeScrolled();
        },
        gotoBottom: function (noRefresh, noSelection) {
          te.gotoLine(9999999, noRefresh, noSelection);
        },
        refreshPreview: function (ignored) {
            te.mm.PreviewMarkdownCallback();
        },
        setselection: function (text) {
            if (text && text.trim().length > 0)
                te.editor.$handlePaste(text);
            else {
                // HACK: Bug in ACE: $handlePaste() doesn't work with ''
                var range = te.editor.getSelectionRange();
                te.editor.session.replace(range, text);
            }
            te.editor.renderer.scrollSelectionIntoView();
        },
        setSelectionRange: function (startRowOrRange, startColumn, endRow, endColumn) {
            var sel = te.editor.getSelection();

            // assume a selection range if an object is passed
            if (typeof startRowOrRange == "object") {
                sel.setRange(startRowOrRange);
                return;
            }

            var range = sel.getRange();
            range.setStart({ row: startRowOrRange, column: startColumn });
            range.setEnd({ row: endRow, column: endColumn });
            sel.setRange(range);
        },
        // Replaces the current selection with new selection text that is then selected
        replaceSelectionRange: function (text, rangeOrStartRow, startColumn, endRow, endColumn) {            
            if (rangeOrStartRow && typeof rangeOrStartRow != "object") {
                range = te.editor.getSelectionRange();
                range.start.row = rangeOrStartRow;
                range.start.column = startColumn;
                range.end.row = endRow;
                range.end.column = endColumn;
            }
            else
                range = rangeOrStartRow;

            // save current range for start position
            var oldRange = te.editor.getSelectionRange();

            // now replace new text
            te.editor.session.replace(range, text);

            // now reselect with the new text
            var newRange = te.editor.getSelectionRange();  // end of position
            newRange.start.row = oldRange.start.row;
            newRange.start.column = oldRange.start.column;                
            te.setSelectionRange(newRange);            
        },
        // line < 0 means use current line
        selectLine: function (lineNo) {
            if (lineNo > -1)
                te.gotoLine(lineNo, true, false);
            te.editor.selection.selectLine();
        },
        getselection: function (ignored) {
            return te.editor.getSelectedText();
        },
        getselectionrange: function (ignored) {
            var range = te.editor.getSelectionRange();
            return {
                startRow: range.start.row,
                endRow: range.end.row,
                startColumn: range.start.column,
                endColumn: range.end.column
            };
        },
        getCursorPosition: function (ignored) { // returns {row: y, column: x}
            var pos = te.editor.selection.getCursor();
            pos.dragMode = 'none';
            return pos;
        },
        setselposition: function (index, count) {
            var doc = te.editor.session.getDocument();
            var lines = doc.getAllLines();

            function offsetToPos(offset) {
                var row = 0, col = 0;
                var pos = 0;
                while (row < lines.length && pos + lines[row].length < offset) {
                    pos += lines[row].length;
                    pos++; // for the newline
                    if (te.settings.linefeedMode == "windows")
                        pos++;
                    row++;
                }
                col = offset - pos;
                return { row: row, column: col };
            };

            var start = offsetToPos(index);
            var end = offsetToPos(index + count);

            var sel = te.editor.getSelection();
            var range = sel.getRange();
            range.setStart(start);
            range.setEnd(end);
            sel.setSelectionRange(range);

            te.editor.renderer.scrollSelectionIntoView();
        },
        setselpositionfrommouse: function (pos) {
            if (!pos)
                pos = $.extend({}, te.mousePos);

            var sel = te.editor.getSelection();
            var range = sel.getRange();
            range.setStart(pos);
            range.setEnd(pos);
            sel.setSelectionRange(range);
        },
        setCursorPosition: function (row, column) { // col and also be pos: { row: y, column: x }
            var pos;
            if (typeof row === "object")
                pos = row;
            else
                pos = { column: column, row: row };

            te.editor.gotoLine(pos.row, pos.column, true);
        },
        
        deleteCurrentLine: function () {
            var sel = te.getselection();
            if (sel) {
                document.execCommand('cut');
                return;
            }
            te.editor.selection.selectLine();
            te.editor.removeLines();
        },
        moveCursorLeft: function (count) {
            if (!count)
                count = 1;
            te.editor.navigateLeft(count);
        },
        moveCursorRight: function (count) {
            if (!count)
                count = 1;
            te.editor.navigateRight(count);
        },
        moveCursorUp: function (count) {
            if (!count)
                count = 1;
            te.editor.navigateUp(count);
        },
        moveCursorDown: function (count) {
            if (!count)
                count = 1;
            te.editor.navigateDown(count);
        },
        getLineNumber: function (ignored) {
            var selectionRange = te.editor.getSelectionRange();
            if (!selectionRange) {
                return -1;
            }
            
            return Math.floor(selectionRange.start.row);   
        },
        getCurrentLine: function (ignored) {
            var selectionRange = te.editor.getSelectionRange();
            var startLine = selectionRange.start.row;
            return te.editor.session.getLine(startLine);
        },
        getLine: function (row) {
            return te.editor.session.getLine(row);
        },
        findAndReplaceText: function (search, replace) {
            var range = te.editor.find(search,
                {
                    wrap: true,
                    caseSensitive: true,
                    wholeWord: true,
                    regExp: false,
                    preventScroll: false // do not change selection
                });
            if (!range)
                return;

            range.start.column = 0;
            range.end.column = 5000;


            te.setselection(replace);

        },
        findAndReplaceTextInCurrentLine: function (search, replace) {
            var range = te.editor.getSelectionRange();
            var startLine = range.start.row;
            var lineText = te.editor.session.getLine(startLine);

            var i = lineText.indexOf(search);
            if (i === -1)
                return;

            range.start.column = i;
            range.end.column = i + search.length;

            te.editor.session.replace(range, replace);
        },
        findAndSelectTextInCurrentLine: function (search) {
          var range = te.editor.getSelectionRange();
          var startLine = range.start.row;
          var lineText = te.editor.session.getLine(startLine);


          var i = lineText.indexOf(search);
          if (i === -1)
            return;

          range.start.column = i;
          range.end.column = i + search.length;
          te.editor.selection.setSelectionRange(range);
        },
        findText: function (search) {
            var range = te.editor.find(search,
                {
                    wrap: true,
                    caseSensitive: true,
                    wholeWord: true,
                    regExp: false,
                    preventScroll: false // do not change selection
                });
            if (!range)
                return;

            range.start.column = 0;
            range.end.column = 5000;
        },
        openSearch: function (searchText) {
            te.editor.execCommand("find");
            setTimeout(function () {
                var el$ = $(".ace_search_form .ace_search_field");
                el$.val(searchText);
                te.editor.searchBox.findNext();
            },
                80);
        },
        openSearchAndReplace: function (searchText, replaceText) {
            te.editor.execCommand("replace");
            setTimeout(function() {
              var el$ = $(".ace_search_form .ace_search_field");
              el$.val(searchText);
              $(".ace_replace_form .ace_search_field").val(replaceText);
              te.editor.searchBox.findNext();

              setTimeout(function() { el$.focus(); }, 200);
            }, 80);
        },

        // call through to status display so it can be called from host
        status: function status(msg) {
          status(msg);
        },
        curStats: { wordCount: 0, lines: 0, characters: 0 },
        getDocumentStats: function () {
            var text = te.getvalue();
            pos = te.editor.selection.getCursor();
            if (pos.row == 0)
                pos = te.mousePos;

            // strip off front matter.
            var frontMatterExp = /^---[ \t]*$[^]+?^(---|...)[ \t]*$/m;
            var match = frontMatterExp.exec(text);
            if (match && match.index == 0)
                text = text.substr(match[0].length);

            var regExWords = /\s+/gi;
            var wordCount = text.replace(regExWords, ' ').split(' ').length;
            var lines = text.split('\n').length;
            var chars = text.length;

            te.curStats = {
                wordCount: wordCount,
                lines: lines,
                characters: chars,
                row: pos.row + 1,
                column: pos.column + 1
            };

            return te.curStats;
        },
        updateDocumentStats: function () {
            if (te.isEditorSimple || !te.mm) return;

            setTimeout(async function () {
                var stats = te.getDocumentStats();
                var jsonStats = JSON.stringify(stats);
                te.mm.UpdateDocumentStats(jsonStats);
            }, 50);
        },
        enablespellchecking: function (disable, dictionary) {
            if (dictionary)
                editorSettings.dictionary = dictionary;
            setTimeout(function () {
                if (!disable)
                    spellcheck.enable();
                else
                    spellcheck.disable();
            },
                100);
        },
        isspellcheckingenabled: function (ignored) {
            return editorSettings.enableSpellChecking;
        },
        // force document to check spelling
        spellcheckDocument: function (force) {
            if (te.spellcheck)
                te.spellcheck.spellCheck(force);
        },
        spellcheckNext: function (ignored) {
            if (te.spellcheck)
                te.keyBindings.nextSpellCheckError();
        },
        spellcheckPrevious: function (ignored) {
            if (te.spellcheck)
                te.keyBindings.previousSpellCheckError();
        },
        checkSpelling: function (word) {
            if (!word || !editorSettings.enableSpellChecking || te.isEditorSimple)
                return true;

            
            // TODO: CHECK THIS FOR ASYNC BEHAVIOR            
            if (te.mm)
                // use COM object
                return te.mm.CheckSpelling(word, editorSettings.dictionary, false);
        },
        showSuggestions: async function (e) {
            try {
                var markers = te.editor.session.getMarkers(true);
                if (!markers || markers.length === 0)
                    return;

                var pos = e && e.getDocumentPosition ? e.getDocumentPosition() : te.editor.selection.getCursor();

                var matched = null;

                // look for a misspelled marker that matches our
                // current document location
                for (var id in markers) {
                    var marker = markers[id];
                    if (marker.clazz != "misspelled")
                        continue;

                    if (pos.row >= marker.range.start.row &&
                        pos.row <= marker.range.end.row &&
                        pos.column >= marker.range.start.column &&
                        pos.column <= marker.range.end.column) {
                        matched = marker;
                        break;
                    }
                };

                var range = null;
                var misspelledWord = null;
                if (matched) {
                    range = matched.range;
                    misspelledWord = matched.range.misspelled;
                }

                // show suggested spellings in WPF Context Menu
                //te.suggestSpelling(misspelledWord, 8, range);
                range = JSON.stringify(range);
                await te.mmAsync.GetSuggestions(misspelledWord, editorSettings.dictionary, false, range);

            } catch (error) {
                var msg = "Editor context menu failed. Please reload document: " + error.message + " (" + error.lineNumber + ")";
                te.mm.LogError(msg);
                te.mm.ShowStatusError(msg);
            }''
        },
        addWordSpelling: async function (word) {
            if (te.isEditorSimple) return;

            await te.mmAsync.AddWordToDictionary(word, editorSettings.dictionary);
            if (te.spellcheck)
                te.spellcheck.spellCheck(true);
        },
        replaceSpellRange: function (range, text) {
            if (typeof range == "string")
                range = JSON.parse(range);


            te.editor.getSession().replace(range, text);
            if (sc)
                sc.spellCheck(true);
        },
        gotfocus: function (ignored) {
          te.setfocus();
        },
        setfocus: function (ignored) {
          setTimeout(function () {
            te.editor.focus();
            setTimeout(function () {
              te.editor.focus();
            }, 300);
          },50);
        },
        // forces Ace to lose focus
        losefocus: function (ignored) {
            $("#losefocus").focus();
        },
        onBlur: async function () {
            if (te.mm)
                await te.mmAsync.LostFocus();
        },
        onGotFocus: async function () {
            if (te.mm)
                await te.mmAsync.GotFocus();
        },
        blurEditorAndRefocus: function (mstimeout) {
            if (!mstimeout)
                mstimeout = 50;

            te.noRefreshPreview = true;
            te.editor.blur(); // HACK: avoid letter o insertion into document
            setTimeout(function () {
                te.editor.focus();
                te.noRefreshPreview = false;
            },
                mstimeout);
        },

        adjustPadding: function (forceRefresh) {
            if (!te.lastStyle || !te.splitInstance)
                return;

            var lastPad = te.lastStyle.padding;

            // single pane
            if (!te.splitInstance || te.splitInstance.$splits < 2) {
                var ed = te.splitInstance.getEditor(0);

                // just apply fixed padding
                if (te.lastStyle.maxWidth == 0) {
                    ed.renderer.setPadding(lastPad);
                } else {

                    // Apply width
                    var w = window.innerWidth - te.lastStyle.maxWidth;
                    if (w > lastPad * 2) {
                        var pad = w / 2;
                        ed.renderer.setPadding(w / 2);
                    } else
                        ed.renderer.setPadding(lastPad);
                }

                ed.resize(true);
                te.splitInstance.resize();

                return;
            }


            // we have multiple panes

            var ed = te.splitInstance.getEditor(0);
            var ed2 = te.splitInstance.getEditor(1);


            // if there's no MaxWidth just apply fixed padding to both splits
            if (te.lastStyle.maxWidth == 0) {
                ed2.renderer.setPadding(lastPad);
                ed.renderer.setPadding(lastPad);
            }
            // Horizontal splits
            else if (te.splitInstance.getOrientation() == te.splitInstance.BESIDE) {
                // Set padding for two horizontal splits
                var w = window.innerWidth / 2 - te.lastStyle.maxWidth;

                if (w > lastPad * 2) {
                    // calc padding
                    var pad = Math.floor(w / 2);
                    ed2.renderer.setPadding(pad);
                    ed.renderer.setPadding(pad);
                } else {
                    // smaller than max width - use padding setting
                    ed.renderer.setPadding(lastPad);
                    ed2.renderer.setPadding(lastPad);
                }
            }
            // vertical splits
            else {
                var w = window.innerWidth - te.lastStyle.maxWidth;

                if (w > lastPad * 2) {
                    var pad = w / 2;
                    ed2.renderer.setPadding(pad);
                    ed.renderer.setPadding(pad);
                } else {
                    ed.renderer.setPadding(lastPad);
                    ed2.renderer.setPadding(lastPad);
                }
            }

            te.splitInstance.resize();
        },
        execcommand: function (cmd, parm1, parm2) {
          te.editor.execCommand(cmd);
        },
        // Below or Beside or None
        split: function (value) {
            var split = te.splitInstance;

            if (value === "Below" || value === "Beside") {
                split.setOrientation(value == "Below" ? split.BELOW : split.BESIDE);
                split.setSplits(2);

                // IMPORTANT: reset large padding first - if padding is too large panel won't render right
                te.mainEditor.renderer.setPadding(te.lastStyle.padding);
                te.mainEditor.resize(true);

                // setSplits creates a second editor instance
                var editor2 = split.getEditor(1);
                editor2.Name = "Editor2";

                // get the old window session and assign to the new editor instance
                var session = te.mainEditor.session; //split.getEditor(0).session;
                var newSession = split.setSession(session, 1);
                newSession.name = session.name;

                // Update editor to match current settings (app specific - cached JSON settings from WPF host)
                te.editor = editor2;
                te.configureAceEditor(te.editor, te.lastStyle);
                te.keyBindings.setupKeyBindings();
            } else {
                te.editor = te.mainEditor;
                split.setSplits(1);
                te.setEditorStyle(te.lastStyle, te.editor);
            }

            te.setfocus();
        },
        returnFalse: function() {
          return false;
        }
    }

    // Remove - delay and let .NET initialize to
    // avoid double styling flash
    //$(document).ready(function () {
    //  te.initialize();
    //});


    window.xonerror = function windowError(message, filename, lineno, colno, error) {
        var msg = "";
        if (message)
            msg = message;
        if (filename)
            msg += ", " + filename;
        if (lineno)
            msg += " (" + lineno + "," + colno + ")";
        if (error)
            msg += error;

        //var value = arguments.callee.caller;

        // show error messages in a little pop overwindow
        if (editorSettings.isDebug)
            status(msg);

        if (textEditor)
            textEditor.lastError = msg;

        if (console)
          console.log(msg, filename, lineno, colno, error);

        // don't let errors trigger browser window
        return true;
    }


    function windowResize() {
        //if (te.mm && te.mm)
        //  te.mm.resizeWindow();

        te.adjustPadding();
    }
    window.onresize = windowResize; //debounce(windowResize, 1);


    window.onmousewheel = function (e) {
        if (e.ctrlKey) {
            e.cancelBubble = true;
            e.returnValue = false;

            if (e.wheelDelta > 0)
                te.keyboardCommand("ZoomEditorUp");
            if (e.wheelDelta < 0)
                te.keyboardCommand("ZoomEditorDown");

            return false;
        }
    };


    //window.ondragover = function (e) {
    //    te.mousePos = e.getDocumentPosition();
    //    console.log('ondragover');
    //}
    //window.ondragstart = function (e) {
    //    e.dataTransfer.effectAllowed = 'all';
    //    console.log('ondragstart');
    //}

    // pass context popup to WPF for handling there
    window.oncontextmenu = function (e) {
        //if (te.mm && te.isEditorSimple) return;  // show browser menu so we can copy/paste

        if(te.isCodeScrolled(400))
          return false;

        te.setCodeScrolled(); // no refreshing

        e.preventDefault();
        e.cancelBubble = true;

        if (te.mm && !te.isEditorSimple)            
            setTimeout(async ()=> await te.showSuggestions(e));

        return false;
    }

    var statusTimeout = null;
    var statusDefaultTimeout = 10000;


    /*
     * Generic Status Message for the bottom of the screen. Can be used to render debug output
     * into the editor. Double click status bar to clear for appended output.
     * status('Started');
     * status('updated',true, 5000);
     */
    function status(msg, append, timeout) {
      if (!timeout)
        timeout = statusDefaultTimeout;

      var el = document.getElementById("StatusMessage");
      if (!el) {
        el = document.createElement('div');
        el.outerHTML = "<div id='StatusMessage' style='display: none; position: fixed; right: 0; left: 0; bottom: 0; padding: 10px; background: black; color: white; z-index: 1000; opacity: 0.90;font-size: 8.75pt;' ondblclick=\"this.style.display = \'none\'; this.innerText = \'\';\"></div>";
        document.body.append(el);
      }
      if (!msg)
        el.style.display = "none";
      else {
        var dt = new Date();
        msg = dt.getHours() + ":" +
          dt.getMinutes() + ":" +
          dt.getSeconds() + "." +
          Math.floor(dt.getMilliseconds()) + ": " + msg;

        if (!append) {
          el.innerText = msg;
        } else {
          var textEl = document.createElement('div');
          textEl.innerText = msg;
          msg = textEl.innerHTML;
          var old = el.innerHTML;
          if (old)
            msg = old + '</br>' + msg;
          el.innerHTML = msg;
        }

        el.style.display = "block";

        if (statusDefaultTimeout > 0) {
          if (statusTimeout)
            window.clearTimeout(statusTimeout);
          statusTimeout = window.setTimeout(function() {
              statusTimeout = null;
              var el = document.getElementById("StatusMessage");
              el.style.display = "none";
              el.innerText = '';
            }, timeout);
        }
      }
    }

})();


// This function is global and called by the .NET parent app
// to pass in the form object and pass back the text
// editor instance that allows the parent to make
// calls into this component
function initializeinterop( jsonStyle) {
    var te = window.textEditor;

    if (window.chrome) {
      te.mm = window.chrome.webview.hostObjects.sync.mm;   // WebView Proxy
      te.mmAsync = window.chrome.webview.hostObjects.mm;
    }

    var style = JSON.parse(jsonStyle);

    te.isEditorSimple = false;
    te.initialize(style);    

    setTimeout(te.keyBindings.setupKeyBindings, 300);
}

function initializeinteropSimple(jsonStyle) {
    var te = window.textEditor;

    if (window.chrome) {
        te.mm = window.chrome.webview.hostObjects.sync.mm; // WebView Proxy
        te.mmAsync = window.chrome.webview.hostObjects.mm;
    }

    var style = JSON.parse(jsonStyle);
    te.isEditorSimple = true;
    te.initialize(style);

    //setTimeout( te.keyBindings.setupKeyBindings, 300);
    // return window.textEditor;
}

/*
* Generic invocation script that invokes
* a function on the
*/
function Invoke(teFunction)
{
    if (arguments.length < 1)
        return null;

    var func = eval("te." + teFunction);
    if (typeof func != "function")
        throw new Error("Invalid Function to Invoke: " + teFunction);

    if (arguments.length > 1)
        Array.prototype.shift.call(arguments);

    return func.apply(window, arguments);
}
function GetValue(property) {
    return eval("te." + property);
}

// For Standalone from WebBrowser partial execution - uncomment this
var standalone = true;
if (standalone) {
    setTimeout(function() {
    window.textEditor.initialize(null);

    te.setvalue("# Markdown Text\n\n* Bullet 1\n* Bullet 2");
    // demonstrate how an external application can 'globally' trigger a function
    //Invoke("setvalue","# Markdown Text\n\n* Bullet 1\n* Bullet 2");
    },400);
}

