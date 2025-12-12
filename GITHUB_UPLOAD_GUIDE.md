# 📤 Panduan Upload Repository RECALL ke GitHub

Panduan lengkap untuk meng-upload proyek RECALL ke GitHub repository.

---

## 📋 Persiapan Sebelum Upload

### 1. Verifikasi File yang Akan Di-Upload

Pastikan file-file sensitif sudah masuk ke `.gitignore`:

**Cek file yang akan diabaikan:**
```bash
# Pastikan file-file ini TIDAK akan ter-commit:
# - .env (semua komponen)
# - serviceAccountKey.json (backend)
# - node_modules/ (frontend & backend)
# - venv/ (__pycache__/ untuk ml_services)
```

### 2. Install Git (Jika Belum)

**Windows:**
- Download dari: https://git-scm.com/download/win
- Install dengan default settings

**Verifikasi instalasi:**
```bash
git --version
```

### 3. Konfigurasi Git (First Time)

```bash
git config --global user.name "Nama Lengkap Anda"
git config --global user.email "email@anda.com"
```

---

## 🚀 Langkah-Langkah Upload ke GitHub

### Step 1: Buat Repository Baru di GitHub

1. Buka https://github.com
2. Login ke akun GitHub Anda
3. Klik tombol **"+" (New repository)** di pojok kanan atas
4. Isi detail repository:
   - **Repository name:** `recall-telco-retention` (atau nama lain)
   - **Description:** `RECALL - AI-Powered Telco Customer Retention System (ASAH 2025)`
   - **Visibility:** 
     - ✅ **Public** (jika ingin dapat diakses publik)
     - ✅ **Private** (jika ingin private)
   - **JANGAN centang:**
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license
     
     *(Karena kita sudah punya file-file ini)*

5. Klik **"Create repository"**

6. **COPY URL repository** yang muncul, contoh:
   ```
   https://github.com/username/recall-telco-retention.git
   ```

---

### Step 2: Inisialisasi Git di Project Lokal

Buka terminal/command prompt di folder root project:

```bash
cd "e:\tugas-kuliah\Program Asah\Capstone\Project - Recall"
```

**Inisialisasi Git repository:**
```bash
git init
```

Output yang diharapkan:
```
Initialized empty Git repository in ...
```

---

### Step 3: Tambahkan File ke Git

**Lihat status file:**
```bash
git status
```

Anda akan melihat banyak file "Untracked files" berwarna merah.

**Tambahkan semua file (kecuali yang di .gitignore):**
```bash
git add .
```

**Verifikasi file yang ditambahkan:**
```bash
git status
```

Sekarang file yang akan di-commit akan berwarna hijau.

**PENTING: Cek apakah file sensitif ter-include:**
```bash
# Pastikan file-file ini TIDAK muncul di list:
git ls-files | grep ".env"
git ls-files | grep "serviceAccountKey"
git ls-files | grep "node_modules"
```

Jika ada yang muncul, **JANGAN LANJUTKAN!** Perbaiki `.gitignore` dulu.

---

### Step 4: Commit Pertama

```bash
git commit -m "Initial commit: RECALL Telco Retention System"
```

**Atau dengan pesan yang lebih detail:**
```bash
git commit -m "feat: Initial commit - RECALL System

- Complete frontend (React + TypeScript + Vite)
- Complete backend (Node.js + Express + MongoDB)  
- ML Services (Flask + scikit-learn)
- Comprehensive documentation (EN & ID)
- Ready for deployment

Team: A25-CS019 | ASAH 2025"
```

Output yang diharapkan:
```
[main (root-commit) xxxxxxx] Initial commit: ...
 XXX files changed, XXXXX insertions(+)
 ...
```

---

### Step 5: Hubungkan dengan GitHub Repository

Ganti `YOUR_USERNAME` dan `YOUR_REPO_NAME` dengan yang sesuai:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Contoh:**
```bash
git remote add origin https://github.com/alamahul/recall-telco-retention.git
```

**Verifikasi remote:**
```bash
git remote -v
```

Output:
```
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (fetch)
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (push)
```

---

### Step 6: Rename Branch ke 'main' (Opsional tapi Direkomendasikan)

GitHub default menggunakan `main`, bukan `master`:

```bash
git branch -M main
```

---

### Step 7: Push ke GitHub

**Upload pertama kali:**
```bash
git push -u origin main
```

Anda mungkin akan diminta login GitHub:
- Masukkan **username** GitHub Anda
- Masukkan **Personal Access Token** (PAT) sebagai password
  
  *Catatan: GitHub tidak lagi menerima password biasa untuk git push*

**Jika belum punya Personal Access Token:**
1. Buka: https://github.com/settings/tokens
2. Klik **"Generate new token"** → **"Generate new token (classic)"**
3. Beri nama: `Git Push from Computer`
4. Pilih expiration: `90 days` atau `No expiration`
5. Centang scope: `repo` (full control)
6. Klik **"Generate token"**
7. **COPY TOKEN** dan simpan (ini tidak akan muncul lagi!)
8. Paste token sebagai password saat git push

**Output yang diharapkan:**
```
Enumerating objects: XXX, done.
Counting objects: 100% (XXX/XXX), done.
...
To https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

### Step 8: Verifikasi di GitHub

1. Buka browser
2. Pergi ke: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`
3. **Verifikasi:**
   - ✅ File `README.md` muncul sebagai homepage
   - ✅ Folder `backend/`, `frontend/`, `ml_services/` ada
   - ✅ File `.env` **TIDAK** ada
   - ✅ File `serviceAccountKey.json` **TIDAK** ada
   - ✅ Folder `node_modules/` **TIDAK** ada

---

## 🔄 Update Repository (Push Perubahan Selanjutnya)

Setelah membuat perubahan pada project:

```bash
# 1. Lihat file yang berubah
git status

# 2. Tambahkan file yang berubah
git add .

# 3. Commit dengan pesan yang jelas
git commit -m "fix: perbaiki bug pada dashboard admin"

# 4. Push ke GitHub
git push
```

---

## 🌿 Membuat Branch (Opsional untuk Development)

Untuk development yang lebih terorganisir:

```bash
# Buat branch baru untuk fitur
git checkout -b feature/fitur-baru

# Buat perubahan, lalu commit
git add .
git commit -m "feat: tambah fitur baru"

# Push branch baru ke GitHub
git push -u origin feature/fitur-baru
```

---

## 🛡️ Keamanan: File yang WAJIB Di-gitignore

**Pastikan file-file ini SELALU diabaikan:**

### Backend
- ❌ `.env` (semua environment variables)
- ❌ `serviceAccountKey.json` (Firebase credentials)
- ❌ `node_modules/`

### Frontend  
- ❌ `.env` (API keys termasuk Gemini)
- ❌ `node_modules/`
- ❌ `dist/` (build output)

### ML Services
- ❌ `.env`
- ❌ `venv/` atau `env/` (Python virtual environment)
- ❌ `__pycache__/`

**Jika tidak sengaja ter-commit:**

```bash
# Hapus dari Git tracking (tapi tetap ada di lokal)
git rm --cached .env
git rm --cached backend/serviceAccountKey.json
git commit -m "chore: remove sensitive files"
git push

# TAPI, file sudah masuk history Git!
# Untuk benar-benar hapus dari history (advanced):
# Gunakan: git filter-branch atau BFG Repo-Cleaner
```

---

## 📝 Membuat README yang Bagus di GitHub

File `README.md` Anda akan otomatis muncul di homepage repository.

**Tips:**
- ✅ Gunakan badges (seperti yang sudah ada)
- ✅ Sertakan screenshot (jika ada)
- ✅ Link ke dokumentasi komponen
- ✅ Sertakan demo link (jika sudah deploy)

---

## 🎨 Membuat Repository Lebih Menarik

### 1. Tambahkan Topics/Tags

Di halaman GitHub repository:
- Klik ⚙️ **Settings** (atau klik "Add topics")
- Tambahkan tags: `react`, `nodejs`, `machine-learning`, `flask`, `typescript`, `mongodb`, `telco`, `customer-retention`

### 2. Tambahkan Description

Di halaman repository, klik "Add description":
```
🌟 AI-Powered Telco Customer Retention System | ASAH 2025 | React + Node.js + Flask ML
```

### 3. Edit About Section

- Website: (masukkan URL deployment jika ada)
- Topics: Tambahkan tags relevan

### 4. Buat Releases (Opsional)

Untuk menandai versi penting:
1. Klik **"Releases"** → **"Create a new release"**
2. Tag version: `v1.0.0`
3. Release title: `RECALL v1.0.0 - Initial Release`
4. Description: Jelaskan fitur utama
5. Klik **"Publish release"**

---

## 🚨 Troubleshooting

### Error: "remote origin already exists"

```bash
# Hapus remote lama
git remote remove origin

# Tambahkan remote baru
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
```

### Error: "failed to push some refs"

```bash
# Pull dulu untuk merge perubahan
git pull origin main --allow-unrelated-histories

# Lalu push lagi
git push -u origin main
```

### Error: Authentication failed

- Pastikan menggunakan **Personal Access Token**, bukan password
- Generate token baru jika token lama expired
- Atau gunakan GitHub Desktop untuk GUI yang lebih mudah

### File .env atau serviceAccountKey.json ikut ter-commit

**SEGERA lakukan:**

```bash
# 1. Hapus dari Git
git rm --cached .env
git rm --cached backend/serviceAccountKey.json

# 2. Commit perubahan
git commit -m "chore: remove sensitive files"

# 3. Push
git push

# 4. PENTING: Generate ulang credentials!
# - Generate JWT_SECRET baru
# - Generate Firebase service account baru  
# - Generate API keys baru
# Karena yang lama sudah public di Git history!
```

---

## 📱 Alternatif: GitHub Desktop (Lebih Mudah untuk Pemula)

Jika command line terasa sulit:

1. Download **GitHub Desktop**: https://desktop.github.com/
2. Install dan login
3. **File** → **Add Local Repository**
4. Pilih folder `Project - Recall`
5. Commit dengan menulis pesan
6. Klik **"Publish repository"** untuk push ke GitHub

---

## ✅ Checklist Sebelum Push

- [ ] File `.gitignore` sudah benar untuk semua komponen
- [ ] File `.env` **TIDAK** muncul di `git status`
- [ ] File `serviceAccountKey.json` **TIDAK** muncul
- [ ] Folder `node_modules/` **TIDAK** muncul
- [ ] README.md sudah lengkap dan informatif
- [ ] Dokumentasi sudah lengkap (EN & ID)
- [ ] Semua credentials sudah di-gitignore
- [ ] Sudah test di lokal bahwa semua service berjalan

---

## 🎓 Git Commands Cheat Sheet

| Command | Fungsi |
|---------|--------|
| `git init` | Inisialisasi Git di folder |
| `git status` | Lihat status file |
| `git add .` | Tambahkan semua file |
| `git add <file>` | Tambahkan file tertentu |
| `git commit -m "pesan"` | Commit dengan pesan |
| `git push` | Upload ke GitHub |
| `git pull` | Download dari GitHub |
| `git clone <url>` | Clone repository |
| `git log` | Lihat history commit |
| `git branch` | Lihat branch yang ada |

---

## 🌟 Tips Pro

1. **Commit Sering**: Lebih baik banyak commit kecil daripada satu commit besar
2. **Pesan Commit Jelas**: Gunakan format: `type: deskripsi singkat`
   - `feat:` untuk fitur baru
   - `fix:` untuk bug fix
   - `docs:` untuk dokumentasi
   - `chore:` untuk maintenance
3. **Jangan push credentials**: Selalu double-check sebelum push
4. **Gunakan branch**: Untuk fitur baru atau experiment
5. **Baca dokumentasi Git**: https://git-scm.com/doc

---

**Dibuat untuk Tim A25-CS019 | ASAH 2025**

Semoga berhasil! 🚀
