# Media Hosting Guide

Reusable, versioned site media now lives in the repository `media/` directory and is published at `/media/<filename>` by the GitHub Pages build. The current migration covers the shared header logo, favicon, homepage hero poster, Smart Referee offering image, Drone Equipment offering image, Services offering image, service thumbnails, the team image, and the structured-data organisation logo.

When a migrated file is used in source code, reference it as `/media/<filename>` so the path works on the custom domain and the GitHub Pages project site. The build script `scripts/copy-repository-media.mts` copies these files into `dist/public/media` after prerendering.

Large videos, database-managed product images, partner logos, and other media that are still controlled by the managed media service remain on `/manus-storage/`. This is intentional: moving a large video or a database-managed upload into GitHub would increase repository size and could break owner-managed catalogue updates. Migrate those assets only after confirming that the associated editing workflow no longer depends on managed storage.

The build must be run with `pnpm build:pages` after adding or replacing a repository-hosted asset. The static output should contain the file under `dist/public/media/`, and direct requests to `/media/<filename>` should return HTTP 200 after deployment.
