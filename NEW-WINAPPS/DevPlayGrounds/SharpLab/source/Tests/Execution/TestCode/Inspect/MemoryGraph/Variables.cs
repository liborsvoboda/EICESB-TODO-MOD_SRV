using System;
using System.Linq.Expressions;

public static class Program {
    public static void Main() {
        var a = 1;
        var b = 2;
        var c = "c";
        Inspect.MemoryGraph(a, c);
        Inspect.MemoryGraph(b);
    }
}

/* output

#{"type":"inspection:memory-graph","stack":[{"id":1,"offset":16,"size":4,"title":"a","value":"1"},{"id":2,"offset":0,"size":8,"title":"c","value":"String ref"}],"heap":[{"id":3,"title":"String","value":"c"}],"references":[{"from":2,"to":3}]}
#{"type":"inspection:memory-graph","stack":[{"id":1,"offset":0,"size":4,"title":"b","value":"2"}],"heap":[],"references":[]}

*/