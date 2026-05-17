# 📸 图文记录小程序

一个简洁优雅的图文记录应用，支持文字记录、图片上传、本地存储等功能。

## ✨ 功能特性

- 📝 **文字记录** - 随时记录你的想法和心情
- 📷 **图片上传** - 支持多张图片，实时预览
- 💾 **本地存储** - 数据保存在浏览器本地，刷新不丢失
- ✏️ **编辑删除** - 随时修改或删除已有记录
- 🔍 **图片放大** - 点击查看大图
- 📱 **响应式设计** - 完美适配手机和电脑

## 🚀 部署到 Vercel

### 方式一：通过 GitHub 部署（推荐）

1. **创建 GitHub 仓库**
   - 登录 [GitHub](https://github.com)
   - 点击右上角 `+` → `New repository`
   - 仓库名填 `photo-diary`
   - 选择 `Public` 或 `Private`
   - 点击 `Create repository`

2. **上传代码**
   ```bash
   # 在本地项目文件夹中执行
   git init
   git add .
   git commit -m "init"
   git branch -M main
   git remote add origin https://github.com/你的用户名/photo-diary.git
   git push -u origin main
   ```

3. **部署到 Vercel**
   - 访问 [Vercel](https://vercel.com)
   - 点击 `Sign Up` 用 GitHub 账号登录
   - 点击 `Add New...` → `Project`
   - 选择 `photo-diary` 仓库
   - Framework Preset 选择 `Other`
   - 点击 `Deploy`

4. **完成！**
   - 等待部署完成（约1分钟）
   - 获得 `https://photo-diary-xxx.vercel.app` 链接
   - 在手机上浏览器打开即可使用

### 方式二：使用 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 在项目目录中登录
vercel login

# 部署
vercel

# 生产环境部署
vercel --prod
```

## 📱 在手机上使用

部署完成后：
1. 在手机上打开浏览器
2. 输入你的 Vercel 链接（如 `https://photo-diary-xxx.vercel.app`）
3. 可以添加到主屏幕，像 App 一样使用

## 🛠️ 技术栈

- HTML5
- CSS3 (Flexbox + Grid)
- Vanilla JavaScript (ES6+)
- LocalStorage API

## 📄 文件说明

```
图文记录小程序/
├── index.html      # 主页面
├── style.css       # 样式文件
├── app.js          # 主程序逻辑
├── vercel.json     # Vercel 配置文件
└── README.md       # 说明文档
```

## 📝 注意事项

- 数据存储在浏览器本地，清除浏览器数据会丢失记录
- 建议定期备份重要记录
- 支持 PWA，可添加到手机主屏幕离线使用

## 🔗 相关链接

- [Vercel 官网](https://vercel.com)
- [GitHub 官网](https://github.com)

---

Made with ❤️ by SOLO
