#!/bin/sh

set -e

git checkout master
pnpm build
git checkout gh-pages
cp -R build/* .
git add .
git commit -am "build"
git push
git checkout master
