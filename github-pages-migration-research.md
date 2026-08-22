# GitHub Pages Migration Research

## Official GitHub requirements reviewed

GitHub Pages can publish a static site through a custom GitHub Actions workflow. The deployment job requires `pages: write` and `id-token: write` permissions, must depend on the build job, and should use a `github-pages` environment that exposes the deployment URL. The current workflow already follows this model with an artifact upload and a separate deployment job.

A repository named `<account>.github.io` creates the account-level Pages site at `https://<account>.github.io/`. A normally named repository creates a project Pages site beneath a repository path, such as `https://carsonchan3.github.io/<repository>/`. The VLI site therefore needs a repository-safe base path when using a project repository.

## Sources

- GitHub Docs, [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- GitHub Docs, [Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## Current VLI audit

The existing public repository is `carsonchan3/vli.github.io`, which is configured for Pages deployment through a GitHub Actions workflow. Its current Pages URL is `https://carsonchan3.github.io/vli.github.io/`.

The VLI project already contains a Pages workflow that installs dependencies, builds `dist/public`, converts managed media URLs to absolute live-site URLs, creates an SPA fallback, uploads the artifact, and deploys it. However, Vite’s project-site base path is presently hard-coded as `/velocity_lab_innovation/`, which does not match the existing `vli.github.io` repository name. The replacement repository must either use that path intentionally or, preferably, make the build accept the selected repository name so assets and routes remain correct.

GitHub Pages only hosts the static frontend. The public marketing pages can be deployed, but server-side catalogue data, enquiry submission, OAuth, the owner dashboard, and database-backed functionality continue to require the full Manus deployment.
