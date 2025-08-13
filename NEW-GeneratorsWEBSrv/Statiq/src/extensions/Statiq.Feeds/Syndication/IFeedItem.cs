using System;

namespace Statiq.Feeds.Syndication
{
    /// <summary>
    /// Item interface.
    /// </summary>
    public interface IFeedItem : IFeedMetadata
    {
        /// <summary>
        /// Gets the content.
        /// </summary>
        string Content { get; }

        /// <summary>
        /// Gets the link to comments on this item.
        /// </summary>
        Uri ThreadLink { get; }

        /// <summary>
        /// Gets the number of comments on this item.
        /// </summary>
        int? ThreadCount { get; }

        /// <summary>
        /// Gets the number of comments on this item.
        /// </summary>
        DateTime? ThreadUpdated { get; }
    }
}