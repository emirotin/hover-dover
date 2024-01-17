#!/bin/sh

set -e

git checkout master
pnpm build
git checkout gh-pages
rm -rf _astro index.html images
cp -R dist/* .
git add .
git commit -am "build"
git push
git checkout master
