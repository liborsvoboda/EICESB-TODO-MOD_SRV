static class C {
    static class N {
        static int M() => 0x12345;
    }
}

/* asm

; Core CLR <IGNORE> on x64

C+N.M()
    L0000: mov eax, 0x12345
    L0005: ret

*/