﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebMarkupMin.Core;
using Statiq.Common;
using Microsoft.Extensions.Logging;

namespace Statiq.Minification
{
    public abstract class MinifierBase
    {
        public async Task<IEnumerable<IDocument>> MinifyAsync(IExecutionContext context, Func<string, MinificationResultBase> minify, string minifierType)
        {
            return await context.Inputs
                .ToAsyncEnumerable()
                .SelectAwait(async input =>
                {
                    try
                    {
                        MinificationResultBase result = minify(await input.GetContentStringAsync());

                        if (result.Errors.Count > 0)
                        {
                            context.LogError("{0} errors found while minifying {4} for {1}:{2}{3}", result.Errors.Count, input.ToSafeDisplayString(), Environment.NewLine, string.Join(Environment.NewLine, result.Errors.Select(MinificationErrorInfoToString)), minifierType);
                            return input;
                        }

                        if (result.Warnings.Count > 0)
                        {
                            context.LogWarning("{0} warnings found while minifying {4} for {1}:{2}{3}", result.Warnings.Count, input.ToSafeDisplayString(), Environment.NewLine, string.Join(Environment.NewLine, result.Warnings.Select(MinificationErrorInfoToString)), minifierType);
                        }

                        return input.Clone(context.GetContentProvider(result.MinifiedContent, input.ContentProvider.MediaType));
                    }
                    catch (Exception ex)
                    {
                        context.LogError("Exception while minifying {2} for {0}: {1}", input.ToSafeDisplayString(), ex.Message, minifierType);
                        return input;
                    }
                })
                .ToListAsync();
        }

        private string MinificationErrorInfoToString(MinificationErrorInfo info) => $"Line {info.LineNumber}, Column {info.ColumnNumber}:{Environment.NewLine}{info.Category} {info.Message}{Environment.NewLine}{info.SourceFragment}";
    }
}