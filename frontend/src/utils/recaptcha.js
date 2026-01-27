const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
let recaptchaScriptPromise = null;

export const loadRecaptcha = () => {
  if (!recaptchaSiteKey || typeof window === 'undefined') {
    return Promise.resolve(false);
  }

  if (window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
    return Promise.resolve(true);
  }

  if (recaptchaScriptPromise) {
    return recaptchaScriptPromise;
  }

  recaptchaScriptPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
};

export const executeRecaptcha = async (action) => {
  if (!recaptchaSiteKey) {
    return null;
  }

  const loaded = await loadRecaptcha();
  if (!loaded || !window.grecaptcha || typeof window.grecaptcha.execute !== 'function') {
    return null;
  }

  try {
    return await window.grecaptcha.execute(recaptchaSiteKey, { action });
  } catch (error) {
    console.error('reCAPTCHA execution failed:', error);
    return null;
  }
};
