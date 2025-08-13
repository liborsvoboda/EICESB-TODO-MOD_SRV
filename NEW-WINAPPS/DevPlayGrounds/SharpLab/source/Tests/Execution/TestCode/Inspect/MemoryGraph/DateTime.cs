using System;
using System.Linq.Expressions;

public static class Program {
    public static void Main() {
        Inspect.MemoryGraph(new DateTime(2000, 1, 1));
    }
}

/* output

#{"type":"inspection:memory-graph","stack":[{"id":1,"offset":0,"size":8,"title":null,"value":"01.01.2000 00:00:00","nestedNodes":[{"id":2,"title":"_dateData","value":"630822816000000000"}]}],"heap":[],"references":[]}

*/