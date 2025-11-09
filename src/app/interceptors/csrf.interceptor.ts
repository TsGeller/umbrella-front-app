import { HttpInterceptorFn } from '@angular/common/http';

const API_HOST = '51.21.224.128:8000';
const CSRF_COOKIE_NAME = 'csrftoken';
const CSRF_HEADER_NAME = 'X-CSRFTOKEN';
const MUTATING_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  if (!isApiRequest(req.url)) {
    return next(req);
  }

  const method = req.method?.toUpperCase() ?? 'GET';
  if (!MUTATING_METHODS.has(method)) {
    return next(req);
  }

  const token = getCookie(CSRF_COOKIE_NAME);
  if (!token) {
    return next(req);
  }

  const cloned = req.clone({
    setHeaders: {
      [CSRF_HEADER_NAME]: token,
    },
  });

  return next(cloned);
};

function isApiRequest(url: string): boolean {
  return url.startsWith(`http://${API_HOST}`) || url.startsWith(`https://${API_HOST}`);
}

function getCookie(name: string): string | null {
  const cookieString = document.cookie;
  if (!cookieString) {
    return null;
  }
  const cookies = cookieString.split(';');
  for (const cookie of cookies) {
    const [rawKey, ...rest] = cookie.trim().split('=');
    if (rawKey === name) {
      return decodeURIComponent(rest.join('='));
    }
  }
  return null;
}
