/** GRAPHITE wordmark — VCR OSD Mono, ASCII texture, kerned; T stem thinned. */
const BANNER_WIDTH = 96;
const BANNER = [
  "  \u001b[97m#B&M%B\u001b[0m    \u001b[97m(%%&@$#WYB\u001b[0m        \u001b[97m#$\u001b[0m      \u001b[97m#WMW@*&W@&\u001b[0m    \u001b[97m##\u001b[0m      \u001b[97mWW\u001b[0m  \u001b[97m$W%@%8\u001b[0m  \u001b[97m8$&8MB#%%X\u001b[0m  \u001b[97mm$%&]&8%#&\u001b[0m",
  "\u001b[97mM0\u001b[0m  \u001b[38;5;248mi+!>\u001b[0m\u001b[97m%#\u001b[0m  \u001b[97m$B8%\u001b[0m\u001b[38;5;248m,!+<\u001b[0m\u001b[97m@O&)\u001b[0m    \u001b[97m$BXwW&\u001b[0m    \u001b[97m8*@W\u001b[0m\u001b[38;5;248m;=`.\u001b[0m\u001b[97m8W\u001b[0m\u001b[38;5;248m:\"\u001b[0m  \u001b[97mB&\u001b[0m\u001b[38;5;248m='\u001b[0m    \u001b[97m&%\u001b[0m\u001b[38;5;248m+'\u001b[0m  \u001b[97m&M\u001b[0m\u001b[38;5;248m!-:-\u001b[0m  \u001b[38;5;248m<>\u001b[0m\u001b[97m@8\u001b[0m\u001b[38;5;248m:>l~!,\u001b[0m\u001b[97m&8\u001b[0m\u001b[38;5;248mi~:i<i=<<~\u001b[0m",
  "\u001b[97m%@\u001b[0m\u001b[38;5;248m!l\u001b[0m      \u001b[38;5;248m=+\u001b[0m\u001b[97m8%$$\u001b[0m\u001b[38;5;248m''\u001b[0m  \u001b[97m80#a\u001b[0m\u001b[38;5;248m=!\u001b[0m\u001b[97m@B\u001b[0m  \u001b[38;5;248m!+\u001b[0m\u001b[97mWh8B\u001b[0m  \u001b[97m&W&B\u001b[0m\u001b[38;5;248m-.\u001b[0m  \u001b[97m$X\u001b[0m\u001b[38;5;248m\"l\u001b[0m  \u001b[97m$M\u001b[0m\u001b[38;5;248m><\u001b[0m    \u001b[97m&W\u001b[0m\u001b[38;5;248m\":\u001b[0m  \u001b[97m(@\u001b[0m\u001b[38;5;248mi`\u001b[0m      \u001b[97m%W\u001b[0m\u001b[38;5;248m<=\u001b[0m    \u001b[97mM#\u001b[0m\u001b[38;5;248m;,\u001b[0m",
  "\u001b[97mB*\u001b[0m\u001b[38;5;248m+<\u001b[0m  \u001b[97mnM#8\u001b[0m  \u001b[97m8&aB%a&0&)\u001b[0m\u001b[38;5;248m`;!`\u001b[0m\u001b[97mM\\\u001b[0m\u001b[38;5;248m,.\u001b[0m    \u001b[97mO8\u001b[0m\u001b[38;5;248ml'\u001b[0m\u001b[97m8MM8%#M&8@\u001b[0m\u001b[38;5;248m++\u001b[0m  \u001b[97m0#&W$M8%#M\u001b[0m\u001b[38;5;248m;~\u001b[0m  \u001b[97mwZ\u001b[0m\u001b[38;5;248m!-\u001b[0m      \u001b[97m%#\u001b[0m\u001b[38;5;248m'!\u001b[0m    \u001b[97mM#$$)W#h\u001b[0m",
  "\u001b[97m#$\u001b[0m\u001b[38;5;248m=~\u001b[0m    \u001b[97m@8\u001b[0m\u001b[38;5;248m-+\u001b[0m\u001b[97mw$*Z@YvB\u001b[0m\u001b[38;5;248m\"~=-\u001b[0m  \u001b[97mX8MBXW$m@&\u001b[0m\u001b[38;5;248m=`\u001b[0m\u001b[97m##Z#\u001b[0m\u001b[38;5;248m:-l-;;<l\u001b[0m  \u001b[97m8W\u001b[0m\u001b[38;5;248m`:=>-;\u001b[0m\u001b[97mM0\u001b[0m\u001b[38;5;248ml!\u001b[0m  \u001b[97m&v\u001b[0m\u001b[38;5;248m~>\u001b[0m      \u001b[97mnW\u001b[0m\u001b[38;5;248m`=\u001b[0m    \u001b[97mMW\u001b[0m\u001b[38;5;248m-\"l;~l~,\u001b[0m",
  "\u001b[97mMB\u001b[0m\u001b[38;5;248m.>\u001b[0m    \u001b[97m#B\u001b[0m\u001b[38;5;248m>~\u001b[0m\u001b[97mh%8W\u001b[0m\u001b[38;5;248m`!\u001b[0m\u001b[97m*$#%\u001b[0m    \u001b[97m#$\u001b[0m\u001b[38;5;248m:\"`;!!\u001b[0m\u001b[97m8B\u001b[0m\u001b[38;5;248m::\u001b[0m\u001b[97m@&\u001b[0m\u001b[38;5;248m=\"\";\u001b[0m        \u001b[97mww\u001b[0m\u001b[38;5;248m+;\u001b[0m    \u001b[97m8&\u001b[0m\u001b[38;5;248m+>\u001b[0m  \u001b[97m$W\u001b[0m\u001b[38;5;248m'>\u001b[0m      \u001b[97mW*\u001b[0m\u001b[38;5;248m;'\u001b[0m    \u001b[97mBM\u001b[0m\u001b[38;5;248m+-\u001b[0m",
  "  \u001b[97m%WBY@W\u001b[0m  \u001b[38;5;248m,;\u001b[0m\u001b[97m&&8W\u001b[0m\u001b[38;5;248m\"-\u001b[0m  \u001b[97m$v\u001b[0m\u001b[38;5;248m`;\u001b[0m  \u001b[97mBa\u001b[0m\u001b[38;5;248m.!\u001b[0m    \u001b[97mMB\u001b[0m\u001b[38;5;248m=~\u001b[0m\u001b[97mZ@X$\u001b[0m          \u001b[97m%X\u001b[0m\u001b[38;5;248m~l\u001b[0m    \u001b[97m@@\u001b[0m\u001b[38;5;248m.:\u001b[0m\u001b[97mWa#W#B\u001b[0m      \u001b[97m$m\u001b[0m\u001b[38;5;248m'+\u001b[0m    \u001b[97m@BX#*%{B&h\u001b[0m",
  "    \u001b[38;5;248ml,:!'+\u001b[0m    \u001b[38;5;248m<>>;\u001b[0m    \u001b[38;5;248m:\"\u001b[0m    \u001b[38;5;248m!:\u001b[0m      \u001b[38;5;248m':\u001b[0m  \u001b[38;5;248m.>:<\u001b[0m          \u001b[38;5;248m`,\u001b[0m      \u001b[38;5;248m\"!\u001b[0m  \u001b[38;5;248m,'',-l\u001b[0m      \u001b[38;5;248m.\"\u001b[0m      \u001b[38;5;248m,!!ll`>`-\"\u001b[0m",
];

const dim = (s: string) => `\x1b[2m${s}\x1b[0m`;
const bold = (s: string) => `\x1b[1m${s}\x1b[0m`;

export function printBanner(subtitle?: string) {
  if ((process.stdout.columns ?? 80) >= BANNER_WIDTH + 2) {
    process.stdout.write("\n" + BANNER.join("\n") + "\n\n");
  } else {
    process.stdout.write(bold("graphite") + "\n");
  }
  if (subtitle) process.stdout.write(dim(subtitle) + "\n");
}
