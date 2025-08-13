---
id: "modules"
title: "livecodes"
sidebar_label: "Exports"
sidebar_position: 0.5
custom_edit_url: null
---

## Modules

- [\_internal](modules/internal.md)

## Interfaces

- [Code](interfaces/Code.md)
- [Config](interfaces/Config.md)
- [EmbedOptions](interfaces/EmbedOptions.md)
- [Playground](interfaces/Playground.md)

## Type Aliases

### Language

Ƭ **Language**: ``"html"`` \| ``"htm"`` \| ``"markdown"`` \| ``"md"`` \| ``"mdown"`` \| ``"mkdn"`` \| ``"mdx"`` \| ``"astro"`` \| ``"pug"`` \| ``"jade"`` \| ``"haml"`` \| ``"asciidoc"`` \| ``"adoc"`` \| ``"asc"`` \| ``"mustache"`` \| ``"handlebars"`` \| ``"hbs"`` \| ``"ejs"`` \| ``"eta"`` \| ``"nunjucks"`` \| ``"njk"`` \| ``"liquid"`` \| ``"liquidjs"`` \| ``"dot"`` \| ``"twig"`` \| ``"art-template"`` \| ``"art"`` \| ``"mjml"`` \| ``"diagrams"`` \| ``"diagram"`` \| ``"graph"`` \| ``"plt"`` \| ``"richtext"`` \| ``"rte"`` \| ``"rich"`` \| ``"rte.html"`` \| ``"css"`` \| ``"scss"`` \| ``"sass"`` \| ``"less"`` \| ``"stylus"`` \| ``"styl"`` \| ``"stylis"`` \| ``"postcss"`` \| ``"javascript"`` \| ``"js"`` \| ``"json"`` \| ``"babel"`` \| ``"es"`` \| ``"sucrase"`` \| ``"typescript"`` \| ``"flow"`` \| ``"ts"`` \| ``"jsx"`` \| ``"tsx"`` \| ``"react-native"`` \| ``"react-native.jsx"`` \| ``"react-native-tsx"`` \| ``"react-native.tsx"`` \| ``"vue"`` \| ``"vue3"`` \| ``"vue2"`` \| ``"svelte"`` \| ``"stencil"`` \| ``"stencil.tsx"`` \| ``"solid"`` \| ``"solid.jsx"`` \| ``"solid.tsx"`` \| ``"riot"`` \| ``"riotjs"`` \| ``"malina"`` \| ``"malinajs"`` \| ``"xht"`` \| ``"coffeescript"`` \| ``"coffee"`` \| ``"livescript"`` \| ``"ls"`` \| ``"civet"`` \| ``"clio"`` \| ``"imba"`` \| ``"assemblyscript"`` \| ``"as"`` \| ``"python"`` \| ``"py"`` \| ``"pyodide"`` \| ``"python-wasm"`` \| ``"py-wasm"`` \| ``"pythonwasm"`` \| ``"pywasm"`` \| ``"py3"`` \| ``"wasm.py"`` \| ``"r"`` \| ``"rlang"`` \| ``"rstats"`` \| ``"r-wasm"`` \| ``"ruby"`` \| ``"rb"`` \| ``"ruby-wasm"`` \| ``"wasm.rb"`` \| ``"rubywasm"`` \| ``"go"`` \| ``"golang"`` \| ``"php"`` \| ``"php-wasm"`` \| ``"phpwasm"`` \| ``"wasm.php"`` \| ``"cpp"`` \| ``"c"`` \| ``"C"`` \| ``"cp"`` \| ``"cxx"`` \| ``"c++"`` \| ``"cppm"`` \| ``"ixx"`` \| ``"ii"`` \| ``"hpp"`` \| ``"h"`` \| ``"cpp-wasm"`` \| ``"cppwasm"`` \| ``"cwasm"`` \| ``"wasm.cpp"`` \| ``"clang"`` \| ``"clang.cpp"`` \| ``"perl"`` \| ``"pl"`` \| ``"pm"`` \| ``"lua"`` \| ``"lua-wasm"`` \| ``"luawasm"`` \| ``"wasm.lua"`` \| ``"teal"`` \| ``"tl"`` \| ``"fennel"`` \| ``"fnl"`` \| ``"julia"`` \| ``"jl"`` \| ``"scheme"`` \| ``"scm"`` \| ``"commonlisp"`` \| ``"common-lisp"`` \| ``"lisp"`` \| ``"clojurescript"`` \| ``"clojure"`` \| ``"cljs"`` \| ``"clj"`` \| ``"cljc"`` \| ``"edn"`` \| ``"rescript"`` \| ``"res"`` \| ``"resi"`` \| ``"reason"`` \| ``"re"`` \| ``"rei"`` \| ``"ocaml"`` \| ``"ml"`` \| ``"mli"`` \| ``"tcl"`` \| ``"wat"`` \| ``"wast"`` \| ``"webassembly"`` \| ``"wasm"`` \| ``"Binary"`` \| ``"csharp"`` \| ``"sql"`` \| ``"sqlite"`` \| ``"sqlite3"`` \| ``"prolog.pl"`` \| ``"prolog"`` \| ``"blockly"`` \| ``"blockly.xml"`` \| ``"xml"`` \| ``"pintora"``

#### Defined in

models.ts:167

## Functions

### createPlayground

▸ **createPlayground**(`container`, `options?`): `Promise`<[`Playground`](interfaces/Playground.md)\>

Creates a LiveCodes playground.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `container` | `string` \| `HTMLElement` | The container where the playground will be rendered. |
| `options?` | [`EmbedOptions`](interfaces/EmbedOptions.md) | The embed options for the playground (optional). |

#### Returns

`Promise`<[`Playground`](interfaces/Playground.md)\>

- A promise that resolves to the created playground.

#### Defined in

index.ts:25

▸ **createPlayground**(`options`): `Promise`<[`Playground`](interfaces/Playground.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`EmbedOptions`](interfaces/EmbedOptions.md) & { `view`: ``"headless"``  } |

#### Returns

`Promise`<[`Playground`](interfaces/Playground.md)\>

#### Defined in

index.ts:29

___

### getPlaygroundUrl

▸ **getPlaygroundUrl**(`options?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`EmbedOptions`](interfaces/EmbedOptions.md) |

#### Returns

`string`

#### Defined in

index.ts:381
