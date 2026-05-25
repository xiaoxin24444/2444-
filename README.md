# 在线密码生成器工具箱

在线密码生成器工具箱是一款实用的 Web 工具，提供密码生成和计算器两大核心功能。界面采用现代蓝紫渐变主题，支持响应式布局和丰富的交互动效，适用于桌面和移动设备。

## 功能特点

### 密码生成器
- **自定义密码长度**：支持生成 4-64 位的密码
- **多字符类型选择**：大写字母、小写字母、数字、特殊符号
- **密码强度评估**：实时显示密码强度等级（弱/中/强/极强）
- **一键复制功能**：快速复制生成的密码到剪贴板
- **密码历史记录**：保存最近生成的密码，方便查看和使用
- **JSON 导出**：支持将密码历史导出为 JSON 文件
- **键盘快捷键**：支持快捷键操作，提高效率

### 简易计算器
- **基本四则运算**：加法、减法、乘法、除法
- **运算符优先级**：遵循数学运算规则，先乘除后加减
- **历史记录**：记录计算历史，方便查看之前的计算结果
- **键盘输入支持**：支持通过键盘输入数字和运算符
- **清空和删除**：支持清空当前输入或删除最后一位数字
- **错误处理**：自动处理除数为零等异常情况

## 技术栈
- HTML5
- CSS3（包含 Flexbox 布局、Grid 布局、动画效果）
- JavaScript（ES6+，包含模块化、箭头函数、模板字符串等特性）

## 使用方法

### 密码生成器
1. **设置密码长度**：使用滑块调整密码长度（4-64 位）
2. **选择字符类型**：勾选需要的字符类型（大写、小写、数字、特殊符号）
3. **生成密码**：点击"生成密码"按钮或使用快捷键 `Ctrl+G`
4. **复制密码**：点击复制图标或使用快捷键 `Ctrl+Shift+C`
5. **查看历史**：在密码历史区域查看之前生成的密码
6. **导出数据**：点击"导出 JSON"按钮下载密码历史

### 计算器
1. **输入数字**：通过点击按钮或键盘输入数字
2. **输入运算符**：选择加、减、乘、除运算符
3. **计算结果**：点击等号按钮得出计算结果
4. **查看历史**：在历史记录区域查看之前的计算结果
5. **清空操作**：点击"C"按钮清空当前输入，点击"AC"清空所有历史

## 快捷键

### 密码生成器
- `Ctrl + G`：生成新密码
- `Ctrl + Shift + C`：复制当前密码
- `Escape`：关闭提示信息

### 计算器
- `0-9`：输入数字
- `+`：加法
- `-`：减法
- `*`：乘法
- `/`：除法
- `Enter`：计算结果
- `Escape`：清空输入
- `Backspace`：删除最后一位

## 部署

本项目可部署到任何静态托管服务，支持以下平台：

### GitHub Pages
1. Fork 或复制此仓库到您的 GitHub 账户
2. 进入仓库的 **Settings** 页面
3. 在左侧菜单中找到 **Pages** 选项
4. 在 **Source** 部分，选择 **Deploy from a branch**
5. Branch 选择 **main**（或 master），文件夹选择 **/ (root)**
6. 点击 **Save** 按钮保存设置
7. 等待 1-2 分钟，页面将自动部署
8. 访问 `https://[用户名].github.io/[仓库名]/` 查看站点

### Vercel
1. 访问 [vercel.com](https://vercel.com) 并登录
2. 点击 "New Project" 创建新项目
3. 导入您的 GitHub 仓库
4. 配置项目设置（框架预设选择 "Other"）
5. 点击 "Deploy" 开始部署
6. 部署完成后，您将获得一个 `.vercel.app` 域名

### Netlify
1. 访问 [netlify.com](https://netlify.com) 并登录
2. 点击 "Add new site" > "Import an existing project"
3. 连接您的 GitHub 仓库
4. 配置构建设置（Build command 和 Publish directory）
5. 点击 "Deploy site" 开始部署
6. 部署完成后，您将获得一个 `.netlify.app` 域名

### Cloudflare Pages
1. 访问 [pages.cloudflare.com](https://pages.cloudflare.com) 并登录
2. 点击 "Create a project" 创建新项目
3. 连接您的 GitHub 仓库
4. 配置项目设置（框架预设选择 "None"）
5. 点击 "Save and Deploy" 开始部署

## 项目结构

```
├── index.html      # 主页面 HTML 文件
├── styles.css      # 样式表文件
├── script.js       # JavaScript 逻辑文件
└── README.md       # 项目说明文档
```

### 文件说明

- **index.html**：项目的主页面，包含密码生成器和计算器的 HTML 结构
- **styles.css**：样式文件，包含布局、颜色、动画等样式定义
- **script.js**：JavaScript 逻辑文件，包含密码生成、计算器、历史记录等功能实现
- **README.md**：项目说明文档，提供项目介绍、功能说明、使用方法等

## 开发指南

### 本地开发
1. 克隆仓库到本地
   ```bash
   git clone https://github.com/xiaoxin24444/2444-.git
   ```
2. 进入项目目录
   ```bash
   cd 24444-
   ```
3. 使用浏览器打开 `index.html` 文件
   ```bash
   # Windows
   start index.html

   # macOS
   open index.html

   # Linux
   xdg-open index.html
   ```

### 开发工具推荐
- **代码编辑器**：VS Code、WebStorm、Sublime Text
- **浏览器**：Chrome、Firefox、Edge（推荐使用 Chrome DevTools 进行调试）
- **Git 工具**：Git Bash、GitHub Desktop、Sourcetree

### 调试技巧
1. 打开浏览器开发者工具（F12）
2. 切换到 Console 面板查看 JavaScript 输出
3. 使用 `console.log()` 输出调试信息
4. 使用断点调试 JavaScript 代码

## 浏览器支持

本项目支持所有现代浏览器，具体版本要求如下：

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
- Opera 67+
- iOS Safari 13+
- Chrome for Android 80+

### 功能支持说明
- 所有核心功能在上述浏览器版本中均正常工作
- 剪贴板 API 在部分浏览器中可能需要 HTTPS 环境
- 键盘快捷键在部分移动设备上可能不可用

## 贡献

欢迎提交 Issue 和 Pull Request 来帮助改进项目！

### 提交 Issue
如果您发现任何问题或有功能建议，请在 GitHub 仓库中提交 Issue，请包含以下信息：
- 问题的详细描述
- 复现步骤
- 预期行为和实际行为
- 浏览器版本和操作系统

### 提交 Pull Request
1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 更新日志

### v1.0.0 (2026-05-25)
- 完成密码生成器工具开发
- 完成简易计算器开发
- 实现视觉设计与动效
- 实现进阶功能（历史记录、JSON导出、键盘快捷键）
- 完成响应式布局
- 完成测试验收

## 许可证

本项目采用 MIT 许可证开源，您可以自由使用、修改和分发本项目的代码。

## 联系方式

- GitHub 仓库：[https://github.com/xiaoxin24444/24444-](https://github.com/xiaoxin24444/24444-)
- 问题反馈：[https://github.com/xiaoxin24444/24444-/issues](https://github.com/xiaoxin24444/24444-/issues)

## 致谢

感谢所有参与项目开发和测试的团队成员！
