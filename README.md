# 🍮 布丁記帳 Pudding Ledger

布丁狗配色的可愛記帳軟體。手機、電腦都能用，用 Google 帳號就能跨裝置同步。

**部署方式：push 上 GitHub 就好，GitHub 會自動幫你蓋好網頁**（用 GitHub Actions 自動建置、部署到 GitHub Pages），不用另外申請 Vercel / Netlify。

## 功能

- 💰 主要以台幣記帳，也可以記錄用 Wise / PayPal 刷外幣付款的花費（美金、紐幣、歐元都排在幣別選單最前面），同時保留原幣金額與台幣實付金額
- 💳 分期付款追蹤：記一筆時勾選「這是分期付款」，填入目前第幾期／共幾期，在「分期」頁籤會自動整理出每個分期項目還剩幾期、有沒有繳清
- 🔢 自訂可愛數字鍵盤輸入金額（不用叫出手機內建小鍵盤）
- 📊 「總覽」頁籤：甜甜圈圖 + 分類長條圖，一眼看出這個月花在哪裡、總共花多少
- 📒 「紀錄」頁籤：依日期分組的花費清單，點一筆可以編輯或刪除
- 🏷️ 分類可以自己新增 / 刪除，預設已經包含食物、醫療、自我充實、生活用品、訂閱、水電費、房租、交通、娛樂、其他
- 🏦 「資產」頁籤：登記各個帳戶 / 平台的餘額（可以同時記多種幣別），自動抓即時匯率換算成台幣總資產，也能標記哪些是定存（每月／每年），一眼看出總共還有多少錢、放在哪裡
- ☁️ 用 Google 帳號登入後，資料存在你自己的 Firebase 專案（Firestore），手機、電腦登入同一個 Google 帳號就會自動同步，不用按任何「同步」按鈕
- 📱 支援「加入主畫面」變成像 App 一樣的 PWA（即使沒設定 Google 同步，也能先在單一裝置上使用，資料存在瀏覽器裡）

## 上線流程（照抄你熟悉的「push 上 GitHub 自動生成網頁」）

1. **建立一次 Firebase 專案**（免費額度，個人記帳用量綽綽有餘），拿到一組設定值 —— 詳見下面「Google 同步設定」
2. 把設定值貼進 [src/firebaseConfig.ts](src/firebaseConfig.ts)，存檔
3. 把整個資料夾 push 上你的 GitHub repo
4. 到 repo 的 **Settings → Pages**，「Source」選 **GitHub Actions**（只要設定這一次）
5. 之後只要 `git push`，GitHub 就會自動建置＋部署，網址會是 `https://你的帳號.github.io/repo名稱/`（在 repo 的 Settings → Pages 可以看到實際網址，Actions 分頁可以看部署進度）
6. 把這個網址加進 Firebase Authentication 的「已授權網域」（見下方步驟 5），否則 Google 登入會失敗
7. 手機、電腦都打開同一個網址、用同一個 Google 帳號登入，資料就會即時同步 —— 手機上可以把這個網址「加入主畫面」，看起來就像一個 App

> 在還沒完成第 1-2 步之前，`src/firebaseConfig.ts` 裡都是空字串，App 會自動用「單機模式」運作（資料存在瀏覽器 localStorage），所以也可以先 `npm run dev` 玩玩看，之後想同步再補 Firebase 設定即可。

## 本機開發

```bash
npm install
npm run dev
```

打開 http://localhost:5173 即可看到畫面。

## Google 同步設定（Firebase）

想要讓手機跟電腦的資料同步，需要建立一個**你自己的** Firebase 專案：

1. 到 [Firebase Console](https://console.firebase.google.com/) 建立新專案
2. 左側選單「Build → Authentication」→ 啟用 **Google** 登入方式
3. 左側選單「Build → Firestore Database」→ 建立資料庫（正式環境模式即可，region 選 `asia-east1` 台灣近一點比較快）
4. 進入 Firestore 的「規則」分頁，貼上下面的規則（讓使用者只能讀寫自己的資料）：

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```

5. 左側選單「專案設定」→ 在「你的應用程式」新增一個「網頁應用程式」，複製出現的設定值，貼進 [src/firebaseConfig.ts](src/firebaseConfig.ts)（這個檔案裡面已經寫好要貼哪六個值）
6. **部署好網頁之後**，回到 Firebase Console 的「Authentication → Settings → 已授權網域」，把你的 `xxx.github.io` 網域加進去（不然 Google 登入按鈕會失敗）

> `src/firebaseConfig.ts` 裡的值**可以放心 commit、push 上 GitHub**——這組設定值本來就是設計成給瀏覽器端程式碼使用的，不是密碼，Google 官方也是這樣用。真正保護資料的是第 4 步的 Firestore 規則（只有登入者本人能讀寫自己的資料）。

## 專案結構

```
.github/workflows/deploy.yml   push 上 main/master 就自動建置 + 部署到 GitHub Pages
src/
  firebaseConfig.ts  填入你自己 Firebase 專案設定值的地方
  components/        所有畫面元件（NumPad 數字鍵盤、新增花費的 AddTransactionSheet、總覽圖表等）
  hooks/             useAuth（登入狀態）、useTransactions（花費資料）、useCategories（分類資料）
  lib/               firebase.ts（Firebase 初始化）、localStore.ts（單機模式）、cloudStore.ts（Firestore 讀寫）
  utils/             日期、金額格式、預設分類
```

資料存取都包成 `useTransactions` / `useCategories` 這兩個 hook，畫面元件不用管資料到底存在 Firestore 還是 localStorage，之後想換資料庫也只要改 `lib/` 底下的檔案。
