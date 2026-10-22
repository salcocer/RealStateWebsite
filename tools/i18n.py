#!/usr/bin/env python3
"""Build the Russian and Thai pages from the English ones.

The English pages at the root are the source. Every piece of visible text, plus
alt, title, aria-label, placeholder and description attributes, is looked up in
i18n/<lang>.json (English -> translation), and the page is written to
<lang>/<same path>. Text with no translation stays in English and is listed, so
after editing an English page, run this again and translate whatever it reports.

    python3 tools/i18n.py            build ru/ and th/ and list missing translations
    python3 tools/i18n.py --check    list missing and unused translations only; exit 1 if any are missing
    python3 tools/i18n.py --strings  print every translatable string in the English pages

A translation unit is the inner HTML of the innermost element holding text, so a
sentence with a link or a line break in it is translated whole. Keys are that HTML
with runs of whitespace collapsed to one space. An empty translation removes the text in that
language. Elements marked translate="no" are left alone.
"""
import json
import os
import re
import sys
from html import escape, unescape
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = ["index.html",
         "villas/luna.html", "villas/aria.html", "villas/medina.html"]
LANGS = {
    "ru": {},
    # Jost has no Thai letters, so Thai pages also load a Thai face (see :lang(th) in site.css).
    "th": {"font": "family=Noto+Sans+Thai:wght@300;400;500&amp;family=Noto+Serif+Thai:wght@400&amp;"},
}

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"}
INLINE = {"a", "abbr", "b", "br", "cite", "em", "i", "mark", "q", "s", "small", "span", "strong", "sub", "sup", "time", "u", "wbr"}
SKIP = {"script", "style", "svg", "template"}
TEXT_ATTRS = {"alt", "title", "aria-label", "placeholder", "data-alt", "data-brochure"}
META_TEXT = {"description", "og:title", "og:description"}
URL_ATTRS = {"href", "src", "content", "data-shot", "action", "poster"}
ATTR_RE = re.compile(r'(\s)([\w:-]+)(\s*=\s*)"([^"]*)"')
LETTER = re.compile(r"[^\W\d_]")


class Raw(str):
    """Markup kept as it is (comments, doctype, stray end tags)."""


class Node:
    def __init__(self, tag, start):
        self.tag, self.start, self.children, self.end = tag, start, [], ""

    def inner(self):
        return "".join(c.html() if isinstance(c, Node) else c for c in self.children)

    def html(self):
        return self.start + self.inner() + self.end

    def attr(self, name):
        m = re.search(r'\s' + re.escape(name) + r'\s*=\s*"([^"]*)"', self.start)
        return unescape(m.group(1)) if m else None


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.root = Node(None, "")
        self.stack = [self.root]

    def add(self, item):
        kids = self.stack[-1].children
        if type(item) is str and kids and type(kids[-1]) is str:
            kids[-1] += item
        else:
            kids.append(item)

    def handle_starttag(self, tag, attrs):
        node = Node(tag, self.get_starttag_text())
        self.add(node)
        if tag not in VOID:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.add(Node(tag, self.get_starttag_text()))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                self.stack[i].end = "</%s>" % tag
                del self.stack[i:]
                return
        self.add(Raw("</%s>" % tag))

    def handle_data(self, data):
        self.add(Raw(data) if self.stack[-1].tag in ("script", "style") else data)

    def handle_entityref(self, name):
        self.add("&%s;" % name)

    def handle_charref(self, name):
        self.add("&#%s;" % name)

    def handle_comment(self, data):
        self.add(Raw("<!--%s-->" % data))

    def handle_decl(self, decl):
        self.add(Raw("<!%s>" % decl))

    def handle_pi(self, data):
        self.add(Raw("<?%s>" % data))


def parse(path):
    with open(path, encoding="utf-8") as f:
        src = f.read()
    b = Builder()
    b.feed(src)
    b.close()
    if b.root.html() != src:
        sys.exit("i18n: could not round-trip %s; check it for malformed markup" % path)
    return b.root


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def has_letters(s):
    return bool(LETTER.search(unescape(s)))


def inline_only(node):
    return all(not isinstance(c, Node) or (c.tag in INLINE and c.attr("translate") != "no" and inline_only(c))
               for c in node.children)


def own_text(node):
    return any(type(c) is str and has_letters(c) for c in node.children)


class Translator:
    """Walks a page; with a dictionary it rewrites text, without one it only collects keys."""

    def __init__(self, table=None):
        self.table, self.seen, self.missing = table, [], []

    def lookup(self, key):
        if key not in self.seen:
            self.seen.append(key)
        if self.table is None:
            return None
        if key in self.table:
            return self.table[key]
        if key not in self.missing:
            self.missing.append(key)
        return None

    def swap(self, text):
        """Translate text keeping its surrounding whitespace."""
        key = norm(text)
        out = self.lookup(key)
        if out is None:
            return text
        lead = text[:len(text) - len(text.lstrip())]
        trail = text[len(text.rstrip()):]
        return lead + out + trail

    def attrs(self, node):
        is_meta = node.tag == "meta" and (node.attr("name") or node.attr("property")) in META_TEXT

        def sub(m):
            name, value = m.group(2), m.group(4)
            if (name in TEXT_ATTRS or (name == "content" and is_meta)) and has_letters(value):
                out = self.lookup(norm(unescape(value)))
                if out is not None:
                    return m.group(1) + name + m.group(3) + '"' + escape(out, quote=True) + '"'
            return m.group(0)
        node.start = ATTR_RE.sub(sub, node.start)

    def walk(self, node):
        if node.tag is not None:
            if node.attr("translate") == "no":
                return
            self.attrs(node)
            if node.tag in SKIP:
                return
            if own_text(node) and inline_only(node):
                # Attributes inside a sentence (a link's title, say) are part of the sentence's key.
                inner = node.inner()
                out = self.swap(inner)
                if out is not inner:
                    node.children = [Raw(out)]
                return
        for i, c in enumerate(node.children):
            if isinstance(c, Node):
                self.walk(c)
            elif type(c) is str and has_letters(c):
                node.children[i] = self.swap(c)


def rel(target, from_page):
    return os.path.relpath(target, os.path.dirname(from_page) or ".").replace(os.sep, "/")


def relink(node, page, out_page, lang):
    """Point asset paths and the language links at the right files from the new location."""
    def sub(m):
        name, value = m.group(2), m.group(4)
        if name not in URL_ATTRS or not value or re.match(r"^(?:[a-z]+:|/|#|\?)", value):
            return m.group(0)
        path, sep, frag = re.match(r"^([^#?]*)([#?]?)(.*)$", value).groups()
        target = os.path.normpath(os.path.join(os.path.dirname(page), path)).replace(os.sep, "/")
        if target in PAGES or not os.path.exists(os.path.join(ROOT, target)):
            return m.group(0)
        return m.group(1) + name + m.group(3) + '"' + rel(target, out_page) + sep + frag + '"'

    def visit(n):
        if n.tag is not None:
            n.start = ATTR_RE.sub(sub, n.start)
            if n.tag == "a" and n.attr("hreflang"):
                code = n.attr("hreflang")
                target = page if code == "en" else code + "/" + page
                n.start = re.sub(r'\shref="[^"]*"', ' href="%s"' % rel(target, out_page), n.start)
                n.start = re.sub(r'\saria-current="[^"]*"', "", n.start)
                if code == lang:
                    n.start = n.start[:-1] + ' aria-current="true">'
            if n.tag == "html":
                n.start = re.sub(r'\slang="[^"]*"', ' lang="%s"' % lang, n.start)
            if n.tag == "link" and "fonts.googleapis.com/css2" in n.start and LANGS[lang].get("font"):
                n.start = n.start.replace("css2?", "css2?" + LANGS[lang]["font"], 1)
        for c in n.children:
            if isinstance(c, Node):
                visit(c)
    visit(node)


def load(lang):
    path = os.path.join(ROOT, "i18n", lang + ".json")
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def main(argv):
    mode = argv[1] if len(argv) > 1 else "build"
    if mode == "--strings":
        t = Translator()
        for page in PAGES:
            t.walk(parse(os.path.join(ROOT, page)))
        print(json.dumps(t.seen, ensure_ascii=False, indent=2))
        return 0

    failed = False
    for lang in LANGS:
        table = load(lang)
        t = Translator(table)
        for page in PAGES:
            tree = parse(os.path.join(ROOT, page))
            t.walk(tree)
            if mode == "--check":
                continue
            out_page = lang + "/" + page
            relink(tree, page, out_page, lang)
            out = os.path.join(ROOT, out_page)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            with open(out, "w", encoding="utf-8") as f:
                f.write(tree.html())
        unused = [k for k in table if k not in t.seen]
        print("%s: %d strings, %d missing, %d unused" % (lang, len(t.seen), len(t.missing), len(unused)))
        for k in t.missing:
            print("  missing: " + k)
        for k in unused:
            print("  unused:  " + k)
        failed = failed or bool(t.missing)
    return 1 if failed and mode == "--check" else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
