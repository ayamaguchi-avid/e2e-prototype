/* Chrome for the "Invoice and pay" flow (AvidInvoice / AvidPay) — a DIFFERENT
   product area from the Add-on management back-office app (see chrome.js).
   Own header + icon-only sidenav, shared across:
     screens/invoice-home.html
     screens/invoice-detail.html
     screens/pay-home.html
   Controlled via data attributes on <body>:
     data-app="invoice" | "pay"           -> header wordmark (AvidInvoice / AvidPay)
     data-active-nav="orders|invoice|pay|capture|admin|analytics|info|ideas"
                                           -> highlights the matching sidenav icon
   Only this new flow's screens use this file; nothing here touches chrome.js,
   app.js, or shared.css.
*/
(function () {
  var STYLE = '' +
    '.aip-header{display:flex;align-items:center;justify-content:space-between;height:60px;' +
      'background:#fff;border-bottom:1px solid var(--border-divider);position:sticky;top:0;z-index:100;}' +
    '.aip-brand{display:flex;align-items:center;gap:16px;padding-left:16px;height:100%;}' +
    '.aip-logo-mark{width:30px;height:30px;border-radius:6px;background:var(--color-primary-b60);' +
      'display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px;flex-shrink:0;}' +
    '.aip-wordmark{font-size:20px;color:#363636;font-weight:400;}' +
    '.aip-header-controls{display:flex;height:100%;}' +
    '.aip-header-btn{width:60px;height:100%;display:flex;align-items:center;justify-content:center;' +
      'border-left:1px solid var(--border-divider);background:none;color:#666;}' +
    '.aip-header-btn:hover{background:#F7F9FB;}' +
    '.aip-header-btn svg{width:16px;height:16px;}' +
    '.aip-body{display:flex;align-items:flex-start;width:100%;}' +
    '.aip-sidenav{background:#fff;border-right:1px solid var(--border-divider);width:61px;min-width:61px;' +
      'align-self:stretch;}' +
    '.aip-sidenav .aip-item{display:flex;flex-direction:column;align-items:center;gap:4px;' +
      'padding:15px 4px;font-size:11px;color:#666;text-align:center;position:relative;line-height:1.1;}' +
    '.aip-sidenav .aip-item svg{width:18px;height:18px;}' +
    '.aip-sidenav .aip-item:hover{background:#F7F9FB;text-decoration:none;}' +
    '.aip-sidenav .aip-item.active{background:#DAE6F0;color:#2F3941;font-weight:600;}' +
    '.aip-sidenav .aip-item.active::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:#237EBC;}' +
    '.aip-content{flex:1;min-width:0;padding:24px;background:var(--bg-content-area);min-height:calc(100vh - 61px);}';

  var ICONS = {
    orders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 7h16l-1.5 11a2 2 0 0 1-2 1.7H7.5a2 2 0 0 1-2-1.7L4 7Z"/><path d="M8 7V5.5A3.5 3.5 0 0 1 11.5 2h1A3.5 3.5 0 0 1 16 5.5V7"/></svg>',
    invoice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2.5h9l3 3V21a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V3a.5.5 0 0 1 .5-.5Z"/><path d="M9 9h6M9 13h6M9 17h3.5"/></svg>',
    pay: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9.2"/><path d="M12 7v10M15 9.5c0-1.4-1.3-2.2-3-2.2s-3 .8-3 2.1c0 1.4 1.3 1.8 3 2.1s3 .8 3 2.2-1.3 2.1-3 2.1-3-.8-3-2.1"/></svg>',
    capture: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2.5" y="6" width="19" height="14" rx="2"/><path d="M8.5 6 10 3.3h4L15.5 6"/><circle cx="12" cy="13" r="3.4"/></svg>',
    admin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a7.6 7.6 0 0 0 0-3l2-1.5-2-3.4-2.4.7a7.6 7.6 0 0 0-2.6-1.5L14 2h-4l-.4 2.3a7.6 7.6 0 0 0-2.6 1.5l-2.4-.7-2 3.4 2 1.5a7.6 7.6 0 0 0 0 3l-2 1.5 2 3.4 2.4-.7c.75.65 1.63 1.16 2.6 1.5L10 22h4l.4-2.3a7.6 7.6 0 0 0 2.6-1.5l2.4.7 2-3.4-2-1.5Z"/></svg>',
    analytics: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 20V10M11 20V4M18 20v-7"/><path d="M2.5 20.5h19"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9.2"/><path d="M12 11v6M12 7.3v.1"/></svg>',
    ideas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 18h6M10 21h4"/><path d="M12 2.8a6.2 6.2 0 0 0-3.6 11.2c.6.45.9 1.15.9 1.9V16h5.4v-.1c0-.75.3-1.45.9-1.9A6.2 6.2 0 0 0 12 2.8Z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.3-4.3"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>'
  };

  var NAV_ITEMS = [
    { key: 'orders', label: 'Orders', href: null },
    { key: 'invoice', label: 'Invoice', href: '../screens/invoice-home.html' },
    { key: 'pay', label: 'Pay', href: '../screens/pay-home.html' },
    { key: 'capture', label: 'Capture', href: null },
    { key: 'admin', label: 'Admin', href: null },
    { key: 'analytics', label: 'Analytics', href: null },
    { key: 'info', label: 'Info', href: null },
    { key: 'ideas', label: 'Ideas', href: null }
  ];

  var APP_NAMES = { invoice: 'AvidInvoice', pay: 'AvidPay' };

  function buildHeader(appKey) {
    var name = APP_NAMES[appKey] || 'AvidInvoice';
    return (
      '<header class="aip-header">' +
        '<div class="aip-brand">' +
          '<span class="aip-logo-mark">x</span>' +
          '<span class="aip-wordmark">' + name + '</span>' +
        '</div>' +
        '<div class="aip-header-controls">' +
          '<button class="aip-header-btn" title="Search">' + ICONS.search + '</button>' +
          '<button class="aip-header-btn" title="Log out">' + ICONS.logout + '</button>' +
        '</div>' +
      '</header>'
    );
  }

  function buildSideNav(activeKey) {
    var rows = NAV_ITEMS.map(function (item) {
      var active = item.key === activeKey;
      var tag = item.href ? 'a' : 'span';
      var hrefAttr = item.href ? ' href="' + item.href + '"' : '';
      return '<' + tag + hrefAttr + ' class="aip-item' + (active ? ' active' : '') + '" data-nav-key="' + item.key + '">' +
        ICONS[item.key] +
        '<span>' + item.label + '</span>' +
      '</' + tag + '>';
    }).join('');
    return '<nav class="aip-sidenav">' + rows + '</nav>';
  }

  document.addEventListener('DOMContentLoaded', function () {
    var styleTag = document.createElement('style');
    styleTag.textContent = STYLE;
    document.head.appendChild(styleTag);

    var appKey = document.body.getAttribute('data-app') || 'invoice';
    var activeKey = document.body.getAttribute('data-active-nav') || 'invoice';

    var headerMount = document.getElementById('aip-header');
    if (headerMount) headerMount.outerHTML = buildHeader(appKey);

    var navMount = document.getElementById('aip-sidenav');
    if (navMount) navMount.outerHTML = buildSideNav(activeKey);
  });
})();
