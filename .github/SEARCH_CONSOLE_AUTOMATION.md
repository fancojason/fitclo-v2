# Google Search Console Sitemap Automation

The GitHub workflow submits `https://www.fitcloo.com/sitemap-index.xml` after every
production-content push and once per day. It does not automate URL Inspection
requests because Google does not provide that capability for ordinary product or
content pages.

## One-time setup

1. In Google Cloud Console, create or select a project and enable the **Google
   Search Console API**.
2. Create a service account, then create a JSON key for that service account.
3. In Google Search Console for `https://www.fitcloo.com/`, add the service
   account email as an **Owner** under **Settings > Users and permissions**.
4. In GitHub, open `fancojason/fitclo-v2` and add a repository Actions secret:
   - Name: `GSC_SERVICE_ACCOUNT_JSON`
   - Value: the complete JSON key file contents.
5. Run **Submit sitemap to Google Search Console** once from the repository's
   Actions tab, or wait for the next push to `main`.

Never commit the JSON key file to the repository.
