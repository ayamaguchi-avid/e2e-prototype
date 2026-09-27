/* Injects the shared Global Header + Side nav into every screen.
   Controlled via data attributes on <body>:
     data-active-nav="add-on-management"   -> highlights the matching side-nav item
*/
(function () {
  var ICON = 'icons/';

  function assetPath(name) {
    // screens/*.html live one level below the site root
    return '../assets/' + ICON + name;
  }

  var HEADER_HTML =
    '<header class="gh">' +
      '<div class="gh-logo"><span class="gh-logo-mark">x</span> avidxchange</div>' +
      '<div class="gh-actions">' +
        '<button class="gh-icon-btn" title="Search"><img src="' + assetPath('search.svg') + '" alt="" /></button>' +
        '<button class="gh-icon-btn" title="Notifications">&#128276;</button>' +
        '<button class="gh-icon-btn" title="Help">?</button>' +
        '<button class="gh-icon-btn" title="Apps">&#8862;</button>' +
        '<div class="gh-divider-v"></div>' +
        '<div class="gh-profile"><span class="gh-avatar">AG</span><span class="gh-username">Allie Grater</span></div>' +
      '</div>' +
    '</header>';

  var NAV_ITEMS = [
    { key: 'home', label: 'Home', icon: 'home.svg', href: '../screens/home-connected.html' },
    { key: 'my-profile', label: 'My profile', icon: 'account-box.svg', href: null },
    { key: 'batching', label: 'Batching', icon: 'stacks.svg', href: null },
    { key: 'add-on-management', label: 'Add-on management', icon: 'store.svg', href: '../screens/home-connected.html' },
    { key: 'match-policies', label: 'Match policies', icon: 'folder-match.svg', href: null },
    { key: 'contracts', label: 'Contracts', icon: 'folder-managed.svg', href: null },
    { key: 'entities', label: 'Entities', icon: 'corporate-fare.svg', href: null },
    { key: 'order-workflows', label: 'Order workflows', icon: 'conversion-path.svg', href: null },
    { key: 'invoice-workflows', label: 'Invoice workflows', icon: 'flowsheet.svg', href: null },
    { key: 'reports', label: 'Reports', icon: 'analytics.svg', href: null },
    { key: 'users', label: 'Users', icon: 'group.svg', href: null },
    { key: 'roles', label: 'Roles', icon: 'badge.svg', href: null },
    { key: 'system-configuration', label: 'System configuration', icon: 'settings.svg', href: null },
    { key: 'portal-customization', label: 'Portal customization', icon: 'inbox-customize.svg', href: null }
  ];

  function buildSideNav(activeKey) {
    var rows = NAV_ITEMS.map(function (item) {
      var active = item.key === activeKey;
      var tag = item.href ? 'a' : 'span';
      var hrefAttr = item.href ? ' href="' + item.href + '"' : '';
      return '<' + tag + hrefAttr + ' class="nav-item' + (active ? ' active' : '') + '">' +
        '<img src="' + assetPath(item.icon) + '" alt="" />' +
        '<span>' + item.label + '</span>' +
      '</' + tag + '>';
    }).join('');

    return (
      '<nav class="side-nav">' +
        '<div class="menu-group">' +
          '<div class="collapse-row"><img src="' + assetPath('collapse.svg') + '" alt="" /><span>Collapse</span></div>' +
          '<hr class="divider" />' +
          '<div class="nav-back"><img src="' + assetPath('back-arrow.svg') + '" alt="" /><span>Administration</span></div>' +
          rows +
        '</div>' +
      '</nav>'
    );
  }

  document.addEventListener('DOMContentLoaded', function () {
    var headerMount = document.getElementById('app-header');
    if (headerMount) headerMount.outerHTML = HEADER_HTML;

    var navMount = document.getElementById('app-sidenav');
    if (navMount) {
      var activeKey = document.body.getAttribute('data-active-nav') || 'add-on-management';
      navMount.outerHTML = buildSideNav(activeKey);
    }
  });
})();
