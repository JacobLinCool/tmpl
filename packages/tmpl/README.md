# `tmpl`

Jacob's Project Templating Tool.

## Features

- [x] Make a template from a directory
- [x] Use a template in a directory
- [x] List all templates
- [x] Peek the file structure and variables of a template
- [x] Import a template from a remote `git` repository
- [x] Template variables
- [x] Composability of multiple templates

## Installation

```sh
pnpm i -g @jacoblincool/tmpl
```

## CLI Usage

It is intended to be an interactive tool, but it can be used in a non-interactive way.

![](https://raw.githubusercontent.com/JacobLinCool/tmpl/main/screenshots/help.gif)

> Use `tmpl --help` / `tmpl <command> --help` to see all the options.

### Make new template

`cd` into the directory you want to make a template of, and run:

```sh
tmpl make
```

It will prompt you for a name and do the rest for you.

![](https://raw.githubusercontent.com/JacobLinCool/tmpl/main/screenshots/make.gif)

#### Template variables

You can use variables in your template.

Use `$#VAR#$` to mark a variable of name `VAR`.

Template variables are case-insensitive.

Character range: `A-Z` (`a-z`), `0-9`, `_`, `.`, and `-`.

### Use template

`cd` into the directory you want to use the template in, and run:

```sh
tmpl use
```

It will give you a list of templates to choose from and do the rest for you.

If there are any files that already exist, it will prompt you to overwrite them or not.

![](https://raw.githubusercontent.com/JacobLinCool/tmpl/main/screenshots/use.gif)

### List templates

It will give you a list of existing templates.

```sh
tmpl list
```

![](https://raw.githubusercontent.com/JacobLinCool/tmpl/main/screenshots/list.gif)

### Peek template

Sometimes you want to see what a template is before using it. You can do that with:

```sh
tmpl list
```

It will show you the file structure and variables of the template.

![](https://raw.githubusercontent.com/JacobLinCool/tmpl/main/screenshots/peek.gif)

### Import template

This tool uses `git` under the hood to manage templates.

By leveraging the power of `git`, you can import templates from any remote repository.

```sh
tmpl import
```

It will prompt you for a remote repository URL and a (local) name for the template.

![](https://raw.githubusercontent.com/JacobLinCool/tmpl/main/screenshots/import.gif)

## API Usage

It can also be used as a library.

See the [documentation](https://jacoblin.cool/tmpl) for more information.
