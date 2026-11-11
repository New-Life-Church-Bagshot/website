# New Life Church Bagshot

The website uses plain HTML, CSS and JavaScript. Pages CMS is a separate, private editing interface that saves content changes to GitHub. Netlify builds the two public pages from those files. Visitors never load the editor, and the Spotify player still loads on request.

## First setup

1. Extract this ZIP and add its contents to the root of the church’s GitHub repository. Include the hidden `.pages.yml`, `.gitignore`, `.nvmrc` and `site/.nojekyll` files. If you already uploaded the earlier static export, replace those old website files with this package. The root now contains `build.mjs`, `content/`, `site/` and `netlify.toml`. Commit to `main`.
2. In Netlify, import that GitHub repository, or use the existing linked project. Set the production branch to `main`. Use the repository root as the base directory. The included `netlify.toml` sets the build command to `node build.mjs` and the publish directory to `dist`. Check these values in the deployment log.
3. Open the resulting `netlify.app` address and test it before connecting or switching the Squarespace domain. If the domain already points at this Netlify project, it will serve the new deployment once the build succeeds.
4. Open [Pages CMS](https://app.pagescms.org/) and sign in with GitHub. Install its GitHub App on the account or organisation that owns the repository. Give it access to the church website repository, then open that repository in Pages CMS and choose `main`. The included `.pages.yml` defines the editing forms.

[Pages CMS setup guide](https://pagescms.org/docs/quick-start/) · [Netlify Git deployment guide](https://docs.netlify.com/start/quickstarts/deploy-from-repository/)

## Making an edit

1. In Pages CMS, choose **Sunday and homepage**, **Contact details** or **Ministries**.
2. Change the fields you need. For example, change **Service starts** to update the homepage service time, the Sunday section and the FAQ in one go. To change a ministry photo, open that card’s **Photo** field and choose or upload an image. A WebP image around 1,000 pixels wide is plenty for these cards.
3. Select **Save**. Saving on `main` commits straight to GitHub and triggers a live deploy. Check Netlify’s **Deploys** screen and then review the website. For changes you want reviewed first, use a separate GitHub branch and a Netlify Deploy Preview before merging into `main`.
4. To reverse an edit, revert its commit in GitHub so the source and the live version stay in sync.

**Sunday and homepage** includes the welcome, launch date, Sunday times and descriptions. **Contact details** updates the current address, phone, email and map link across the two pages. **Ministries** edits the four existing cards. The menu, site design, FAQ structure, Spotify episode, most of the timeline, values and statement of faith are still maintained in the site source.

## Local preview or another host

With Node.js 22 or newer, run `node build.mjs`. Open `dist/index.html`, or serve the folder using `python3 -m http.server 8000 --directory dist`. There are no packages to install. Any static host can serve the generated `dist` folder. For automatic updates on another Git-based host, set the build command to `node build.mjs` and publish `dist`.

The `site/` folder contains the HTML templates, shared CSS, JavaScript and images. The `content/` folder contains the editable text. `dist/` is generated each time and should not be edited or committed.
