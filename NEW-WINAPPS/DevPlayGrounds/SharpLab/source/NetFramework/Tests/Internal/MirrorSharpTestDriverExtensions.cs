using System.Collections.Generic;
using System.Threading.Tasks;
using MirrorSharp.Testing;
using SharpLab.Server.Common;

namespace SharpLab.Tests.Internal {
    public static class MirrorSharpTestDriverExtensions {
        public static Task SendSetOptionsAsync(this MirrorSharpTestDriver driver, string sourceLanguageName, string targetName, string optimize = Optimize.Release) {
            return driver.SendSetOptionsAsync(new Dictionary<string, string> {
                {"language", sourceLanguageName},
                {"x-optimize", optimize},
                {"x-target", targetName}
            });
        }
    }
}
