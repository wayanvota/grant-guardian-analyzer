# Publication status

## Current release: 2.0.1 · September 29, 2026

Published the explicitly authorized score-disclosure update over SFTP using the successful upgraded-server connection saved by FileZilla. The Mac was locked, so the transfer used the SFTP client rather than the FileZilla interface. The server’s ED25519 key matched FileZilla’s saved trusted key; strict host checking remained enabled. Credentials were read in memory and were not added to the repository.

The prior live file was downloaded and checked against the recorded v2.0.0 hash before upload. The new file was uploaded to a temporary name in the same website directory, downloaded to verify its bytes, and renamed over `grant-guardian-analyzer.html`. No other website file was changed.

- Public URL: https://wayan.com/grant-guardian-analyzer.html
- Version: 2.0.1
- SHA-256: `8d5c8332d41b48c5bb6bdaf1c26edd8eac3c6e67ac3100c839681268eaafdab5`
- The canonical HTTPS response matched the local build byte for byte.
- Headless Chromium passed the score workflow against the live URL, including optional-off behavior, withholding unverified scores, the 80.5 reference result, the 94 alternate scenario, and withholding a score after editing a confirmed figure.
- Recovery copy: `archive/2026-09-29-v2.0.0-before-score-disclosure.html`, SHA-256 `a27c7584787ef51fff41b88bfa6bb78a12d98ce3c65515b545547063810b53f3`.

## Previous release: 2.0.0

Published September 29, 2026 using FileZilla, following explicit user authorization.

Live URL: https://wayan.com/grant-guardian-analyzer.html

## Deployment

The upgraded Liquid Web server was identified in the authenticated portal as `newalma08.cloudvpsserver.host.wayan.com` (`64.91.242.56`). SFTP connected successfully on port 22 using the current credentials supplied by that portal. The server key matched the existing trusted FileZilla key. No passwords or private connection configuration are stored in this repository.

FileZilla resolved the website directory to `/chroot/home/wayancom/wayan.com/html`. The only uploaded file was the 55,597-byte standalone `dist/grant-guardian-analyzer.html`. FileZilla reported one successful transfer and an empty queue.

The canonical URL, shared favicon, and social-preview artwork are retained; the descriptions now match the financial ratio explorer.

## Verification

- The exact public HTTPS URL returned the uploaded file byte for byte.
- SHA-256: `a27c7584787ef51fff41b88bfa6bb78a12d98ce3c65515b545547063810b53f3`.
- Firefox rendered the new Intercom-inspired interface and version 2.0.0.
- The live fictional-data workflow returned current ratio 2×, reserve coverage 3 months, and donor restrictions 60%, with unverified inputs labeled correctly.
- A pre-upload public readback matched the unchanged archived baseline.

## Recovery

The prior public page remains in `archive/2026-09-29-live.html`, with SHA-256 `9c0bcdd369fa30cf40cd5d154037baf00fb44a6ffe00171c61a6468464f14c0d`. It is a recovery copy with known historical defects, not the current release.

The earlier failed publication attempt used outdated saved credentials and made no remote changes. The upgraded server login resolved that blocker.
