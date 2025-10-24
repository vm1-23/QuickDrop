# 🚀 QuickDrop  
*A fast, simple, and secure file-sharing web app — built for instant uploads, temporary links, and automatic expiration.*

---

## 📖 Overview  
**QuickDrop** is a full-stack web application that enables users to quickly upload and share files via temporary links — no login or registration required.  
Files are securely stored using **Vercel Blob Storage**, while metadata such as expiration, file details, and download counts are managed using **Supabase**.  

The application automatically deletes expired files and supports additional features like real-time upload progress and one-time downloads.

---

Demo Video Link: https://www.mediafire.com/file/ji35ms4z28dtb3x/QuickDrop+recording.mp4/file

---

## ✨ Features  

### 🧱 Core Features  
- **File Upload:**  
  - Drag-and-drop or button-based upload interface.  
  - No authentication required.  

- **Link Generation:**  
  - Generates unique, non-guessable file id using nanoid.  
  - Displays the link for easy sharing.  

- **Expiration:**  
  - Users can select file expiry durations ( 1 hour, 12 hours, 24 hours, 1 week).  
  - Files are automatically deleted after expiration.  

- **Download Page:**  
  - Simple, minimal download interface accessible via the generated link.  
  - Displays file name, size, and remaining validity time.  

---

### 💎 Bonus Features Implemented  
- **Real-Time Upload Progress:**  
  Displays a smooth progress bar indicating upload completion percentage.  

- **One-Time Download:**  
  File links expire immediately after the first successful download if option is selected prior to link generation.  

---

## 🧠 Tech Stack  

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js (React + Tailwind CSS) |
| **Backend** | Next.js API Routes |
| **File Storage** | [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) |
| **Database** | [Supabase](https://supabase.com/) |
| **Deployment** | Vercel |

---

## ⚙️ How It Works  

1. **Upload:**  
   - The user uploads a file via the web interface.  
   - The file is stored in **Vercel Blob**, and metadata (URL, expiry time, one-time flag, etc.) is saved in **Supabase**.  

2. **Generate Link:**  
   - A unique download link is generated.  
   - The link is shown to the user for sharing.  

3. **Expiration:**  
   - The backend periodically checks for expired files and removes them from storage.  

4. **Download:**  
   - The download route validates the file’s expiration and download status.  
   - For one-time downloads, the file is deleted immediately after it’s accessed once.  

5. **Progress Bar:**  
   - Real-time progress updates during upload using client-side event tracking.  

---


