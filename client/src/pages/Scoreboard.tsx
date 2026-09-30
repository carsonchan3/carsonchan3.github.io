import { ArrowRight, ExternalLink, Keyboard, MonitorPlay, ShieldCheck } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useWebsiteLanguage } from "@/contexts/LanguageContext";
import { localizedPath } from "@/lib/seo";
import { staticSitePath } from "@/lib/staticPreview";

/** The referee console is a standalone page in client/public/scoreboard; it only runs on velocity-lab.com and localhost. */
export const refereeConsolePath = "/scoreboard/referee-console.html";
const consoleSrc = `${(import.meta.env?.BASE_URL ?? "/").replace(/\/$/, "")}${refereeConsolePath}`;

const hotkeys = [
  { keys: ["1", "2"], en: "Red team goal / undo goal", zh: "紅隊入球／取消入球" },
  { keys: ["3", "4"], en: "Red team yellow card / remove card", zh: "紅隊黃牌／取消黃牌" },
  { keys: ["5", "6"], en: "Blue team goal / undo goal", zh: "藍隊入球／取消入球" },
  { keys: ["7", "8"], en: "Blue team yellow card / remove card", zh: "藍隊黃牌／取消黃牌" },
  { keys: ["9"], en: "Start or pause the match clock (with whistle)", zh: "開始或暫停比賽計時（連哨聲）" },
  { keys: ["0"], en: "Reset the game", zh: "重設比賽" },
  { keys: ["P"], en: "Start or pause the 10-second penalty shot clock", zh: "開始或暫停 10 秒罰球計時" },
  { keys: ["B"], en: "Broadcast view for spectators", zh: "觀眾廣播畫面" },
  { keys: ["S"], en: "Match setup: team names, set and shot durations", zh: "比賽設定：隊名、局時及罰球時間" },
  { keys: ["M"], en: "Match report and export", zh: "比賽報告及匯出" },
  { keys: ["?"], en: "Shortcut guide", zh: "快捷鍵指南" },
  { keys: ["Esc"], en: "Exit broadcast view or close a window", zh: "離開廣播畫面或關閉視窗" },
];

export default function Scoreboard() {
  const { language } = useWebsiteLanguage();
  const zh = language === "zh-Hant";
  const copy = zh
    ? {
      eyebrow: "免費裁判工具",
      title: "無人機足球記分板",
      intro: "免費的網頁版裁判控制台，適用於 FAI F9A 無人機足球：比賽計時、比分、黃牌、10 秒罰球計時、哨聲，以及供投影或 OBS 使用的觀眾畫面。毋須註冊，毋須安裝。",
      openFull: "全螢幕開啟",
      openDisplay: "開啟觀眾畫面",
      features: ["三局制比賽計時", "比分及黃牌記錄", "10 秒罰球計時", "觀眾及 OBS 廣播畫面", "CSV／JSON 匯出及列印比賽報告"],
      phoneNotice: "控制台為手提電腦或橫向平板而設。使用手機時，請按「全螢幕開啟」並橫放裝置。",
      focusTip: "先點擊控制台一次，即可使用鍵盤快捷鍵。",
      frameTitle: "無人機足球裁判記分板",
      howTitle: "三步開始比賽",
      steps: [
        { title: "設定比賽", body: "按「SETUP」或 S 鍵輸入隊名，並選擇每局時間及罰球時間。" },
        { title: "執法比賽", body: "按 9 鳴哨開始計時，用數字鍵記錄入球及黃牌，按 P 開始 10 秒罰球。" },
        { title: "顯示及記錄", body: "按「POPUP」在第二個螢幕或 OBS 顯示觀眾畫面；完場後按「REPORT」匯出或列印已簽署的比賽報告。" },
      ],
      keysTitle: "鍵盤快捷鍵",
      keysNote: "數字鍵跟隨隊伍顏色，而非左右位置——交換顏色後，按鍵會跟隨隊伍。支援 USB 數字鍵盤及腳踏開關。",
      privacyTitle: "資料只留在您的瀏覽器",
      privacyBody: "比賽資料只儲存在此瀏覽器，並只與同一部電腦上開啟的觀眾畫面同步，不會上載。",
      upsellTitle: "需要影片覆核判決？",
      upsellBody: "Smart Referee 為關鍵得分瞬間提供經校準的多角度重播；全場地及賽事系統套裝則包括整套場地、器材及裁判設置。",
      referee: "了解 Smart Referee",
      bundles: "查看賽事套裝",
    }
    : {
      eyebrow: "Free referee tool",
      title: "Drone Soccer Score Board",
      intro: "A free, browser-based referee console for FAI F9A drone soccer: match clock, scores, yellow cards, a 10-second penalty shot clock, whistle, and a spectator display for projectors or OBS. No sign-up, nothing to install.",
      openFull: "Open full screen",
      openDisplay: "Open spectator display",
      features: ["3-set match clock", "Scores and yellow cards", "10-second penalty shot clock", "Spectator and OBS broadcast view", "CSV / JSON export and printable match report"],
      phoneNotice: "The console is built for a laptop or a tablet in landscape. On a phone, tap “Open full screen” and turn your device sideways.",
      focusTip: "Click inside the console once to turn on the keyboard shortcuts.",
      frameTitle: "Drone soccer referee score board",
      howTitle: "Run a match in three steps",
      steps: [
        { title: "Set up the match", body: "Press SETUP (or S) to enter team names and choose the set length and penalty shot time." },
        { title: "Referee the match", body: "Press 9 to blow the whistle and start the clock, record goals and cards with the number keys, and press P for a 10-second penalty shot." },
        { title: "Show and record", body: "Press POPUP to put the spectator view on a second screen or into OBS. After the match, press REPORT to export or print a match sheet ready for signatures." },
      ],
      keysTitle: "Keyboard shortcuts",
      keysNote: "Number keys follow the team colour, not the side of the screen — swap colours and the keys move with the team. Works with USB keypads and foot pedals.",
      privacyTitle: "Your data stays in your browser",
      privacyBody: "Match data is kept in this browser and only syncs to spectator windows opened on the same computer. Nothing is uploaded.",
      upsellTitle: "Need video review for close calls?",
      upsellBody: "Smart Referee adds calibrated, multi-angle replay for decisive scoring moments. The Full Arena & Tournament System bundle packages the venue, drones, and officiating setup together.",
      referee: "Explore Smart Referee",
      bundles: "See tournament bundles",
    };

  return (
    <div className="min-h-screen bg-black text-white">
      <SiteHeader active="scoreboard" />
      <main className="pt-16">
        <section className="border-b border-white/10 bg-[radial-gradient(circle_at_28%_20%,rgba(64,224,208,0.17),transparent_0_28%),linear-gradient(135deg,#1C1D20,#27282B_60%,#1C1D20)] py-8 md:py-10">
          <div className="container grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-3xl">
              <div className="mb-3 h-1 w-12 bg-accent" />
              <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">{copy.eyebrow}</p>
              <h1 className="velocity-headline !text-4xl text-white md:!text-5xl">{copy.title}</h1>
              <p className="mt-4 text-base leading-7 text-white/70 md:text-lg md:leading-8">{copy.intro}</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {copy.features.map((feature) => <li key={feature} className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">{feature}</li>)}
              </ul>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <a data-testid="scoreboard-open-full" href={consoleSrc} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 font-semibold text-black transition-opacity hover:opacity-90">{copy.openFull} <ExternalLink size={17} aria-hidden="true" /></a>
              <a href={`${consoleSrc}?mode=broadcast`} target="_blank" rel="noopener" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/40 px-6 py-3 font-semibold text-white transition-colors hover:border-accent hover:text-accent">{copy.openDisplay} <MonitorPlay size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section className="bg-black py-6 md:py-8">
          <div className="mx-auto w-full max-w-[1760px] px-3 sm:px-5">
            <p className="mb-3 rounded-md border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-100 lg:hidden">{copy.phoneNotice}</p>
            <p className="mb-3 hidden items-center gap-2 text-sm text-white/55 lg:flex"><Keyboard size={16} className="text-accent" aria-hidden="true" />{copy.focusTip}</p>
            <div className="overflow-hidden rounded-xl border border-accent/30 bg-[#0A1116] shadow-[0_24px_70px_rgba(14,166,157,0.12)]">
              <iframe data-testid="scoreboard-console" src={consoleSrc} title={copy.frameTitle} allow="fullscreen; autoplay" className="block h-[calc(100svh-5rem)] min-h-[720px] w-full border-0" />
            </div>
          </div>
        </section>

        <section className="velocity-section bg-black pt-10">
          <div className="container">
            <h2 className="velocity-headline mb-8 text-white">{copy.howTitle}</h2>
            <ol className="grid gap-4 md:grid-cols-3">
              {copy.steps.map((step, index) => (
                <li key={step.title} className="rounded-lg border border-white/10 bg-[#1C1D20] p-6">
                  <p className="mb-3 text-sm font-bold text-accent">{String(index + 1).padStart(2, "0")}</p>
                  <h3 className="mb-2 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="leading-7 text-white/70">{step.body}</p>
                </li>
              ))}
            </ol>

            <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-lg border border-white/10 bg-[#111215] p-6 sm:p-8">
                <h2 className="velocity-subheading mb-2 flex items-center gap-3 text-white"><Keyboard size={22} className="text-accent" aria-hidden="true" />{copy.keysTitle}</h2>
                <p className="mb-5 text-sm leading-6 text-white/60">{copy.keysNote}</p>
                <dl className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {hotkeys.map((hotkey) => (
                    <div key={hotkey.keys.join()} className="flex items-center gap-3 text-sm">
                      <dt className="flex shrink-0 gap-1">{hotkey.keys.map((key) => <kbd key={key} className="min-w-8 rounded border border-white/20 bg-white/10 px-2 py-0.5 text-center font-mono text-xs font-bold text-white shadow-[0_2px_0_rgba(0,0,0,0.5)]">{key}</kbd>)}</dt>
                      <dd className="text-white/75">{zh ? hotkey.zh : hotkey.en}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="flex flex-col gap-6">
                <div className="rounded-lg border border-white/10 bg-[#111215] p-6">
                  <h2 className="mb-2 flex items-center gap-3 text-lg font-semibold text-white"><ShieldCheck size={20} className="text-accent" aria-hidden="true" />{copy.privacyTitle}</h2>
                  <p className="text-sm leading-6 text-white/65">{copy.privacyBody}</p>
                </div>
                <div className="flex-1 rounded-lg border border-accent/35 bg-[linear-gradient(115deg,rgba(64,224,208,0.16),rgba(39,40,43,0.94)_50%,rgba(22,23,25,1))] p-6">
                  <h2 className="mb-2 text-lg font-semibold text-white">{copy.upsellTitle}</h2>
                  <p className="mb-5 text-sm leading-6 text-white/70">{copy.upsellBody}</p>
                  <div className="flex flex-wrap gap-3">
                    <a href={staticSitePath(localizedPath("/dronesportsreferee", language))} className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90">{copy.referee} <ArrowRight size={16} /></a>
                    <a href={staticSitePath(localizedPath("/product/bundles", language))} className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-accent hover:text-accent">{copy.bundles}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
