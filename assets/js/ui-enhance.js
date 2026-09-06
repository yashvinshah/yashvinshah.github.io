(function () {
  'use strict';

  var progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.insertBefore(progressBar, document.body.firstChild);

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    progressBar.style.width = (docH > 0 ? (scrollTop / docH) * 100 : 0) + '%';
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  var sectionIds = [];
  var navLinks = [];

  function buildNavMap() {
    navLinks = Array.prototype.slice.call(document.querySelectorAll('.masthead__menu-item a'));
    sectionIds = [];
    ['about-me', 'educations', 'internship-experiences', 'publications', 'selected-projects'].forEach(function (id) {
      if (document.getElementById(id)) sectionIds.push(id);
    });

    navLinks.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href') || '';
        var hash = href.indexOf('#') !== -1 ? href.slice(href.indexOf('#') + 1) : '';
        var target = hash ? document.getElementById(hash) : null;
        if (!target) return;
        e.preventDefault();
        revealTree(target);
        var top = target.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        history.replaceState(null, '', '#' + hash);
      });
    });
  }

  function updateActiveNav() {
    if (!sectionIds.length) return;
    var current = sectionIds[0];
    var marker = 90;
    for (var i = 0; i < sectionIds.length; i++) {
      var el = document.getElementById(sectionIds[i]);
      if (!el) continue;
      if (el.getBoundingClientRect().top <= marker) current = sectionIds[i];
    }
    navLinks.forEach(function (a) {
      a.classList.remove('nav-active');
      if (a.closest && a.closest('.masthead__menu-item--lg')) return;
      var href = a.getAttribute('href') || '';
      if (href.indexOf('#' + current) !== -1) a.classList.add('nav-active');
    });
  }

  function textOf(el) {
    return (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
  }

  function isContactBlock(el) {
    var t = textOf(el);
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

  function makeSectionNum(n) {
    var el = document.createElement('span');
    el.className = 'site-num';
    el.setAttribute('aria-hidden', 'true');
    el.textContent = n;
    return el;
  }

  function assembleHero() {
    var profile = document.querySelector('.profile_box');
    var content = document.querySelector('.page__content');
    if (!profile || !content) return;

    var section = document.createElement('section');
    section.className = 'site-section site-section--hero';
    var old = document.getElementById('about-me');
    if (old) old.removeAttribute('id');
    section.id = 'about-me';
    if (profile.parentNode) profile.parentNode.removeChild(profile);
    section.appendChild(profile);
    section.insertBefore(makeSectionNum('01'), section.firstChild);
    content.insertBefore(section, content.firstChild);

    var sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.style.display = 'none';
  }

  function takeAnchorId(nodes) {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      if (n.id) {
        var id = n.id;
        n.removeAttribute('id');
        return id;
      }
      if (n.querySelector) {
        var inner = n.querySelector('[id]');
        if (inner && inner.id) {
          var innerId = inner.id;
          inner.removeAttribute('id');
          return innerId;
        }
      }
    }
    return '';
  }

  function wrapSections() {
    var content = document.querySelector('.page__content');
    if (!content) return;
    var headings = Array.prototype.slice.call(content.querySelectorAll(':scope > h1'));
    var index = 0;

    headings.forEach(function (h1) {
      var nodes = [];
      var prev = h1.previousElementSibling;
      if (prev && prev.tagName === 'P' && prev.querySelector('[id]')) {
        nodes.push(prev);
      } else if (prev && prev.classList && (prev.classList.contains('anchor') || prev.id)) {
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

      var section = document.createElement('section');
      section.className = 'site-section' + (index % 2 === 0 ? ' site-section--alt' : '');
      var id = takeAnchorId(nodes);
      if (id) section.id = id;
      nodes[0].parentNode.insertBefore(section, nodes[0]);
      nodes.forEach(function (n) { section.appendChild(n); });
      Array.prototype.slice.call(section.children).forEach(function (n) {
        if (n.tagName === 'P' && n.querySelector && n.querySelector('.anchor, [id]') && !textOf(n)) {
          n.style.display = 'none';
        }
        if (n.classList && n.classList.contains('anchor') && !textOf(n)) {
          n.style.display = 'none';
        }
        if (n.tagName === 'H1' && n.id) n.removeAttribute('id');
      });
      section.insertBefore(makeSectionNum(String(index + 2).padStart(2, '0')), section.firstChild);
      index += 1;
    });
  }

  function timelineEducation() {
    var section = document.getElementById('educations');
    if (!section) return;
    var ul = section.querySelector('ul');
    if (!ul) return;

    var timeline = document.createElement('div');
    timeline.className = 'edu-timeline';

    Array.prototype.forEach.call(ul.children, function (li) {
      if (li.tagName !== 'LI') return;
      var row = document.createElement('div');
      row.className = 'edu-row reveal';

      var date = document.createElement('div');
      date.className = 'edu-row__date';
      var em = li.querySelector(':scope > em, em');
      if (em && em.parentNode === li) {
        date.textContent = textOf(em);
        em.parentNode.removeChild(em);
        if (li.firstChild && li.firstChild.nodeType === 3) {
          li.firstChild.textContent = li.firstChild.textContent.replace(/^[\s,]+/, '');
        }
      }

      var schoolLink = li.querySelector('a');
      var schoolName = schoolLink ? textOf(schoolLink) : '';
      var place = '';
      if (schoolLink && schoolLink.nextSibling && schoolLink.nextSibling.nodeType === 3) {
        place = schoolLink.nextSibling.textContent.replace(/^[\s,]+/, '').trim();
      }
      var nested = li.querySelector('ul');
      var degree = nested ? textOf(nested.querySelector('li') || nested) : '';

      var rail = document.createElement('div');
      rail.className = 'edu-row__rail';
      rail.innerHTML = '<span class="edu-row__dot"></span>';

      var logo = document.createElement('div');
      logo.className = 'edu-row__logo';
      var logoSrc = '';
      if (/NC State/i.test(schoolName)) logoSrc = 'images/nc logo.png';
      else if (/Sanghvi/i.test(schoolName)) logoSrc = 'images/dj.png';
      if (logoSrc) {
        var img = document.createElement('img');
        img.src = logoSrc;
        img.alt = schoolName;
        logo.appendChild(img);
      } else {
        var mono = document.createElement('span');
        mono.textContent = monogram(schoolName);
        logo.appendChild(mono);
      }

      var body = document.createElement('div');
      body.className = 'edu-row__body';
      var school = document.createElement(schoolLink ? 'a' : 'div');
      school.className = 'edu-row__school';
      school.textContent = schoolName;
      if (schoolLink) {
        school.href = schoolLink.getAttribute('href');
        school.target = '_blank';
        school.rel = 'noopener noreferrer';
      }
      body.appendChild(school);
      if (degree) {
        var deg = document.createElement('p');
        deg.className = 'edu-row__degree';
        deg.textContent = degree.replace(/\s+with Honors in .+$/i, '');
        body.appendChild(deg);
      }
      if (place) {
        var loc = document.createElement('p');
        loc.className = 'edu-row__place';
        loc.textContent = place;
        body.appendChild(loc);
      }
      var honor = degree.match(/Honors in (.+)$/i);
      if (honor) {
        var chips = document.createElement('div');
        chips.className = 'edu-chips';
        var chip = document.createElement('span');
        chip.className = 'edu-chip';
        chip.textContent = 'Honors in ' + honor[1];
        chips.appendChild(chip);
        body.appendChild(chips);
      }

      row.appendChild(date);
      row.appendChild(rail);
      row.appendChild(logo);
      row.appendChild(body);
      timeline.appendChild(row);
    });

    ul.parentNode.replaceChild(timeline, ul);
  }

  function hideDuplicatePubCitation() {
    var section = document.getElementById('publications');
    if (!section) return;
    Array.prototype.slice.call(section.children).forEach(function (el) {
      if (el.classList && el.classList.contains('paper-box')) return;
      if (el.tagName === 'H1') return;
      if (el.tagName === 'P' || el.tagName === 'UL' || el.tagName === 'HR') {
        if (!textOf(el)) el.style.display = 'none';
      }
    });
  }

  function unwrapLinks(root) {
    Array.prototype.forEach.call(root.querySelectorAll('a'), function (a) {
      var text = document.createTextNode(a.textContent);
      if (a.parentNode) a.parentNode.replaceChild(text, a);
    });
  }

  function headerBudget(info) {
    return (info.title || '').length + (info.subtitle || '').length + (info.meta || '').length + 48;
  }

  function stripShortHeaderNode(el) {
    if (!el || !el.parentNode) return;
    var parent = el.parentNode;
    parent.removeChild(el);
    if (parent.tagName === 'P' && !textOf(parent) && parent.parentNode) {
      parent.parentNode.removeChild(parent);
    }
  }

  function stripExperienceHeader(body, info) {
    unwrapLinks(body);

    var firstLi = body.querySelector('ul > li');
    if (firstLi && info.title && textOf(firstLi).indexOf(info.title) !== -1) {
      var list = firstLi.parentNode;
      if (textOf(firstLi).length <= headerBudget(info)) {
        list.removeChild(firstLi);
        if (list && !list.children.length && list.parentNode) list.parentNode.removeChild(list);
      } else if (list && list.parentNode) {
        while (firstLi.firstChild) list.parentNode.insertBefore(firstLi.firstChild, list);
        list.parentNode.removeChild(list);
      }
    }

    Array.prototype.slice.call(body.querySelectorAll(':scope > p, :scope > strong')).forEach(function (el) {
      var t = textOf(el);
      if (!info.title || !t) return;
      if (t === info.title || (t.indexOf(info.title) === 0 && t.length <= headerBudget(info))) {
        stripShortHeaderNode(el);
      }
    });

    if (info.subtitle) {
      var roleEl = body.querySelector('strong');
      if (roleEl && textOf(roleEl) === info.subtitle) {
        var roleWrap = roleEl.parentNode;
        if (textOf(roleWrap).length <= headerBudget(info)) stripShortHeaderNode(roleEl);
        else roleEl.parentNode.removeChild(roleEl);
      }
    }

    if (info.meta) {
      var em = body.querySelector('em');
      if (em && textOf(em) === info.meta) {
        var dateWrap = em.parentNode;
        if (textOf(dateWrap).length <= headerBudget(info)) stripShortHeaderNode(em);
        else em.parentNode.removeChild(em);
      }
    }
  }

  function extractPreview(card) {
    var textEl = card.querySelector('.paper-box-text') || card;
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

    Array.prototype.forEach.call(strongs, function (s) {
      var t = textOf(s);
      if (t && t !== title && t.length < 90 && !subtitle) subtitle = t;
    });

    return { title: title || 'Details', subtitle: subtitle, meta: meta };
  }

  function firstCompanyLink(textEl, title) {
    var found = null;
    Array.prototype.forEach.call(textEl.querySelectorAll('a'), function (a) {
      if (!found && textOf(a) === title) found = a;
    });
    return found;
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

    var stack = [];
    Array.prototype.forEach.call(textEl.querySelectorAll('p, li'), function (el) {
      var t = textOf(el);
      if (!stack.length && t.indexOf('·') !== -1) {
        stack = t.split('·').map(function (part) { return part.trim(); }).filter(Boolean);
      }
    });

    return { title: title || 'Project', tag: tag, summary: summary, links: links, stack: stack };
  }

  var TECH_SLUGS = {
    python: 'python',
    opencv: 'opencv',
    numpy: 'numpy',
    pandas: 'pandas',
    'scikit-learn': 'scikitlearn',
    scikitlearn: 'scikitlearn',
    pytorch: 'pytorch',
    react: 'react',
    'node.js': 'nodedotjs',
    nodejs: 'nodedotjs',
    'express.js': 'express',
    express: 'express',
    firebase: 'firebase',
    'react query': 'reactquery',
    'github actions': 'githubactions',
    flutter: 'flutter',
    flask: 'flask',
    tensorflow: 'tensorflow',
    wireshark: 'wireshark',
    pyside6: 'qt'
  };

  function stackIcons(stack) {
    var slugs = [];
    (stack || []).forEach(function (name) {
      var slug = TECH_SLUGS[name.toLowerCase()];
      if (slug && slugs.indexOf(slug) === -1) slugs.push(slug);
    });
    return slugs.slice(0, 4);
  }

  function makeTechRow(slugs) {
    var row = document.createElement('div');
    row.className = 'folio-card__tech';
    slugs.forEach(function (slug) {
      var img = document.createElement('img');
      img.src = 'https://cdn.simpleicons.org/' + slug;
      img.alt = slug;
      img.loading = 'lazy';
      row.appendChild(img);
    });
    return row;
  }

  function makePattern(index) {
    var bar = document.createElement('div');
    bar.className = 'folio-card__pattern folio-card__pattern--' + (index % 4);
    bar.setAttribute('aria-hidden', 'true');
    return bar;
  }

  function makeCardLink(src) {
    var href = src.getAttribute('href') || '';
    var label = textOf(src);
    var icon = 'fas fa-external-link-alt';
    if (/github\.com/i.test(href) || /^github$/i.test(label)) icon = 'fab fa-github';
    else if (/canva|slides|poster|drive\.google/i.test(href + ' ' + label)) icon = 'fas fa-file-alt';
    else if (/demo|live/i.test(label)) icon = 'fas fa-play-circle';

    var a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'folio-card__link';
    a.setAttribute('aria-label', label || 'Open project link');
    a.innerHTML = '<i class="' + icon + '" aria-hidden="true"></i>';
    a.addEventListener('click', function (e) { e.stopPropagation(); });
    return a;
  }

  function extractLocation(textEl, title, subtitle) {
    var loc = '';
    Array.prototype.forEach.call(textEl.querySelectorAll('p, li'), function (el) {
      if (loc) return;
      var t = textOf(el);
      if (title && t.indexOf(title) !== -1) {
        var rest = t.slice(t.indexOf(title) + title.length).replace(/^[\s,]+/, '');
        if (rest && rest.length < 60) loc = rest;
      } else if (subtitle && t.indexOf(subtitle) !== -1) {
        var rest2 = t.slice(t.indexOf(subtitle) + subtitle.length).replace(/^[\s,]+/, '');
        if (rest2 && rest2.length < 60) loc = rest2;
      }
    });
    return loc;
  }

  function monogram(title) {
    var words = (title || '').replace(/[^A-Za-z0-9\s]/g, ' ').split(/\s+/).filter(function (w) {
      return w && !/^(the|and|of|via|a|for|at|in)$/i.test(w);
    });
    if (!words.length) return 'YS';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  function makeBadge(imgOrSrc, title) {
    var badge = document.createElement('div');
    badge.className = 'folio-card__badge';
    var src = '';
    if (typeof imgOrSrc === 'string') src = imgOrSrc;
    else if (imgOrSrc && imgOrSrc.getAttribute) src = imgOrSrc.getAttribute('src') || '';
    if (src) {
      var img = document.createElement('img');
      img.src = src;
      img.alt = title || '';
      badge.appendChild(img);
    } else {
      var mono = document.createElement('span');
      mono.className = 'folio-card__mono';
      mono.textContent = monogram(title);
      badge.appendChild(mono);
    }
    return badge;
  }

  function makeWatermark(src) {
    var mark = document.createElement('span');
    mark.className = 'folio-card__mark';
    mark.setAttribute('aria-hidden', 'true');
    if (src) mark.style.backgroundImage = 'url("' + src.replace(/"/g, '') + '")';
    return mark;
  }

  function wireCard(card, info) {
    card.classList.add('folio-card', 'reveal');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Open details for ' + (info.title || 'entry'));
    card.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a, .folio-card__link')) return;
      openModal(card, info);
    });
    card.addEventListener('keydown', function (e) {
      if (e.target.closest && e.target.closest('a')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card, info);
      }
    });
  }

  function flattenExperience(card) {
    var imageWrap = card.querySelector('.paper-box-image');
    var textEl = card.querySelector('.paper-box-text');
    if (!textEl) return;
    var info = extractPreview(card);
    var location = extractLocation(textEl, info.title, info.subtitle);
    var companyLink = firstCompanyLink(textEl, info.title);
    var img = imageWrap ? imageWrap.querySelector('img') : null;
    info.location = location;
    info.href = companyLink ? companyLink.getAttribute('href') : '';
    info.imgSrc = img ? img.getAttribute('src') : '';
    info.kind = 'experience';

    stripExperienceHeader(textEl, info);
    Array.prototype.slice.call(textEl.querySelectorAll('p')).forEach(function (p) {
      var t = textOf(p);
      if (!t || (/^[,.–—\s]/.test(t) && t.length < 60)) {
        if (p.parentNode) p.parentNode.removeChild(p);
      }
    });
    textEl.className = 'entry__body';

    card.innerHTML = '';
    if (info.imgSrc) card.appendChild(makeWatermark(info.imgSrc));
    card.appendChild(makeBadge(img, info.title));

    var title = document.createElement('h3');
    title.className = 'entry__title';
    title.textContent = info.title;
    card.appendChild(title);

    if (info.subtitle) {
      var role = document.createElement('p');
      role.className = 'entry__role';
      role.textContent = info.subtitle;
      card.appendChild(role);
    }
    var metaBits = [location, info.meta && info.meta !== info.subtitle ? info.meta : ''].filter(Boolean);
    if (metaBits.length) {
      var meta = document.createElement('p');
      meta.className = 'entry__meta';
      meta.textContent = metaBits.join(' · ');
      card.appendChild(meta);
    }

    var cta = document.createElement('span');
    cta.className = 'folio-card__cta';
    cta.textContent = 'View details';
    card.appendChild(cta);
    card.appendChild(textEl);
    wireCard(card, info);
  }

  var projectCardIndex = 0;

  function flattenProject(card) {
    var textEl = card.querySelector('.paper-box-text');
    if (!textEl) return;
    var proj = extractProjectInfo(textEl);
    proj.kind = 'project';
    proj.imgSrc = '';
    var icons = stackIcons(proj.stack);
    var cardIndex = projectCardIndex++;

    stripProjectTitleFromBody(textEl, proj.title);
    textEl.className = 'entry__body';

    var modalLinks = document.createElement('div');
    modalLinks.className = 'entry__links';
    var cardLinks = document.createElement('div');
    cardLinks.className = 'folio-card__links';
    proj.links.forEach(function (src) {
      var a = src.cloneNode(true);
      a.setAttribute('target', '_blank');
      a.setAttribute('rel', 'noopener noreferrer');
      modalLinks.appendChild(a);
      cardLinks.appendChild(makeCardLink(src));
      if (src.parentNode) src.parentNode.removeChild(src);
    });

    card.innerHTML = '';
    if (icons.length >= 2) {
      card.appendChild(makeTechRow(icons));
    } else {
      card.classList.add('has-pattern');
      card.appendChild(makePattern(cardIndex));
    }

    var title = document.createElement('h3');
    title.className = 'entry__title';
    title.textContent = proj.title;
    if (proj.tag) {
      var tag = document.createElement('span');
      tag.className = 'card-preview__tag';
      tag.textContent = proj.tag;
      title.appendChild(document.createTextNode(' '));
      title.appendChild(tag);
    }
    card.appendChild(title);

    if (proj.summary) {
      var summary = document.createElement('p');
      summary.className = 'entry__summary';
      summary.textContent = proj.summary;
      card.appendChild(summary);
    }

    var foot = document.createElement('div');
    foot.className = 'folio-card__foot';
    var cta = document.createElement('span');
    cta.className = 'folio-card__cta';
    cta.textContent = 'View details';
    foot.appendChild(cta);
    if (cardLinks.children.length) foot.appendChild(cardLinks);
    card.appendChild(foot);
    card.appendChild(textEl);
    if (modalLinks.children.length) card.appendChild(modalLinks);
    wireCard(card, proj);
  }

  function decoratePubs() {
    document.querySelectorAll('.pub-box').forEach(function (card) {
      card.classList.add('reveal');
      var img = card.querySelector('.paper-box-image img');
      var titleEl = card.querySelector('.pub-title');
      var title = textOf(titleEl);
      var src = img ? img.getAttribute('src') : '';
      if (src) card.insertBefore(makeWatermark(src), card.firstChild);
      var wrap = card.querySelector('.paper-box-image');
      var badge = makeBadge(img, title);
      if (wrap && wrap.parentNode) wrap.parentNode.replaceChild(badge, wrap);
      else if (card.querySelector('.pub-head')) card.querySelector('.pub-head').insertBefore(badge, card.querySelector('.pub-head').firstChild);
    });
  }

  function wrapGrid(sectionId, selector, className) {
    var section = document.getElementById(sectionId);
    if (!section) return;
    var items = section.querySelectorAll(selector);
    if (!items.length) return;
    var grid = document.createElement('div');
    grid.className = className;
    items[0].parentNode.insertBefore(grid, items[0]);
    items.forEach(function (el) { grid.appendChild(el); });
  }

  function flattenEntries() {
    document.querySelectorAll('.paper-box').forEach(function (card) {
      if (card.classList.contains('pub-box')) return;
      if (card.classList.contains('project-box')) {
        flattenProject(card);
        return;
      }
      flattenExperience(card);
    });
    decoratePubs();
    wrapGrid('internship-experiences', '.folio-card', 'card-grid');
    wrapGrid('selected-projects', '.folio-card', 'project-grid');
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
    head.innerHTML = '';

    var badge = makeBadge(info.imgSrc || '', info.title);
    badge.className = 'card-modal__badge';
    head.appendChild(badge);

    var titles = document.createElement('div');
    var h = document.createElement('h2');
    if (info.href) {
      var a = document.createElement('a');
      a.href = info.href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = info.title;
      h.appendChild(a);
    } else {
      h.textContent = info.title;
    }
    if (info.tag) {
      var tag = document.createElement('span');
      tag.className = 'card-preview__tag';
      tag.textContent = info.tag;
      h.appendChild(document.createTextNode(' '));
      h.appendChild(tag);
    }
    titles.appendChild(h);
    if (info.subtitle) {
      var role = document.createElement('p');
      role.className = 'card-modal__role';
      role.textContent = info.subtitle;
      titles.appendChild(role);
    }
    var meta = [info.location, info.meta].filter(Boolean).join(' · ');
    if (meta) {
      var dates = document.createElement('p');
      dates.className = 'card-modal__dates';
      dates.textContent = meta;
      titles.appendChild(dates);
    }
    head.appendChild(titles);

    var detail = card.querySelector('.entry__body');
    body.innerHTML = detail ? detail.innerHTML : '';
    var links = card.querySelector('.entry__links');
    if (links && links.children.length) {
      var cloned = links.cloneNode(true);
      cloned.className = 'card-modal__links';
      body.appendChild(cloned);
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

  function buildContactBand() {
    var content = document.querySelector('.page__content');
    var mail = document.querySelector('.hero-actions .btn-accent, a[href^="mailto:"]');
    if (!content || !mail) return;
    var band = document.createElement('section');
    band.className = 'site-band';
    band.appendChild(makeSectionNum('06'));
    var heading = document.createElement('h2');
    heading.textContent = 'Coffee, code, or collaboration — I\'m in.';
    band.appendChild(heading);
    var btn = mail.cloneNode(true);
    btn.className = 'btn-accent';
    btn.textContent = 'Contact me';
    band.appendChild(btn);
    content.appendChild(band);
  }

  function revealTree(el) {
    if (!el) return;
    el.classList.add('is-visible');
    Array.prototype.forEach.call(el.querySelectorAll('.reveal'), function (child) {
      child.classList.add('is-visible');
    });
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });

    if (location.hash) {
      revealTree(document.getElementById(location.hash.slice(1)));
    }
    window.setTimeout(function () {
      document.querySelectorAll('.reveal').forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('is-visible');
      });
    }, 800);
  }

  function init() {
    relocateAbout();
    assembleHero();
    wrapSections();
    timelineEducation();
    hideDuplicatePubCitation();
    flattenEntries();
    buildModal();
    buildContactBand();
    buildNavMap();
    initReveal();
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
