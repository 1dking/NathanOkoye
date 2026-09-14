/**
 * Field Notes — the writing on nathanokoye.com.
 *
 * Body paragraphs are plain strings. A string prefixed with "## " renders
 * as a subhead. House rules: double-spaced paragraphs, no em-dashes.
 */

export type FieldNote = {
  slug: string;
  title: string;
  description: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  readTime: string;
  body: string[];
};

export const FIELD_NOTES: FieldNote[] = [
  {
    slug: "most-strategy-consultants-only-interview-leadership",
    title: "Most strategy consultants only interview leadership.",
    description:
      "The workshop model is clean, billable, and structurally broken. What changes when you interview all three views of an organization.",
    date: "2026-09-13",
    readTime: "3 min read",
    body: [
      "Most strategy consultants only interview leadership. That's the workshop model. You get the leaders in a room for two days, you facilitate exercises, you produce a positioning statement everyone agrees with, and then you leave. It's clean, it's billable, and it's structurally broken.",
      "Here is the structural problem. The people in the room where positioning gets decided are the ones who can't see the problem, because they're inside it. Leadership built the current story. They hired around it. They defend it in every meeting. Asking them to diagnose it is asking the author to proofread their own book. They will catch typos. They will not catch the plot hole.",
      "The workshop model doesn't fail because the exercises are bad or the facilitator is lazy. It fails because it collects one view of the organization and treats it as the whole picture. Consensus in the room is not evidence. It is the absence of anyone positioned to disagree.",
      "You can tell this has happened to an organization by what follows the engagement. The slide deck is good. Everyone agreed with it. It gets presented, circulated, and filed. A year later the numbers look the same and nobody can quite explain why, because the strategy was built from the only vantage point that couldn't see the obstruction.",
      "The alternative is slower and less comfortable. You interview leadership, staff, and customers separately. Not together, and not in a workshop, because people in a room with their boss report the org chart, not the truth.",
      "Leadership tells you the vision. Staff tell you the operational reality. Customers tell you the experience. Then you lay the three transcripts side by side, and the findings are not in any one of them. The findings are in the gaps between them.",
      "When leadership says premium and customers say convenient, that gap is the strategy problem. When staff describe a workaround that leadership doesn't know exists, that gap is the strategy problem. No workshop surfaces these, because no single room contains them.",
      "If you've hired a consultant who spent two days with your leadership team, produced a deck everyone agreed with, and left, and nothing has changed since, the workshop wasn't your problem. The room was.",
      "This is the method behind Authority Architect, the diagnostic I run at OCIDM. Three sets of interviews, run separately, compared honestly. The organization usually already contains the answer. It has just never been in one document before.",
    ],
  },
  {
    slug: "the-three-views-that-almost-never-match",
    title: "The three views of an organization that almost never match.",
    description:
      "Leadership has a vision. Staff have an operational reality. Customers have an experience. Growth stalls in the gaps between them.",
    date: "2026-09-12",
    readTime: "5 min read",
    body: [
      "Every organization runs on three descriptions of itself, held by three different groups of people.",
      "Leadership holds the vision. What the organization is for, where it's going, what makes it different. This view is coherent, articulate, and rehearsed, because leadership presents it constantly. It is also the oldest of the three views, because it was written first and revised least.",
      "Staff hold the operational reality. What actually happens when the vision meets a Tuesday. Which promises are easy to keep and which ones require heroics. Where the process bends, where it breaks, and what customers actually ask for on the phone, which is frequently not what the brochure offers.",
      "Customers hold the experience. Not the intended experience. The one they actually had, described in their own vocabulary, which almost never matches the organization's vocabulary. Customers do not know the mission statement. They know what it felt like to buy, to attend, to call, to come back or not come back.",
      "In fifteen years of doing this work, I have never once seen the three views match. Not in a struggling organization, and not in a successful one. The difference between the two isn't whether the gap exists. It's how wide the gap has been allowed to grow, and whether anyone is looking at it.",
      "## Where growth actually stalls",
      "When an organization plateaus despite consistent effort and consistent spend, the reflex is to inspect the activity. Change the agency. Increase the budget. Redo the website. But activity was never the constraint. The constraint is that the organization is broadcasting the leadership view to people who are living the customer view, and the two don't connect.",
      "The marketing describes what leadership believes. The customer hears a message that doesn't describe anything they've experienced or wanted. The message isn't wrong, exactly. It's aimed at a reader who doesn't exist.",
      "## A worked example",
      "SING! The Toronto Vocal Arts Festival had been running for years on genuine quality. Leadership's view was accurate as far as it went: a serious festival with world-class vocal performances, respected by the people who knew it. The content said so, in the festival's own language, to the audience that already agreed.",
      "The customer view was different, and the people who held the most useful version of it weren't even customers yet. They were people who would have loved a night like this and had no idea what it felt like. Nothing in the festival's outward conversation told them. The credentials spoke to the converted. Nobody was speaking to the curious.",
      "The repositioning didn't change the product at all. It changed which view the content was built from. The new conversation described the experience of being in the room, in the language of someone deciding what to do on a Saturday, not the language of the program notes. All six events sold out. That had not happened in fifteen years.",
      "## The diagnostic move",
      "You cannot see this gap from inside any one of the three views, which is why it survives for years inside smart organizations. Leadership can't see it because their view is self-consistent. Staff see pieces of it but have no venue to report it. Customers feel it but have no reason to articulate it.",
      "The only way to see it is to collect all three views separately and compare them. Interview leadership without staff in the room. Interview staff without leadership in the room. Interview customers without anyone from the organization in the room. Then read the transcripts side by side.",
      "The strategy is rarely something a consultant invents. It's usually sitting in the customer transcripts, described plainly, waiting for someone to notice that nobody inside the building talks that way.",
    ],
  },
  {
    slug: "fix-positioning-before-you-buy-more-marketing",
    title: "Fix positioning before you buy more marketing.",
    description:
      "Amplifying a message aimed at the wrong person is the most expensive form of doing nothing.",
    date: "2026-09-11",
    readTime: "3 min read",
    body: [
      "There is a moment that happens in boardrooms every quarter. Someone looks at the marketing line on the budget and asks what it produced this year. The answers are activity numbers. Impressions, followers, campaigns shipped, content published. The person asking wanted growth numbers. The room moves on, slightly less convinced than last quarter.",
      "The standard response to that moment is to adjust the activity. New agency. New channel. Bigger budget, or smaller one. A rebrand, if the frustration has been building long enough.",
      "All of these assume the problem is the amplifier. Almost always, the problem is the message going into it.",
      "Marketing is an amplifier. It takes what you say about yourself and says it louder, to more people, more often. If the message is aimed at the right person, amplification compounds. If the message is aimed at the wrong person, amplification does nothing except cost more. You reach thousands of people with a description of something they don't recognize needing, and the numbers stay flat, and everyone concludes the market is hard.",
      "Aimed at the wrong person is the phrase to sit with, because it's rarely obvious from inside. The message usually describes the organization accurately. Leadership approves it because it's true. But true and aimed are different properties. A message can be entirely accurate about you and entirely disconnected from the person reading it, and accuracy is what makes the problem invisible. Nobody audits a true sentence.",
      "This is why spending more before fixing aim is the most expensive form of doing nothing. Every dollar buys a louder version of the miss. Worse, the activity generates enough motion that it feels like strategy is happening. Reports get produced. Meetings review them. The stall continues underneath, fully funded.",
      "The test is not whether your marketing is good. The test is whether the person you need most would recognize themselves in the first sentence of it. Not admire it. Recognize themselves in it.",
      "If you're not certain, the diagnosis comes before the spend. Find out how the people you serve actually describe the problem you solve, in their words, collected without your team in the room. Compare it to what your marketing says. If the two don't match, no budget fixes that from the amplifier side.",
      "Aim first. Then amplify. The order is the whole game.",
    ],
  },
  {
    slug: "interviewing-customers-without-vocabulary",
    title: "How to interview customers who don't have vocabulary for what they want.",
    description:
      "What to actually ask, how to handle the answers, and why open-ended interviews produce data that surveys never will.",
    date: "2026-09-10",
    readTime: "4 min read",
    body: [
      "The hardest part of customer research is that customers are experts in their experience and amateurs in describing it. They know exactly what happened and how it felt. They do not have your category's vocabulary for it, and if you hand them that vocabulary, they will politely use it, and your data is now contaminated.",
      "This is the structural failure of surveys. A survey supplies the words. Rate our professionalism. How important is innovation to you. The customer picks from the frames you offered, you tabulate the confirmations of your own assumptions, and the report tells you what you already believed, now with percentages.",
      "Interviews done properly work the other way. The customer supplies the words, and the words are the data. Here is how I actually run them.",
      "## Ask about the last time, not the general case",
      "Never ask what someone generally values or usually does. General questions produce their self-image. Ask about the most recent specific instance. Walk me through the last time you attended. What was happening the day you decided to call someone like us. Specific memories contain the real sequence of events and the real feelings, in the words they naturally use for them.",
      "## Ask what they almost did instead",
      "The alternative they nearly chose tells you what category they think you're in, and it is regularly not the category you think you're in. An organization that believes it competes with other consultants may discover it competes with doing nothing. Those are entirely different positioning problems.",
      "## Follow the energy, not the script",
      "You need a handful of planned questions and the discipline to abandon them. When a customer's tone shifts, when they speed up, laugh, or hesitate, the interview is happening right there. Say more about that is the most valuable sentence in the method. The scripted question can wait.",
      "## Never correct their language. Collect it.",
      "When a customer describes your flagship offering in words your team would never use, the instinct is to gently reframe. Resist it. Their phrasing is not a misunderstanding of your positioning. It is your positioning, as received. Write it down exactly. The gap between their words and your words is the finding.",
      "## Handle the answers as evidence, not verdicts",
      "One customer's phrasing is an anecdote. The same phrasing appearing in the fifth and eighth interviews, from people who have never met, is a pattern, and patterns are what you position on. You are not looking for the most articulate customer. You are looking for the words that keep independently recurring.",
      "The payoff of doing this properly is that the positioning work stops being creative writing. The language that will actually land with your next hundred customers is sitting in the transcripts of your last ten, verbatim. Your job was never to invent it. Your job was to notice it.",
    ],
  },
];

export function getFieldNote(slug: string): FieldNote | undefined {
  return FIELD_NOTES.find((n) => n.slug === slug);
}

export function formatNoteDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
