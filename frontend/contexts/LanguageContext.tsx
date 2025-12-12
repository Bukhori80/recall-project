import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type Language = 'en' | 'id';

// Mendefinisikan struktur tipe berdasarkan objek translations 'en'
// agar kita mendapatkan autocomplete di komponen lain.
type TranslationStructure = typeof translations.en;

type Translations = {
  [key in Language]: TranslationStructure;
};

const translations = {
  en: {
    common: {
      recall: "Recall",
      login: "Login",
      logout: "Logout",
      profile: "Profile",
      dashboard: "Dashboard",
      homeDashboard: "Dashboard",
      recommendation: "Recommendation",
      packages: "Packages",
      getStarted: "Get Started",
      next: "Next",
      continue: "Continue",
      cancel: "Cancel",
      saveChanges: "Save Changes",
      editProfile: "Edit Profile",
      help: "Need Help?",
      back: "Back",
      step: "Step",
      of: "of",
    },
    landing: {
      title: "Personalized Telco Plans for You",
      subtitle: "Recall uses machine learning to provide smart, personalized telco recommendations, simplifying choices for you.",
      footer: "© 2025 Recall. Work of Team A25-CS019 from Asah",
      features: {
        analyticsTitle: "Real-time Analytics",
        analyticsDesc: "Monitor bandwidth usage per app in detail to understand your digital lifestyle.",
        churnTitle: "Churn Prediction",
        churnDesc: "AI detects usage anomalies 30 days before you might consider switching providers.",
        offerTitle: "Personalized Offer",
        offerDesc: "We ensure every promo notification is 100% relevant to your needs."
      },
      stats: {
        users: "Active Users",
        savings: "Avg. Savings",
        accuracy: "AI Accuracy"
      },
      howItWorks: {
        title: "How Recall Works",
        subtitle: "Get your perfect plan in 3 simple steps.",
        step1Title: "Register Account",
        step1Desc: "Create an account in seconds.",
        step2Title: "Input Your Habits",
        step2Desc: "Tell us your data usage and budget.",
        step3Title: "Get AI Advice",
        step3Desc: "Receive personalized plan recommendations."
      },
      faq: {
        title: "Frequently Asked Questions",
        q1: "Is my data safe?",
        a1: "Yes, we use bank-grade encryption to protect your personal data.",
        q2: "Is this service free?",
        a2: "Recall is currently 100% free for all users.",
        q3: "Which providers are supported?",
        a3: "We support all major providers in Indonesia (Telkomsel, Indosat, XL, etc)."
      },
      ctaBottom: {
        title: "Ready to Save on Your Bill?",
        btn: "Join Recall Now"
      },
      heroTypewriter: ['New: AI Agentic Features', 'Smart Recommendations', 'Usage Analytics'],
      totalSavings: "Total Savings",
      last30Days: "Last 30 Days"

    },
    login: {
      title: "Log in to your account",
      subtitle: "Welcome back! Please enter your details.",
      usernameLabel: "Username",
      usernamePlaceholder: "Enter username",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter password",
      forgotPassword: "Forgot Password?",
      submit: "Log In",
      footerHelp: "Having trouble logging in? Our AI is ready to assist with account recovery.",
      promoTitle: "Smart Recommendations, Right Connection.",
      promoDesc: "Recall simplifies how you choose the telecommunication package that best suits your needs.",
      notHaveAccountPrefix: "Don't have an account? Register ",
      notHaveAccountLink: "here!"
    },
    register: {
      title: "Create Your Recall Account",
      subtitle: "Fill in the details below to get started.",
      usernameLabel: "Username",
      usernamePlaceholder: "Enter your username",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Confirm your password",
      passwordHint: "Minimum 8 characters, 1 uppercase letter, and 1 number.",
      next: "Next",
      haveAccount: "Already have an account? Log In"
    },
    onboarding: {
      step1Title: "Discover Your Potential",
      step1Desc: "Let Recall help you unlock the full potential of your telecommunication services with smart, personalized recommendations.",
      step2Title: "Smart Insights, Right Choices",
      step2Desc: "Recall analyzes your usage patterns to provide smart recommendations that help you choose the best telecommunication products.",
      step3Title: "Complete Profile for Accurate Recommendations",
      step3Desc: "This data is used to generate more personal and accurate recommendations.",

      // Fields
      dataUsageLabel: "Internet data usage per month",
      dataUsagePlaceholder: "Select data usage (GB)",
      callDurationLabel: "Call duration per month",
      callDurationPlaceholder: "Select call duration (Minutes)",
      smsCountLabel: "SMS sent per month",
      smsCountPlaceholder: "Select SMS count",
      topupFreqLabel: "Top-up/Purchase frequency",
      topupFreqPlaceholder: "Select frequency",
      deviceBrandLabel: "Mobile device brand",
      deviceBrandPlaceholder: "Select device brand",
      monthlySpendLabel: "Monthly telco expenditure",
      monthlySpendPlaceholder: "Select expenditure range (IDR)",
      paymentMethodLabel: "Payment method",
      paymentMethodPlaceholder: "Select payment method",

      // New Fields (Added for RegisterNeeds.tsx consistency)
      travelScoreLabel: "Frequency of overseas travel",
      travelScorePlaceholder: "Select travel frequency",
      videoUsageLabel: "Video streaming percentage",
      videoUsagePlaceholder: "Select percentage",

      // Options & Actions
      prepaid: "Prepaid",
      postpaid: "Postpaid",
      weekly: "Weekly",
      monthly: "Monthly",
      always: "Always",
      rarely: "Rarely",
      medium: "Medium",
      often: "Often",
      never: "Never",
      terms: "I agree to the Terms & Conditions of Purchase.",
      createAccount: "Create Account",
      successTitle: "Registration Successful!",
      successWelcome: "Welcome, [User Name]! Your account has been created successfully.",
      successDesc: "Now, we will prepare the best personal recommendations for you based on your profile data.",
      goToDashboard: "Continue to Dashboard",
      viewProfile: "View My Profile"
    },
    dashboard: {
      welcome: "Hello, [Name]!",
      welcomeSub: "Welcome to Recall.",
      behaviourTitle: "Behaviour Summary",
      behaviourDesc: "Based on your input 30 days behaviour, we show this usage data:",
      data: "Data",
      call: "Call",
      sms: "SMS",
      streaming: "Percentage Streaming Data",
      roaming: "Data Roaming",
      device: "Device Brand",
      payment: "Payment Method",
      expenditure: "Monthly Expenditure",
      topup: "Data Top-up",
      historyRecomendation: "Recent Recommendation History",
      generateRec: "Generate New Recommendation",
      aiTitle: "Analyze Your Habits with Recall AI",
      aiDesc: "Get deep understanding of your usage patterns and find the most suitable package.",
      startAnalysis: "Start Analysis",
      confidence: "Confidence"
    },
    categories: {
      title: "Choose Product Category",
      subtitle: "Find the package that best suits your needs.",
      aiInsight: "You usually choose the Data category.",
      generalOffer: "General Offer",
      generalOfferDesc: "General packages and latest promotions for you.",
      dataBooster: "Data Booster",
      dataBoosterDesc: "Add extra data quota anytime.",
      streamingPlan: "Streaming Plan",
      streamingPlanDesc: "Enjoy unlimited video streaming services.",
      device: "Device",
      deviceDesc: "Upgrade your device with special offers.",
      familyPlan: "Family Plan",
      familyPlanDesc: "Sharing package for all family members.",
      retention: "Retention Offer",
      retentionDesc: "Special offers for loyal customers.",
      roamingPass: "Roaming Pass",
      roamingPassDesc: "Stay connected while traveling abroad.",
      topupPromo: "Top-up Promo",
      topupPromoDesc: "Get bonuses when you top up.",
      voiceBundle: "Voice Bundle",
      voiceBundleDesc: "Affordable call packages to all operators."
    },
    analytics: {
      title: "Your Behaviour Analytics",
      insightTitle: "Based on your patterns, you are a 'Data Heavy Night User'.",
      insightDesc: "This insight is generated by our AI based on your recent activity.",
      seeRec: "See My Smart Recommendations",
      labels: {
        totalUsage30: "Total Usage (Last 30 Days)",
        totalUsage: "Total Usage",
        avgStreaming: "Avg Streaming Time",
        roamingUsage: "Roaming Usage",
        mainDevice: "Main Device",
        payment: "Payment",
        monthlyExp: "Monthly Expenditure",
        topupFreq: "Top-up Frequency"
      }
    },
    recommendation: {
      title: "Find the Perfect Package for You",
      subtitle: "Get personalized telecommunication package recommendations based on your usage habits, powered by our smart technology.",
      generate: "Generate Recommendation",
      mainRecTitle: "Main Package Recommendation For You:",
      confidence: "Confidence",
      modelAccuracy: "Model Accuracy Target",
      relevance: "Relevance",
      quota: "Quota",
      validity: "Validity",
      price: "Price",
      selectPackage: "Select Package",
      whyRec: "Why this is recommended?",
      reason1: "Because you often stream between 19.00–24.00.",
      tag1: "Frequent video streaming",
      reason2: "Because your average data usage is > 2GB/day.",
      tag2: "High night data usage",
      helpful: "Is this recommendation helpful?",
      explain: "Explain this recommendation",
      compare: "Compare with other packages",
      checkBehaviour: "Check my behaviour"
    },
    productDetail: {
      benefitDetail: "Benefit Detail",
      mainQuota: "Main Quota",
      nightQuota: "Night Quota",
      callsSame: "Calls to Same Provider",
      smsSame: "SMS to Same Provider",
      videoPlatform: "Video Platform",
      viewOriginal: "View Original Product",
      aiInsightTitle: "AI Insight",
      aiInsightDesc: "This package is suitable because your data usage is high at night. You will save significant main quota."
    },
    profile: {
      myProfile: "My Profile",
      usageData: "Usage Data",
      used: "used",
      remainingQuota: "Remaining Quota",
      currentPackage: "Current Package",
      nextRenewal: "Next Renewal",
      daysLeft: "days left",
      dataRoaming: "Data Roaming",
      inactive: "Inactive",
      deviceBrand: "Device Brand",
      paymentMethod: "Payment Method",
      monthlyExp: "Monthly Expenditure",
      dataTopup: "Data Top-up",
      askAiTitle: "Ask Recall AI",
      askAiDesc: "Get the best package recommendations for you this week.",
      startRec: "Start Recommendation"
    },
    editProfile: {
      title: "Edit Profile",
      subtitle: "Update your personal account information.",
      photoInst: "Allowed: JPG, GIF or PNG. Max size of 800K",
      fullName: "Full Name",
      phoneNumber: "Phone Number",
      email: "Email Address",
      changePhoto: "Change Photo",
      changePasswordTitle: "Change Password",
      newPasswordLabel: "New Password",
      newPasswordPlaceholder: "Leave blank if you don't want to change",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Repeat new password",
      saving: "Saving..."
    },
    validation: {
      usernameRequired: "Username is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email format",
      passwordRequired: "Password is required",
      passwordMinLength: "Password must be at least 6 characters",
      passwordMismatch: "New password and confirmation do not match",
      confirmPasswordRequired: "Confirm password is required",
      validationFailedTitle: "Validation Failed",
      validationFailedDesc: "Please complete all required fields and ensure the email format is correct.",
      profileFetchError: "Failed to fetch profile data.",
      profileUpdateSuccessTitle: "Success!",
      profileUpdateSuccessDesc: "Profile successfully updated.",
      profileUpdateErrorTitle: "Failed to Update Profile",
      profileUpdateErrorDesc: "An error occurred while saving data.",
      loginFailedTitle: "Login Failed",
      loginSuccessTitle: "Login Successful!",
      loginSuccessDesc: "Welcome back.",
      loginNetworkErrorTitle: "Network Error",
      loginNetworkErrorDesc: "Server unreachable",
      inputRequiredTitle: "Warning",
      inputRequiredDesc: "Username and password are required!",
      tokenInvalid: "Invalid token"
    },
    chat: {
      title: "Recall AI Agent",
      initialMessage: "Hello! I'm the Recall AI Assistant. I can help you find the best packages, predict your churn risk, and analyze your usage. How can I help you today? You can also use the quick actions below.",
      inputPlaceholder: "Ask me anything about your plan...",
      actions: {
        checkBest: "Check Best Package",
        churn: "Predict My Churn",
        analyze: "Check my Usage"
      },
      botName: "Recall AI",
      you: "You",
      typing: "Recall AI is typing..."
    }
  },
  id: {
    common: {
      recall: "Recall",
      login: "Masuk",
      logout: "Keluar",
      profile: "Profil",
      dashboard: "Dashboard",
      homeDashboard: "Dashboard",
      recommendation: "Rekomendasi",
      packages: "Paket",
      getStarted: "Mulai Sekarang",
      next: "Selanjutnya",
      continue: "Lanjutkan",
      cancel: "Batal",
      saveChanges: "Simpan Perubahan",
      editProfile: "Edit Profil",
      help: "Butuh Bantuan?",
      back: "Kembali",
      step: "Langkah",
      of: "dari",
    },
    landing: {
      title: "Personalisasi Paket Telkomunikasi untuk Anda",
      subtitle: "Recall menggunakan machine learning untuk memberikan rekomendasi paket telco yang cerdas dan dipersonalisasi, menyederhanakan pilihan untuk Anda.",
      footer: "© 2025 Recall. Karya Tim A25-CS019 dari Asah",
      features: {
        analyticsTitle: "Analitik Real-time",
        analyticsDesc: "Pantau penggunaan bandwidth per aplikasi secara detail untuk memahami gaya hidup digital Anda.",
        churnTitle: "Prediksi Churn",
        churnDesc: "AI mendeteksi anomali penggunaan 30 hari sebelum Anda mungkin mempertimbangkan untuk berhenti berlangganan.",
        offerTitle: "Penawaran Personal",
        offerDesc: "Kami memastikan setiap notifikasi promo 100% relevan dengan kebutuhan Anda."
      },
      stats: {
        users: "Pengguna Aktif",
        savings: "Rata-rata Hemat",
        accuracy: "Akurasi AI"
      },
      howItWorks: {
        title: "Cara Kerja Recall",
        subtitle: "Dapatkan paket terbaik dalam 3 langkah mudah.",
        step1Title: "Daftar Akun",
        step1Desc: "Buat akun hanya dalam hitungan detik.",
        step2Title: "Isi Kebiasaan",
        step2Desc: "Beritahu kami penggunaan data dan budget Anda.",
        step3Title: "Dapat Rekomendasi",
        step3Desc: "Terima rekomendasi paket yang dipersonalisasi."
      },
      faq: {
        title: "Pertanyaan Umum",
        q1: "Apakah data saya aman?",
        a1: "Ya, kami menggunakan enkripsi setara bank untuk melindungi data pribadi Anda.",
        q2: "Apakah layanan ini gratis?",
        a2: "Recall saat ini 100% gratis untuk semua pengguna.",
        q3: "Provider apa saja yang didukung?",
        a3: "Kami mendukung semua provider utama di Indonesia (Telkomsel, Indosat, XL, dll)."
      },
      ctaBottom: {
        title: "Siap Menghemat Tagihan Anda?",
        btn: "Gabung Recall Sekarang"
      },
      heroTypewriter: ['Baru: Fitur Agen AI', 'Rekomendasi Cerdas', 'Analisis Penggunaan'],
      totalSavings: "Total Hemat",
      last30Days: "30 Hari Terakhir"
    },
    login: {
      title: "Masuk ke Akun Anda",
      subtitle: "Selamat datang kembali! Silakan masukkan detail Anda.",
      usernameLabel: "Nama Pengguna",
      usernamePlaceholder: "Masukkan nama Pengguna..",
      passwordLabel: "Password",
      passwordPlaceholder: "Masukkan password",
      forgotPassword: "Lupa Password?",
      submit: "Masuk",
      footerHelp: "Mengalami kendala masuk? AI kami siap membantu pemulihan akun Anda.",
      promoTitle: "Rekomendasi Cerdas, Koneksi Tepat.",
      promoDesc: "Recall menyederhanakan cara Anda memilih paket telekomunikasi yang paling sesuai dengan kebutuhan Anda.",
      notHaveAccountPrefix: "Belum punya akun? Daftar ",
      notHaveAccountLink: "di sini!"
    },
    register: {
      title: "Buat Akun Recall Anda",
      subtitle: "Isi detail di bawah ini untuk memulai.",
      usernameLabel: "Nama Pengguna",
      usernamePlaceholder: "Masukkan nama untuk nama pengguna",
      emailLabel: "Email",
      emailPlaceholder: "contoh example@email.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Masukkan password Anda",
      confirmPasswordLabel: "Konfirmasi Password",
      confirmPasswordPlaceholder: "Konfirmasi password Anda",
      passwordHint: "Minimal 8 karakter, 1 huruf besar, dan 1 angka.",
      next: "Selanjutnya",
      haveAccount: "Sudah punya akun? Masuk"
    },
    onboarding: {
      step1Title: "Temukan Potensi Anda",
      step1Desc: "Biarkan Recall membantu Anda membuka potensi penuh dari layanan telekomunikasi Anda dengan rekomendasi cerdas yang dipersonalisasi.",
      step2Title: "Wawasan Cerdas, Pilihan Tepat",
      step2Desc: "Recall menganalisis pola penggunaan Anda untuk memberikan rekomendasi cerdas yang membantu Anda memilih produk telekomunikasi terbaik.",
      step3Title: "Lengkapi Profil untuk Rekomendasi Akurat",
      step3Desc: "Data ini digunakan untuk menghasilkan rekomendasi yang lebih personal dan akurat.",

      // Fields
      dataUsageLabel: "Penggunaan data internet per bulan",
      dataUsagePlaceholder: "Pilih penggunaan data (GB)",
      callDurationLabel: "Durasi telepon per bulan",
      callDurationPlaceholder: "Pilih durasi telepon (Menit)",
      smsCountLabel: "Pengiriman SMS per bulan",
      smsCountPlaceholder: "Pilih jumlah SMS",
      topupFreqLabel: "Frekuensi top-up/beli paket",
      topupFreqPlaceholder: "Pilih frekuensi",
      deviceBrandLabel: "Merek perangkat seluler",
      deviceBrandPlaceholder: "Pilih merek perangkat",
      monthlySpendLabel: "Pengeluaran telko bulanan",
      monthlySpendPlaceholder: "Pilih rentang pengeluaran (IDR)",
      paymentMethodLabel: "Metode pembayaran",
      paymentMethodPlaceholder: "Pilih metode pembayaran",

      // New Fields (Consistent with EN)
      travelScoreLabel: "Frekuensi perjalanan ke luar negeri",
      travelScorePlaceholder: "Pilih frekuensi perjalanan",
      videoUsageLabel: "Persentase streaming video",
      videoUsagePlaceholder: "Pilih persentase",

      // Options & Actions
      prepaid: "Prabayar",
      postpaid: "Pascabayar",
      weekly: "Mingguan",
      monthly: "Bulanan",
      always: "Selalu",
      rarely: "Sering",
      medium: "Menengah",
      often: "Jarang",
      never: "Tidak Pernah",
      terms: "Saya setuju dengan Syarat & Ketentuan Pembelian.",
      createAccount: "Buat Akun",
      successTitle: "Pendaftaran Berhasil!",
      successWelcome: "Selamat datang, [Nama Pengguna]! Akun Anda berhasil dibuat.",
      successDesc: "Sekarang, kami akan menyiapkan rekomendasi personal terbaik untuk Anda berdasarkan data profil Anda.",
      goToDashboard: "Lanjutkan ke Dashboard",
      viewProfile: "Lihat Profil Saya"
    },
    dashboard: {
      welcome: "Halo, [Name]!",
      welcomeSub: "Selamat Datang di Recall.",
      behaviourTitle: "Ringkasan Perilaku",
      behaviourDesc: "Berdasarkan input perilaku 30 hari dari Anda, Kami menampilkan data penggunaannya:",
      data: "Data",
      call: "Telepon",
      sms: "SMS",
      streaming: "Pesentasi Data Streaming",
      roaming: "Roaming Data",
      device: "Merek Perangkat",
      payment: "Metode Pembayaran",
      expenditure: "Pengeluaran Bulanan",
      topup: "Top-up Data",
      historyRecomendation: "Riwayat Rekomendasi Terbaru",
      generateRec: "Buat Rekomendasi Baru",
      aiTitle: "Analisis Kebiasaan Anda dengan Recall AI",
      aiDesc: "Dapatkan pemahaman mendalam tentang pola penggunaan Anda dan temukan paket yang paling sesuai.",
      startAnalysis: "Mulai Analisis",
      confidence: "Keyakinan"
    },
    categories: {
      title: "Pilih Kategori Produk",
      subtitle: "Temukan paket yang paling sesuai dengan kebutuhan Anda.",
      aiInsight: "Anda biasanya memilih kategori Data.",
      generalOffer: "Penawaran Umum",
      generalOfferDesc: "Paket umum dan promosi terbaru untuk Anda.",
      dataBooster: "Data Booster",
      dataBoosterDesc: "Tambah kuota data ekstra kapan saja.",
      streamingPlan: "Paket Streaming",
      streamingPlanDesc: "Nikmati layanan streaming video tanpa batas.",
      device: "Perangkat",
      deviceDesc: "Tingkatkan perangkat Anda dengan penawaran spesial.",
      familyPlan: "Paket Keluarga",
      familyPlanDesc: "Paket berbagi untuk seluruh anggota keluarga.",
      retention: "Penawaran Retensi",
      retentionDesc: "Penawaran spesial untuk pelanggan setia.",
      roamingPass: "Paket Roaming",
      roamingPassDesc: "Tetap terhubung saat bepergian ke luar negeri.",
      topupPromo: "Promo Top-up",
      topupPromoDesc: "Dapatkan bonus saat Anda melakukan isi ulang.",
      voiceBundle: "Paket Suara",
      voiceBundleDesc: "Paket telepon hemat ke semua operator."
    },
    analytics: {
      title: "Analitik Perilaku Anda",
      insightTitle: "Berdasarkan pola Anda, Anda termasuk tipe 'Data Heavy Night User'.",
      insightDesc: "Wawasan ini dihasilkan oleh AI kami berdasarkan aktivitas terbaru Anda.",
      seeRec: "Lihat Rekomendasi Cerdas Saya",
      labels: {
        totalUsage30: "Total Penggunaan (30 Hari Terakhir)",
        totalUsage: "Total Penggunaan",
        avgStreaming: "Rata-rata Waktu Streaming",
        roamingUsage: "Penggunaan Roaming",
        mainDevice: "Perangkat Utama",
        payment: "Pembayaran",
        monthlyExp: "Pengeluaran Bulanan",
        topupFreq: "Frekuensi Top-up"
      }
    },
    recommendation: {
      title: "Temukan Paket yang Paling Tepat untuk Anda",
      subtitle: "Dapatkan rekomendasi paket telekomunikasi yang dipersonalisasi berdasarkan kebiasaan penggunaan Anda, didukung oleh teknologi cerdas kami.",
      generate: "Buat Rekomendasi",
      mainRecTitle: "Rekomendasi Paket Utama Untuk Anda:",
      confidence: "Kepercayaan",
      modelAccuracy: "Target Akurasi Model",
      relevance: "Relevansi",
      quota: "Kuota",
      validity: "Masa Aktif",
      price: "Harga",
      selectPackage: "Pilih Paket",
      whyRec: "Mengapa ini direkomendasikan?",
      reason1: "Karena Anda sering streaming pukul 19.00–24.00.",
      tag1: "Sering streaming video",
      reason2: "Karena penggunaan data rata-rata > 2GB/hari.",
      tag2: "Penggunaan data malam tinggi",
      helpful: "Apakah rekomendasi ini membantu?",
      explain: "Jelaskan rekomendasi ini",
      compare: "Bandingkan dengan paket lain",
      checkBehaviour: "Cek perilaku saya"
    },
    productDetail: {
      benefitDetail: "Detail Manfaat",
      mainQuota: "Kuota Utama",
      nightQuota: "Kuota Malam",
      callsSame: "Telepon Sesama Provider",
      smsSame: "SMS Sesama Provider",
      videoPlatform: "Platform Video",
      viewOriginal: "Lihat Produk Asli",
      aiInsightTitle: "Wawasan AI",
      aiInsightDesc: "Paket ini cocok karena penggunaan data Anda tinggi pada jam malam. Anda akan menghemat kuota utama secara signifikan."
    },
    profile: {
      myProfile: "Profil Saya",
      usageData: "Data Penggunaan",
      used: "terpakai",
      remainingQuota: "Sisa Kuota",
      currentPackage: "Paket Saat Ini",
      nextRenewal: "Pembaruan Berikutnya",
      daysLeft: "hari lagi",
      dataRoaming: "Data Roaming",
      inactive: "Tidak Aktif",
      deviceBrand: "Merek Perangkat",
      paymentMethod: "Metode Pembayaran",
      monthlyExp: "Pengeluaran Bulanan",
      dataTopup: "Top-up Data",
      askAiTitle: "Tanya Recall AI",
      askAiDesc: "Dapatkan rekomendasi paket terbaik untukmu minggu ini.",
      startRec: "Mulai Rekomendasi"
    },
    editProfile: {
      title: "Edit Profil",
      subtitle: "Perbarui informasi pribadi akun Anda.",
      photoInst: "Diizinkan: JPG, GIF atau PNG. Ukuran maks 800K",
      fullName: "Nama Lengkap",
      phoneNumber: "Nomor Telepon",
      email: "Alamat Email",
      changePhoto: "Ubah Foto",
      changePasswordTitle: "Ubah Password",
      newPasswordLabel: "Password Baru",
      newPasswordPlaceholder: "Kosongkan jika tidak ingin mengubah",
      confirmPasswordLabel: "Konfirmasi Password",
      confirmPasswordPlaceholder: "Ulangi password baru",
      saving: "Menyimpan..."
    },
    validation: {
      usernameRequired: "Nama Pengguna wajib diisi",
      emailRequired: "Email wajib diisi",
      emailInvalid: "Format email tidak valid",
      passwordRequired: "Password wajib diisi",
      passwordMinLength: "Password minimal 6 karakter",
      passwordMismatch: "Password baru dan konfirmasi tidak cocok",
      confirmPasswordRequired: "Konfirmasi password wajib diisi",
      validationFailedTitle: "Validasi Gagal",
      validationFailedDesc: "Mohon lengkapi semua field yang wajib diisi dan pastikan format email benar.",
      profileFetchError: "Gagal mengambil data profil.",
      profileUpdateSuccessTitle: "Berhasil!",
      profileUpdateSuccessDesc: "Profil berhasil diperbarui.",
      profileUpdateErrorTitle: "Gagal Memperbarui Profil",
      profileUpdateErrorDesc: "Terjadi kesalahan saat menyimpan data.",
      loginFailedTitle: "Login Gagal",
      loginSuccessTitle: "Login Berhasil!",
      loginSuccessDesc: "Selamat datang kembali.",
      loginNetworkErrorTitle: "Network Error",
      loginNetworkErrorDesc: "Server tidak dapat diakses",
      inputRequiredTitle: "Peringatan",
      inputRequiredDesc: "Username dan password wajib diisi!",
      tokenInvalid: "Token tidak valid"
    },
    chat: {
      title: "Agen Recall AI",
      initialMessage: "Halo! Saya Asisten Recall AI. Saya dapat membantu Anda menemukan paket terbaik, memprediksi risiko churn, dan menganalisis penggunaan Anda. Bagaimana saya bisa membantu Anda hari ini? Anda juga dapat menggunakan tindakan cepat di bawah ini.",
      inputPlaceholder: "Tanyakan apa saja tentang paket Anda...",
      actions: {
        checkBest: "Cek Paket Terbaik",
        churn: "Prediksi Churn Saya",
        analyze: "Cek profil penggunaan saya"
      },
      botName: "Recall AI",
      you: "Anda",
      typing: "Recall AI sedang mengetik..."
    }
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  // Gunakan Generic agar tipe 't' sesuai dengan struktur translations
  t: (key: string) => any;
  translations: TranslationStructure;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('id'); // Default to Indonesian

  useEffect(() => {
    const storedLang = localStorage.getItem('language') as Language;
    if (storedLang && (storedLang === 'en' || storedLang === 'id')) {
      setLanguage(storedLang);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (path: string) => {
    const keys = path.split('.');
    let current: any = translations[language];

    for (const key of keys) {
      if (current === undefined || current[key] === undefined) {
        console.warn(`Translation missing for key: ${path} in language: ${language}`);
        return path; // Return key path if missing
      }
      current = current[key];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      setLanguage: handleSetLanguage,
      t,
      translations: translations[language]
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};