# Security and privacy

## Permissions

The extension requests only the Chrome `storage` permission to save profiles and preferences locally.

It does not request host or proxy permissions, change DNS settings, or probe DNS servers. Profiles are stored in Chrome local storage and are not sent to a project server. When available, browser-provided network estimates are displayed locally and are not stored or transmitted.

Custom DNS profiles can be exported by the user to a local JSON file and imported after format, size, name, and IPv4 validation. Imports add new profiles without replacing existing ones; backup files are not uploaded.

## Report a vulnerability

Please do not report exploitable vulnerabilities in a public issue. Contact the maintainer through the [GitHub profile](https://github.com/sadrmanesh) to arrange private disclosure.
