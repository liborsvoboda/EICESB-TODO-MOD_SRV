using System;
public class C {
    void M() {
        again: try {
            while(true) {}
        }
        catch {
            goto again;
      	}
    }
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
    private void M()
    {
        while (true)
        {
            try
            {
                while (true)
                {
                }
            }
            catch
            {
            }
        }
    }
}

*/