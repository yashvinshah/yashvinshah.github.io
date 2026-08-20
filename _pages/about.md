---
permalink: /
title: "Hello, I'm [YOUR_NAME]"
excerpt: ""
author_profile: true
redirect_from: 
  - /about/
  - /about.html
---

{% if site.google_scholar_stats_use_cdn %}
{% assign gsDataBaseUrl = "https://cdn.jsdelivr.net/gh/" | append: site.repository | append: "@" %}
{% else %}
{% assign gsDataBaseUrl = "https://raw.githubusercontent.com/" | append: site.repository | append: "/" %}
{% endif %}
{% assign url = gsDataBaseUrl | append: "google-scholar-stats/gs_data_shieldsio.json" %}

<span class='anchor' id='about-me'></span>

# 👋 Hello, I'm [YOUR_NAME]

🎓 I'm a [Ph.D. student / Researcher / Professor] at [[Your University](https://your-university.edu/)]

🔬 My research focuses on **[Your Research Area]** (e.g., Computer Vision, Robotics, NLP).

✉️ Contact me:  
Email: [your.email@university.edu]  
LinkedIn: [[Your Name](https://linkedin.com/in/your-profile)]

<!-- TIP: Add a short paragraph describing your research interest and goals. -->

<span class='anchor' id='news'></span>

# 🔥 News
- *Month YYYY* — [Brief news item, e.g., paper accepted at Conference X]
- *Month YYYY* — [Another news item]

<span class='anchor' id='educations'></span>

# 📖 Educations

- *Aug 20XX – Present*, [[University Name](https://your-university.edu/)], City, Country
  - [Degree] in [Field]

- *Aug 20XX – May 20XX*, [[University Name](https://your-university.edu/)], City, Country
  - [Degree] in [Field]

<span class='anchor' id='publications'></span>

# 📝 Publications

<!-- ── Plain-text publication (no figure) ────────────────────────── -->
<!-- Duplicate this block for each paper without an image. -->

[Paper Title — link to paper or leave empty]()

**[Your Name]**, Co-author A, Co-author B, Corresponding Author<sup>*</sup>

- *In Preparation* / *Under Review* / *Journal / Conference Name, Year*

---

<!-- ── Paper card with image (paper-box) ─────────────────────────── -->
<!-- Steps:
     1. Put a figure (e.g., paper-figure.png) in the images/ folder.
     2. Set the badge to the venue name.
     3. Replace the link and author list.
     Duplicate this block for each paper.                           -->

<div class='paper-box'>
  <div class='paper-box-image'>
    <div>
      <div class="badge">Venue / Journal</div>
      <img src='images/paper-figure.png' alt="paper preview" width="100%">
    </div>
  </div>
<div class='paper-box-text' markdown="1">

[Your Paper Title](https://link-to-your-paper.com)

**[Your Name]**, Co-author A, Co-author B, Corresponding Author<sup>*</sup>

- One-sentence summary of the paper's key contribution.
</div>
</div>

<span class='anchor' id='internship-experiences'></span>

# 💻 Experience

<!-- ── Experience card ──────────────────────────────────────────── -->
<!-- Steps:
     1. Add a company logo or relevant photo to images/.
     2. Fill in the dates, company, location, and bullet points.
     Duplicate this block for each role.                           -->

<div class='paper-box'>
  <div class='paper-box-image'>
    <div>
      <img src='images/company-logo.png' alt="Company Name" width="100%">
    </div>
  </div>
<div class='paper-box-text' markdown="1">

- *Month YYYY – Month YYYY*, [[Company Name](https://company-website.com)], City, Country  
  **Your Role / Title**
- Brief description of the role or project.
  - Key achievement or responsibility 1
  - Key achievement or responsibility 2

</div>
</div>

<span class='anchor' id='selected-projects'></span>

# 🚀 Selected Projects

<!-- ── Project card ─────────────────────────────────────────────── -->
<!-- Steps:
     1. Add a screenshot or demo GIF to images/.
     2. Describe the project in bullet points.
     Duplicate this block for each project.                        -->

<div class='paper-box'>
  <div class='paper-box-image'>
    <div>
      <img src='images/project-screenshot.png' alt="Project Name" width="100%">
    </div>
  </div>
<div class='paper-box-text' markdown="1">

- **[Project Name]**
  - What the project does and why it matters.
  - Key technologies / methods used.
  - [GitHub](https://github.com/your-repo) | [Demo](https://your-demo-link.com) *(optional)*

</div>
</div>

<span class='anchor' id='journal-reviewer'></span>

# ✏️ Journal Reviewer
- [Journal Name]

<span class='anchor' id='conference-presentations'></span>

# 🎤 Conference Presentations
- *Month. YYYY*, [Conference Name](https://conference-url.com), City, Country

<span class='anchor' id='honors-and-awards'></span>

# 🏆 Honors and Awards
- *Month YYYY*, Award Name, Institution / Organization

<span class='anchor' id='reading-list'></span>

# 📚 Reading List

<!-- ── Book shelf ──────────────────────────────────────────────── -->
<!-- This section renders a visual book grid.
     To add a book:
       1. (Optional) Put the cover image in images/ as book-*.jpg.
       2. Copy one .book-card block below and fill in:
            - img src  → cover image path (or leave blank for the color placeholder)
            - book-ph  → initials shown when no cover image is loaded
            - gradient → background color of the placeholder (CSS linear-gradient)
            - book-title, book-author, book-tag spans
     The grid is responsive: 4 columns → 3 → 2 on smaller screens.  -->

<style>
.book-shelf-intro{font-style:italic;color:#4b5563;font-size:1.02em;line-height:1.85;margin:0 0 32px;padding:14px 20px;border-left:4px solid #3b82f6;background:linear-gradient(90deg,rgba(59,130,246,.07),transparent);border-radius:0 8px 8px 0;}
.book-category{margin-bottom:40px;}
.book-cat-label{font-size:.72em;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#3b82f6;margin-bottom:16px;padding-bottom:10px;border-bottom:2px solid #e5e7eb;display:flex;align-items:center;gap:8px;}
.book-cat-label::before{content:'';display:inline-block;width:4px;height:15px;background:#3b82f6;border-radius:2px;flex-shrink:0;}
.book-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin:0;padding:0;}
.book-card{border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.10),0 8px 28px rgba(0,0,0,.07);transition:transform .30s cubic-bezier(.22,.68,0,1.2),box-shadow .30s ease;background:#fff;display:flex;flex-direction:column;}
.book-card:hover{transform:translateY(-10px) scale(1.018);box-shadow:0 8px 24px rgba(0,0,0,.15),0 24px 56px rgba(0,0,0,.12);}
.book-cover-wrap{position:relative;width:100%;padding-top:150%;overflow:hidden;flex-shrink:0;}
.book-cover-wrap img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;z-index:2;}
.book-ph{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px;text-align:center;}
.book-ph-initial{font-size:2.4em;font-weight:800;color:rgba(255,255,255,.82);line-height:1;margin-bottom:10px;letter-spacing:-1px;}
.book-ph-name{font-size:.58em;color:rgba(255,255,255,.65);font-weight:500;line-height:1.35;}
.book-meta{padding:10px 12px 12px;flex:1;display:flex;flex-direction:column;}
.book-title{font-size:.78em;font-weight:700;color:#111827;line-height:1.35;margin-bottom:3px;}
.book-author{font-size:.70em;color:#6b7280;margin-bottom:7px;}
.book-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:auto;}
.book-tag{font-size:.60em;padding:2px 8px;border-radius:999px;background:#eff6ff;color:#2563eb;font-weight:500;white-space:nowrap;}
@media(max-width:768px){.book-grid{grid-template-columns:repeat(3,1fr);gap:15px;}}
@media(max-width:480px){.book-grid{grid-template-columns:repeat(2,1fr);gap:12px;}}
</style>

<p class="book-shelf-intro">A curated list of books I've genuinely loved and would recommend — replace this with your own favorites.</p>

<div class="book-category">
<div class="book-cat-label">Category Name · N</div>
<div class="book-grid">

<!-- Book card example — duplicate and fill in for each book -->
<div class="book-card">
<div class="book-cover-wrap">
<img src="images/book-example.jpg" alt="Book Title" loading="lazy" onerror="this.style.display='none'">
<div class="book-ph" style="background:linear-gradient(145deg,#1e3a8a,#2563eb);"><div class="book-ph-initial">AB</div><div class="book-ph-name">Book Title</div></div>
</div>
<div class="book-meta"><div class="book-title">Book Title</div><div class="book-author">Author Name</div><div class="book-tags"><span class="book-tag">Tag 1</span><span class="book-tag">Tag 2</span></div></div>
</div>

</div>
</div>
