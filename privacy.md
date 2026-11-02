# Workbench privacy policy

*Last updated November 2, 2026*

Workbench is made by Matt Birchler (Birchtree Productions). This policy covers the Workbench Mac app and the Workbench iPhone app.

## The short version

Workbench never collects your code, prompts, conversations, or files. To help improve it, both apps send anonymous usage counts, like how many Claude tabs were opened, and you can turn that off in Settings. There are no accounts, ads, or trackers.

## The Mac app

Workbench runs on your Mac and keeps its settings and project list there. It doesn't send your code, prompts, or anything else to us.

On its own, Workbench connects to the internet to check for updates and, unless you turn it off, to send the usage analytics described below. Updates come from a small feed file on GitHub, where Workbench is hosted. Like any website, GitHub may log that request.

Claude Code, which you install separately, talks to Anthropic under Anthropic's own terms and privacy policy. Workbench doesn't change what Claude Code sends.

## The iPhone app

The iPhone app connects directly to Workbench on your own Mac, over your own Tailscale network. Your projects, sessions, and code go from your Mac to your phone and nowhere else. We never see them.

- **Camera:** used only to scan the pairing code Workbench shows on your Mac. Nothing is recorded or saved.
- **Pairing details:** stored in your phone's keychain.
- **Notifications:** off unless you turn them on. If you do, your phone's notification token is sent to your own Mac, which sends notifications through Apple's push service.

## Usage analytics

Both apps send anonymous usage events to [PostHog](https://posthog.com), an analytics service, so I can see which features get used and where setup gets stuck. An event says that something happened, for example:

- the app launched, or a step of the Mac app's welcome was shown
- a project was added, a Claude tab opened, or an agent started
- a reply was sent, or a command was allowed or denied, from the iPhone

Events carry counts, yes or no values, and choices from fixed lists (like "chat" or "terminal"), plus the app version, your device model, and your operating system version. Each install has a random ID, created on your device and not linked to your name, email, or Apple account, so I can count how many people use Workbench and whether they come back.

Events never include your code, prompts, messages, Claude's replies, file or folder names, project or branch names, or your device's name. Your time zone and language are removed before an event is sent, and PostHog is set not to keep your IP address or work out your location.

To turn analytics off, go to **Settings > General > Privacy** in the Mac app, or **Settings > Privacy** in the iPhone app.

## Children

Workbench isn't directed at children and doesn't knowingly collect information from anyone.

## Changes

If this policy changes, the new version will be posted here with a new date.

## Contact

Questions: [matt@birchtree.me](mailto:matt@birchtree.me)
