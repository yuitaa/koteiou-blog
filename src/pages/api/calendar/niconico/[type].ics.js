import * as cheerio from 'cheerio';
import vm from 'vm';

const targets = {
  regular: {
    url: 'https://anime.nicovideo.jp/live/reserved-regular.html',
    key: 'live_reserved_regular',
    duration: 30,
  },
  ikkyo: {
    url: 'https://anime.nicovideo.jp/live/reserved-ikkyo.html',
    key: 'live_reserved_ikkyo',
    duration: 300,
  },
};

const date = new Date();
const dtstamp = convertDateString(date);

const sandboxTemplate = () => ({
  window: { TKTK: {} },
  s: (v) =>
    v.trim().replace(/&(lt|gt|amp|quot|#x27|#x60|#x2F|#x3D);/g, (m) => {
      return (
        {
          '&lt;': '<',
          '&gt;': '>',
          '&amp;': '&',
          '&quot;': '"',
          '&#x27;': "'",
          '&#x60;': '`',
          '&#x2F;': '/',
          '&#x3D;': '=',
        }[m] || m
      );
    }),
  d_s: (v) => v,
  n: (v) => Number(v),
  b: (v) => v === 'true',
});

function convertDateString(date) {
  const icsString = date
    .toISOString()
    .replace(/-/g, '')
    .replace(/:/g, '')
    .replace(/\.\d{3}Z$/, 'Z');

  return icsString;
}

export async function GET({ params, request }) {
  const target = targets[params.type];
  const response = await fetch(target.url);

  const $ = cheerio.load(await response.text());
  const scriptContent = $('#tktk-module').html();

  const sandbox = sandboxTemplate();
  const context = vm.createContext(sandbox);
  const script = new vm.Script(scriptContent);
  script.runInContext(context);

  const events = sandbox.window.TKTK[target.key];
  if (!Array.isArray(events)) {
    return [];
  }

  const programData = events
    .map((program) => ({
      title: program.title,
      start: new Date(program.startTime),
      url: new URL(program.watchUrl),
    }))
    .filter((program) => {
      return !program.title.includes('【ニコニコプレミアム会員限定】');
    })
    .map((program) => ({
      ...program,
      uid:
        program.url.pathname
          .split('/')
          .filter((s) => s)
          .pop() + '@koteiou',
      end: new Date(program.start.getTime() + target.duration * 60 * 1000),
    }));

  const calendarData = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:koteiou',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-COMMENT:I made this for my own use. No guarantees on how it works!',
  ];

  for (const e of programData) {
    calendarData.push(
      'BEGIN:VEVENT',
      `SUMMARY:${e.title}`,
      `DTSTART:${convertDateString(e.start)}`,
      `DTEND:${convertDateString(e.end)}`,
      `UID:${e.uid}`,
      `URL:${e.url}`,
      `DTSTAMP:${dtstamp}`,
      'END:VEVENT',
    );
  }

  calendarData.push('END:VCALENDAR');

  return new Response(calendarData.join('\r\n'), {
    headers: { 'Content-Type': 'text/calendar' },
  });
}

export function getStaticPaths() {
  return Object.keys(targets).map((type) => ({ params: { type } }));
}
