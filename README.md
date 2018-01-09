# Atom Workshop

A single tool for all atom types.

## Running locally

You'll need the [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) installed, and credentials
for both the composer and capi AWS accounts from [janus](https://janus.gutools.co.uk). You'll also need to follow the
'Install SSL certificates' step in the [dev-nginx readme](https://github.com/guardian/dev-nginx). Then:

 - Fetch config from S3: `./fetch-config.sh`
 - If you get an error message saying that you requred AWS Signature Version 4, configure your aws cli by running `aws configure set default.s3.signature_version s3v4`
 - Setup the nginx mapping by following the instructions in the
 [dev-nginx readme](https://github.com/guardian/dev-nginx#install-config-for-an-application).
 - Install Client Side Dependencies with `./scripts/setup.sh`
 - Run app with: `./scripts/start.sh`
 - Run using sbt: `sbt "run 9050"`. (For quick restart you should run `sbt` and then `run 9050`, so that you can exit
  the application without exiting sbt.)
 - Access the app by visiting https://atomworkshop.local.dev-gutools.co.uk (just make sure nginx is running on your machine)

## Compiling Client Side Dependencies

Requires Node 6, we recommend you use [nvm](https://github.com/creationix/nvm) to manage versions of node. We've included an `.nvmrc` file so you can use `nvm use` to switch to the correct version.
You can compile client side dependencies with `yarn build` or `npm run build`.
Alternatively to compile client side assets on change run `yarn build-dev` or `npm run build-dev`

There's a handy script to run both the server and watch for file changes `./scripts/start.sh`

## Hot Reloading

This app also supports Hot Module Reloading for both the React Components and Reducers (not the client side routes currently)

`./scripts/client-dev.sh`

Note: You may see an error regarding Routes on each change, this will be the case until React router v4 is released.
