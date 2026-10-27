# Bench

Bench is a free Mac app for running Claude Code. Each project gets its own window of terminal tabs, with the changes Claude is making shown right next to them.

**[Download the latest version](https://github.com/mattbirchler/bench-releases/releases/latest)** (a zip with Bench.app inside)

## What it does

- **Claude Code in tabs.** Open Claude and shell tabs per project. Bench shows which sessions are working, waiting on you, or done.
- **Changes as they happen.** A side panel shows the diff of everything Claude has touched, and a file browser for the rest of the project.
- **Agents in their own branches.** Start a Claude session in a separate git worktree, then review and merge it when it's ready.
- **Pull requests at a glance.** With the GitHub CLI signed in, each branch shows its pull request and whether checks passed.
- **Your own shortcuts.** One-click tabs for commands you run often, plus a dev server button for JavaScript projects.
- **Updates itself.** Bench checks for new versions and installs them when you quit.

An iPhone companion app is coming through TestFlight.

## Requirements

- A Mac with Apple silicon (M1 or later). Intel Macs aren't supported.
- macOS 26 or later.
- [Claude Code](https://claude.com/product/claude-code), installed and signed in.
- git, from Apple's command line tools. Bench offers to install them if they're missing.

Optional:

- The [GitHub CLI](https://cli.github.com), signed in, for pull request status.
- [Tailscale](https://tailscale.com/download/mac), to use Bench from your iPhone or another Mac.

When Bench first opens, it checks for these and shows what it found. You can check again in Settings > Setup.

## Installing

1. Download the zip from the [latest release](https://github.com/mattbirchler/bench-releases/releases/latest) and open it.
2. Drag Bench into your Applications folder.
3. Open Bench and add a project folder.

Bench is signed and notarized by Apple.

## Terms

Bench is free to use. It's provided as is, without warranty of any kind.

Bench has no analytics and doesn't send your code anywhere. The only thing it fetches on its own is this repository's update feed. Claude Code talks to Anthropic as it normally does.

Bench is built with Ghostty, Sparkle, and other open source projects. Their licenses are in Bench > Acknowledgements.

## About this repository

This repository hosts Bench's downloads and its update feed (`appcast.xml`). Each version's zip and release notes are on the [Releases](https://github.com/mattbirchler/bench-releases/releases) page.

Made by [Birchtree Productions](https://birchtree.productions).
