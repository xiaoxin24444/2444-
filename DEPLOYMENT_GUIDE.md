# 部署验证指南

## GitHub Pages 部署步骤

### 步骤 1: 访问 GitHub 仓库设置
1. 打开浏览器，访问: https://github.com/xiaoxin24444/2444-
2. 点击仓库顶部的 "Settings" 标签

### 步骤 2: 配置 GitHub Pages
1. 在左侧菜单中找到 "Pages" 选项并点击
2. 在 "Source" 部分，找到 "Branch" 下拉菜单
3. 选择 **main** (或 master)
4. 选择 **/ (root)** 作为文件夹
5. 点击 "Save" 按钮保存设置

### 步骤 3: 等待部署
1. 部署通常需要 1-2 分钟完成
2. 页面顶部会显示 "Your site is published at https://xiaoxin24444.github.io/24444-/"
3. 等待状态变为绿色勾选标记

### 步骤 4: 验证部署
1. 点击 "Visit site" 按钮访问您的网站
2. 验证所有功能是否正常工作：
   - 密码生成器工具
   - 计算器工具
   - 响应式布局
   - 键盘快捷键
   - 密码历史记录

## 部署检查清单

### GitHub Pages 配置
- [ ] 访问 Settings > Pages
- [ ] Source 设置为 "Deploy from a branch"
- [ ] Branch 选择 "main" 或 "master"
- [ ] Folder 选择 "/ (root)"
- [ ] 点击 Save 保存

### 功能验证
- [ ] 网站可以正常访问
- [ ] HTTPS 已启用（自动）
- [ ] 密码生成器功能正常
- [ ] 计算器功能正常
- [ ] 密码强度评估正常
- [ ] 复制功能正常
- [ ] 历史记录功能正常
- [ ] 响应式布局正常

### 常见问题排查

#### 问题 1: 404 错误
**原因**: GitHub Pages 未正确配置或部署未完成
**解决方案**:
1. 确认 Settings > Pages 中的配置正确
2. 等待 2-3 分钟让部署完成
3. 检查分支名称是否正确

#### 问题 2: 样式不显示
**原因**: CSS 文件路径问题
**解决方案**:
1. 确认 index.html 和 styles.css 在同一目录
2. 检查浏览器控制台是否有错误

#### 问题 3: JavaScript 不工作
**原因**: 浏览器禁用 JavaScript 或脚本加载失败
**解决方案**:
1. 确认浏览器已启用 JavaScript
2. 检查网络连接
3. 查看浏览器控制台错误

## 部署完成后的操作

### 分享您的网站
- 网站 URL: `https://xiaoxin24444.github.io/24444-/`
- 可以将此链接分享给朋友或添加到简历中

### 监控网站状态
- GitHub 会自动部署每次推送到 main/master 分支的代码
- 可以在 Actions 标签页查看部署历史

### 更新网站内容
1. 修改本地文件
2. 提交更改: `git add . && git commit -m "描述"`
3. 推送: `git push`
4. GitHub 会自动重新部署

## 其他部署选项

### Vercel 部署
1. 访问 https://vercel.com
2. 登录并点击 "New Project"
3. 导入 GitHub 仓库
4. 点击 "Deploy"

### Netlify 部署
1. 访问 https://netlify.com
2. 登录并点击 "Add new site"
3. 选择 "Import an existing project"
4. 连接 GitHub 仓库
5. 配置设置并点击 "Deploy site"

### Cloudflare Pages 部署
1. 访问 https://pages.cloudflare.com
2. 登录并点击 "Create a project"
3. 连接 GitHub 仓库
4. 配置并点击 "Save and Deploy"

## 技术支持

如果遇到任何问题:
1. 查看 GitHub Actions 日志了解部署详情
2. 检查浏览器开发者工具（F12）的 Console 错误
3. 参考 README.md 中的使用说明
