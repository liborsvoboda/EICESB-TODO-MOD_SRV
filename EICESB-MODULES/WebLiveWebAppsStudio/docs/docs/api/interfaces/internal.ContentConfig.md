---
id: "internal.ContentConfig"
title: "Interface: ContentConfig"
sidebar_label: "ContentConfig"
custom_edit_url: null
---

[_internal](../modules/internal.md).ContentConfig

## Hierarchy

- **`ContentConfig`**

  ↳ [`Config`](Config.md)

## Properties

### activeEditor

• **activeEditor**: `undefined` \| [`EditorId`](../modules/internal.md#editorid)

#### Defined in

models.ts:77

___

### cssPreset

• **cssPreset**: [`CssPresetId`](../modules/internal.md#csspresetid)

#### Defined in

models.ts:84

___

### customSettings

• **customSettings**: `Partial`<{ `Binary`: `any` ; `C`: `any` ; `adoc`: `any` ; `art`: `any` ; `art-template`: `any` ; `as`: `any` ; `asc`: `any` ; `asciidoc`: `any` ; `assemblyscript`: `any` ; `astro`: `any` ; `autoprefixer`: `any` ; `babel`: `any` ; `blockly`: `any` ; `blockly.xml`: `any` ; `c`: `any` ; `c++`: `any` ; `civet`: `any` ; `clang`: `any` ; `clang.cpp`: `any` ; `clio`: `any` ; `clj`: `any` ; `cljc`: `any` ; `cljs`: `any` ; `clojure`: `any` ; `clojurescript`: `any` ; `coffee`: `any` ; `coffeescript`: `any` ; `common-lisp`: `any` ; `commonlisp`: `any` ; `cp`: `any` ; `cpp`: `any` ; `cpp-wasm`: `any` ; `cppm`: `any` ; `cppwasm`: `any` ; `csharp`: `any` ; `css`: `any` ; `cssmodules`: `any` ; `cssnano`: `any` ; `cwasm`: `any` ; `cxx`: `any` ; `diagram`: `any` ; `diagrams`: `any` ; `dot`: `any` ; `edn`: `any` ; `ejs`: `any` ; `es`: `any` ; `eta`: `any` ; `fennel`: `any` ; `flow`: `any` ; `fnl`: `any` ; `go`: `any` ; `golang`: `any` ; `graph`: `any` ; `h`: `any` ; `haml`: `any` ; `handlebars`: `any` ; `hbs`: `any` ; `hpp`: `any` ; `htm`: `any` ; `html`: `any` ; `ii`: `any` ; `imba`: `any` ; `ixx`: `any` ; `jade`: `any` ; `javascript`: `any` ; `jl`: `any` ; `js`: `any` ; `json`: `any` ; `jsx`: `any` ; `julia`: `any` ; `less`: `any` ; `lightningcss`: `any` ; `liquid`: `any` ; `liquidjs`: `any` ; `lisp`: `any` ; `livescript`: `any` ; `ls`: `any` ; `lua`: `any` ; `lua-wasm`: `any` ; `luawasm`: `any` ; `malina`: `any` ; `malinajs`: `any` ; `markdown`: `any` ; `md`: `any` ; `mdown`: `any` ; `mdx`: `any` ; `mjml`: `any` ; `mkdn`: `any` ; `ml`: `any` ; `mli`: `any` ; `mustache`: `any` ; `njk`: `any` ; `nunjucks`: `any` ; `ocaml`: `any` ; `perl`: `any` ; `php`: `any` ; `php-wasm`: `any` ; `phpwasm`: `any` ; `pintora`: `any` ; `pl`: `any` ; `plt`: `any` ; `pm`: `any` ; `postcss`: `any` ; `postcssImportUrl`: `any` ; `postcssPresetEnv`: `any` ; `prolog`: `any` ; `prolog.pl`: `any` ; `pug`: `any` ; `purgecss`: `any` ; `py`: `any` ; `py-wasm`: `any` ; `py3`: `any` ; `pyodide`: `any` ; `python`: `any` ; `python-wasm`: `any` ; `pythonwasm`: `any` ; `pywasm`: `any` ; `r`: `any` ; `r-wasm`: `any` ; `rb`: `any` ; `re`: `any` ; `react-native`: `any` ; `react-native-tsx`: `any` ; `react-native.jsx`: `any` ; `react-native.tsx`: `any` ; `reason`: `any` ; `rei`: `any` ; `res`: `any` ; `rescript`: `any` ; `resi`: `any` ; `rich`: `any` ; `richtext`: `any` ; `riot`: `any` ; `riotjs`: `any` ; `rlang`: `any` ; `rstats`: `any` ; `rte`: `any` ; `rte.html`: `any` ; `ruby`: `any` ; `ruby-wasm`: `any` ; `rubywasm`: `any` ; `sass`: `any` ; `scheme`: `any` ; `scm`: `any` ; `scss`: `any` ; `solid`: `any` ; `solid.jsx`: `any` ; `solid.tsx`: `any` ; `sql`: `any` ; `sqlite`: `any` ; `sqlite3`: `any` ; `stencil`: `any` ; `stencil.tsx`: `any` ; `styl`: `any` ; `stylis`: `any` ; `stylus`: `any` ; `sucrase`: `any` ; `svelte`: `any` ; `tailwindcss`: `any` ; `tcl`: `any` ; `teal`: `any` ; `tl`: `any` ; `tokencss`: `any` ; `ts`: `any` ; `tsx`: `any` ; `twig`: `any` ; `typescript`: `any` ; `unocss`: `any` ; `vue`: `any` ; `vue2`: `any` ; `vue3`: `any` ; `wasm`: `any` ; `wasm.cpp`: `any` ; `wasm.lua`: `any` ; `wasm.php`: `any` ; `wasm.py`: `any` ; `wasm.rb`: `any` ; `wast`: `any` ; `wat`: `any` ; `webassembly`: `any` ; `windicss`: `any` ; `xht`: `any` ; `xml`: `any`  } & { `convertCommonjs`: `boolean` ; `defaultCDN`: [`CDN`](../modules/internal.md#cdn) ; `imports`: `Record`<`string`, `string`\> ; `mapImports`: `boolean` ; `scriptType`: `undefined` \| ``""`` \| ``"module"`` \| ``"text/liquid"`` \| ``"text/python"`` \| ``"text/r"`` \| ``"text/ruby-wasm"`` \| ``"text/x-uniter-php"`` \| ``"text/php-wasm"`` \| ``"text/cpp"`` \| ``"text/perl"`` \| ``"text/julia"`` \| ``"text/biwascheme"`` \| ``"text/commonlisp"`` \| ``"text/tcl"`` \| ``"text/prolog"`` \| ``"application/json"`` \| ``"application/lua"`` \| ``"text/fennel"`` \| ``"application/wasm-uint8"`` \| ``"application/javascript"`` \| ``"application/ecmascript"`` \| ``"text/javascript"`` \| ``"text/ecmascript"`` ; `template`: { `data?`: `any` ; `prerender?`: `boolean`  } ; `types`: [`Types`](internal.Types.md)  }\>

#### Defined in

models.ts:86

___

### description

• **description**: `string`

#### Defined in

models.ts:73

___

### head

• **head**: `string`

#### Defined in

models.ts:74

___

### htmlAttrs

• **htmlAttrs**: `string` \| `Record`<`string`, `string`\>

#### Defined in

models.ts:75

___

### imports

• **imports**: `Object`

#### Index signature

▪ [key: `string`]: `string`

#### Defined in

models.ts:87

___

### languages

• **languages**: `undefined` \| (``"reason"`` \| ``"stylus"`` \| ``"html"`` \| ``"ruby"`` \| ``"rb"`` \| ``"json"`` \| ``"htm"`` \| ``"markdown"`` \| ``"md"`` \| ``"mdown"`` \| ``"mkdn"`` \| ``"mdx"`` \| ``"astro"`` \| ``"pug"`` \| ``"jade"`` \| ``"haml"`` \| ``"asciidoc"`` \| ``"adoc"`` \| ``"asc"`` \| ``"mustache"`` \| ``"handlebars"`` \| ``"hbs"`` \| ``"ejs"`` \| ``"eta"`` \| ``"nunjucks"`` \| ``"njk"`` \| ``"liquid"`` \| ``"liquidjs"`` \| ``"dot"`` \| ``"twig"`` \| ``"art-template"`` \| ``"art"`` \| ``"mjml"`` \| ``"diagrams"`` \| ``"diagram"`` \| ``"graph"`` \| ``"plt"`` \| ``"richtext"`` \| ``"rte"`` \| ``"rich"`` \| ``"rte.html"`` \| ``"css"`` \| ``"scss"`` \| ``"sass"`` \| ``"less"`` \| ``"styl"`` \| ``"stylis"`` \| ``"postcss"`` \| ``"javascript"`` \| ``"js"`` \| ``"babel"`` \| ``"es"`` \| ``"sucrase"`` \| ``"typescript"`` \| ``"flow"`` \| ``"ts"`` \| ``"jsx"`` \| ``"tsx"`` \| ``"react-native"`` \| ``"react-native.jsx"`` \| ``"react-native-tsx"`` \| ``"react-native.tsx"`` \| ``"vue"`` \| ``"vue3"`` \| ``"vue2"`` \| ``"svelte"`` \| ``"stencil"`` \| ``"stencil.tsx"`` \| ``"solid"`` \| ``"solid.jsx"`` \| ``"solid.tsx"`` \| ``"riot"`` \| ``"riotjs"`` \| ``"malina"`` \| ``"malinajs"`` \| ``"xht"`` \| ``"coffeescript"`` \| ``"coffee"`` \| ``"livescript"`` \| ``"ls"`` \| ``"civet"`` \| ``"clio"`` \| ``"imba"`` \| ``"assemblyscript"`` \| ``"as"`` \| ``"python"`` \| ``"py"`` \| ``"pyodide"`` \| ``"python-wasm"`` \| ``"py-wasm"`` \| ``"pythonwasm"`` \| ``"pywasm"`` \| ``"py3"`` \| ``"wasm.py"`` \| ``"r"`` \| ``"rlang"`` \| ``"rstats"`` \| ``"r-wasm"`` \| ``"ruby-wasm"`` \| ``"wasm.rb"`` \| ``"rubywasm"`` \| ``"go"`` \| ``"golang"`` \| ``"php"`` \| ``"php-wasm"`` \| ``"phpwasm"`` \| ``"wasm.php"`` \| ``"cpp"`` \| ``"c"`` \| ``"C"`` \| ``"cp"`` \| ``"cxx"`` \| ``"c++"`` \| ``"cppm"`` \| ``"ixx"`` \| ``"ii"`` \| ``"hpp"`` \| ``"h"`` \| ``"cpp-wasm"`` \| ``"cppwasm"`` \| ``"cwasm"`` \| ``"wasm.cpp"`` \| ``"clang"`` \| ``"clang.cpp"`` \| ``"perl"`` \| ``"pl"`` \| ``"pm"`` \| ``"lua"`` \| ``"lua-wasm"`` \| ``"luawasm"`` \| ``"wasm.lua"`` \| ``"teal"`` \| ``"tl"`` \| ``"fennel"`` \| ``"fnl"`` \| ``"julia"`` \| ``"jl"`` \| ``"scheme"`` \| ``"scm"`` \| ``"commonlisp"`` \| ``"common-lisp"`` \| ``"lisp"`` \| ``"clojurescript"`` \| ``"clojure"`` \| ``"cljs"`` \| ``"clj"`` \| ``"cljc"`` \| ``"edn"`` \| ``"rescript"`` \| ``"res"`` \| ``"resi"`` \| ``"re"`` \| ``"rei"`` \| ``"ocaml"`` \| ``"ml"`` \| ``"mli"`` \| ``"tcl"`` \| ``"wat"`` \| ``"wast"`` \| ``"webassembly"`` \| ``"wasm"`` \| ``"Binary"`` \| ``"csharp"`` \| ``"sql"`` \| ``"sqlite"`` \| ``"sqlite3"`` \| ``"prolog.pl"`` \| ``"prolog"`` \| ``"blockly"`` \| ``"blockly.xml"`` \| ``"xml"`` \| ``"pintora"`` \| ``"tailwindcss"`` \| ``"postcssImportUrl"`` \| ``"windicss"`` \| ``"unocss"`` \| ``"tokencss"`` \| ``"lightningcss"`` \| ``"autoprefixer"`` \| ``"postcssPresetEnv"`` \| ``"cssmodules"`` \| ``"purgecss"`` \| ``"cssnano"``)[]

#### Defined in

models.ts:78

___

### markup

• **markup**: [`Editor`](internal.Editor.md)

#### Defined in

models.ts:79

___

### processors

• **processors**: [`Processor`](../modules/internal.md#processor)[]

#### Defined in

models.ts:85

___

### script

• **script**: [`Editor`](internal.Editor.md)

#### Defined in

models.ts:81

___

### scripts

• **scripts**: `string`[]

#### Defined in

models.ts:83

___

### style

• **style**: [`Editor`](internal.Editor.md)

#### Defined in

models.ts:80

___

### stylesheets

• **stylesheets**: `string`[]

#### Defined in

models.ts:82

___

### tags

• **tags**: `string`[]

#### Defined in

models.ts:76

___

### tests

• **tests**: `undefined` \| `Partial`<[`Editor`](internal.Editor.md)\>

#### Defined in

models.ts:89

___

### title

• **title**: `string`

#### Defined in

models.ts:72

___

### types

• **types**: [`Types`](internal.Types.md)

#### Defined in

models.ts:88

___

### version

• `Readonly` **version**: `string`

#### Defined in

models.ts:90
