﻿using System.Collections.Generic;
using System.Threading.Tasks;
using Statiq.Common;
using WebMarkupMin.Core;

namespace Statiq.Minification
{
    /// <summary>
    /// Minifies the JS content.
    /// </summary>
    /// <remarks>
    /// This module takes the JS content and uses minification to reduce the output.
    /// </remarks>
    /// <example>
    /// <code>
    /// Pipelines.Add("JS",
    ///     ReadFiles("*.js"),
    ///     MinifyJs(),
    ///     WriteFiles(".js")
    /// );
    /// </code>
    /// </example>
    /// <category name="Content" />
    public class MinifyJs : MinifierBase, IModule
    {
        private bool _isInlineCode;

        /// <summary>
        /// Minifies the JS content.
        /// </summary>
        /// <param name="isInlineCode">
        /// Boolean to specify whether the content has inline JS code. Default value is <c>false</c>.
        /// </param>
        public MinifyJs(bool isInlineCode = false)
        {
            // https://github.com/Taritsyn/WebMarkupMin/wiki/Built-in-JS-minifiers
            _isInlineCode = isInlineCode;
        }

        /// <summary>
        /// Flag for whether the content has inline JS code.
        /// </summary>
        /// <param name="isInlineCode">Default value is <c>true</c>.</param>
        /// <returns>The current instance.</returns>
        public MinifyJs IsInlineCode(bool isInlineCode = true)
        {
            _isInlineCode = isInlineCode;
            return this;
        }

        /// <inheritdoc />
        public async Task<IEnumerable<IDocument>> ExecuteAsync(IExecutionContext context)
        {
            CrockfordJsMinifier minifier = new CrockfordJsMinifier();

            return await MinifyAsync(context, (x) => minifier.Minify(x, _isInlineCode), "JS");
        }
    }
}