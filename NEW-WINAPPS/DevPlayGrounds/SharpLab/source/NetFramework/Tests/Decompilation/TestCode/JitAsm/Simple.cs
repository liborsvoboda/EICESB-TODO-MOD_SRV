static class C {
    static int M() => 0x12345;
}

/* asm

; Desktop CLR <IGNORE> on x64

Microsoft.CodeAnalysis.EmbeddedAttribute..ctor()
    L0000: ret

System.Runtime.CompilerServices.RefSafetyRulesAttribute..ctor(Int32)
    L0000: mov [rcx+0x8], edx
    L0003: ret

C.M()
    L0000: mov eax, 0x12345
    L0005: ret

*/