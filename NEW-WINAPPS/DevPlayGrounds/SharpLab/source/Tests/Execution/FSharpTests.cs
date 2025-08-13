using System.Threading.Tasks;
using Microsoft.CodeAnalysis;
using Xunit;
using SharpLab.Tests.Execution.Internal;
using SharpLab.Tests.Internal;
using Xunit.Abstractions;

namespace SharpLab.Tests.Execution;

[Collection(TestCollectionNames.Execution)]
public class FSharpTests {
    public FSharpTests(ITestOutputHelper output) {
        // TestDiagnosticLog.Enable(output);
    }

    [Fact]
    public async Task FSharp_Simple() {
        // Arrange
        var code = @"
            open System
            printf ""Test""
        ";

        // Act
        var output = await ContainerTestDriver.CompileAndExecuteAsync(code, LanguageNames.FSharp);

        // Assert
        Assert.Equal("Test", output);
    }

    [Fact]
    public async Task FSharp_WithExplicitEntryPoint() {
        // Arrange
        var code = @"
            open System

            [<EntryPoint>]
            let main argv = 
                printf ""Test""
                0
        ";

        // Act
        var output = await ContainerTestDriver.CompileAndExecuteAsync(code, LanguageNames.FSharp);

        // Assert
        Assert.Equal("Test", output);
    }


    [Fact]
    public async Task FSharp_Empty() {
        // Act
        var output = await ContainerTestDriver.CompileAndExecuteAsync("", LanguageNames.FSharp);

        // Assert            
        Assert.Equal("", output);
    }
}
