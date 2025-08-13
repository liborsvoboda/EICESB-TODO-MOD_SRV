# Westwind.RazorHosting Change Log

### Version 3.4
*December 24th, 2018*

* **Support for latest CSharp Features**  
You can now provide the CSharpCodeProvider that is used to compile Razor templates. This requires adding the `Microsoft.CodeDom.Providers.DotNetCompilerPlatform` and adding a `<codeDom>` section to the host project. We don't provide this in-box due to the large size of the compiler, so you get the lightweight CSharp 5.0 implementation out of box, and you can add Roslyn based compilation (~17meg package!) explicitly to your own application.

* **Better Error Handling for Host Containers**  
Host containers now render an error page on failures and set a `LastException` property on errors. Error page shows the error plus the error information with line numbers as well as the source code with line numbers to look up errors in templates more easily.

### Version 3.2
*January 7th, 2018*

* **Host Container ThrowExceptions Option**  
You can now have the Razor Host Containers throw exceptions when an error occurs rather than returning error information on the error message property. A custom exception is thrown that provides more information about the current request and engine.

* **StringHostContainer to match constructor format**   
Add overload to generic type overload of the StringHostContainer in the same way you can overload FolderHostContainer. Makes it easier to create application level hosts derived from a specific template.

* **RawString Default and Empty Property**  
Added `RawString.Empty` property which returns a new empty RawString instance. Default instance now also returns `string.Empty` (rather than null before).

### Version 3.1
*May 29th, 2017*

* **Support for Layout Pages with RazorFolderHostContainer**  
You can now use the **Layout** property in your templates when using the RazorFolderHostContainer class to render Razor Views using `@{ Layout = " ~\_Layout.cshtml" }` relative to the folder root.

* **Add inferModelType option for string RenderTemplate() methods**  
Added option to allow inferring the model type if no @model or @inherits
tags are provided in the template. If set this flag adds the model type
to the template to force a strongly typed model. Note that this feature
only works for string template rendering in RazorEngine.RenderTemplate()
and StringHostContainer.RenderTemplate(). Stream and file based renderers
do not have this feature and must explicitly specify the model type.

* **[Updated Documentation Site](https://west-wind.com/files/tools/razorhosting/docs/)**   
Updated the documentation site to use the latest [Help Builder](https://helpbuilder.west-wind.com) templates from old very outdated old MSDN style templates. Yikes! :smile: Updated content for version 3.0 improvements and added latest generated class documentation.

### Version 3.0
*July 8th, 2014*

* **Update to Razor Version 3**  
Updated to the latest version of the Razor Engine distributed
with MVC 5. Fix various issues that are a result of the 
  new rendering engine.

* **Require .NET 4.5 to run**  
The Razor Libraries version 3 requires .NET 4.5 so this library
is updating to the same .NET version.

* **Support for @helper**  
You can now use Razor Helpers using the @helper syntax supported
in core Razor. Helpers allow you to create small function like
Razor snippets that can either act as functions or execute razor
templates to provide reusability.

* **Version numbers in Sync with Razor Version**  
Decided to keep the library version in sync with Razor version.

* **RazorHostContainerBase now implements IDisposable**  
Container hosts are now IDisposable which makes it easier to stop them when
they are released. Default Dispose() behavior stops the engine and releases
all cached assemblies.


### Version 1.01
*December 20th, 2012*

* **Changed default bin folder location**  
Default folder location is now loaded from GetEntryAssembly() location by default and falls back to current directory if that can't resolve. BaseBinary folder can still be used to explicitly override the path.

* **Removed System.Web dependency**  
Removed dependency on System.Web for client applications. One drawback: 
No access to HtmlString(), for raw result values, so templates use a custom
RawString format.

* **RazorEngine.LastResultData property**  
to hold response data retrieved from last request

* **Added non-generic RazorEngine class**  
To simplify basic pages that don't require strongly typed ViewModels the non-generic RazorEngine class can now be used. When used only dynamic models are available.

* **Nested template Rendering**  
Added support to allow nested template rendering within expressions. Allows to have RazorExpressions to be evaluated in the result of a parsed expression. Useful for dynamic content systems that can contain Razor content as part of the application stored data (like a CMS or help system)
