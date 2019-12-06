# Atom Workshop

A single tool for all atom types.

## Running locally

You'll need the [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed, and credentials
for both the composer and capi AWS accounts from [janus](https://janus.gutools.co.uk/multi-credentials?&permissionIds=capi-dev,composer-dev&tzOffset=1). 

This project requires Node, so we recommend you use [node version manager](https://github.com/nvm-sh/nvm) `nvm`. Run `brew install nvm` if you do not have it. 

Run `nvm use` in the root of the project to ensure you are using the right version of node. The project's node version is set in the `.nvmrc` file.

You will then need to:

 - Fetch config from S3 `./fetch-config.sh`
 - If you get an error message saying that you requred AWS Signature Version 4, configure your aws cli by running `aws configure set default.s3.signature_version s3v4`
 - Install dependencies with `./scripts/setup.sh`
 - Run app with `./scripts/start.sh`
 - Alternatively, run with [Hot Reloading](https://github.com/guardian/atom-workshop#hot-reloading) using `./scripts/client-dev.sh`
 - Access the app by visiting https://atomworkshop.local.dev-gutools.co.uk (just make sure nginx is running on your machine)

## Compiling Client Side Dependencies

This work is already done in the script files, but you can compile client side dependencies with `yarn build`. 

To compile client side assets on change run `yarn start` - this is in `./scripts/client-dev.sh`. 

