export function normalizePhoneNumber(value) {
  const digits = String(value).replace(/[^\d+*#]/g, '');
  if (!digits) {
    return '';
  }
  if (digits.startsWith('+')) {
    return digits;
  }
  if (digits.length === 10) {
    return `+1${digits}`;
  }
  return `+${digits.replace(/^\+/, '')}`;
}

export function dialWithZoomPhone(number) {
  const normalized = normalizePhoneNumber(number);
  if (!normalized) {
    return false;
  }
  const uri = `zoomphonecall://${normalized}`;

  // CTI runs inside a Freshdesk iframe; hidden <a> clicks are often blocked.
  // Prefer top window or a user-visible navigation so the OS can hand off to Zoom.
  try {
    if (window.top && window.top !== window) {
      window.top.location.href = uri;
      return true;
    }
  } catch (err) {
    console.warn('top frame navigation blocked', err);
  }

  const opened = window.open(uri, '_blank');
  if (opened) {
    return true;
  }

  const link = document.createElement('a');
  link.href = uri;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}
