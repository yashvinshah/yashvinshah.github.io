(function () {
  'use strict';

  var progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.insertBefore(progressBar, document.body.firstChild);

  var backBtn = document.createElement('button');
  backBtn.id = 'back-to-top';
  backBtn.setAttribute('aria-label', 'Back to top');
  backBtn.title = 'Back to top';
  backBtn.innerHTML = '&#8679;';
  document.body.appendChild(backBtn);
  backBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
    backBtn.classList.toggle('visible', scrollTop > 400);
    updateActiveNav(scrollTop);
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  var anchors = [];
  var navLinks = [];

  function buildNavMap() {
    document.querySelectorAll('.masthead__menu-item a').forEach(function (a) {
      navLinks.push(a);
    });
    document.querySelectorAll('h1[id], span[id].anchor').forEach(function (el) {
      anchors.push(el);
    });
  }

  function updateActiveNav(scrollTop) {
    if (!anchors.length) return;
    var current = anchors[0];
    for (var i = 0; i < anchors.length; i++) {
      if (anchors[i].getBoundingClientRect().top + scrollTop <= scrollTop + 80) {
        current = anchors[i];
      }
    }
    navLinks.forEach(function (a) {
      a.classList.remove('nav-active');
      var href = a.getAttribute('href') || '';
      if (current && href.indexOf(current.id) !== -1) {
        a.classList.add('nav-active');
      }
    });
  }

  function injectPubStatus() {
    var statusMap = {
      'In Preparation': 'pub-status pub-status--prep',
      'Under Review': 'pub-status pub-status--review',
      'Submitted': 'pub-status pub-status--review'
    };
    document.querySelectorAll('.page__content li').forEach(function (li) {
      var text = li.textContent.trim();
      if (statusMap[text]) {
        li.innerHTML = '<span class="' + statusMap[text] + '">' + text + '</span>';
      }
    });
  }

  function isContactBlock(el) {
    var t = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!t) return false;
    if (/^Contact me/i.test(t)) return true;
    if (/^Email:/i.test(t)) return true;
    if (/^LinkedIn:/i.test(t)) return true;
    return false;
  }

  function blockFromAnchor(el) {
    if (el && el.parentNode && el.parentNode.tagName === 'P' && el.parentNode.children.length === 1) {
      return el.parentNode;
    }
    return el;
  }

  function relocateAbout() {
    var dest = document.querySelector('.hero-about');
    var start = blockFromAnchor(document.getElementById('about-me'));
    var end = blockFromAnchor(document.getElementById('educations'));
    if (!dest || !start) return;

    var node = start.nextSibling;
    while (node && node !== end) {
      var next = node.nextSibling;
      if (node.nodeType === 1) {
        if (isContactBlock(node)) {
          node.style.display = 'none';
        } else {
          dest.appendChild(node);
        }
      }
      node = next;
    }
    start.style.display = 'none';
  }

  function cardifyEducation() {
    var anchor = document.getElementById('educations');
    if (!anchor) return;
    var heading = anchor.nextElementSibling;
    while (heading && heading.tagName !== 'H1') heading = heading.nextElementSibling;
    if (!heading) return;
    var ul = heading.nextElementSibling;
    while (ul && ul.tagName !== 'UL' && ul.tagName !== 'H1') ul = ul.nextElementSibling;
    if (!ul || ul.tagName !== 'UL') return;

    var grid = document.createElement('div');
    grid.className = 'card-grid';
    Array.prototype.forEach.call(ul.children, function (li) {
      if (li.tagName !== 'LI') return;
      var card = document.createElement('div');
      card.className = 'edu-card';
      card.innerHTML = li.innerHTML;
      grid.appendChild(card);
    });
    ul.parentNode.replaceChild(grid, ul);
  }

  function hideDuplicatePubCitation() {
    var start = document.getElementById('publications');
    if (!start) return;
    var el = start.nextElementSibling;
    while (el && el.tagName !== 'H1') el = el.nextElementSibling;
    if (!el) return;
    el = el.nextElementSibling;
    while (el && el.tagName !== 'H1') {
      if (el.classList && el.classList.contains('paper-box')) break;
      var next = el.nextElementSibling;
      if (el.tagName === 'P' || el.tagName === 'UL' || el.tagName === 'HR') {
        el.style.display = 'none';
      }
      el = next;
    }
  }

  function wrapCardGrids() {
    var content = document.querySelector('.page__content');
    if (!content) return;

    var boxes = Array.prototype.slice.call(content.querySelectorAll('.paper-box'));
    if (!boxes.length) return;

    function precedingHeading(el) {
      var node = el;
      while (node && node !== content) {
        var prev = node.previousElementSibling;
        while (prev) {
          if (prev.tagName === 'H1') return prev;
          prev = prev.previousElementSibling;
        }
        node = node.parentNode;
      }
      return null;
    }

    var groups = [];
    var current = [];
    var lastH = null;
    boxes.forEach(function (box) {
      var h = precedingHeading(box);
      if (current.length && h !== lastH) {
        groups.push(current);
        current = [];
      }
      lastH = h;
      current.push(box);
    });
    if (current.length) groups.push(current);

    groups.forEach(function (run) {
      var grid = document.createElement('div');
      grid.className = 'card-grid';
      run[0].parentNode.insertBefore(grid, run[0]);
      run.forEach(function (el) { grid.appendChild(el); });
    });
  }

  function textOf(el) {
    return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function extractPreview(card) {
    var textEl = card.querySelector('.paper-box-text') || card;
    var badge = card.querySelector('.badge');
    var links = textEl.querySelectorAll('a');
    var strongs = textEl.querySelectorAll('strong');
    var em = textEl.querySelector('em');
    var title = '';
    var subtitle = '';
    var meta = em ? textOf(em) : '';

    var longLink = null;
    var shortLink = null;
    Array.prototype.forEach.call(links, function (a) {
      var t = textOf(a);
      if (!t) return;
      if (t.length > 40 && !longLink) longLink = t;
      if (t.length <= 40 && !shortLink) shortLink = t;
    });

    if (longLink) title = longLink;
    else if (shortLink) title = shortLink;
    else if (strongs.length) title = textOf(strongs[0]);

    if (badge) {
      subtitle = textOf(badge);
    } else {
      Array.prototype.forEach.call(strongs, function (s) {
        var t = textOf(s);
        if (t && t !== title && t.length < 90 && !subtitle) subtitle = t;
      });
    }

    if (em) meta = textOf(em);

    return {
      title: title || 'Details',
      subtitle: subtitle,
      meta: meta
    };
  }

  function enhancePaperBoxes() {
    document.querySelectorAll('.paper-box').forEach(function (card) {
      var imageWrap = card.querySelector('.paper-box-image');
      var textEl = card.querySelector('.paper-box-text');
      if (!textEl) return;

      var info = extractPreview(card);
      var preview = document.createElement('div');
      preview.className = 'card-preview';

      if (imageWrap) preview.appendChild(imageWrap);

      var copy = document.createElement('div');
      copy.className = 'card-preview__copy';
      var title = document.createElement('h3');
      title.className = 'card-preview__title';
      title.textContent = info.title;
      copy.appendChild(title);
      if (info.subtitle) {
        var sub = document.createElement('p');
        sub.className = 'card-preview__sub';
        sub.textContent = info.subtitle;
        copy.appendChild(sub);
      }
      if (info.meta && info.meta !== info.subtitle) {
        var meta = document.createElement('p');
        meta.className = 'card-preview__meta';
        meta.textContent = info.meta;
        copy.appendChild(meta);
      }
      var cta = document.createElement('span');
      cta.className = 'card-preview__cta';
      cta.textContent = 'View details →';
      copy.appendChild(cta);
      preview.appendChild(copy);

      card.insertBefore(preview, textEl);
      card.classList.add('is-compact');
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', 'Open details for ' + info.title);

      card.addEventListener('click', function () {
        openModal(card, info);
      });
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(card, info);
        }
      });
    });
  }

  var modal;

  function buildModal() {
    modal = document.createElement('div');
    modal.className = 'card-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML =
      '<div class="card-modal__backdrop" data-close="1"></div>' +
      '<div class="card-modal__panel" role="dialog" aria-modal="true">' +
        '<button type="button" class="card-modal__close" aria-label="Close">&times;</button>' +
        '<div class="card-modal__head"></div>' +
        '<div class="card-modal__body"></div>' +
      '</div>';
    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
      if (e.target.getAttribute('data-close') || e.target.classList.contains('card-modal__close')) {
        closeModal();
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  function openModal(card, info) {
    if (!modal) return;
    var head = modal.querySelector('.card-modal__head');
    var body = modal.querySelector('.card-modal__body');
    var img = card.querySelector('.paper-box-image img');
    var detail = card.querySelector('.paper-box-text');

    head.innerHTML = '';
    if (img) {
      var cloneImg = img.cloneNode(true);
      head.appendChild(cloneImg);
    }
    var h = document.createElement('h2');
    h.textContent = info.title;
    head.appendChild(h);

    body.innerHTML = detail ? detail.innerHTML : '';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    modal.querySelector('.card-modal__close').focus();
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
  }

  function wrapSections() {
    var content = document.querySelector('.page__content');
    if (!content) return;
    var headings = Array.prototype.slice.call(content.querySelectorAll(':scope > h1'));

    headings.forEach(function (h1) {
      var nodes = [];
      var prev = h1.previousElementSibling;
      if (prev && prev.tagName === 'P' && prev.querySelector('[id]')) {
        nodes.push(prev);
      } else if (prev && prev.classList && prev.classList.contains('anchor')) {
        nodes.push(prev);
      }
      nodes.push(h1);

      var el = h1.nextElementSibling;
      while (el && el.tagName !== 'H1') {
        var next = el.nextElementSibling;
        if (
          el.tagName === 'P' &&
          el.querySelector('[id]') &&
          next &&
          next.tagName === 'H1'
        ) {
          break;
        }
        nodes.push(el);
        el = next;
      }

      var panel = document.createElement('section');
      panel.className = 'section-panel';
      nodes[0].parentNode.insertBefore(panel, nodes[0]);
      nodes.forEach(function (n) { panel.appendChild(n); });
    });
  }

  function init() {
    relocateAbout();
    hideDuplicatePubCitation();
    cardifyEducation();
    wrapCardGrids();
    wrapSections();
    enhancePaperBoxes();
    buildModal();
    buildNavMap();
    injectPubStatus();
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
