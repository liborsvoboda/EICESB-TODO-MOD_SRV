var page = {
    tableData: {
        isPreviewActive: false,
        activeCell: { row: 0, column: 0, isHeader: true },
        headers: [
            "Header 1",
            "Header 2:",
            "Header 3"
        ],
        rows: [
            [
                "Column 1",
                "Column 2",
                "Column 3"
            ]
        ]
    },
    dotnet: null,
    mousePos: {
        x: -1,
        y: -1,
        // row 0: Header, row -1: not set
        row: -1,
        col: -1
    },
    workElement: null,
    initialize: function() {
        var div$ = $("#RenderWrapper");
        page.workElement = document.createElement("div");

        setTimeout(async function () {
            // handle tab insertion and up down key navigation
            div$.on("keydown", "td textarea,th textarea", await page.keydownHandler);

            div$.on("keyup", "th textarea", page.headerAlignment);

            // Initial header alignment for all headers
            setTimeout(function () { $("th textarea").trigger("keyup"); }, 10);

            div$.on("change",
                "textarea",
                async function () {
                    if (page.dotnet) {
                       var pos = page.idToPos(this.id); // update location
                       await page.dotnetAsync.RefreshPreview(JSON.stringify(pos));
                       await page.dotnetAsync.UpdateTableData(page.parseTable(true));
                    }
                });
            div$.on("contextmenu",
                "textarea",
                async function (e) {
                    var textBox = e.target;
                    if (textBox.tagName !== "TEXTAREA") return;
                    var pos = page.idToPos(textBox.id);

                    if (page.dotnet)
                        await page.dotnetAsync.ShowContextMenu(JSON.stringify(pos));
                    else {
                        alert(JSON.stringify(pos));
                    }
                    return false;
                });
            div$.on("focus",
                "textarea",
                function () {
                    this.select();
                    if (!this.id) return;
                    var pos = page.idToPos(this.id);
                });
            div$.on("mouseleave",
                "textarea",
                async function () {
                    if (!this.id) return;
                    var pos = page.idToPos(this.id);

                    if (page.dotnet)
                        await page.dotnet.UpdateTableData(page.parseTable(true));
                });
        });

        
        
    },
    keydownHandler: async function (e) {

        console.log(`kc: ${e.keyCode}  key: ${e.key }   a:${e.altKey}  c:${e.ctrlKey }  s:${ e.shiftKey}`);

        var isAlt = e.originalEvent.getModifierState("Alt");
        var isShift = e.originalEvent.getModifierState("Shift");
        var isCtrl = e.originalEvent.getModifierState("Control");

        console.log(`a:${isAlt}  s:${isShift}  c:${isCtrl}`);

        var text$ = $(this);
        var id = this.id;

        var pos = page.idToPos(id);
        if (pos.row === -1) return;

        console.log("Key position", pos);
        // tab end of list insertion
        if (!e.shiftKey && e.keyCode === 9 && this.parentNode.tagName !== "TH") {
            // find next td
            var $next = $(this).parent().next();
            if ($next.length > 0) // not last textarea
                return;

            // find next tr
            var tr$ = $(this).parent().parent().next();
            if (tr$.length > 0) // not last tr
                return;

            var clonedTr$ = $(this).parent().parent().clone();
            clonedTr$.find("textarea").each(function(i) {
                var pos = page.idToPos(this.id);
                var row = pos.row + 1;
                this.id = "id_" + row + "_" + pos.column;
                this.value = "";
                $(this).attr("rows", "1");
                autosize(this);
            });
            $("tbody").append(clonedTr$);
        }
        // ctrl-enter
        else if (e.keyCode === 13 && e.ctrlKey) {
            if (page.dotnet)
               await page.dotnetAsync.KeyboardCommand("Ctrl-Enter");
        }
        // alt-shift-down - insert row below
        else if (e.keyCode === 40 && e.altKey && e.shiftKey) {
            e.preventDefault();
            if (page.dotnet)
                await page.dotnetAsync.KeyboardCommand("Alt-Shift-Down");

            return false;
        }
        // alt-shift-up - insert row above
        else if (e.keyCode === 38 && e.altKey && e.shiftKey) {
            e.preventDefault();
            if (page.dotnet)
                await page.dotnetAsync.KeyboardCommand("Alt-Shift-Up");
            return false;
        }
        // alt-shift-delete - delete row
        else if (e.keyCode === 46 && e.altKey) {
            if (page.dotnet)
                await page.dotnetAsync.KeyboardCommand("Alt-Delete");
        }
        // alt-down - move row down
        else if (e.keyCode === 40 && e.altKey) {
            if (page.dotnet)
                await page.dotnetAsync.KeyboardCommand("Alt-Down");
            return false;
        }
        // alt-up - move row up
        else if (e.keyCode === 38 && e.altKey) {
            if (page.dotnet)
                await page.dotnetAsync.KeyboardCommand("Alt-Up");
            return false;
        }
        // alt-left - move column left
        else if (e.keyCode === 37 && e.altKey) {
            if (page.dotnet)
                await page.dotnetAsync.KeyboardCommand("Alt-Left");
            return false;
        }
        // alt-right - move column right
        else if (e.keyCode === 39 && e.altKey) {
            if (page.dotnet)
                await page.dotnetAsync.KeyboardCommand("Alt-Right");
            return false;
        }

        // down key navigates
        else if (e.keyCode === 40) {
            var hasReturns = this.value.indexOf("\n") > 0;
            if (hasReturns && !e.ctrlKey) return null; // line breaks - don't use arrows

            // move to new row
            var newRow = pos.row + 1;
            var newId = "#id_" + newRow + "_" + pos.column;
            $(newId).focus();

            return false;
        }
        // up key navigation
        else if (e.keyCode === 38) {
            var hasReturns = this.value.indexOf("\n") > 0;
            if (pos.row < 1 || (hasReturns && !e.ctrlKey)) return true;

            var newRow = pos.row - 1;
            var newId = "#id_" + newRow + "_" + pos.column;
            $(newId).focus();
            return false;
        }
    },

    headerAlignment: function() {
        var el$ = $(this);
        var text = el$.val();

        var pos = page.idToPos(this.id);
        if (pos.row !== 0) return;

        var col = pos.column + 1;
        var cols$ = $("#RenderWrapper thead th:nth-child(" +
            col +
            ") textarea," +
            "#RenderWrapper tbody td:nth-child(" +
            col +
            ") textarea");

        cols$.removeClass("center-align");
        cols$.removeClass("right-align");

        if (text[text.length - 1] === ":" && text[0] === ":") {
            cols$.addClass("center-align");
        }
        if (text[text.length - 1] === ":") {
            cols$.addClass("right-align");
        }

    },
    renderTable: function (tableData) {

        console.log('renderTable',tableData);
        try {
            if (typeof tableData === "string")
                page.tableData = JSON.parse(tableData);

            var focusLocation = page.tableData.activeCell;

            var html = "<table>\n";
            var headers = page.tableData.headers;

            // row 0
            if (headers && headers.length > 0) {
                html += "<thead>\n<tr>";

                for (let i = 0; i < headers.length; i++) {
                    var colText = headers[i];
                    var c = i;
                    html += "<th><textarea id='id_0_" +
                        c +
                        "' rows='1'>" +
                        page.encodeText(colText) +
                        "</textarea></th>";
                }
                html += "</tr>\n</thead>"
            }

            // content rows are 1 based to account for row ids
            var rows = page.tableData.rows;
            if (rows && rows.length > 0) {
                html += "<tbody>\n"

                for (let rowIdx = 0; rowIdx < rows.length; rowIdx++) {
                    var rowArray = rows[rowIdx];
                    html += "<tr>\n"

                    for (var colIdx = 0; colIdx < rowArray.length; colIdx++) {
                        var colText = rowArray[colIdx];
                        var r = rowIdx * 1 + 1;
                        var c = colIdx * 1;
                        html += "<td><textarea id='id_" +
                            r +
                            "_" +
                            c +
                            "' rows='1'>" +
                            page.encodeText(colText) +
                            "</textarea></td>\n";
                    }

                    html += "</tr>\n";
                }
                html += "</tbody>";
            }

            html += "</table>";
            $("#RenderWrapper").html(html);

            // console.log(html);

            if (focusLocation) {
                if (focusLocation.isHeader) {
                    var $el = $("th textarea").first();
                    $el.focus();
                } else {
                    var row = focusLocation.row + 1;
                    var sel = "#id_" + row + "_" + focusLocation.column;
                    $(sel).focus();
                    setTimeout(() => $(sel)[0].scrollIntoView(), 10);
                }
            }

            autosize(document.querySelectorAll('textarea'));

            setTimeout(function() {
                    $("th textarea").trigger("keyup");
                },
                20);
        } catch (ex) {
            console.log("RenderTable Error:\n" + ex.message, ex);
        }
    },
    parseTable: function(asJson) {
        var td = page.tableData;

        $("#RenderWrapper thead th textarea").each(function(i) {
            td.headers[i] = this.value.trimEnd();
        });
        $("#RenderWrapper tbody tr").each(function(i) {
            var row = [];
            $(this).find("textarea").each(function(x) {
                row[x] = this.value.trimEnd();
            });
            td.rows[i] = row;
        });
        //page.tableData = td;

        // strip out trailing empty lines
        //for (let i = td.rows.length - 1; i > -1; i--) {
        //    var row = td.rows[i];
        //    var nonBlank = false;
        //    for (let x = 0; x < row.length; x++) {
        //        if (row[x]) {
        //            nonBlank = true;
        //            break;
        //        }
        //    }
        //    if (nonBlank) break;
        //    td.rows.pop();
        //}

        if (asJson) {
            var json = JSON.stringify(td);
            //console.log('parseTable:\n' + json);
            return json;
        }
        return td;
    },

    idToPos: function (id) {
        if (!id) return;

        var pos = { row: -1, column: -1 };

        var id = id.replace("id_", "");
        var tokens = id.split("_");
        if (tokens.length < 2) return pos;

        pos.row = tokens[0] * 1;
        pos.column = tokens[1] * 1;

        page.tableData.activeCell.row = pos.row;
        page.tableData.activeCell.column = pos.column;

        return pos;
    },
    encodeText: function(text) {
        page.workElement.innerText = text;
        return page.workElement.innerHTML.replace(/<br>/g, "\n");
    },


};  // page

page.initialize();
page.renderTable();

function InitializeInterop(tableDataJson) {
    if (window.chrome) {
        page.dotnet = window.chrome.webview.hostObjects.sync.dotnet;   // WebView Proxy
        page.dotnetAsync = window.chrome.webview.hostObjects.dotnet;
    }
    page.tableData = JSON.parse(tableDataJson);
    page.renderTable();

    setTimeout(function() {
        var first = $("th textarea");
        if (first.length > 0)
            setTimeout(function() { first[0].focus(); }, 320);
    });

    return page;
}
