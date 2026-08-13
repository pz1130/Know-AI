# AI 分诊台

## 文档（源稿）

| 中文 | 英文（`web/public/docs/en/` 与 `docs/en/`） | 用途 |
|------|---------------------------------------------|------|
| `概念层级图谱_从LLM到Agent.md` | `concept-map-llm-to-agent.md` | L0–L6 能力叠加 |
| `Agent术语定义_修订提案.md` | `agent-definitions-revision.md` | A×B 定义体系 |
| `AI需求技术选型手册.md` | `ai-requirements-selection-handbook.md` | 分诊 / 六形态 / 打分 / 场景 |
| `概念讲解手册_给IT团队.md` | `concept-handbook-for-it.md` | 内训讲解与易混点 |
| `企业级Agent平台_概念术语提炼.md` | `enterprise-agent-platform-term-digest.md` | 原书术语十域提炼 |

站点「原文库」随界面中/英切换加载对应文稿。改中文源稿后请同步更新英文译本。

## 交互站点

静态前端在 [`web/`](./web/)，可发布到 **Hugging Face Spaces（Static）**。

```bash
cd web
npm install
npm run dev      # 本地预览
npm run check    # 术语中英校验 + tsc
npm run build    # 含 prebuild 术语校验，再打包
```

发布到 HF：

```bash
chmod +x scripts/deploy-hf.sh
./scripts/deploy-hf.sh YOUR_USER/YOUR_SPACE
```

---

## 术语馆怎么维护（约定）

### 真相源

| 内容 | 真相源 | 说明 |
|------|--------|------|
| 词条（terms） | 手册 `概念讲解手册_给IT团队.md` §1.1–1.11 | 讲课/改文档只碰 Markdown |
| 站点 terms 镜像 | `web/src/data/glossary.ts` | 可精炼拆条、短定义；与手册允许有意差几条 |
| 易混对照 + 十讲 | **仅** `glossary.ts` | 教学卡片结构，不自动从手册生成 |
| 英文 | `web/src/data/en/glossary.ts` | 不机翻入库；与中文**同 PR**、同条数 |
| UI 壳子文案 | `web/src/i18n/ui.ts` | 与术语内容无关 |

### 四条约定

1. **改词条释义 → 先改手册，再对照站点。** 不要只改 TS 忘了讲义。  
2. **改易混 / 十讲 → 只改 `glossary.ts`（及对应英文）。**  
3. **中英必须同 PR、同条数。** `terms` / `confusions` / `lectures` 任一不对齐，`check:glossary` 失败。  
4. **日常用 check，大手术才 write。** 默认不要 `--write` 冲掉精炼词条。

### 命令

```bash
# 手册 ↔ 站点词条 diff（不写文件；允许精炼版与 MD 有意差集）
node scripts/sync-glossary.mjs

# 中英条数 / 空字段硬校验（CI / prebuild / pre-commit）
node scripts/check-glossary.mjs
# 或
cd web && npm run check:glossary

# 确认要以手册为准重写 terms 时（保留易混+十讲）
node scripts/sync-glossary.mjs --write
node scripts/sync-glossary.mjs --write --dry-run

# 可选：安装 git pre-commit（仅在暂存了 glossary 相关文件时跑校验）
chmod +x scripts/install-git-hooks.sh
./scripts/install-git-hooks.sh
```

`npm run build` 会先跑 `prebuild` → `check-glossary`；中英条数不一致会直接失败。

### 推荐 PR 节奏

```
改手册 §1.1–1.11
  → node scripts/sync-glossary.mjs   # 贴 diff 进 PR
  → 更新 glossary.ts（手改或 --write 后验收）
  → 同 PR 更新 en/glossary.ts
  → npm run check:glossary
```

---

## 页面一览

1. **概念电梯** — L0→L6 可点层级  
2. **定义网格** — A×B + 五旋钮系统画像  
3. **选型分诊** — 决策树 → 形态 A–F  
4. **属性打分** — 七维 + 本行硬规则  
5. **场景库** — 业务原话对照  
6. **术语馆** — 速查 / 易混 / 十讲 / 闪卡  
7. **验收四问** — 定义可检验判据  
8. **原文库** — 五份 Markdown 全文  

面向：**行内 IT 内训**、**架构师选型**。公开部署，无需脱敏。
