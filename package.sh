#!/bin/bash
# 
# *************************************************
# File Name    : package.sh
# Author       : Cole Smith
# Mail         : tobewhatwewant@gmail.com
# Github       : whatwewant
# Created Time : 2016年07月06日 星期三 12时44分45秒
# *************************************************
VERSION=$(cat manifest.json | grep '"version"' | awk -F '"' '{print $4}')
NAME="WordHelp-${VERSION}.zip"

[ -f $NAME ] && rm -rf $NAME

zip -r $NAME \
       index.html \
       manifest.json \
       icons \
       dist

