namespace GroupwareSolution.Plugin {

    /// <summary>
    /// Shared Definition for Complete Plugins Data
    /// </summary>
    public partial class PluginData {

        /// <summary>
        /// Distribution Database Request Init
        /// Client Database Init
        /// Database SQL Command Definition 
        /// TODO AUTOExtend Dials
        /// </summary>
        public bool SolutionDbInit { get; set; } = true;
        public bool ClientDBInit { get; set; } = true;
        public string MSSQLCmd { get; set; } = string.Empty;

        public List<string>? PluginParams { get; set; } = null;
        public int? Price { get; set; } = null;
        public string? GitHubUrl { get; set; } = null;
        public bool ClientCustomPlugin { get; set; } = false;

        public bool CmdPluginType { get; set; } = true!;
        public bool CmdCommandType { get; set; } = true!;
        public string CmdDataFolder { get; set; } = "package";
        public string CodeTemplate { get; set; } = null;
        public List<string> CustomData { get; set; }


    }

    public enum CommandType {
        browser,
        exe,
        dll,
        python,
        powershell,
        nodejs
    }

}
