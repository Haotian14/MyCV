# MyCV

骆皓天（Hart Luo）的个人简历。

| 文件 | 说明 |
| --- | --- |
| [`resume.html`](resume.html) | 简历源文件，也是网页版：浏览器打开即可，打印时自动切换为 A4 两页排版，支持深色模式与手机屏幕 |
| [`resume.pdf`](resume.pdf) | 公开版 A4 PDF，不含电话与照片 |

## 生成 PDF

需要 Node.js 和 `playwright`，并安装 Noto Sans SC 字体：

```bash
node build/pdf.js
```

电话和照片放在 `private/` 中（已被 git 忽略），不会提交到这个公开仓库：

```
private/profile.json   { "phone": "..." }
private/photo.jpg      或 photo.png
```

存在 `private/` 时会额外生成完整版 `dist/resume-full.pdf`（同样被忽略），用于投递。
