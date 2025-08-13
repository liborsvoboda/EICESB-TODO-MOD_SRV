using System;

public static class Program {
    public static void Main() {
        Inspect.Heap((object)null);
    }
}

/* output

Exception: System.Exception: Inspect.Heap can't inspect null, as it does not point to a valid location on the heap.
   at SharpLab.Server.Execution.Runtime.MemoryBytesInspector.InspectHeap(Object object)
   at Inspect.Heap(Object object)
   at Program.Main()

*/