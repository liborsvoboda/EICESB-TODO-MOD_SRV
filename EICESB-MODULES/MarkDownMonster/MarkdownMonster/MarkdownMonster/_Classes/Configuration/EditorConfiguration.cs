﻿using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Documents;
using MarkdownMonster.Annotations;
using MarkdownMonster.Utilities;
using Westwind.Utilities;

namespace MarkdownMonster.Configuration
{
    /// <summary>
    /// Holds all Editor related configuration options
    /// </summary>
    public class EditorConfiguration : INotifyPropertyChanged
    {
        public EditorConfiguration()
        {
            Font = "Consolas";
            FontSize = 17;
            LineHeight = 1.45M;
            PreviewHighlightTimeout = 1800;  // 0 means it stays highlighted

            WrapText = true;
            HighlightActiveLine = true;

            EnableSpellcheck = true;
            Dictionary = "EN_US";
            KeyboardHandler = "default";  // vim,emacs
        }

        #region Font, Sizing and Padding

        /// <summary>
        /// The font used in the editor. Must be a fixed width font like Consolas, Courier New, Lucida Console etc.
        /// </summary>
        public string Font
        {
            get => _font;
            set
            {
                if (value == _font) return;

                if (mmImageUtils.IsFixedWidthFont(value))
                    _font = value;

                OnPropertyChanged(nameof(EditorConfiguration.Font));
            }
        }

        /// <summary>
        /// Font size for the editor.
        /// </summary>
        public int FontSize { get; set; }


        /// <summary>
        /// CSS style editor line height. Set to value between 1 and 2. Default 1.2
        /// </summary>
        public decimal LineHeight { get; set; }


        /// <summary>
        /// Sets the editor to render in the center of the canvas if a max width or
        /// padding is applied to the editor. Causes text to be rendered with surrounding
        /// white space if the canvas is larger than the width.
        ///
        /// Used in combination with `CenteredModeMaxWidth`.
        /// </summary>
        public bool CenteredMode
        {
            get {  return _centeredMode; }
            set
            {
                if (value == _centeredMode) return;
                _centeredMode = value;
                if (_centeredMode && CenteredModeMaxWidth == 0)
                    CenteredModeMaxWidth = 970;

                OnPropertyChanged();
            }
        }
        private bool _centeredMode = true;

        /// <summary>
        /// If set to a non-zero value will keep the editor's content width to
        /// this specified size. If the  canvas size is bigger the text is centered
        /// within the canvas area with whitespace on each side.
        /// </summary>
        public int CenteredModeMaxWidth { get; set; } = 970;

        /// <summary>
        /// Horizontal padding for the editor
        /// </summary>
        public int Padding { get; set; } = 20;

        /// <summary>
        /// Zoom level percentage on top of the EditorFontSize
        /// </summary>
        public int ZoomLevel
        {
            get { return _zoomLevel; }
            set
            {
                if (value == _zoomLevel) return;
                _zoomLevel = value;
                OnPropertyChanged(nameof(ZoomLevel));
                _zoomLevel = value;
            }
        }
        private int _zoomLevel = 100;

        #endregion

        #region Options

        /// <summary>
        /// Determines whether the active line is highlighted in the editor
        /// </summary>
        public bool HighlightActiveLine { get; set; }



        /// <summary>
        /// Determines whether line numbers are shown in the editor margin
        /// </summary>
        public bool ShowLineNumbers
        {
            get { return _showLineNumbers; }
            set
            {
                if (_showLineNumbers == value) return;
                _showLineNumbers = value;
                OnPropertyChanged(nameof(ShowLineNumbers));
            }
        }
        private bool _showLineNumbers = false;

        /// <summary>
        /// Shows special symbols for white space characters in the editor.
        /// </summary>
        public bool ShowInvisibles
        {
            get { return _showInvisibles; }
            set
            {
                if (_showInvisibles == value) return;
                _showInvisibles = value;
                OnPropertyChanged(nameof(ShowInvisibles));
            }
        }
        private bool _showInvisibles = false;


        /// <summary>
        /// Determines how linefeeds are treated by the editor for copy and paste
        /// operations and new text entered. `CrLf` or `Lf`.
        ///
        /// Note: It doesn't affect existing content in the document and doesn't
        /// re-write all line endings.
        /// </summary>
        public LinefeedModes LinefeedMode
        {
            get { return _linefeedMode; }
            set
            {
                if (value == _linefeedMode) return;
                _linefeedMode = value;
                OnPropertyChanged(nameof(LinefeedMode));
            }
        }
        private LinefeedModes _linefeedMode = LinefeedModes.Lf;


        #endregion

        #region Spell Checking
        /// <summary>
        /// Determines if spell checking is used. This value maps to the
        /// spell check button in the window header.
        /// </summary>
        public bool EnableSpellcheck
        {
            get { return _enableSpellcheck; }
            set
            {
                if (value == _enableSpellcheck) return;
                _enableSpellcheck = value;
                OnPropertyChanged(nameof(EnableSpellcheck));
            }
        }
        private bool _enableSpellcheck;

        /// <summary>
        /// Dictionary used by the editor. Defaults to 'en_US'.
        /// Others shipped: de_DE, es_ES, fr_FR
        /// Any OpenOffice style dictionary can be used by copying into
        /// the .\Editor folder providing .dic and .aff files.
        /// </summary>
        public string Dictionary
        {
            get => _dictionary;
            set
            {
                if (value == _dictionary) return;
                _dictionary = value;
                OnPropertyChanged();
            }
        }
        private string _dictionary;

        #endregion


        #region Tabs, Print Margin and Wrapping
        /// <summary>
        /// If using SoftTabs determines the Tab size
        /// </summary>
        public int TabSize { get; set; } = 4;

        /// <summary>
        /// Determines whether hard tabs or spaces are used for Tabs
        /// </summary>
        public bool UseSoftTabs { get; set; } = true;

        /// <summary>
        /// Determines whether the editor wraps text or extends lines
        /// out. Default is false.
        /// </summary>
        public bool WrapText
        {
            get { return _wrapText; }
            set
            {
                if (value == _wrapText) return;
                _wrapText = value;
                OnPropertyChanged(nameof(WrapText));
            }
        }

        private bool _wrapText;

        /// <summary>
        /// A numeric value for the column when the editor wraps for long lines. Default is 0 which wraps at the editor's full width.
        /// </summary>
        public int WrapMargin { get; set; }

        /// <summary>
        /// Determines if links embedded in the text are clickable via Ctrl-Click
        /// </summary>
        public bool ClickableLinks { get; set; } = true;

        /// <summary>
        /// Determines whether a print margin is displayed
        /// </summary>
        public bool ShowPrintMargin { get; set; }

        /// <summary>
        /// Size of the print margin if it's displayed
        /// </summary>
        public int PrintMargin { get; set; }

        #endregion

        #region Miscellaneous
        /// <summary>
        /// Keyboard input hanlder type:
        /// default (ace/vs), vim, emacs
        /// </summary>
        public string KeyboardHandler { get; set; }

        /// <summary>
        /// When checked allows the renderer to use RTL (Right To Left)
        /// processing of Markdown text that uses RTL characters. Also
        /// enabled RTL/LTR per paragraph switching in the editor.
        ///
        /// Defaults to off as it adds a bit of processing overhead.
        /// </summary>
        public bool EnableRightToLeft
        {
            get => _enableRightToLeft;
            set
            {
                if (value == _enableRightToLeft) return;
                _enableRightToLeft = value;
                OnPropertyChanged();
            }
        }

        private bool _enableRightToLeft;
        private string _font;


        /// <summary>
        /// If enabled prefills bullets and auto-numbers. Disabled
        /// by default because it has some side effects that
        /// are not desired by some.
        /// </summary>
        public bool EnableBulletAutoCompletion { get; set; }

        /// <summary>
        /// Additional Toolbar Icons:
        /// FontAwesomeIconId  /  MarkupMarkdown() action name
        /// https://github.com/RickStrahl/MarkdownMonster/blob/master/MarkdownMonster/_Classes/MarkdownDocumentEditor.cs#L508
        /// </summary>
        public Dictionary<string, string> AdditionalToolbarIcons {get; set; }= new Dictionary<string, string>();

        #endregion

        #region Preview Properties

        /// <summary>
        /// Determines how long the preview highlighting stays
        /// highlighted in the Preview Editor after navigating or editing
        /// text in the editor. Value is in milliseconds.
        /// Set to 0 to never clear.
        /// </summary>
        public int PreviewHighlightTimeout { get; set; }



        #endregion




        #region INotifyPropertyChanged

        public event PropertyChangedEventHandler PropertyChanged;

        [NotifyPropertyChangedInvocator]
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        #endregion
    }

    public enum LinefeedModes
    {
        Lf,
        CrLf
    }
}
