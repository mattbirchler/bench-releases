# Bench support

Bench is a free Mac app for running Claude Code, with an iPhone app that connects to it. Download the Mac app from the [latest release](https://github.com/mattbirchler/bench-releases/releases/latest).

## Getting started

1. Install [Claude Code](https://claude.com/product/claude-code) and sign in.
2. Open Bench and add a project folder. Bench > Settings > Setup shows anything that's missing.

## Using the iPhone app

1. Install [Tailscale](https://tailscale.com) on your Mac and iPhone, and sign in to the same account.
2. On the Mac, open Bench > Settings > iPhone and turn the companion on.
3. In the iPhone app, tap Scan Code and scan the code on your Mac.

To look around first, tap **Try a Demo** on the iPhone app's first screen.

## Common problems

**"Can't find the Mac."** Check that Tailscale is connected on both devices.

**"Found the Mac, but Bench isn't answering."** Make sure Bench is open on the Mac and the companion is turned on in Settings > iPhone.

**Claude tabs say Claude Code isn't installed.** Install it, then open a new Claude tab. Settings > Setup shows where Bench looked.

**Pull requests don't show up.** Install the [GitHub CLI](https://cli.github.com) and run `gh auth login` in a terminal.

## Contact

Email [EMAIL TO DECIDE](mailto:EMAIL-TO-DECIDE) with what happened and your Mac's macOS version.
