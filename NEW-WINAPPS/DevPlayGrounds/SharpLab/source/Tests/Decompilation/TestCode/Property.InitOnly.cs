public class C {
    public int P { get; init; }
}

/* cs

using System.Diagnostics;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Security;
using System.Security.Permissions;

[assembly: CompilationRelaxations(8)]
[assembly: RuntimeCompatibility(WrapNonExceptionThrows = true)]
[assembly: Debuggable(DebuggableAttribute.DebuggingModes.IgnoreSymbolStoreSequencePoints)]
[assembly: SecurityPermission(SecurityAction.RequestMinimum, SkipVerification = true)]
[assembly: AssemblyVersion("0.0.0.0")]
[module: UnverifiableCode]
[module: RefSafetyRules(11)]

public class C
{
    [CompilerGenerated]
    private readonly int <P>k__BackingField;

    public int P
    {
        [CompilerGenerated]
        get
        {
            return <P>k__BackingField;
        }
        [CompilerGenerated]
        init
        {
            <P>k__BackingField = value;
        }
    }
}

*/