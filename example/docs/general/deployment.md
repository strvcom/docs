---
id: deployment
title: Deployment
sidebar_position: 4
---

# Deployment

This is an example of a documentation on how and where the application is deployed.

## Environments

- **Production:** used on `production` and `main` branch
- **Preview:** used by all other branches and PRs

The main difference is the enabling of some development tools, and connection to staging sources if available.

## Production Deployment

The process consists of a couple of mandatory steps:

- **Step 1:** ...
- **Step 2:** ...
- **Step 3:** ...

### References

Some references that lead to the current solution:

- [Release creation with Standard Version](https://github.com/conventional-changelog/standard-version/issues/610#issuecomment-683337506)
- [Checkout whole tree for chanlog/versioning purposes](https://github.com/actions/checkout#Fetch-all-history-for-all-tags-and-branches)
- [The Ultimate Guide to GitHub Actions authentication](https://michaelheap.com/ultimate-guide-github-actions-authentication/#github-apps)
