// Links to other sites open in a new tab. A link is external when it starts with http:// or https://
// and its host is not aadived.com. Internal links, #anchors, tel: and mailto: stay in the same tab.
const OWN_HOSTS = new Set(['aadived.com', 'www.aadived.com']);

export function isExternal(href?: string | null): boolean {
  if (!href || !/^https?:\/\//i.test(href)) return false;
  try {
    return !OWN_HOSTS.has(new URL(href).hostname.toLowerCase());
  } catch {
    return false;
  }
}

/** Spread onto an <a>: <a href={url} {...linkProps(url)}> */
export function linkProps(href?: string | null): { target?: string; rel?: string } {
  return isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {};
}
