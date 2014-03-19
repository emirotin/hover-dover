#!/bin/sh

git checkout master
middleman build
git checkout gh-pages
cp -R build/* .
git add .
git commit -am "build"
git push
