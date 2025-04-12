### Firebase Studio

### 🔧 **技術堆疊總覽**

本專案是一個使用 JavaScript/TypeScript 生態系所打造的 **現代化全端網頁應用程式**，強調模組化、可擴充性與 AI 驅動功能。以下是依類別整理的技術使用明細：

---

#### 🌐 **核心框架與語言**
- **Next.js**：基於 React 的全端框架，支援伺服器端渲染（SSR）、路由與 API 建立。
- **React**：構建使用者介面的 JavaScript 函式庫，採用元件化架構。
- **TypeScript**：JavaScript 的超集合，提供靜態型別，提升可維護性並減少錯誤。

---

#### 🤖 **AI 與機器學習**
- **Genkit AI**：專為整合 AI 功能所設計的框架，應用於如食譜建議、食材識別等功能。
- **@genkit-ai/googleai**：整合 Google AI 模型（如 Gemini），處理自然語言處理（NLP）任務。

---

#### 🎨 **使用者介面與樣式**
- **Radix UI**：無預設樣式的可存取性元件庫，提供建構自訂 UI 元件的基礎。
- **shadcn/ui**（可能使用）：基於 Radix UI 的預設樣式元件庫，廣泛用於現代 UI 建構。
- **Tailwind CSS**：實用導向的 CSS 框架，加速樣式與版面設計。
- **class-variance-authority (cva)** & **tailwind-merge**：用於有效管理 Tailwind CSS 類別與變化樣式。
- **clsx**：條件式組合 CSS 類別名稱的工具。
- **lucide-react**：統一風格的向量圖示庫。

---

#### 📝 **表單處理與資料管理**
- **react-hook-form**：React 表單狀態與驗證管理工具。
- **zod**：型別安全的資料驗證與結構聲明函式庫。
- **@hookform/resolvers**：將 Zod 整合進 react-hook-form 中。
- **@tanstack/react-query**：處理伺服器資料抓取、快取與同步狀態的強大函式庫。
- **@tanstack-query-firebase/react**：支援 TanStack Query 與 Firebase 整合。
- **Firebase**：Google 提供的應用開發平台，涵蓋使用者驗證、資料庫與儲存等功能。

---

#### 📊 **工具與資料視覺化**
- **date-fns**：日期處理與格式化工具。
- **recharts**：基於 React 的可組合式圖表函式庫。
- **patch-package**：可保存對 npm 套件所做修改的工具。

---

#### 🧰 **開發工具**
- **npm**：JavaScript 的套件管理工具。
- **postcss**：可透過插件轉換 CSS 的工具。
- **genkit-cli**：Genkit AI 專用的命令列工具。
- **next dev / next build**：分別用於啟動開發伺服器與建構正式環境版本。
- **typescript (tsc)**：將 TypeScript 編譯為 JavaScript 的編譯器。




