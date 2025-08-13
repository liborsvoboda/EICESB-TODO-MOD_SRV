define("ace/theme/visualstudio.css",["require","exports","module"], function(require, exports, module){module.exports = "/* BUILT WITH ACE */\n.ace-vs .ace_gutter {\n  background: #fcfcfc;\n  color: #222;  \n}\n.ace-vs .ace_print-margin {\nwidth: 1px;\nbackground: #e8e8e8;\n}\n.ace-vs .ace_fold {\nbackground-color: #6B72E6;\n}\n.ace-vs {\n  background-color: #fcfcfc;\n  color: #222;\n}\n.ace-vs .ace_cursor {\ncolor: black;\n}\n.ace-vs .ace_invisible {\ncolor: rgb(191, 191, 191);\n}\n.ace-vs .ace_storage, .ace-vs .ace_keyword {\ncolor: #0000ff;\n}\n.ace-vs .ace_constant {\ncolor: rgb(197, 6, 11);\n}\n.ace-vs .ace_constant.ace_buildin {\ncolor: orange;\n}\n.ace-vs .ace_constant.ace_language {\ncolor: rgb(88, 92, 246);\n}\n.ace-vs .ace_constant.ace_library {\ncolor: rgb(6, 150, 14);\n}\n.ace-vs .ace_invalid {\nbackground-color: rgba(255, 0, 0, 0.1);\ncolor: red;\n}\n.ace-vs .ace_support.ace_function {\ncolor: Teal;\n}\n.ace-vs .ace_support.ace_constant {\ncolor: rgb(6, 150, 14);\n}\n.ace-vs .ace_support.ace_type, .ace-vs .ace_support.ace_class {\ncolor: rgb(109, 121, 222);\n}\n.ace-vs .ace_keyword.ace_operator {\ncolor: blue;\n}\n.ace-vs .ace_string {\ncolor: maroon;\n}\n.ace-vs .ace_comment {\ncolor: green;\n}\n.ace-vs .ace_comment.ace_doc {\ncolor: rgb(0, 102, 255);\n}\n.ace-vs .ace_comment.ace_doc.ace_tag {\ncolor: rgb(128, 159, 191);\n}\n.ace-vs .ace_constant.ace_numeric {\ncolor: rgb(0, 0, 205);\n}\n.ace-vs .ace_variable {\ncolor: rgb(49, 132, 149);\n}\n.ace-vs .ace_xml-pe {\ncolor: rgb(104, 104, 91);\n}\n.ace-vs .ace_entity.ace_name.ace_function {\ncolor: #0000A2;\n}\n.ace-vs .ace_list {\ncolor: rgb(185, 6, 144);\n}\n.ace-vs .ace_meta.ace_tag {\ncolor: #b70202;\n}\n.ace-vs .ace_tag.ace_punctuation{\ncolor: blue;\n}\n.ace-vs .ace_attribute-name {\ncolor: red;\n}\n.ace-vs .ace_string.ace_regex {\ncolor: blue;\n}\n.ace-vs .ace_marker-layer .ace_selection {\nbackground: rgb(181, 213, 255);\n}\n.ace-vs.ace_multiselect .ace_selection.ace_start {\nbox-shadow: 0 0 3px 0px white;\nborder-radius: 2px;\n}\n.ace-vs .ace_marker-layer .ace_step {\nbackground: rgb(252, 255, 0);\n}\n.ace-vs .ace_marker-layer .ace_stack {\nbackground: rgb(164, 229, 101);\n}\n.ace-vs .ace_marker-layer .ace_bracket {\nmargin: -1px 0 0 -1px;\nborder: 1px solid rgb(192, 192, 192);\n}\n.ace-vs .ace_marker-layer .ace_active-line {\nbackground: rgba(0, 0, 0, 0.07);\n}\n.ace-vs .ace_gutter-active-line {\nbackground-color: silver;\n}\n.ace-vs .ace_marker-layer .ace_selected-word {\nbackground: red;\nborder: 1px solid rgb(200, 200, 250);\n}\n.ace-vs .ace_heading {\ncolor: Steelblue;\nfont-weight: bold;\n}\n.ace-vs .ace_strong {\nfont-weight: bold !important;\n}\n.ace-vs .ace_emphasis {\nfont-style: italic;\n}\n";

});

define("ace/theme/visualstudio",["require","exports","module","ace/theme/visualstudio.css","ace/lib/dom"], function(require, exports, module){exports.isDark = false;
exports.cssClass = "ace-vs";
exports.cssText = require("./visualstudio.css");
var dom = require("../lib/dom");
dom.importCssString(exports.cssText, exports.cssClass);

});
                (function() {
                    window.require(["ace/theme/visualstudio"], function(m) {
                        if (typeof module == "object" && typeof exports == "object" && module) {
                            module.exports = m;
                        }
                    });
                })();
            