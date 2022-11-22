# Change Log

All notable changes to the "svg-print-demo" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Registers for print services and writes the fact of its registration into the print log.
- Because SVG is registered as a language for files of type .svg they are longer treated as XML resulting in the loss of syntax colouring in the editor. While it is possible to overcome this consequence, it is not relevant to the use of print services and is omitted for clarity.