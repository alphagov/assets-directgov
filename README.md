Directgov Assets
================

This repository contains assets from Directgov which continue to be
served via [Bouncer's nginx configuration](https://github.com/alphagov/govuk-puppet/blob/master/modules/govuk/manifests/apps/bouncer.pp).

Changes to this repository are released by deploying [Bouncer](https://github.com/alphagov/bouncer). It is independent of the Bouncer version, so simply redeploying the current version of Bouncer is
enough.

To replace one of these assets with a redirect or a 410 page, you must:
* add the appropriate mapping to the Transition app
* remove the asset from this repository
* redeploy Bouncer

Previously, S3 was involved in deploying changes.

See also [assets-businesslink](https://github.com/alphagov/assets-businesslink)
