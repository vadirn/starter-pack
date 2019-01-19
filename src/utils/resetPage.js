import log from 'pretty-log';

export default function resetPage(meta = {}) {
  const { title = window.location.hostname, description, thumbnail, url } = meta;

  window.scrollTo(0, 0);

  try {
    // Primary meta tags
    document.title = title;
    document.querySelector('meta[name="title"]').setAttribute('content', title);
    document.querySelector('meta[name="description"]').setAttribute('content', description);
    // open graph / facebook
    document.querySelector('meta[property="og:type"]').setAttribute('content', 'website');
    document.querySelector('meta[property="og:url"]').setAttribute('content', url);
    document.querySelector('meta[property="og:title"]').setAttribute('content', title);
    document.querySelector('meta[property="og:description"]').setAttribute('content', description);
    document.querySelector('meta[property="og:image"]').setAttribute('content', thumbnail);
    // twitter
    document.querySelector('meta[property="twitter:card"]').setAttribute('content', 'summary_large_image');
    document.querySelector('meta[property="twitter:url"]').setAttribute('content', url);
    document.querySelector('meta[property="twitter:title"]').setAttribute('content', title);
    document.querySelector('meta[property="twitter:description"]').setAttribute('content', description);
    document.querySelector('meta[property="twitter:image"]').setAttribute('content', thumbnail);
  } catch (err) {
    log(err);
  }
}
