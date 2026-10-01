import type { WebsiteLanguage } from "@/contexts/LanguageContext";

/** Shared by the Score Board page and its structured data (seo.ts), so the visible FAQ and the FAQPage schema always match. */
export const scoreboardSocialImage = "/media/drone-soccer-scoreboard_og.jpg";

export const scoreboardFeatureList: Record<WebsiteLanguage, string[]> = {
  en: [
    "FAI F9A match clock with 3 sets",
    "Team scores and yellow cards",
    "10-second penalty shot clock",
    "Whistle and 5-second countdown audio",
    "Spectator display for projectors, TVs and OBS",
    "CSV / JSON export and printable match report",
  ],
  "zh-Hant": [
    "FAI F9A 三局比賽計時",
    "隊伍比分及黃牌記錄",
    "10 秒罰球計時",
    "哨聲及 5 秒倒數音效",
    "供投影機、電視及 OBS 使用的觀眾畫面",
    "CSV／JSON 匯出及可列印比賽報告",
  ],
};

export const scoreboardFaq: Record<WebsiteLanguage, Array<{ question: string; answer: string }>> = {
  en: [
    {
      question: "Is the drone soccer scoreboard really free?",
      answer: "Yes. The Velocity Lab Innovation drone soccer scoreboard and referee system is free to use online. There is no account, no download and no subscription: open velocity-lab.com/scoreboard in a browser and start the match.",
    },
    {
      question: "Does it follow FAI F9A drone soccer rules?",
      answer: "It is set up for FAI F9A drone soccer by default: three sets of three minutes, a 10-second penalty shot clock, yellow-card counts and set wins for each team. Set length (1–4 minutes) and penalty shot time (10, 15 or 20 seconds) can be changed in Setup for youth, practice or local event rules.",
    },
    {
      question: "Can I show the score on a projector, TV or live stream?",
      answer: "Yes. Press POPUP to open a spectator scoreboard in its own window for a second screen or projector; it stays in sync with the referee console. Broadcast mode adds a transparent background and a lower-third layout for OBS and other streaming software.",
    },
    {
      question: "Does the referee timer have a whistle and countdown sound?",
      answer: "Yes. Starting the clock blows a whistle, and a 5-second countdown audio cue plays as time runs out. You can test the countdown sound, or replace it with your own audio file, in Setup.",
    },
    {
      question: "What do I need to run a drone soccer match with it?",
      answer: "A laptop or tablet with a modern browser and an internet connection. A second screen, a USB number keypad or a foot pedal are optional: the console works with keyboard shortcuts, so referees can score without looking away from the cage.",
    },
    {
      question: "Is match data uploaded anywhere?",
      answer: "No. Scores, cards and the match timeline stay in your browser and only sync to spectator windows on the same computer. After the match you can export the report as CSV or JSON, or print an official match sheet with signature lines.",
    },
    {
      question: "How is this different from Smart Referee?",
      answer: "The scoreboard handles timing, scoring and penalties for any drone soccer match. Smart Referee adds calibrated, multi-angle video review for close calls at competitions, delivered by the VLI team.",
    },
  ],
  "zh-Hant": [
    {
      question: "無人機足球記分板真的免費嗎？",
      answer: "是的。速研創新的無人機足球記分板及裁判系統可免費在網上使用，毋須帳戶、下載或訂閱：在瀏覽器開啟 velocity-lab.com/scoreboard 即可開賽。",
    },
    {
      question: "是否符合 FAI F9A 無人機足球規則？",
      answer: "預設按 FAI F9A 無人機足球設定：三局、每局三分鐘、10 秒罰球計時，以及各隊黃牌及勝局記錄。每局時間（1–4 分鐘）及罰球時間（10、15 或 20 秒）可在「SETUP」中按青少年賽、練習或本地賽事規則調整。",
    },
    {
      question: "可以在投影機、電視或直播上顯示比分嗎？",
      answer: "可以。按「POPUP」可在另一個視窗開啟觀眾記分板，供第二個螢幕或投影機使用，並與裁判控制台即時同步。廣播模式提供透明背景及下方字幕版面，適用於 OBS 等直播軟件。",
    },
    {
      question: "裁判計時器有哨聲及倒數音效嗎？",
      answer: "有。開始計時會鳴哨，時間將盡時會播放 5 秒倒數音效。您可在「SETUP」中試聽倒數音效，或換成自己的音效檔。",
    },
    {
      question: "使用它執法無人機足球比賽需要甚麼？",
      answer: "一部有瀏覽器及網絡連線的手提電腦或平板電腦即可。第二個螢幕、USB 數字鍵盤或腳踏開關可按需要加配：控制台支援鍵盤快捷鍵，裁判毋須離開視線即可記分。",
    },
    {
      question: "比賽資料會被上載嗎？",
      answer: "不會。比分、黃牌及比賽時間線只留在您的瀏覽器，並只與同一部電腦上的觀眾視窗同步。完場後可匯出 CSV 或 JSON 報告，或列印附簽名欄的正式比賽記錄表。",
    },
    {
      question: "這與 Smart Referee 有何不同？",
      answer: "記分板負責任何無人機足球比賽的計時、記分及判罰；Smart Referee 則由 VLI 團隊為賽事提供經校準的多角度影片覆核，處理關鍵判決。",
    },
  ],
};
