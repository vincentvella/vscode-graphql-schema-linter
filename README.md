# Graphql Schema Linter for Gopuff

This VSCode extension allows you to lint your GraphQL schema files using the [graphql-schema-linter](https://github.com/gopuff/graphql-schema-linter) library directly within the editor. The extension is activated when the graphql-schema-linter library is installed in your currently open workspace.

![screenshot](assets/screenshot.png)

## Features

- Lint your GraphQL schema files in VSCode using the graphql-schema-linter library.
- Automatically runs linting when you save your schema files.
- Displays linting errors and warnings directly in the editor.

## Limitations

Please note that this extension does not support real-time linting as you make changes to your schema files. Linting is only performed on save.

## Installation

Local:

```
npm install --save-dev @gopuff/graphql-schema-linter
```

Global (non-node projects):

```
npm install -g @gopuff/graphql-schema-linter
```

> You must have the `schemaPaths` option configured in your graphql-schema-linter configuration file. This is necessary because the extension cannot determine whether a GraphQL file is a schema or a client query. See: https://github.com/gopuff/graphql-schema-linter#configuration-file

## Usage

Once the extension is installed and the graphql-schema-linter library is available in your workspace, the linting functionality will be automatically enabled. When you save your GraphQL schema files, the extension will run the linter and display any errors or warnings in the editor.

## No Configuration Needed

This extension does not require any configuration options. It automatically detects and uses the graphql-schema-linter library installed in your workspace.

## Contributing

Install dependencies: `npm i`

Install global package: `npm i -g @gopuff/graphql-schema-linter`

Run tests: `npm run test`

Open a PR and I'll review

## Feedback and Support

If you encounter any issues or have suggestions for improvements, please feel free to create an issue on the GitHub repository.

I appreciate your feedback and support in making this extension better.
