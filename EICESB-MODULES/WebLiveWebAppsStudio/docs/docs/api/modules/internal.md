---
id: "internal"
title: "Module: _internal"
sidebar_label: "_internal"
sidebar_position: 0
custom_edit_url: null
---

## Interfaces

- [API](../interfaces/internal.API.md)
- [AppConfig](../interfaces/internal.AppConfig.md)
- [ContentConfig](../interfaces/internal.ContentConfig.md)
- [Editor](../interfaces/internal.Editor.md)
- [EditorConfig](../interfaces/internal.EditorConfig.md)
- [EditorPosition](../interfaces/internal.EditorPosition.md)
- [FormatterConfig](../interfaces/internal.FormatterConfig.md)
- [Screen](../interfaces/internal.Screen.md)
- [TestResult](../interfaces/internal.TestResult.md)
- [Types](../interfaces/internal.Types.md)
- [UserConfig](../interfaces/internal.UserConfig.md)

## Type Aliases

### APICommands

Ƭ **APICommands**: ``"setBroadcastToken"`` \| ``"showVersion"``

#### Defined in

models.ts:52

___

### CDN

Ƭ **CDN**: ``"jspm"`` \| ``"skypack"`` \| ``"jsdelivr"`` \| ``"fastly.jsdelivr"`` \| ``"jsdelivr.gh"`` \| ``"fastly.jsdelivr.gh"`` \| ``"esm.run"`` \| ``"esm.sh"`` \| ``"esbuild"`` \| ``"bundle.run"`` \| ``"unpkg"`` \| ``"statically"``

#### Defined in

models.ts:1000

___

### CodejarTheme

Ƭ **CodejarTheme**: ``"a11y-dark"`` \| ``"atom-dark"`` \| ``"base16-ateliersulphurpool-light"`` \| ``"cb"`` \| ``"coldark-cold"`` \| ``"coldark-dark"`` \| ``"coy"`` \| ``"coy-without-shadows"`` \| ``"darcula"`` \| ``"dark"`` \| ``"dracula"`` \| ``"duotone-dark"`` \| ``"duotone-earth"`` \| ``"duotone-forest"`` \| ``"duotone-light"`` \| ``"duotone-sea"`` \| ``"duotone-space"`` \| ``"funky"`` \| ``"ghcolors"`` \| ``"gruvbox-dark"`` \| ``"gruvbox-light"`` \| ``"holi-theme"`` \| ``"hopscotch"`` \| ``"laserwave"`` \| ``"lucario"`` \| ``"material-dark"`` \| ``"material-light"`` \| ``"material-oceanic"`` \| ``"monochrome"`` \| ``"monochrome-dark"`` \| ``"night-owl"`` \| ``"nord"`` \| ``"okaidia"`` \| ``"one-dark"`` \| ``"one-light"`` \| ``"pojoaque"`` \| ``"shades-of-purple"`` \| ``"solarized-dark-atom"`` \| ``"solarized-light"`` \| ``"synthwave84"`` \| ``"tomorrow"`` \| ``"twilight"`` \| ``"vs"`` \| ``"vsc-dark-plus"`` \| ``"xonokai"`` \| ``"z-touchs"``

#### Defined in

models.ts:848

___

### CodemirrorTheme

Ƭ **CodemirrorTheme**: ``"amy"`` \| ``"aura"`` \| ``"ayu-light"`` \| ``"barf"`` \| ``"basic-light"`` \| ``"basic-dark"`` \| ``"bespin"`` \| ``"birds-of-paradise"`` \| ``"boys-and-girls"`` \| ``"clouds"`` \| ``"cm-light"`` \| ``"cobalt"`` \| ``"cool-glow"`` \| ``"dracula"`` \| ``"espresso"`` \| ``"github-dark"`` \| ``"github-light"`` \| ``"gruvbox-dark"`` \| ``"gruvbox-light"`` \| ``"material-dark"`` \| ``"material-light"`` \| ``"monochrome"`` \| ``"monochrome-dark"`` \| ``"noctis-lilac"`` \| ``"nord"`` \| ``"one-dark"`` \| ``"rose-pine-dawn"`` \| ``"smoothy"`` \| ``"solarized-light"`` \| ``"solarized-dark"`` \| ``"tokyo-night"`` \| ``"tokyo-night-day"`` \| ``"tokyo-night-storm"`` \| ``"tomorrow"``

#### Defined in

models.ts:812

___

### CssPresetId

Ƭ **CssPresetId**: ``""`` \| ``"normalize.css"`` \| ``"reset-css"``

#### Defined in

models.ts:456

___

### EditorId

Ƭ **EditorId**: ``"markup"`` \| ``"style"`` \| ``"script"``

#### Defined in

models.ts:356

___

### EditorTheme

Ƭ **EditorTheme**: [`MonacoTheme`](internal.md#monacotheme) \| [`CodemirrorTheme`](internal.md#codemirrortheme) \| [`CodejarTheme`](internal.md#codejartheme) \| \`${MonacoTheme}@${Theme}\` \| \`${CodemirrorTheme}@${Theme}\` \| \`${CodejarTheme}@${Theme}\` \| \`monaco:${MonacoTheme}\` \| \`codemirror:${CodemirrorTheme}\` \| \`codejar:${CodejarTheme}\` \| \`monaco:${MonacoTheme}@${Theme}\` \| \`codemirror:${CodemirrorTheme}@${Theme}\` \| \`codejar:${CodejarTheme}@${Theme}\`

#### Defined in

models.ts:896

___

### MonacoTheme

Ƭ **MonacoTheme**: ``"active4d"`` \| ``"all-hallows-eve"`` \| ``"amy"`` \| ``"birds-of-paradise"`` \| ``"blackboard"`` \| ``"brilliance-black"`` \| ``"brilliance-dull"`` \| ``"chrome-devtools"`` \| ``"clouds-midnight"`` \| ``"clouds"`` \| ``"cobalt"`` \| ``"cobalt2"`` \| ``"custom-vs-light"`` \| ``"custom-vs-dark"`` \| ``"dawn"`` \| ``"dracula"`` \| ``"dreamweaver"`` \| ``"eiffel"`` \| ``"espresso-libre"`` \| ``"github"`` \| ``"github-dark"`` \| ``"github-light"`` \| ``"hc-black"`` \| ``"hc-light"`` \| ``"idle"`` \| ``"idlefingers"`` \| ``"iplastic"`` \| ``"katzenmilch"`` \| ``"krtheme"`` \| ``"kuroir"`` \| ``"lazy"`` \| ``"magicwb-amiga"`` \| ``"merbivore-soft"`` \| ``"merbivore"`` \| ``"monochrome"`` \| ``"monochrome-dark"`` \| ``"monokai"`` \| ``"monokai-bright"`` \| ``"monoindustrial"`` \| ``"night-owl"`` \| ``"nord"`` \| ``"oceanic-next"`` \| ``"pastels-on-dark"`` \| ``"slush-and-poppies"`` \| ``"solarized-dark"`` \| ``"solarized-light"`` \| ``"spacecadet"`` \| ``"sunburst"`` \| ``"textmate-mac-classic"`` \| ``"tomorrow"`` \| ``"tomorrow-night"`` \| ``"tomorrow-night-blue"`` \| ``"tomorrow-night-bright"`` \| ``"tomorrow-night-eighties"`` \| ``"twilight"`` \| ``"upstream-sunburst"`` \| ``"vibrant-ink"`` \| ``"vs"`` \| ``"vs-dark"`` \| ``"xcode-default"`` \| ``"zenburnesque"``

#### Defined in

models.ts:749

___

### Processor

Ƭ **Processor**: ``"postcss"`` \| ``"postcssImportUrl"`` \| ``"tailwindcss"`` \| ``"windicss"`` \| ``"unocss"`` \| ``"tokencss"`` \| ``"lightningcss"`` \| ``"autoprefixer"`` \| ``"postcssPresetEnv"`` \| ``"cssmodules"`` \| ``"purgecss"`` \| ``"cssnano"``

#### Defined in

models.ts:414

___

### SDKCodeHandler

Ƭ **SDKCodeHandler**: (`data`: { `code`: [`Code`](../interfaces/Code.md) ; `config`: [`Config`](../interfaces/Config.md)  }) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Object` |
| `data.code` | [`Code`](../interfaces/Code.md) |
| `data.config` | [`Config`](../interfaces/Config.md) |

##### Returns

`void`

#### Defined in

models.ts:28

___

### SDKConsoleHandler

Ƭ **SDKConsoleHandler**: (`data`: { `args`: `any`[] ; `method`: `string`  }) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Object` |
| `data.args` | `any`[] |
| `data.method` | `string` |

##### Returns

`void`

#### Defined in

models.ts:29

___

### SDKGenericHandler

Ƭ **SDKGenericHandler**: () => `void`

#### Type declaration

▸ (): `void`

##### Returns

`void`

#### Defined in

models.ts:31

___

### SDKReadyHandler

Ƭ **SDKReadyHandler**: (`data`: { `config`: [`Config`](../interfaces/Config.md)  }) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Object` |
| `data.config` | [`Config`](../interfaces/Config.md) |

##### Returns

`void`

#### Defined in

models.ts:27

___

### SDKTestsHandler

Ƭ **SDKTestsHandler**: (`data`: { `error?`: `string` ; `results`: [`TestResult`](../interfaces/internal.TestResult.md)[]  }) => `void`

#### Type declaration

▸ (`data`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `data` | `Object` |
| `data.error?` | `string` |
| `data.results` | [`TestResult`](../interfaces/internal.TestResult.md)[] |

##### Returns

`void`

#### Defined in

models.ts:30

___

### TemplateName

Ƭ **TemplateName**: ``"blank"`` \| ``"javascript"`` \| ``"typescript"`` \| ``"react"`` \| ``"react-native"`` \| ``"vue2"`` \| ``"vue"`` \| ``"angular"`` \| ``"preact"`` \| ``"svelte"`` \| ``"solid"`` \| ``"lit"`` \| ``"stencil"`` \| ``"mdx"`` \| ``"astro"`` \| ``"riot"`` \| ``"malina"`` \| ``"jquery"`` \| ``"backbone"`` \| ``"knockout"`` \| ``"jest"`` \| ``"jest-react"`` \| ``"bootstrap"`` \| ``"tailwindcss"`` \| ``"coffeescript"`` \| ``"livescript"`` \| ``"civet"`` \| ``"clio"`` \| ``"imba"`` \| ``"rescript"`` \| ``"reason"`` \| ``"ocaml"`` \| ``"python"`` \| ``"pyodide"`` \| ``"python-wasm"`` \| ``"r"`` \| ``"ruby"`` \| ``"ruby-wasm"`` \| ``"go"`` \| ``"php"`` \| ``"php-wasm"`` \| ``"cpp"`` \| ``"clang"`` \| ``"cpp-wasm"`` \| ``"perl"`` \| ``"lua"`` \| ``"lua-wasm"`` \| ``"teal"`` \| ``"fennel"`` \| ``"julia"`` \| ``"scheme"`` \| ``"commonlisp"`` \| ``"clojurescript"`` \| ``"tcl"`` \| ``"markdown"`` \| ``"assemblyscript"`` \| ``"wat"`` \| ``"sql"`` \| ``"prolog"`` \| ``"blockly"`` \| ``"diagrams"``

#### Defined in

models.ts:559

___

### Theme

Ƭ **Theme**: ``"light"`` \| ``"dark"``

#### Defined in

models.ts:1047

___

### ToolsPaneStatus

Ƭ **ToolsPaneStatus**: ``"closed"`` \| ``"open"`` \| ``"full"`` \| ``"none"`` \| ``""``

#### Defined in

models.ts:631
