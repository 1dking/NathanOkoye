import { cookies } from "next/headers";
import type { Metadata } from "next";
import { unlockBgl } from "./actions";
import "../bgl.css";

export const metadata: Metadata = {
  title: "Brand Guidelines",
  robots: { index: false, follow: false },
};

const BGL_ACCESS_TOKEN = process.env.BGL_ACCESS_TOKEN ?? "";

function isUnlocked(): boolean {
  if (!BGL_ACCESS_TOKEN) return false;
  return cookies().get("bgl_ok")?.value === BGL_ACCESS_TOKEN;
}

export default function BglPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (!isUnlocked()) {
    return (
      <div className="lock-screen">
        <div className="lock-card">
          <span className="lock-kicker">Nathan Okoye</span>
          <h1 className="lock-title">Brand Guidelines</h1>
          <p className="lock-copy">For the art team — enter the password to continue.</p>
          <form className="lock-form" action={unlockBgl}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              autoFocus
              required
              className="lock-input"
            />
            <button type="submit" className="lock-submit">
              Enter →
            </button>
          </form>
          {searchParams.error === "1" && (
            <p className="lock-error">That password isn&apos;t right — try again.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bgl-doc">
      <header className="bgl-cover">
        <div className="bgl-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="bgl-cover-logo" src="/images/logo.png" alt="Nathan Okoye monogram" />
          <span className="bgl-cover-kicker">Brand Guidelines</span>
          <h1>
            NATHAN <em>OKOYE</em>
          </h1>
          <p className="bgl-cover-sub">
            Reference for the art team — logo usage, color, type, and the photographic/video direction behind every
            generated asset.
          </p>
          <div className="bgl-cover-meta">
            <span>v1.0</span>
            <span>Ink · Cream · Emerald</span>
            <span>Dark system only</span>
          </div>
        </div>
      </header>

      <main className="bgl-wrap">
        <section className="bgl-block" id="logo">
          <div className="bgl-block-head">
            <span className="bgl-index">01</span>
            <div>
              <span className="bgl-eyebrow">Mark</span>
              <h2 className="bgl-title">The Logo</h2>
            </div>
          </div>
          <div className="bgl-logo-grid">
            <div className="bgl-logo-stage">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.png" alt="Nathan Okoye monogram on dark ground" />
            </div>
            <div>
              <dl className="bgl-spec-row">
                <dt>File</dt>
                <dd>logo.png · 320×400 · alpha</dd>
              </dl>
              <dl className="bgl-spec-row">
                <dt>Fill color</dt>
                <dd>#FBFAF3 (near-white, not pure #FFF)</dd>
              </dl>
              <dl className="bgl-spec-row">
                <dt>Minimum size</dt>
                <dd>28px tall (header use)</dd>
              </dl>
              <dl className="bgl-spec-row">
                <dt>Clear space</dt>
                <dd>≥ 1× mark height, all sides</dd>
              </dl>
              <dl className="bgl-spec-row">
                <dt>Favicon build</dt>
                <dd>mark + ink-black square backdrop</dd>
              </dl>
              <p className="bgl-note">
                The mark&apos;s fill is a very pale off-white — it disappears on light or white grounds. Always place
                it on <strong>ink black or another dark ground</strong>. Never recolor, outline, or add a drop
                shadow.
              </p>
              <div className="bgl-dont-row">
                <div className="bgl-dont-card good">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logo.png" alt="correct usage on dark ground" />
                  <span className="bgl-dont-label">Correct — dark ground</span>
                </div>
                <div className="bgl-dont-card bad">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logo.png" alt="incorrect usage on light ground" />
                  <span className="bgl-dont-label">Never — light ground</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bgl-block" id="color">
          <div className="bgl-block-head">
            <span className="bgl-index">02</span>
            <div>
              <span className="bgl-eyebrow">Palette</span>
              <h2 className="bgl-title">Color</h2>
            </div>
          </div>
          <p className="bgl-note" style={{ marginBottom: "1.75rem" }}>
            Six colors, no more. Ink and cream carry the page; emerald is the only accent and it never shares a
            screen with a second accent color.
          </p>
          <div className="bgl-swatch-grid">
            <div className="bgl-swatch">
              <div className="bgl-swatch-chip" style={{ background: "#050605" }} />
              <div className="bgl-swatch-body">
                <p className="bgl-swatch-name">Ink</p>
                <p className="bgl-swatch-role">Page ground</p>
                <div className="bgl-swatch-codes">
                  <span>#050605</span>
                  <span>rgb(5, 6, 5)</span>
                </div>
              </div>
            </div>
            <div className="bgl-swatch">
              <div className="bgl-swatch-chip" style={{ background: "#0A0C0B" }} />
              <div className="bgl-swatch-body">
                <p className="bgl-swatch-name">Ink Lifted</p>
                <p className="bgl-swatch-role">Panels, stat strips</p>
                <div className="bgl-swatch-codes">
                  <span>#0A0C0B</span>
                  <span>rgb(10, 12, 11)</span>
                </div>
              </div>
            </div>
            <div className="bgl-swatch">
              <div className="bgl-swatch-chip on-light" style={{ background: "#F2EDE0" }}>
                <span
                  style={{
                    fontFamily: "var(--cin-display)",
                    color: "#050605",
                    fontSize: "1.4rem",
                    textTransform: "uppercase",
                  }}
                >
                  Aa
                </span>
              </div>
              <div className="bgl-swatch-body">
                <p className="bgl-swatch-name">Cream</p>
                <p className="bgl-swatch-role">Primary text, headlines</p>
                <div className="bgl-swatch-codes">
                  <span>#F2EDE0</span>
                  <span>rgb(242, 237, 224)</span>
                </div>
              </div>
            </div>
            <div className="bgl-swatch">
              <div className="bgl-swatch-chip" style={{ background: "#10B981" }} />
              <div className="bgl-swatch-body">
                <p className="bgl-swatch-name">Emerald</p>
                <p className="bgl-swatch-role">Accent, CTAs, rules</p>
                <div className="bgl-swatch-codes">
                  <span>#10B981</span>
                  <span>rgb(16, 185, 129)</span>
                </div>
              </div>
            </div>
            <div className="bgl-swatch">
              <div className="bgl-swatch-chip" style={{ background: "#34D399" }} />
              <div className="bgl-swatch-body">
                <p className="bgl-swatch-name">Emerald Bright</p>
                <p className="bgl-swatch-role">Hover states, glow, outline type</p>
                <div className="bgl-swatch-codes">
                  <span>#34D399</span>
                  <span>rgb(52, 211, 153)</span>
                </div>
              </div>
            </div>
            <div className="bgl-swatch">
              <div className="bgl-swatch-chip" style={{ background: "#9C968A" }} />
              <div className="bgl-swatch-body">
                <p className="bgl-swatch-name">Muted Taupe</p>
                <p className="bgl-swatch-role">Secondary / de-emphasized text</p>
                <div className="bgl-swatch-codes">
                  <span>#9C968A</span>
                  <span>rgb(156, 150, 138)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bgl-block" id="type">
          <div className="bgl-block-head">
            <span className="bgl-index">03</span>
            <div>
              <span className="bgl-eyebrow">Typography</span>
              <h2 className="bgl-title">Type</h2>
            </div>
          </div>
          <div className="bgl-specimen">
            <p className="display">Close The Gap</p>
            <div className="bgl-specimen-meta">
              <span>Anton</span>
              <span>Weight 400 only</span>
              <span>Always uppercase</span>
              <span>Headlines, stats, kinetic type</span>
            </div>
          </div>
          <div className="bgl-specimen">
            <p className="sans">
              Brand strategist for consultants and advisors — I close the gap between the expertise you&apos;ve built
              and the brand that represents it.
            </p>
            <div className="bgl-specimen-meta">
              <span>Space Grotesk</span>
              <span>Weights 400 / 500 / 600</span>
              <span>Sentence case</span>
              <span>Body copy, nav, buttons</span>
            </div>
          </div>
          <div className="bgl-type-table-wrap">
            <table className="bgl-type-table">
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Face</th>
                  <th>Size</th>
                  <th>Tracking</th>
                  <th>Sample</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Display headline</td>
                  <td>Anton</td>
                  <td>48–96px</td>
                  <td>0.01em</td>
                  <td className="ex">Okoye</td>
                </tr>
                <tr>
                  <td>Section eyebrow / kicker</td>
                  <td>Space Grotesk</td>
                  <td>12–13px</td>
                  <td>0.16–0.4em</td>
                  <td
                    style={{
                      fontSize: "0.75rem",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      color: "var(--cin-emerald-bright)",
                    }}
                  >
                    — Label
                  </td>
                </tr>
                <tr>
                  <td>Body copy</td>
                  <td>Space Grotesk</td>
                  <td>16–17px</td>
                  <td>normal</td>
                  <td>Paragraph text</td>
                </tr>
                <tr>
                  <td>Stat / metric</td>
                  <td>Anton</td>
                  <td>48–96px</td>
                  <td>normal</td>
                  <td className="ex">$135M+</td>
                </tr>
                <tr>
                  <td>Button label</td>
                  <td>Space Grotesk</td>
                  <td>13–14px</td>
                  <td>0.03em</td>
                  <td style={{ fontWeight: 600 }}>Work With Nathan</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="bgl-note">
            Every uppercase label — eyebrows, kickers, buttons, stat units — carries extra letter-spacing. Anton is
            never set in sentence case; if it needs to read as a normal sentence, that&apos;s a sign the copy belongs
            in Space Grotesk instead.
          </p>
        </section>

        <section className="bgl-block" id="imagery">
          <div className="bgl-block-head">
            <span className="bgl-index">04</span>
            <div>
              <span className="bgl-eyebrow">Direction</span>
              <h2 className="bgl-title">Photography &amp; Video</h2>
            </div>
          </div>
          <div className="bgl-imagery-layout">
            <div>
              <div className="bgl-imagery-frame">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sequence/hero/frame_0010.webp"
                  alt="Reference frame: Nathan walking a night Toronto street, emerald neon lighting"
                />
              </div>
              <p className="bgl-imagery-caption">Reference frame — hero sequence, generated asset</p>
            </div>
            <div>
              <dl className="bgl-brief-list">
                <li>
                  <dt>Subject</dt>
                  <dd>
                    Nathan only — bald, grey beard, glasses. Identity locked via reference image on every generation
                    so his face stays consistent across assets.
                  </dd>
                </li>
                <li>
                  <dt>Wardrobe</dt>
                  <dd>Black t-shirt under a dark overshirt. Identical in every shot — never swap colors or add patterns.</dd>
                </li>
                <li>
                  <dt>Setting</dt>
                  <dd>Downtown Toronto at night. CN Tower and skyline in frame, wet reflective asphalt.</dd>
                </li>
                <li>
                  <dt>Lighting</dt>
                  <dd>Emerald-green neon (signage, practicals, rim light) against near-black. No other accent color in the light.</dd>
                </li>
                <li>
                  <dt>Atmosphere</dt>
                  <dd>Haze/fog in the air, high contrast, visible film grain. Never clean or clinical.</dd>
                </li>
                <li>
                  <dt>Camera</dt>
                  <dd>Slow and deliberate — a static hold or one continuous, unhurried move. No whip pans, no fast cuts, no handheld shake.</dd>
                </li>
              </dl>
              <div className="bgl-tech-specs">
                <span className="bgl-tech-chip">16:9</span>
                <span className="bgl-tech-chip">1080p</span>
                <span className="bgl-tech-chip">~8s per clip</span>
                <span className="bgl-tech-chip">No audio</span>
                <span className="bgl-tech-chip">Identity-referenced</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bgl-block" id="voice">
          <div className="bgl-block-head">
            <span className="bgl-index">05</span>
            <div>
              <span className="bgl-eyebrow">Tone</span>
              <h2 className="bgl-title">Voice</h2>
            </div>
          </div>
          <div className="bgl-voice-grid">
            <div className="bgl-voice-principle">
              <h3>Direct, never hedged</h3>
              <p>Short, declarative sentences. No &quot;I think,&quot; no qualifiers stacked in front of a claim.</p>
            </div>
            <div className="bgl-voice-principle">
              <h3>Outcomes, not adjectives</h3>
              <p>Leads with a number or a result before it reaches for a describing word.</p>
            </div>
            <div className="bgl-voice-principle">
              <h3>No packages, no hype</h3>
              <p>Refuses marketing filler — tiers, feature lists, urgency language. Says what something is and isn&apos;t.</p>
            </div>
            <div className="bgl-voice-principle">
              <h3>Confident about limits</h3>
              <p>States who this isn&apos;t for as plainly as who it is for. Confidence includes saying no.</p>
            </div>
          </div>
          <div className="bgl-quote-stack">
            <blockquote>
              &ldquo;I do not offer packages. I do not have tiers with feature lists.&rdquo;
              <cite>Work With Nathan</cite>
            </blockquote>
            <blockquote>
              &ldquo;The first conversation is about understanding your situation, not pitching a programme.&rdquo;
              <cite>Core Framework</cite>
            </blockquote>
            <blockquote>
              &ldquo;If that is where you are, The CORE Discovery Session will confirm it within the first hour. If
              it is not, I will tell you that too.&rdquo;
              <cite>Work With Nathan</cite>
            </blockquote>
          </div>
        </section>

        <section className="bgl-block" id="motion">
          <div className="bgl-block-head">
            <span className="bgl-index">06</span>
            <div>
              <span className="bgl-eyebrow">Interaction</span>
              <h2 className="bgl-title">Motion &amp; UI</h2>
            </div>
          </div>
          <div className="bgl-ui-grid">
            <div className="bgl-ui-card">
              <h4>Buttons</h4>
              <p>Solid emerald fill, near-black label (never white) for contrast. Hover brightens to emerald-bright and lifts 2px with a soft glow.</p>
              <span className="bgl-demo-btn">Book a Discovery Session</span>
            </div>
            <div className="bgl-ui-card">
              <h4>Grain</h4>
              <p>A faint animated noise texture sits over every page at ~5–7% opacity. It&apos;s atmosphere, not a filter — never crank it up.</p>
            </div>
            <div className="bgl-ui-card">
              <h4>Kinetic type</h4>
              <p>Key words (a name, a greeting) dolly toward camera on scroll — small and faint, growing sharp, then dissolving past the lens. Reserved for hero moments only.</p>
            </div>
          </div>
        </section>

        <section className="bgl-block" id="checklist">
          <div className="bgl-block-head">
            <span className="bgl-index">07</span>
            <div>
              <span className="bgl-eyebrow">Quick Reference</span>
              <h2 className="bgl-title">Do / Don&apos;t</h2>
            </div>
          </div>
          <div className="bgl-check-grid">
            <div className="bgl-check-col yes">
              <h4>Do</h4>
              <ul>
                <li>Keep the logo on ink black or another dark ground</li>
                <li>Set Anton in uppercase only, tight leading</li>
                <li>Use emerald as the one and only accent</li>
                <li>Keep video static or slow, with visible grain</li>
                <li>Write short, direct sentences that state a result</li>
              </ul>
            </div>
            <div className="bgl-check-col no">
              <h4>Don&apos;t</h4>
              <ul>
                <li>Place the logo on white, cream, or light photography</li>
                <li>Set Anton in sentence case, or bold/italicize it</li>
                <li>Introduce a second accent color alongside emerald</li>
                <li>Use fast cuts, whip pans, or clean/bright lighting</li>
                <li>Write in hype language, tiers, or feature-list copy</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="bgl-doc-footer">
        <p>Nathan Okoye — Brand Guidelines v1.0 — For internal / art team use</p>
      </footer>
    </div>
  );
}
