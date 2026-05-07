"use client";

import { useEffect, useRef } from "react";

/**
 * Lightweight rich-text editor — contentEditable + execCommand + a
 * conservative output sanitizer. Output is restricted to tags that
 * render reliably in Gmail and Apple Mail: p, br, b, strong, i, em,
 * u, a, ul, ol, li, hr, span (style stripped except a few safe ones).
 *
 * The toolbar buttons declared via `tools` accept any of:
 *   bold | italic | underline | link | bullet | numbered | divider | clear
 */

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  tools?: Array<
    | "bold"
    | "italic"
    | "underline"
    | "link"
    | "bullet"
    | "numbered"
    | "divider"
    | "clear"
  >;
  minHeight?: number;
}

const ALLOWED_TAGS = new Set([
  "P", "BR", "B", "STRONG", "I", "EM", "U", "A", "UL", "OL", "LI", "HR", "SPAN", "DIV",
]);
const ALLOWED_ATTRS: Record<string, Set<string>> = {
  A: new Set(["href", "target", "rel"]),
};

function sanitize(html: string): string {
  if (typeof document === "undefined") return html;
  const wrap = document.createElement("div");
  wrap.innerHTML = html;
  const walk = (node: Node) => {
    const children = Array.from(node.childNodes);
    for (const child of children) {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const el = child as HTMLElement;
        const tag = el.tagName;
        if (!ALLOWED_TAGS.has(tag)) {
          // unwrap (preserve children, drop the element)
          while (el.firstChild) node.insertBefore(el.firstChild, el);
          node.removeChild(el);
          continue;
        }
        // Strip disallowed attributes
        const allowed = ALLOWED_ATTRS[tag] ?? new Set<string>();
        for (const attr of Array.from(el.attributes)) {
          if (!allowed.has(attr.name.toLowerCase())) {
            el.removeAttribute(attr.name);
          }
        }
        // For anchors, force safe rel + target
        if (tag === "A") {
          const href = el.getAttribute("href") ?? "";
          if (!/^(https?:|mailto:|tel:|#)/i.test(href)) {
            el.removeAttribute("href");
          } else {
            el.setAttribute("target", "_blank");
            el.setAttribute("rel", "noopener noreferrer");
          }
        }
        walk(el);
      } else if (child.nodeType !== Node.TEXT_NODE) {
        node.removeChild(child);
      }
    }
  };
  walk(wrap);
  return wrap.innerHTML;
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  tools = ["bold", "italic", "underline", "link", "bullet", "numbered", "divider", "clear"],
  minHeight = 200,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  // Initial paint — set innerHTML once. After that, the editor owns the DOM;
  // we don't re-sync from props on every render or the cursor jumps.
  useEffect(() => {
    if (ref.current && value !== ref.current.innerHTML) {
      ref.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(cmd: string, arg?: string) {
    ref.current?.focus();
    document.execCommand(cmd, false, arg);
    if (ref.current) onChange(sanitize(ref.current.innerHTML));
  }

  function handleLink() {
    const url = window.prompt("Link URL");
    if (!url) return;
    exec("createLink", url);
  }

  function handleDivider() {
    ref.current?.focus();
    document.execCommand("insertHorizontalRule");
    if (ref.current) onChange(sanitize(ref.current.innerHTML));
  }

  function handleClear() {
    ref.current?.focus();
    document.execCommand("removeFormat");
    if (ref.current) onChange(sanitize(ref.current.innerHTML));
  }

  function handleInput() {
    if (!ref.current) return;
    onChange(ref.current.innerHTML);
  }

  function handleBlur() {
    if (!ref.current) return;
    const cleaned = sanitize(ref.current.innerHTML);
    if (cleaned !== ref.current.innerHTML) ref.current.innerHTML = cleaned;
    onChange(cleaned);
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    const text = e.clipboardData.getData("text/plain");
    document.execCommand("insertText", false, text);
  }

  return (
    <div className="admin-rte">
      <div className="admin-rte-toolbar">
        {tools.includes("bold") && (
          <button type="button" onClick={() => exec("bold")}><b>B</b></button>
        )}
        {tools.includes("italic") && (
          <button type="button" onClick={() => exec("italic")}><i>I</i></button>
        )}
        {tools.includes("underline") && (
          <button type="button" onClick={() => exec("underline")}><u>U</u></button>
        )}
        {tools.includes("link") && (
          <button type="button" onClick={handleLink}>Link</button>
        )}
        {tools.includes("bullet") && (
          <button type="button" onClick={() => exec("insertUnorderedList")}>• List</button>
        )}
        {tools.includes("numbered") && (
          <button type="button" onClick={() => exec("insertOrderedList")}>1. List</button>
        )}
        {tools.includes("divider") && (
          <button type="button" onClick={handleDivider}>—</button>
        )}
        {tools.includes("clear") && (
          <button type="button" onClick={handleClear}>Clear</button>
        )}
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        className="admin-rte-area"
        style={{ minHeight }}
        data-placeholder={placeholder}
        onInput={handleInput}
        onBlur={handleBlur}
        onPaste={handlePaste}
      />
    </div>
  );
}
