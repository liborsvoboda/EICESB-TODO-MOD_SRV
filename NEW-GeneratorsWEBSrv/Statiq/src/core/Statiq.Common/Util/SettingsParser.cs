﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace Statiq.Common
{
    /// <summary>
    /// Parses INI-like args in key=value format.
    /// </summary>
    public static class SettingsParser
    {
        public static IReadOnlyDictionary<string, string> Parse(IEnumerable<string> args) =>
            args.Select(ParsePair).ToDictionary(pair => pair.Key, pair => pair.Value);

        public static KeyValuePair<string, string> ParsePair(string arg)
        {
            // Find the first unescaped equal
            for (int i = 0; i < arg.Length; i++)
            {
                if (arg[i] == '=' && i > 0 && arg[i - 1] != '\\')
                {
                    return new KeyValuePair<string, string>(
                        Unescape(arg.Substring(0, i).Trim()),
                        Unescape(arg.Substring(i + 1).Trim()));
                }
            }

            // If one wasn't found, just unescape the whole string and set a true value
            return new KeyValuePair<string, string>(Unescape(arg.Trim()), "true");
        }

        // Based on code from StackOverflow: http://stackoverflow.com/a/25471811/807064
        public static string Unescape(string s)
        {
            StringBuilder sb = new StringBuilder();
            Regex r = new Regex("\\\\[=abfnrtv?\"'\\\\]|\\\\[0-3]?[0-7]{1,2}|\\\\u[0-9a-fA-F]{4}|\\\\U[0-9a-fA-F]{8}|.");
            foreach (Match m in r.Matches(s, 0))
            {
                if (m.Length == 1)
                {
                    sb.Append(m.Value);
                }
                else
                {
                    if (m.Value[1] >= '0' && m.Value[1] <= '7')
                    {
                        int i = Convert.ToInt32(m.Value.Substring(1), 8);
                        sb.Append((char)i);
                    }
                    else if (m.Value[1] == 'u')
                    {
                        int i = Convert.ToInt32(m.Value.Substring(2), 16);
                        sb.Append((char)i);
                    }
                    else if (m.Value[1] == 'U')
                    {
                        int i = Convert.ToInt32(m.Value.Substring(2), 16);
                        sb.Append(char.ConvertFromUtf32(i));
                    }
                    else
                    {
                        switch (m.Value[1])
                        {
                            case 'a':
                                sb.Append('\a');
                                break;
                            case 'b':
                                sb.Append('\b');
                                break;
                            case 'f':
                                sb.Append('\f');
                                break;
                            case 'n':
                                sb.Append('\n');
                                break;
                            case 'r':
                                sb.Append('\r');
                                break;
                            case 't':
                                sb.Append('\t');
                                break;
                            case 'v':
                                sb.Append('\v');
                                break;
                            case '=':
                                sb.Append('=');
                                break;
                            default:
                                sb.Append(m.Value[1]);
                                break;
                        }
                    }
                }
            }

            return sb.ToString();
        }
    }
}
