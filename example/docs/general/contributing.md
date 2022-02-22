---
id: contributing
title: Contributing
sidebar_position: 3
---

# Contributing Guidelines

This is an example of a document that would examplain how to contribute to the application.

## Git

Check [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) to better understand the
following. Also, keep in mind this is no API or library project, and Conventional Commits here play a role in automating process, but no big part in ensuring application stability.

### Allowed types:

For all purposes hereinafter, these are the allowed types:

| Type     | Usage                                                                  | Affects end user | Version |
| -------- | ---------------------------------------------------------------------- | ---------------- | ------- |
| feat     | new/modified feature for the user, not a DX/CI/CD improvement          | yes              | `MINOR` |
| fix      | bug fix for the user, not a fix for DX/CI/CD                           | yes              | `PATCH` |
| perf     | performance improve for the user, not a DX/CI/CD improvement           | can              | `PATCH` |
| refactor | refactoring production code, not a change to DX/CI/CD codebase         | no               | `PATCH` |
| docs     | changes to the documentation                                           | no               | `PATCH` |
| style    | formatting, missing semi colons, etc; no production code change        | no               | `PATCH` |
| test     | adding missing tests, refactoring tests; no production code change     | no               | `PATCH` |
| chore    | updating a script; no production code change                           | no               | `PATCH` |
| build    | updating the build process or configuration; no production code change | no               | `PATCH` |
| ci       | updating CI/CD process; no production code change                      | no               | `PATCH` |
| revert   | reverts a previous change                                              | no               | `PATCH` |

> Differently than Conventional Commits, **all types will generate at least a `PATCH` version**, as we
> need new versions to deploy the changes to production.

### Commits

- **Format:** `<type>(<scope>)?: <description>` _(example: `feat(footer): add facebook social link`)_
- **Changelog and Versioning:** direct commit descriptions **do not impact versioning**; instead, squashed commits from
  [Pull Request merging](#pull-requests) will be used for this purpose.

### Branches

- **Format:** `<TYPE>/<TICKET_ID?>-description` _(example: `feat/sw-42-dropdown`)_
- **Changelog and Versioning:** branch names have no effect on application versioning, but we follow the same naming
  partern for the sake of simplicity.

### Pull Requests

- **Name format:** `<type>(<scope>)?: <description>` _(example: `feat(footer): add social links`)_
- **Target:** `main` branch is targeted by default. See [Deployment](./deployment.md) for details on
  how/when the integrated PR gets to production.
- **Template:** new PRs can benefit from the pre-configured [template](../.github/pull_request_template.md). In exceptional
  cases, it's acceptable for a PR to fall off the recommended pattern.
- **Strategy:** [Squash and merge](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github#squashing-your-merge-commits).
  This means a single change set – a branch – will become a single commit in the target `main` tree.
- **Changelog and versioning:** as ultimately only one commit will be integrated from a change set (the squashed commit), **the PR name
  will be used in the [Changelog](/changelog)** and for versioning purposes.

### Code Reviews

Ideally, at least one of the Code Owners should review the PR before merging.

