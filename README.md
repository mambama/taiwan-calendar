# 台灣農民曆行事曆 PWA

## 📁 檔案清單
```
taiwan-calendar/
├── index.html    ← 主程式（全部功能在這）
├── manifest.json ← PWA 設定
├── sw.js         ← Service Worker（離線支援）
├── icon-192.png  ← App 圖示（需自行準備）
├── icon-512.png  ← App 圖示（需自行準備）
└── README.md     ← 本說明檔
```

---

## 🚀 快速使用（不需部署）
直接用瀏覽器開啟 `index.html` 即可使用。
資料存在瀏覽器的 localStorage，**關掉重開資料不會消失**。

---

## 📱 安裝到手機（iPhone）
1. 用 **Safari** 開啟網頁
2. 點底部「分享」按鈕（方框加箭頭）
3. 選「加入主畫面」
4. 命名後點「新增」
5. 主畫面就會出現 App 圖示！

> iPhone 限制：直接開本機檔案（file://）無法安裝 PWA，
> 需要部署到網路才能正式安裝（見下方步驟）。

---

## 🌐 部署到網路（免費，讓 PWA 完整運作）

### 方法 A：GitHub Pages（推薦）
1. 申請免費 GitHub 帳號：https://github.com
2. 建立新 Repository（勾選 Public）
3. 把這個資料夾的所有檔案上傳
4. 進入 Settings → Pages → 選 main branch → Save
5. 幾分鐘後會得到網址：`https://你的帳號.github.io/repo名稱`
6. 用手機 Safari 開啟 → 加入主畫面 → 完成！

### 方法 B：Netlify（拖曳即部署）
1. 前往 https://app.netlify.com
2. 不需登入，直接把整個資料夾拖進網頁
3. 自動得到 `https://xxx.netlify.app` 的網址

### 方法 C：Vercel
1. 前往 https://vercel.com
2. 連結 GitHub 帳號後，選擇 repository 部署

---

## 🔄 跨裝置資料同步

### 目前機制（手動同步）
- 點「⇅ 備份/還原」
- **匯出資料** → 下載 JSON 檔
- 在另一台裝置開啟 App → **匯入資料** → 選擇剛才的 JSON

### 自動同步（需要後端）
若要手機和電腦資料自動同步，需要整合雲端資料庫：

| 服務 | 難度 | 費用 |
|------|------|------|
| Firebase Realtime DB | 中 | 免費額度足夠個人使用 |
| Supabase | 中 | 免費 |
| Cloudflare KV | 低-中 | 免費額度大 |

可以請 Claude 幫你加入 Firebase 同步功能。

---

## 🖼️ 自訂 App 圖示
準備兩張正方形圖片：
- `icon-192.png`（192×192 px）
- `icon-512.png`（512×512 px）

放進同一個資料夾即可，建議用紫色（#534AB7）背景搭配白色日曆圖示。

---

## 🔔 通知說明
- 瀏覽器通知需先點「開啟通知」授權
- 頁面/瀏覽器開著時才能收到提醒
- 安裝成 PWA 後，即使 App 在背景也能收通知（Android 完整支援，iPhone 需 iOS 16.4+）

---

功能由 Claude AI 協助開發
