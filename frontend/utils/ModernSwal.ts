import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

// Cek apakah mode gelap aktif
const isDarkMode = () => {
  return document.documentElement.classList.contains('dark') ||
    localStorage.getItem('theme') === 'dark';
};

// Cek bahasa dari localStorage
const getLanguage = () => {
  return localStorage.getItem('language') || 'id';
};

const texts = {
  id: {
    close: 'Tutup',
    ok: 'OK',
    yes: 'Ya',
    cancel: 'Batal',
    loading: 'Mohon Tunggu...'
  },
  en: {
    close: 'Close',
    ok: 'OK',
    yes: 'Yes',
    cancel: 'Cancel',
    loading: 'Please Wait...'
  }
};

const getTexts = () => {
  const lang = getLanguage();
  return texts[lang as keyof typeof texts] || texts.id;
};


// Konfigurasi dasar yang modern dan konsisten
const getCommonConfig = () => {
  const dark = isDarkMode();
  return {
    background: dark ? '#1E1A2D' : '#ffffff',
    color: dark ? '#F1F5F9' : '#1E293B',
    backdrop: `rgba(0,0,0,0.5) left top no-repeat`,
    width: 'auto',
    padding: '2rem',
    customClass: {
      popup: 'rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 font-sans',
      title: 'text-2xl font-bold text-slate-900 dark:text-white mb-2',
      htmlContainer: 'text-base text-slate-600 dark:text-gray-300',
      confirmButton: 'bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 mx-2',
      cancelButton: 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-gray-200 font-bold px-6 py-3 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors mx-2',
      icon: 'border-none' // Menghilangkan border default icon agar lebih bersih
    },
    buttonsStyling: false, // Kita gunakan Tailwind classes sepenuhnya
    showClass: {
      popup: 'animate-fade-up animate-duration-300' // Animasi masuk yang halus
    },
    hideClass: {
      popup: 'animate-fade-out animate-duration-200'
    }
  };
};

export const ModernSwal = {
  // 1. Sukses
  success: (title: string, text: string = '', timer: number = 2000): Promise<SweetAlertResult> => {
    return Swal.fire({
      ...getCommonConfig(),
      icon: 'success',
      title: title,
      text: text,
      timer: timer,
      showConfirmButton: false,
      timerProgressBar: true,
    });
  },

  // 2. Error
  error: (title: string, text: string = ''): Promise<SweetAlertResult> => {
    const t = getTexts();
    return Swal.fire({
      ...getCommonConfig(),
      icon: 'error',
      title: title,
      text: text,
      confirmButtonText: t.close,
      showConfirmButton: true,
    });
  },

  // 3. Peringatan / Validasi
  warning: (title: string, text: string = ''): Promise<SweetAlertResult> => {
    const t = getTexts();
    return Swal.fire({
      ...getCommonConfig(),
      icon: 'warning',
      title: title,
      text: text,
      confirmButtonText: t.ok,
      showConfirmButton: true,
    });
  },

  // 4. Konfirmasi (Misal: Logout, Hapus)
  confirm: (
    title: string,
    text: string,
    confirmText?: string,
    cancelText?: string,
    icon: SweetAlertIcon = 'warning'
  ): Promise<SweetAlertResult> => {
    const t = getTexts();
    return Swal.fire({
      ...getCommonConfig(),
      icon: icon,
      title: title,
      text: text,
      showCancelButton: true,
      confirmButtonText: confirmText || t.yes,
      cancelButtonText: cancelText || t.cancel,
      reverseButtons: true, // Tombol aksi di kanan, batal di kiri
      focusCancel: true
    });
  },

  // 5. Loading
  loading: (title?: string) => {
    const t = getTexts();
    Swal.fire({
      ...getCommonConfig(),
      title: title || t.loading,
      html: '<div class="mt-4"><div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div></div>',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        // Hapus icon default swal saat loading custom
        // Swal.showLoading(); // Kita pakai custom spinner html
      }
    });
  },

  close: () => Swal.close()
};
