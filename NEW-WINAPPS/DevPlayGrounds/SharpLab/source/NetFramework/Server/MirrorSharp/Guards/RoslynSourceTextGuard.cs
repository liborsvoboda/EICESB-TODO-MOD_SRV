using System;
using System.IO;
using System.Text;
using Microsoft.CodeAnalysis.Text;
using MirrorSharp.Advanced.EarlyAccess;
using SharpLab.Server.Common;

namespace SharpLab.Server.MirrorSharp.Guards {
    public class RoslynSourceTextGuard : IRoslynSourceTextGuard {
        private const int BracketsNestingLimit = 5;
        private const int BracketsAdjacentPairLimit = 4;

        private static readonly Pool<ValidatingSourceTextWriter> _validatingWriterPool = new Pool<ValidatingSourceTextWriter>(
            () => new ValidatingSourceTextWriter()
        );

        public void ValidateSourceText(SourceText sourceText) {
            Argument.NotNull(nameof(sourceText), sourceText);

            using var writerLease = _validatingWriterPool.GetOrCreate();
            var writer = writerLease.Object;

            writer.Reset();
            sourceText.Write(writer);
        }

        private class ValidatingSourceTextWriter : TextWriter {
            private int _roundBracketsNestingLevel;
            private readonly int[] _roundBracketsAdjacentPairCounts = new int[BracketsNestingLimit + 1];

            private int _squareBracketsNestingLevel;
            private readonly int[] _squareBracketsAdjacentPairCounts = new int[BracketsNestingLimit + 1];

            public override Encoding Encoding => Encoding.UTF8;

            public override void Write(char @char) {
                ValidateBrackets(@char, '(', ')', ref _roundBracketsNestingLevel, _roundBracketsAdjacentPairCounts);
                ValidateBrackets(@char, '[', ']', ref _squareBracketsNestingLevel, _squareBracketsAdjacentPairCounts);
            }

            private void ValidateBrackets(char @char, char openBracket, char closeBracket, ref int nestingLevel, int[] adjacentPairCounts) {
                if (@char == openBracket) {
                    nestingLevel += 1;
                    if (nestingLevel > BracketsNestingLimit)
                        throw new RoslynSourceTextGuardException($"Exceeded nesting limit of {openBracket}{closeBracket}.");
                    return;
                }

                if (nestingLevel > 0 && @char == closeBracket) {
                    nestingLevel -= 1;
                    adjacentPairCounts[nestingLevel] += 1;
                    if (adjacentPairCounts[nestingLevel] > BracketsAdjacentPairLimit)
                        throw new RoslynSourceTextGuardException($"Exceeded limit on consecutive {openBracket}{closeBracket}.");
                    for (var i = nestingLevel + 1; i < adjacentPairCounts.Length; i++) {
                        adjacentPairCounts[i] = 0;
                    }
                    return;
                }

                if (!char.IsWhiteSpace(@char)) {
                    adjacentPairCounts[nestingLevel] = 0;
                    return;
                }
            }

            public void Reset() {
                _roundBracketsNestingLevel = 0;
                for (var i = 0; i < _roundBracketsAdjacentPairCounts.Length; i++) {
                    _roundBracketsAdjacentPairCounts[i] = 0;
                }

                _squareBracketsNestingLevel = 0;
                for (var i = 0; i < _squareBracketsAdjacentPairCounts.Length; i++) {
                    _squareBracketsAdjacentPairCounts[i] = 0;
                }
            }
        }
    }
}
