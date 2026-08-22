# GitHub Pages Deployment

This repository is prepared as an account-level GitHub Pages site. Its repository name must remain **`carsonchan3.github.io`** for GitHub to publish the website at the root URL:

```text
https://carsonchan3.github.io/
```

## Deployment workflow

Pushing to `main` triggers `.github/workflows/static.yml`. The workflow installs dependencies, configures Pages, creates the static Vite build, rewrites managed media URLs to the live VLI asset host, writes `404.html` as a single-page-app fallback, then uploads and deploys `dist/public` through GitHub Pages Actions.

In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The workflow needs `contents: read`, `pages: write`, and `id-token: write` permissions, all already declared in the workflow.

## Static-hosting scope

GitHub Pages provides the public static website only. Catalogue data from the database, enquiry submission, OAuth sign-in, the owner dashboard, uploads, and other server-side features require the full VLI application at `https://velolab-gkpolzge.manus.space/`.

## References

- [GitHub Docs: Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Docs: Creating a GitHub Pages site](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
