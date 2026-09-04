export type EntryIconSpec =
  | { kind: "favicon"; domain: string; fallback: string }
  | { kind: "emoji"; value: string };

interface IconRule {
  pattern: RegExp;
  icon: EntryIconSpec;
}

// Checked in order — more specific brand matches first, generic category
// keywords after. Brand rules use a well-known domain so a real favicon
// can be shown; every brand rule still carries an emoji fallback in case
// the favicon fails to load (offline, blocked, domain wrong).
const RULES: IconRule[] = [
  // Brands (favicon, with emoji fallback)
  { pattern: /\bo2\b/i, icon: { kind: "favicon", domain: "o2.co.uk", fallback: "📱" } },
  { pattern: /\bee\b/i, icon: { kind: "favicon", domain: "ee.co.uk", fallback: "📱" } },
  { pattern: /vodafone/i, icon: { kind: "favicon", domain: "vodafone.co.uk", fallback: "📱" } },
  { pattern: /giffgaff/i, icon: { kind: "favicon", domain: "giffgaff.com", fallback: "📱" } },
  { pattern: /\bthree\b/i, icon: { kind: "favicon", domain: "three.co.uk", fallback: "📱" } },
  { pattern: /virgin\s*media/i, icon: { kind: "favicon", domain: "virginmedia.com", fallback: "📶" } },
  { pattern: /virgin\s*mobile/i, icon: { kind: "favicon", domain: "virginmobile.com", fallback: "📱" } },
  { pattern: /\bbt\b|british telecom/i, icon: { kind: "favicon", domain: "bt.com", fallback: "📶" } },
  { pattern: /\bsky\b/i, icon: { kind: "favicon", domain: "sky.com", fallback: "📺" } },
  { pattern: /argos/i, icon: { kind: "favicon", domain: "argos.co.uk", fallback: "💳" } },
  { pattern: /capital ?one/i, icon: { kind: "favicon", domain: "capitalone.co.uk", fallback: "💳" } },
  { pattern: /barclaycard/i, icon: { kind: "favicon", domain: "barclaycard.co.uk", fallback: "💳" } },
  { pattern: /\bbarclays\b/i, icon: { kind: "favicon", domain: "barclays.co.uk", fallback: "🏦" } },
  { pattern: /halifax/i, icon: { kind: "favicon", domain: "halifax.co.uk", fallback: "🏦" } },
  { pattern: /natwest/i, icon: { kind: "favicon", domain: "natwest.com", fallback: "🏦" } },
  { pattern: /santander/i, icon: { kind: "favicon", domain: "santander.co.uk", fallback: "🏦" } },
  { pattern: /monzo/i, icon: { kind: "favicon", domain: "monzo.com", fallback: "🏦" } },
  { pattern: /\bamex\b|american express/i, icon: { kind: "favicon", domain: "americanexpress.com", fallback: "💳" } },
  { pattern: /netflix/i, icon: { kind: "favicon", domain: "netflix.com", fallback: "🎬" } },
  { pattern: /spotify/i, icon: { kind: "favicon", domain: "spotify.com", fallback: "🎵" } },
  { pattern: /youtube/i, icon: { kind: "favicon", domain: "youtube.com", fallback: "📺" } },
  { pattern: /disney/i, icon: { kind: "favicon", domain: "disneyplus.com", fallback: "🎬" } },
  { pattern: /amazon|\bprime\b/i, icon: { kind: "favicon", domain: "amazon.co.uk", fallback: "📦" } },
  { pattern: /playstation|\bps5\b|\bps4\b|\bps portal\b/i, icon: { kind: "favicon", domain: "playstation.com", fallback: "🎮" } },
  { pattern: /nintendo|switch/i, icon: { kind: "favicon", domain: "nintendo.com", fallback: "🎮" } },
  { pattern: /xbox/i, icon: { kind: "favicon", domain: "xbox.com", fallback: "🎮" } },
  { pattern: /currys/i, icon: { kind: "favicon", domain: "currys.co.uk", fallback: "🔌" } },
  { pattern: /bambu\s*lab/i, icon: { kind: "favicon", domain: "bambulab.com", fallback: "🖨️" } },

  // Generic categories (emoji)
  { pattern: /\brent\b|mortgage/i, icon: { kind: "emoji", value: "🏠" } },
  { pattern: /council tax/i, icon: { kind: "emoji", value: "🏛️" } },
  { pattern: /\bwater\b/i, icon: { kind: "emoji", value: "💧" } },
  { pattern: /electric|energy|\bgas\b|\bpower\b/i, icon: { kind: "emoji", value: "⚡" } },
  { pattern: /broadband|wifi|internet|router/i, icon: { kind: "emoji", value: "📶" } },
  { pattern: /\bbike\b|motorbike|motorcycle/i, icon: { kind: "emoji", value: "🏍️" } },
  { pattern: /\bcar\b|vehicle|\bmot\b|fuel|petrol|diesel/i, icon: { kind: "emoji", value: "🚗" } },
  { pattern: /mobile|\bphone\b|\bsim\b/i, icon: { kind: "emoji", value: "📱" } },
  { pattern: /life insurance|insurance/i, icon: { kind: "emoji", value: "🛡️" } },
  { pattern: /child maintenance/i, icon: { kind: "emoji", value: "👨‍👩‍👧" } },
  { pattern: /gym|fitness/i, icon: { kind: "emoji", value: "🏋️" } },
  { pattern: /grocer|shop|supermarket/i, icon: { kind: "emoji", value: "🛒" } },
  { pattern: /credit card|store card|loan|\bdebt\b|\bowe\b|\bpay\b.*card/i, icon: { kind: "emoji", value: "💳" } },
  { pattern: /luxury/i, icon: { kind: "emoji", value: "✨" } },
  { pattern: /christmas|gift/i, icon: { kind: "emoji", value: "🎁" } },
  { pattern: /salary|wage|income/i, icon: { kind: "emoji", value: "💷" } },
  { pattern: /subscription|streaming/i, icon: { kind: "emoji", value: "📺" } },
  { pattern: /game|gaming|console/i, icon: { kind: "emoji", value: "🎮" } },
];

const DEFAULT_ICON: EntryIconSpec = { kind: "emoji", value: "💰" };

export function getEntryIcon(name: string): EntryIconSpec {
  for (const rule of RULES) {
    if (rule.pattern.test(name)) return rule.icon;
  }
  return DEFAULT_ICON;
}
