---
title: AI 分诊台
emoji: 🩺
colorFrom: purple
colorTo: green
sdk: static
pinned: false
license: mit
short_description: IT 内训与架构师选型 · 概念电梯 / A×B 网格 / 分诊 / 打分
---

# AI 分诊台

交互式静态站点，面向 **IT 内训** 与 **方案架构师选型**。

## 模块

| 路径 | 功能 |
|------|------|
| 概念电梯 | L0→L6 层级导航、叠加视图、横切能力与规律 |
| 定义网格 | A×B 定位 + 五个设计旋钮 → 系统画像 |
| 选型分诊 | 五问决策树 → 形态 A–F 与组件清单 |
| 属性打分 | 七维打分 + 密级/问责 → 规则读出 |
| 场景库 | 业务原话检索 + 危险信号 + 建设顺序 |
| 术语馆 | 速查 / 易混 / 十讲 / 闪卡 |
| 验收四问 | 可检验判据自测 |
| 原文库 | 五份手册中英文全文 |

## 本地开发

```bash
cd web
npm install
npm run dev
```

```bash
npm run build
npm run preview
```

## 发布到 Hugging Face Spaces

1. 在 [huggingface.co/new-space](https://huggingface.co/new-space) 创建 Space，**SDK 选 Static**。
2. 构建并推送 `dist` 内容到 Space 仓库根目录：

```bash
cd web
npm run build
npx --yes huggingface-cli upload YOUR_USER/YOUR_SPACE dist . --repo-type=space
```

或使用项目根目录脚本：

```bash
./scripts/deploy-hf.sh YOUR_USER/YOUR_SPACE
```

## 说明

内容源自项目文档体系，公开参考用途，**非正式政策文件**。
