#!/bin/bash

# 获取当前版本号
currentVersion=$(grep '"version":' ./ui/package.json | awk -F '"' '{print $4}')

# 生成新版本号（你可以根据需要修改版本号规则）
newVersion=$(echo $currentVersion | awk -F. '{print $1 FS $2 FS $3+1}')

# 更新 package.json 文件中的版本号
sed -i '' "s/\"version\": \"$currentVersion\"/\"version\": \"$newVersion\"/" ./ui/package.json

# 打标签并推送到远程仓库
git tag -a v$newVersion -m "Release $newVersion"
git push --tags

echo "Tag v$newVersion 已创建并推送到远程仓库。"
