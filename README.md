directgov assets
================

This repository contains archived assets from direct.gov.uk. 

These are not deployed directly from git, but instead taken from the copy 
stored on S3. If changes are made, they can be synchronised with S3 like so:

    s3cmd -c s3cmd.conf sync --delete-removed assets/ s3://transition-assets/directgov/
    s3cmd -c s3cmd.conf sync --delete-removed directgov_campaigns/ s3://transition-assets/directgov_campaigns/
