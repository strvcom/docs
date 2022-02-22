---
id: scripts
title: Scripts
sidebar_position: 2
---

# Available scripts

This is an example of available scripts in the application

| Script                  | Description                                                                                                    | CI  | CD  |
| ----------------------- | -------------------------------------------------------------------------------------------------------------- | --- | --- |
| **Workflow**            |
| `dev`                   | Initiates the application at http://localhost:3000.                                                            |     |     |
| `build`                 | Builds the application.                                                                                        |     | ✅  |
| **Storybook**           |
| `storybook`             | Locally launches Storybook to develop React Component in isolation.                                            |     |     |
| `storybook:build`       | Builds up the Storybook library which then can be hosted somewhere and be accessible to the team.              |     |     |
| **Documentation**       |
| `docs:start`            | Initiates the documentation website.                                                                           |     |
| `docs:build`            | Builds the documentation website.                                                                              | ✅  |
| `docs:clear`            | Cleans cache and temporary files of the documentation website.                                                 |     |
| `docs:serve`            | Serves the built documentation website.                                                                        |     |
| **Code quality**        |
| `lint`                  | Validates codebase style using ESLint.                                                                         | ✅  |     |
| `typecheck`             | Validates codebase typing using TypeScript.                                                                    | ✅  | ✅  |
| `test`                  | Switch command for `test:run` and `test:watch` (depending on CI).                                              | ✅  |     |
