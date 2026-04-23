# FAC Illustration Style Guide
## FAC 统一插画视觉规范

### 1. 设计哲学 (Design Philosophy)

FAC 的插画风格体现「资深智慧 (Veteran Wisdom)」、「技术敏捷 (Technical Agility)」与「长期承诺 (Endurance)」三大核心价值。

**关键词 (Keywords)**:
- **专业权威感 (Professional Authority)** - 体现40年金融科技积淀
- **工程师逻辑 (Engineer Logic)** - 几何线条、结构化构图
- **马拉松韧性 (Marathon Resilience)** - 流动的曲线、方向感
- **东西方桥接 (East-West Bridge)** - 融合全球视野与本土执行

---

### 2. 视觉规范 (Visual Standards)

#### 2.1 色彩系统 (Color Palette)

| 颜色名称 | Hex | RGB | 使用场景 |
|---------|-----|-----|---------|
| **主色 - 深板岩 (Deep Slate)** | `#0F172A` | rgb(15, 23, 42) | 背景、深色轮廓、西装 |
| **辅助 - 中板岩 (Medium Slate)** | `#334155` | rgb(51, 65, 85) | 次要轮廓、阴影 |
| **点缀 - 青色 (Cyan)** | `#06B6D4` | rgb(6, 182, 212) | 高光、技术元素、眼睛 |
| **点缀 - 金色 (Gold)** | `#D4AF37` | rgb(212, 175, 55) | 荣耀、成就、徽章 |
| **背景 - 浅灰 (Light Gray)** | `#F8FAFC` | rgb(248, 250, 252) | 留白、卡片背景 |

#### 2.2 插画风格 (Illustration Style)

**统一描述 (Unified Description)**:
```
Minimalist line art portrait, modern professional illustration style, 
high-contrast monochrome with cyan accents, geometric facial features,
clean vector aesthetic, corporate identity portrait, sophisticated 
and authoritative presence, subtle gold accent for achievement badge.
```

**核心特征 (Core Characteristics)**:
1. **极简线条 (Minimalist Lines)** - 简洁的轮廓线，避免繁复细节
2. **几何化处理 (Geometric Abstraction)** - 面部特征适度几何化
3. **高对比度 (High Contrast)** - 深色轮廓 (#0F172A) 配浅色背景
4. **青色高光 (Cyan Highlights)** - 眼睛、高光点使用 #06B6D4
5. **金色点缀 (Gold Accents)** - 成就徽章、特殊标识使用 #D4AF37

#### 2.3 构图规范 (Composition Standards)

**头像比例 (Portrait Ratio)**:
- **比例**: 1:1 正方形
- **主体位置**: 面部位于画面中央偏上 (Rule of thirds - upper third)
- **视线方向**: 略微偏向观察者，建立连接感
- **肩部以上**: 展示专业上半身形象

**留白 (Negative Space)**:
- 四周保持 15-20% 的留白区域
- 避免边缘切割面部或关键特征

---

### 3. AI 生成 Prompt 模板

#### 3.1 英文 Prompt (English)

**基础模板 (Base Template)**:
```
Minimalist line art portrait illustration, modern professional corporate style, 
subject: [NAME], [GENDER], [ETHNICITY/REGION] business professional, 
confident and approachable expression, wearing [ATTIRE: dark formal suit/navy blazer],
geometric facial structure with clean lines, high-contrast monochrome palette 
using deep navy (#0F172A) for outlines, subtle cyan (#06B6D4) highlights 
for eyes and key features, light gray (#F8FAFC) background, vector art aesthetic,
flat design with minimal shading, sophisticated and authoritative presence,
[optional: small gold accent for achievement badge on lapel],
symmetrical composition, professional headshot style, 
suitable for fintech consulting website, clean white background,
--style raw --ar 1:1 --v 6
```

**Mark Lin 专用 Prompt**:
```
Minimalist line art portrait illustration, modern professional corporate style, 
subject: Asian male business executive in his 60s, distinguished appearance,
confident and wise expression with subtle smile, wearing dark navy formal suit 
with white shirt, geometric facial structure with clean lines, 
high-contrast monochrome palette using deep navy (#0F172A) for outlines, 
subtle cyan (#06B6D4) highlights for eyes and key features, 
small gold (#D4AF37) lapel pin representing "President's Club" honor,
light gray (#F8FAFC) background, vector art aesthetic, flat design with 
minimal shading, marathon runner's determined presence, sophisticated and 
authoritative, symmetrical composition, professional headshot style, 
suitable for fintech consulting website, clean white background,
--style raw --ar 1:1 --v 6
```

#### 3.2 中文 Prompt 参考 (Chinese Reference)

```
极简线条艺术肖像插画，现代专业企业风格，亚洲商务人士，
60岁左右男性，睿智自信的表情，身着深蓝色西装白衬衫，
几何化面部结构配以干净利落的线条，高对比度单色调色板，
使用深海军蓝(#0F172A)轮廓线，青色(#06B6D4)点缀眼睛和关键特征，
金色(#D4AF37)领针象征卓越荣誉，浅灰(#F8FAFC)背景，
矢量艺术风格，扁平设计极简阴影，专业权威感，
对称构图，商务头像风格，金融科技咨询网站适用，纯白背景
```

---

### 4. 技术规格 (Technical Specifications)

#### 4.1 输出格式 (Output Format)

- **文件格式**: PNG (透明背景) 或 SVG (矢量)
- **尺寸**: 800×800px (1:1 比例)
- **色彩模式**: RGB
- **分辨率**: 72-150 DPI (网页用)

#### 4.2 占位符使用 (Placeholder Usage)

在团队成员插画尚未生成时，使用以下占位符：

```
[AI-Generated Illustration - FAC Style]
Deep Navy (#0F172A) geometric portrait
Cyan (#06B6D4) accent highlights
Gold (#D4AF37) achievement badge
Minimalist line art style
```

---

### 5. 应用场景 (Application Scenarios)

#### 5.1 团队成员展示 (Team Member Display)
- 使用 1:1 正方形头像
- 在卡片中显示半身像
- 悬停时轻微放大 (scale: 1.05)

#### 5.2 创始人特别展示 (Founder Spotlight)
- Mark Lin 可使用更大尺寸展示
- 可加入特殊元素：马拉松隐喻的流动线条背景
- 强调 "President's Club" 金色徽章

#### 5.3 合作伙伴/顾问 (Partners/Advisors)
- 使用统一风格保持视觉一致性
- 可使用圆形或圆角方形裁切
- 背景使用浅灰 (#F8FAFC)

---

### 6. 新成员入职流程 (New Member Onboarding)

当有新顾问加入 FAC 时，请按以下步骤生成插画：

1. **收集素材**: 获取新成员的专业照片（正面、清晰、职业装）
2. **填写变量**: 根据本指南第3节的 Prompt 模板填写：
   - [NAME] - 成员姓名
   - [GENDER] - 性别
   - [ETHNICITY/REGION] - 种族/地区
   - [ATTIRE] - 着装描述
3. **生成插画**: 使用 Midjourney / DALL-E / Stable Diffusion 生成
4. **后期调整**: 确保色彩符合 FAC 色板
5. **存储归档**: 按命名规范保存至 `public/team/[member-id].png`

---

### 7. 命名规范 (Naming Convention)

```
文件命名: team-[firstname]-[lastname]-fac-style.png
示例: team-mark-lin-fac-style.png
       team-sarah-chen-fac-style.png
       team-ahmed-al-farsi-fac-style.png

存储路径: /public/team/
```

---

### 8. 一致性检查清单 (Consistency Checklist)

在生成或审核新插画时，请确认：

- [ ] 使用深板岩色 (#0F172A) 作为主要轮廓色
- [ ] 青色 (#06B6D4) 仅用于眼睛和高光点缀
- [ ] 背景为浅灰 (#F8FAFC) 或纯白
- [ ] 面部特征几何化，避免写实风格
- [ ] 保持1:1正方形比例
- [ ] 面部位于中央偏上位置
- [ ] 表情专业自信，略带亲和力
- [ ] 如有特殊荣誉，使用金色 (#D4AF37) 徽章

---

### 9. 参考资料 (Reference Materials)

**风格参考 (Style References)**:
- Notion 品牌插画风格
- Linear 应用程序插画风格
- Apple 团队肖像风格

**FAC 设计系统关联 (FAC Design System)**:
- 主文档: `app/globals.css`
- 色彩变量: `--color-navy-900`, `--color-cyan`, `--color-gold`
- 字体: Geist Sans / Geist Mono

---

**文档版本**: v1.0  
**最后更新**: 2026-04-23  
**负责团队**: FAC Brand & Design  
**审批人**: Mark GC Lin
