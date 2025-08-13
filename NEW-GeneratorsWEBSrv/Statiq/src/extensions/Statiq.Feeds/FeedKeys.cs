﻿namespace Statiq.Feeds
{
    /// <summary>
    /// Keys for use with the <see cref="GenerateFeeds"/> module.
    /// </summary>
    public static class FeedKeys
    {
        /// <summary>
        /// The default metadata key for getting the title of feed items.
        /// </summary>
        /// <type cref="string" />
        public const string Title = nameof(Title);

        /// <summary>
        /// The default metadata key for getting the description of feed items.
        /// </summary>
        /// <type cref="string" />
        public const string Description = nameof(Description);

        /// <summary>
        /// The default metadata key for getting the author of feed items.
        /// </summary>
        /// <type cref="string" />
        public const string Author = nameof(Author);

        /// <summary>
        /// The default metadata key for getting the image of feed items.
        /// </summary>
        /// <type cref="string" />
        public const string Image = nameof(Image);

        /// <summary>
        /// The default metadata key for getting the copyright of feed items.
        /// </summary>
        /// <type cref="string" />
        public const string Copyright = nameof(Copyright);

        /// <summary>
        /// The default metadata key for getting the excerpt of feed items. The
        /// excerpt is typically only used for the feed item if a description
        /// is not provided.
        /// </summary>
        /// <type cref="string" />
        public const string Excerpt = nameof(Excerpt);

        /// <summary>
        /// The default metadata key for getting the published date of feed items.
        /// </summary>
        /// <type cref="string" />
        public const string Published = nameof(Published);

        /// <summary>
        /// The default metadata key for getting the updated date of feed items.
        /// </summary>
        /// <type cref="string" />
        public const string Updated = nameof(Updated);

        /// <summary>
        /// The default metadata key for getting the content of feed items.
        /// </summary>
        /// <type cref="string" />
        public const string Content = nameof(Content);
    }
}