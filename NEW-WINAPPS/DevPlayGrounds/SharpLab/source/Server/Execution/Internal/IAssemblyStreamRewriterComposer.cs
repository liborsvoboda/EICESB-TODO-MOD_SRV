using MirrorSharp.Advanced;
using SharpLab.Server.Common;

namespace SharpLab.Server.Execution.Internal {
    public interface IAssemblyStreamRewriterComposer {
        AssemblyStreamRewriteResult Rewrite(CompilationStreamPair streams, IWorkSession session);
    }
}