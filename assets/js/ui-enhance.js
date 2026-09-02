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
      if (run[0].classList.contains('pub-box')) grid.classList.add('card-grid--pubs');
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

  function firstCompanyLink(textEl, title) {
    var found = null;
    Array.prototype.forEach.call(textEl.querySelectorAll('a'), function (a) {
      if (!found && textOf(a) === title) found = a;
    });
    return found;
  }

  function unwrapLinks(root) {
    Array.prototype.forEach.call(root.querySelectorAll('a'), function (a) {
      var text = document.createTextNode(a.textContent);
      if (a.parentNode) a.parentNode.replaceChild(text, a);
    });
  }

  function isProjectTag(t) {
    return /^hackathon\s+projects?$/i.test(t || '');
  }

  function stripProjectTitleFromBody(body, title) {
    var strong = body.querySelector('strong');
    if (strong) {
      var name = textOf(strong).replace(/^\[|\]$/g, '');
      if (name === title) {
        var parent = strong.parentNode;
        parent.removeChild(strong);
        if (parent.tagName === 'LI') {
          var list = parent.parentNode;
          if (list && list.children.length === 1) {
            while (parent.firstChild) {
              list.parentNode.insertBefore(parent.firstChild, list);
            }
            list.parentNode.removeChild(list);
          }
        }
      } else {
        strong.textContent = name;
      }
    }
    Array.prototype.forEach.call(body.querySelectorAll('p, em'), function (el) {
      if (isProjectTag(textOf(el)) && el.parentNode) el.parentNode.removeChild(el);
    });
  }

  function extractProjectInfo(textEl) {
    var title = '';
    var strong = textEl.querySelector('strong');
    if (strong) title = textOf(strong).replace(/^\[|\]$/g, '');

    var tag = '';
    Array.prototype.forEach.call(textEl.querySelectorAll('p, em'), function (el) {
      var t = textOf(el);
      if (!tag && isProjectTag(t)) tag = t.replace(/Project$/i, 'project');
    });

    var summary = '';
    var firstLi = textEl.querySelector('li');
    if (firstLi) {
      var clone = firstLi.cloneNode(true);
      Array.prototype.forEach.call(clone.querySelectorAll('ul, ol, table, strong, a'), function (n) {
        if (n.parentNode) n.parentNode.removeChild(n);
      });
      summary = textOf(clone);
      if (isProjectTag(summary)) summary = '';
    }
    if (!summary) {
      Array.prototype.forEach.call(textEl.querySelectorAll('p'), function (p) {
        var t = textOf(p);
        if (!summary && t && t.indexOf('·') === -1 && !isProjectTag(t)) summary = t;
      });
    }

    var links = [];
    Array.prototype.forEach.call(textEl.querySelectorAll('a'), function (a) {
      var label = textOf(a);
      var href = a.getAttribute('href') || '';
      if (
        /^(github|demo|code|live|website|poster|presentation slides)$/i.test(label) ||
        /github\.com|gitlab\.com|drive\.google|canva\.com/.test(href)
      ) {
        links.push(a);
      }
    });

    return {
      title: title || 'Project',
      tag: tag,
      summary: summary,
      links: links
    };
  }

  function enhancePaperBoxes() {
    document.querySelectorAll('.paper-box').forEach(function (card) {
      var imageWrap = card.querySelector('.paper-box-image');
      var textEl = card.querySelector('.paper-box-text');
      if (!textEl) return;

      if (card.classList.contains('pub-box')) return;

      if (card.classList.contains('project-box')) {
        var proj = extractProjectInfo(textEl);
        var preview = document.createElement('div');
        preview.className = 'card-preview';

        var copy = document.createElement('div');
        copy.className = 'card-preview__copy';

        var title = document.createElement('h3');
        title.className = 'card-preview__title';
        var titleName = document.createElement('span');
        titleName.textContent = proj.title;
        title.appendChild(titleName);
        if (proj.tag) {
          var tag = document.createElement('span');
          tag.className = 'card-preview__tag';
          tag.textContent = proj.tag;
          title.appendChild(tag);
        }
        copy.appendChild(title);

        if (proj.summary) {
          var summary = document.createElement('p');
          summary.className = 'card-preview__summary';
          summary.textContent = proj.summary;
          copy.appendChild(summary);
        }

        var footer = document.createElement('div');
        footer.className = 'card-preview__footer';

        if (proj.links.length) {
          var linksWrap = document.createElement('div');
          linksWrap.className = 'card-preview__links';
          proj.links.forEach(function (src) {
            var a = src.cloneNode(true);
            a.setAttribute('target', '_blank');
            a.setAttribute('rel', 'noopener noreferrer');
            linksWrap.appendChild(a);
          });
          footer.appendChild(linksWrap);
        }

        var cta = document.createElement('span');
        cta.className = 'card-preview__cta';
        cta.textContent = 'Read more →';
        footer.appendChild(cta);
        copy.appendChild(footer);
        preview.appendChild(copy);

        if (imageWrap && imageWrap.parentNode) imageWrap.parentNode.removeChild(imageWrap);
        card.insertBefore(preview, textEl);
        card.classList.add('is-compact', 'is-project');
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Open details for ' + proj.title);

        card.addEventListener('click', function (e) {
          if (e.target.closest && e.target.closest('a')) return;
          openModal(card, proj);
        });
        card.addEventListener('keydown', function (e) {
          if (e.target.closest && e.target.closest('a')) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openModal(card, proj);
          }
        });
        return;
      }

      if (card.querySelector('.badge')) {
        card.classList.add('is-full');
        var badge = card.querySelector('.badge');
        var titleLink = textEl.querySelector('a');
        var descSource = textEl.querySelector('li');
        var descHtml = descSource ? descSource.innerHTML : '';

        var titleWrap = document.createElement('div');
        titleWrap.className = 'pub-title';
        if (titleLink) titleWrap.appendChild(titleLink);

        var descWrap = document.createElement('div');
        descWrap.className = 'pub-desc';
        descWrap.innerHTML = descHtml;

        if (badge.parentNode) badge.parentNode.removeChild(badge);
        if (textEl.parentNode) textEl.parentNode.removeChild(textEl);

        card.appendChild(titleWrap);
        card.appendChild(badge);
        card.appendChild(descWrap);
        return;
      }

      var info = extractPreview(card);
      var preview = document.createElement('div');
      preview.className = 'card-preview';

      if (imageWrap) preview.appendChild(imageWrap);

      var copy = document.createElement('div');
      copy.className = 'card-preview__copy';
      var title = document.createElement('h3');
      title.className = 'card-preview__title';
      var companyLink = firstCompanyLink(textEl, info.title);
      if (companyLink) {
        var linkedName = companyLink.cloneNode(true);
        linkedName.className = 'card-preview__company';
        linkedName.setAttribute('target', '_blank');
        linkedName.setAttribute('rel', 'noopener noreferrer');
        title.appendChild(linkedName);
      } else {
        title.textContent = info.title;
      }
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

      card.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('a')) return;
        openModal(card, info);
      });
      card.addEventListener('keydown', function (e) {
        if (e.target.closest && e.target.closest('a')) return;
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

  function stripExperienceHeader(body, info) {
    unwrapLinks(body);

    var firstLi = body.querySelector(':scope > ul > li, ul > li');
    if (firstLi && info.title && textOf(firstLi).indexOf(info.title) !== -1) {
      var list = firstLi.parentNode;
      list.removeChild(firstLi);
      if (list && !list.children.length && list.parentNode) list.parentNode.removeChild(list);
    }

    Array.prototype.slice.call(body.querySelectorAll('p, strong')).forEach(function (el) {
      if (!el.parentNode) return;
      var t = textOf(el);
      if (!t) return;
      if (info.title && (t === info.title || t.indexOf(info.title) === 0) && t.length <= info.title.length + 40) {
        if (el.tagName === 'P' || (el.tagName === 'STRONG' && el.parentNode.childNodes.length <= 3)) {
          var parent = el.parentNode;
          parent.removeChild(el);
          if (parent.tagName === 'P' && !textOf(parent) && parent.parentNode) parent.parentNode.removeChild(parent);
        }
      }
    });

    if (info.subtitle) {
      Array.prototype.slice.call(body.querySelectorAll('strong')).forEach(function (el) {
        if (!el.parentNode) return;
        if (textOf(el) !== info.subtitle) return;
        var parent = el.parentNode;
        parent.removeChild(el);
        if (parent.tagName === 'P' && textOf(parent).length < 30 && parent.parentNode) {
          parent.parentNode.removeChild(parent);
        }
      });
    }

    if (info.meta) {
      var em = body.querySelector('em');
      if (em && textOf(em) === info.meta) {
        var wrap = em.parentNode;
        wrap.removeChild(em);
        if (wrap && !textOf(wrap) && wrap.parentNode) wrap.parentNode.removeChild(wrap);
      }
    }
  }

  function openModal(card, info) {
    if (!modal) return;
    var head = modal.querySelector('.card-modal__head');
    var body = modal.querySelector('.card-modal__body');
    var img = card.querySelector('.paper-box-image img');
    var detail = card.querySelector('.paper-box-text');

    head.innerHTML = '';
    if (img && !card.classList.contains('is-project')) {
      var cloneImg = img.cloneNode(true);
      head.appendChild(cloneImg);
    }
    var h = document.createElement('h2');
    h.textContent = info.title;
    head.appendChild(h);
    if (info.tag) {
      var tagEl = document.createElement('span');
      tagEl.className = 'card-preview__tag';
      tagEl.textContent = info.tag;
      h.appendChild(document.createTextNode(' '));
      h.appendChild(tagEl);
    }

    body.innerHTML = detail ? detail.innerHTML : '';
    if (card.classList.contains('is-project')) {
      stripProjectTitleFromBody(body, info.title);
    } else {
      stripExperienceHeader(body, info);
      if (info.subtitle) {
        var role = document.createElement('p');
        role.className = 'card-modal__role';
        role.textContent = info.subtitle;
        body.insertBefore(role, body.firstChild);
      }
      if (info.meta && info.meta !== info.subtitle) {
        var dates = document.createElement('p');
        dates.className = 'card-modal__dates';
        dates.textContent = info.meta;
        body.insertBefore(dates, info.subtitle ? role.nextSibling : body.firstChild);
      }
    }
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
