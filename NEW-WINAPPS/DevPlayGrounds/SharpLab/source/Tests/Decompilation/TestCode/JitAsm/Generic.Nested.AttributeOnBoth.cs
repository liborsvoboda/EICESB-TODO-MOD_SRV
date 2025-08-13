using SharpLab.Runtime;

[JitGeneric(typeof(int))]
[JitGeneric(typeof(string))]
static class C<T> {
    [JitGeneric(typeof(int))]
    [JitGeneric(typeof(string))]
    static class N<U> {
        static T M(U u) => default(T);
    }
}

/* asm

; Core CLR <IGNORE> on x64

C`1+N`1[[System.Int32, System.Private.CoreLib],[System.Int32, System.Private.CoreLib]].M(Int32)
    L0000: xor eax, eax
    L0002: ret

C`1+N`1[[System.Int32, System.Private.CoreLib, Version=8.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e],[System.String, System.Private.CoreLib, Version=8.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]].M(...)
    ; Failed to find JIT output. This might appear more frequently than before due to a library update.
    ; Please monitor https://github.com/ashmind/SharpLab/issues/1334 for progress.

C`1+N`1[[System.String, System.Private.CoreLib, Version=8.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e],[System.Int32, System.Private.CoreLib, Version=8.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]].M(...)
    ; Failed to find JIT output. This might appear more frequently than before due to a library update.
    ; Please monitor https://github.com/ashmind/SharpLab/issues/1334 for progress.

C`1+N`1[[System.String, System.Private.CoreLib, Version=8.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e],[System.String, System.Private.CoreLib, Version=8.0.0.0, Culture=neutral, PublicKeyToken=7cec85d7bea7798e]].M(...)
    ; Failed to find JIT output. This might appear more frequently than before due to a library update.
    ; Please monitor https://github.com/ashmind/SharpLab/issues/1334 for progress.

*/