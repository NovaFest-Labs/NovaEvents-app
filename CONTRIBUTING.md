# Contributing to NovaEvents App

Thanks for considering a contribution. This guide covers everything you need to go from zero to a merged PR.

## What this project is

NovaEvents App is the Next.js frontend for NovaEvents — a transparent event management platform on Stellar. It reads from the [off-chain API](https://github.com/NovaFest-Labs/NovaEvents-api) and writes directly to the [Soroban contract](https://github.com/NovaFest-Labs/NovaEvents) through a connected wallet.

If you haven't read the README, do that first.

## Before you start

Browse the open issues. Each issue has clear acceptance criteria that define what "done" looks like. Pick one, leave a comment so others know it's being worked on, and only then start writing code.

If you want to work on something that isn't in the issues, open an issue first and describe what you'd like to build. Don't spend time writing code for a change that hasn't been discussed.

## Setup

### Prerequisites

- [Node.js](https://nodejs.org/) 20+

### Install

```bash
npm install
```

### Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Lint

```bash
npm run lint
```

### Test

```bash
npm test
```

### Build

```bash
npm run build
```

Lint, tests, and the build must all pass before you open a PR. New logic (helpers, hooks, non-trivial components) needs a test that covers the happy path and at least one edge case.

## Making a contribution

1. Fork the repository and create a branch named after the issue: `issue-12-contributing-guide`.
2. Write your code. Keep changes focused on the issue — don't refactor unrelated things in the same PR.
3. Run `npm run lint`, `npm test`, and `npm run build` and make sure everything passes.
4. Open a pull request against `main`. Fill in the PR description: what changed, why, and how you tested it.

## Code standards

- Prefer extracting non-trivial logic (formatting, calculations) into small, named, pure functions under `app/lib/` so they're independently testable — see `app/lib/eventFormatting.ts` and `app/lib/formatUsdc.ts` for the existing pattern.
- Accessibility matters here: interactive elements need accessible names, loading states need `aria-live`/`role="status"`, and icon-only or `target="_blank"` links need `aria-label`.
- Use `next/link` for internal navigation, not `<a>`.
- Comments: only add one when the *why* is non-obvious. Don't describe what the code does — the code does that.

## AI-assisted contributions

You may use AI tools to help write or understand code. However:

- You are responsible for every line you submit. Review and understand all AI-generated code before including it in a PR.
- Submitting unreviewed AI output — code you can't explain or defend — is grounds for a flag under the GrantFox quality policy.
- If a reviewer asks you to explain a section of your PR, you should be able to do so.

## Questions

Open an issue or leave a comment on the relevant issue thread. Don't open a PR without prior discussion for anything beyond a small, clearly scoped bug fix.
