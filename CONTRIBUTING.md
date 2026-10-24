# Contributing

Thank you for considering a contribution to DNS Configuration Manager.

## Report a bug or suggest an improvement

Search existing issues first, then open an issue with a concise description, steps to reproduce, expected and actual behavior, and your Chrome and operating-system versions. Do not include personal data or sensitive network details.

## Submit a change

1. Fork the repository and create a focused branch.
2. Make the change, keeping the extension's privacy and manual-configuration behavior clear.
3. Run `npm run lint` and load the extension unpacked in Chrome to check relevant behavior.
4. Open a pull request describing the change and how you verified it.

There is no build step or automated browser test suite. Do not add network requests, permissions, or DNS probing without documenting the user impact and reviewing the privacy implications.

## License

Please ensure you have the right to submit your contribution under this project's custom non-commercial attribution license. See [LICENSE](LICENSE); contact the maintainer if you have licensing questions.
