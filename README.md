# How to add support for rendered printing 

> Requires vscode-print 0.10.10 or later.
>
> This sample is part of the Print SDK.

If you can render a particular file format as styled HTML, it can be printed that way. CSS and images are supported.

The Print extension registers for *all* languages. When you click the Print icon, the `languageId` of the document you're printing is used to request an HTML renderer. When no HTML renderer is found for a languageId the default renderer is used. This renderer handles line-numbered syntax coloured source code. 

Renderers must support `getBodyHtml`, and may also support `getCssUriStrings`, `getResource` and `getTitle`. 

* `getTitle` is required but has a default implementation that is generally satisfactory. 
* When the HTML return by `getBodyHtml` doesn't require CSS files or images then you need not supply callbacks for `getCssUriStrings` or `getResource`.
* A stylesheet link tag is added to the head of the generated HTML for each string returned by `getCssUriStrings`. These can refer to bundled resources using a relative path (`bundled/stylesheet.css` or `bundled/image.png`) or an absolute URL.
* When `getResource` is required but not yet implemented, requests for bundled resources return HTTP code 403 (access denied).
* When `getResource` is implemented but the resource is not in cache, requests for bundled resources return HTTP code 404 (not found).

SVG was chosen for this sample because transformation to HTML is trivial (just remove the XML directive) so it does not draw attention away from

* Webpack bundling of the extension and any resources you need (images and stylesheets)
* How to define a setting to enable/disable rendering of your format when printing
* How to register with the Print extension when your extension activates

The sample doesn't implement `getTitle` because the default implementation is generally satisfactory. The default title is a shortened filepath similar to `c:\...\folder\file.ext` or `.../folder/file.ext` depending on platform. The title is the name most web browsers show in the page header when printing. 

The project has `launch.json` and `tasks.json` preconfigured. After you clone the repo and run 

```
npm i
```

you can simply press `F5` and expect it to compile, bundle and run in the debugger.

## Getting started on your own extension

Use this project as the basis of your own extension so you don't have to fight with Webpack or tasks or launch configuration.

For your convenience the project is extensively marked with `// todo`. Some of these require corresponding changes in `package.json` so be sure to change that before you remove the todo (no comments in package.json).

For easy navigation through these annotations, install https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree

## More complex rendering 

The goal of the SVG sample was to teach you how to do all the supporting stuff that's irrelevant but vital. SVG was chosen precisely because it's a trivial transformation. 

Here's something meatier. The code below was taken from the default renderer. It does a number of things.
* Delegates syntax colouring to the [highlightjs npm package](https://highlightjs.org). 
* Adds optional word breaks after long runs of letters, closing parentheses, braces, brackets and commas to guarantee flow within page bounds.
* Preserves empty lines.
* Adds line numbers, subject to user settings. 

`highlightjs` uses language identifiers that are imperfectly aligned with those used by VS Code. We offer the VS Code `languageId`, and when this is rejected we allow `highlightjs` to detect the language.

```ts
export function getBodyHtml(raw: string, languageId: string, options?:any): string {
	let renderedCode = "";
	try {
		try {
			renderedCode = hljs.highlight(raw, { language: languageId }).value;
		}
		catch (err) {
			renderedCode = hljs.highlightAuto(raw).value;
		}
		renderedCode = fixMultilineSpans(renderedCode);
		const printConfig = vscode.workspace.getConfiguration("print");
		const bpre = /([^ -<]{40}|\)\]\},)/g;
		if (printConfig.lineNumbers === "on") {
			renderedCode = renderedCode
				.split("\n")
				.map(line => line || "&nbsp;")
				.map((line, i) => `<tr><td class="line-number">${options.startLine + i}</td><td class="line-text">${line.replace(bpre, "$1<wbr>")}</td></tr>`)
				.join("\n")
				.replace("\n</td>", "</td>")
				;
		} else {
			renderedCode = renderedCode
				.split("\n")
				.map(line => line || "&nbsp;")
				.map((line, i) => `<tr><td class="line-text">${line.replace(bpre, "$1<wbr>")}</td></tr>`)
				.join("\n")
				.replace("\n</td>", "</td>")
				;
		}
	} catch {
		logger.error("Markdown could not be rendered");
		renderedCode = "<div>Could not render this file.</div>";
	}
	return `<table class="hljs">\n${renderedCode}\n</table>`;
}
```
## What happened to syntax colouring and intellisense?

Registering the `languageId` "svg" and associating the `.svg` file type with the SVG language means that files with an svg extension are no longer treated as XML. As a result, they are no longer afforded the syntax colouring and autocompletion provided by the XML language server. 

There are ways to correct this, but they are non-trivial and well out of scope for this sample.
