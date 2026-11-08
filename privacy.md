# Workbench privacy policy

*Last updated November 7, 2026*

Workbench is made by Matt Birchler (Birchtree Productions). This policy covers the Workbench Mac app and the Workbench iPhone app.

## The short version

Workbench has no accounts and no ads. Your code, prompts, and conversations go from your Mac to your own devices and never to us. Both apps share anonymous usage counts to help improve Workbench, and you can turn that off. Notifications pass through Workbench's push service on their way to Apple, encrypted so only your phone can read them.

## Anonymous usage data

Both apps send anonymous counts of what you use to [PostHog](https://posthog.com), an analytics service. This is on unless you turn it off: on the Mac, Settings > General > Share anonymous usage data; on the iPhone, Settings > Share Anonymous Usage Data.

- **What's sent:** which features you use, like opening a Claude tab, starting an agent, pairing an iPhone, sending a reply, or answering a permission prompt, plus simple counts such as how many projects you have, and which kind of Claude model a session uses (like Opus or Haiku) and its effort level. Each install gets a random ID that isn't linked to you.
- **What's never sent:** your code, prompts, messages, file names, project or branch names, or your name or email.
- **What's left out:** location, time zone, language, and device name are removed before anything is sent, and PostHog is set to discard IP addresses.

## The Mac app

Workbench runs on your Mac and keeps its settings and project list there. Besides the usage data above, it connects to:

- **GitHub,** to check this repository's feed for updates. If you install the GitHub CLI, Workbench also uses it to show your pull requests, checks, and deploys.
- **Anthropic,** using Claude Code's own sign-in, to read your plan's usage limits for the rings in the sidebar. Recaps, the one-line summaries of finished work, are written by Claude Code on your plan.
- **Workbench's push service,** when your iPhone has notifications or the Lock Screen dashboard turned on (see below). If you add your own Apple push key in Settings > iPhone, your Mac sends to Apple directly instead.

Claude Code, which you install separately, talks to Anthropic under Anthropic's own terms and privacy policy. Workbench doesn't change what Claude Code sends.

## The iPhone app

The iPhone app connects directly to Workbench on your own Mac, over your own Tailscale network. Your projects, sessions, and code go from your Mac to your phone without passing through our servers.

- **Camera:** used only to scan the pairing code Workbench shows on your Mac. Nothing is recorded or saved.
- **Pairing details:** stored in your phone's keychain.
- **Notifications:** off unless you turn them on, and only for the projects you choose on your Mac. Your phone's notification token goes to your own Mac. Your Mac encrypts each notification's text so only your phone can read it, then sends it through Workbench's push service to Apple. The service and Apple only see "Open Workbench to see what happened." The service doesn't store or log anything.
- **Lock Screen dashboard:** if you turn it on, your Mac sends its updates through the same push service to Apple. These updates aren't encrypted yet: they include your Mac's name, project names, and a short line about each session, like what Claude is doing or asking. Nothing is stored or logged. Turn the dashboard off and these updates stop.

## This website

This site doesn't use cookies or analytics. To show the latest version and the version history, your browser asks GitHub for Workbench's public release list. The site's fonts come from Google Fonts, and the version history page loads two small scripts from cdnjs. Those services see your browser's request the way any website would, under their own privacy policies. Your browser keeps the release list for 15 minutes so it isn't fetched again on every page, and it's never sent anywhere.

## Children

Workbench isn't directed at children and doesn't knowingly collect information from anyone.

## Changes

If this policy changes, the new version will be posted here with a new date.

## Contact

Questions: [matt@birchtree.me](mailto:matt@birchtree.me)
