import { useRegisterSW } from 'virtual:pwa-register/react';

export default function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) { 
      console.log('سرویس ورکر با موفقیت ثبت شد:', r);
    },
    onRegisterError(error: any) { 
      console.log('خطا در ثبت سرویس ورکر:', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div
  className="
    fixed bottom-6 left-1/2 -translate-x-1/2
    z-[2000]
    max-w-sm w-[calc(100%-32px)]
  "
>
  <div
    className="
      rounded-2xl
      border border-white/10
      bg-black/70
      backdrop-blur-xl
      shadow-2xl
      px-5 py-4
    "
  >
    <div className="flex items-start gap-3">
      <div className="text-xl">✨</div>

      <div className="flex-1">
        <p className="text-sm font-medium text-white">
          نسخه جدید آماده است
        </p>

        <p className="mt-1 text-xs text-white/60 leading-5">
          تغییرات جدید وبلاگ منتشر شده. برای دریافت آخرین نسخه صفحه را به‌روزرسانی کنید.
        </p>
      </div>
    </div>

    <div className="mt-4 flex justify-end gap-2">
      <button
        onClick={close}
        className="
          px-3 py-2
          text-sm
          rounded-xl
          text-white/70
          hover:bg-white/5
        "
      >
        بعداً
      </button>

      <button
        onClick={() => updateServiceWorker(true)}
        className="
          px-4 py-2
          text-sm font-medium
          rounded-xl
          bg-white text-black
          hover:opacity-90
        "
      >
        بروزرسانی
      </button>
    </div>
  </div>
</div>
  );
}