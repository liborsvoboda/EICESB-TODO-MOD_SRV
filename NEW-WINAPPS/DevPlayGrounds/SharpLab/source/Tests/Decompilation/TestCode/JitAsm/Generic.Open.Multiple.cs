using SharpLab.Runtime;

static class C<T> {
    static void M() {}

    static class N {
        static void M() {}
    }
}

static class C {
    static void M<T>() {}

    static class N<T> {
        static void M() {}
    }
}

/* asm

; Core CLR <IGNORE> on x64

C`1.M()
    ; Open generics cannot be JIT-compiled.
    ; However you can use attribute SharpLab.Runtime.JitGeneric to specify argument types.
    ; Example: [JitGeneric(typeof(int)), JitGeneric(typeof(string))] void M<T>() { ... }.

C`1+N.M()
    ; Open generics cannot be JIT-compiled.
    ; However you can use attribute SharpLab.Runtime.JitGeneric to specify argument types.
    ; Example: [JitGeneric(typeof(int)), JitGeneric(typeof(string))] void M<T>() { ... }.

C.M[[, _]]()
    ; Open generics cannot be JIT-compiled.
    ; However you can use attribute SharpLab.Runtime.JitGeneric to specify argument types.
    ; Example: [JitGeneric(typeof(int)), JitGeneric(typeof(string))] void M<T>() { ... }.

C+N`1.M()
    ; Open generics cannot be JIT-compiled.
    ; However you can use attribute SharpLab.Runtime.JitGeneric to specify argument types.
    ; Example: [JitGeneric(typeof(int)), JitGeneric(typeof(string))] void M<T>() { ... }.

*/