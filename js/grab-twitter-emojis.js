"use strict";
const fs = require('fs');
const https = require('https');

const outdir = __dirname + '/svg';


function DownloadSVG(codepoint) {
  return new Promise((resolve, reject) => {
    let cpstr = codepoint.toString(16).toLowerCase();
    let filename = `${cpstr}.svg`;
    let filepath = outdir + '/' + filename;

    try {
      let st = fs.statSync(filepath);
      if (st.size > 0) {
        console.error(`${cpstr} already downloaded (skipped)`);
        resolve(filepath);
        return;
      }
    } catch (_) {}

    https.get(`https://abs.twimg.com/emoji/v2/svg/${filename}`, (res) => {
      if (res.statusCode !== 200) {
        if (res.statusCode === 404) {
          console.error(`${cpstr} not found (skipped)`);
          resolve();
        } else {
          console.error(`${cpstr} failed with status ${res.statusCode}`);
          reject(new Error('http ' + res.statusCode));
        }
        return;
      }
      
      let outs = fs.createWriteStream(filepath, {
        flags: 'w',
        defaultEncoding: 'utf8',
      });

      res.on('data', chunk => {
        outs.write(chunk);
      });

      res.on('end', () => {
        outs.end();
        resolve(filepath);
        console.log(`${cpstr} written to ${filename}`)
      });

    }).on('error', (err) => {
      reject(err);
    });
  });
}


// Unicode 4.0 Emojis from http://unicode.org/Public/emoji/4.0/emoji-data.txt
const codepoints = [
   0x23,0x2a,0x30,0x39,0xa9,0xae,0x203c,0x2049,0x2122,0x2139,0x2194,0x2199,0x21a9,
   0x21aa,0x231a,0x231b,0x2328,0x23cf,0x23e9,0x23f3,0x23f8,0x23fa,0x24c2,0x25aa,
   0x25ab,0x25b6,0x25c0,0x25fb,0x25fe,0x2600,0x2604,0x260e,0x2611,0x2614,0x2615,
   0x2618,0x261d,0x2620,0x2622,0x2623,0x2626,0x262a,0x262e,0x262f,0x2638,0x263a,
   0x2640,0x2642,0x2648,0x2653,0x2660,0x2663,0x2665,0x2666,0x2668,0x267b,0x267f,
   0x2692,0x2697,0x2699,0x269b,0x269c,0x26a0,0x26a1,0x26aa,0x26ab,0x26b0,0x26b1,
   0x26bd,0x26be,0x26c4,0x26c5,0x26c8,0x26ce,0x26cf,0x26d1,0x26d3,0x26d4,0x26e9,
   0x26ea,0x26f0,0x26f5,0x26f7,0x26fa,0x26fd,0x2702,0x2705,0x2708,0x2709,0x270a,
   0x270b,0x270c,0x270d,0x270f,0x2712,0x2714,0x2716,0x271d,0x2721,0x2728,0x2733,
   0x2734,0x2744,0x2747,0x274c,0x274e,0x2753,0x2755,0x2757,0x2763,0x2764,0x2795,
   0x2797,0x27a1,0x27b0,0x27bf,0x2934,0x2935,0x2b05,0x2b07,0x2b1b,0x2b1c,0x2b50,
   0x2b55,0x3030,0x303d,0x3297,0x3299,0x1f004,0x1f0cf,0x1f170,0x1f171,0x1f17e,
   0x1f17f,0x1f18e,0x1f191,0x1f19a,0x1f1e6,0x1f1ff,0x1f201,0x1f202,0x1f21a,
   0x1f22f,0x1f232,0x1f23a,0x1f250,0x1f251,0x1f300,0x1f320,0x1f321,0x1f324,
   0x1f32c,0x1f32d,0x1f32f,0x1f330,0x1f335,0x1f336,0x1f337,0x1f37c,0x1f37d,
   0x1f37e,0x1f37f,0x1f380,0x1f393,0x1f396,0x1f397,0x1f399,0x1f39b,0x1f39e,
   0x1f39f,0x1f3a0,0x1f3c4,0x1f3c5,0x1f3c6,0x1f3ca,0x1f3cb,0x1f3ce,0x1f3cf,
   0x1f3d3,0x1f3d4,0x1f3df,0x1f3e0,0x1f3f0,0x1f3f3,0x1f3f5,0x1f3f7,0x1f3f8,
   0x1f3ff,0x1f400,0x1f43e,0x1f43f,0x1f440,0x1f441,0x1f442,0x1f4f7,0x1f4f8,
   0x1f4f9,0x1f4fc,0x1f4fd,0x1f4ff,0x1f500,0x1f53d,0x1f549,0x1f54a,0x1f54b,
   0x1f54e,0x1f550,0x1f567,0x1f56f,0x1f570,0x1f573,0x1f579,0x1f57a,0x1f587,
   0x1f58a,0x1f58d,0x1f590,0x1f595,0x1f596,0x1f5a4,0x1f5a5,0x1f5a8,0x1f5b1,
   0x1f5b2,0x1f5bc,0x1f5c2,0x1f5c4,0x1f5d1,0x1f5d3,0x1f5dc,0x1f5de,0x1f5e1,
   0x1f5e3,0x1f5e8,0x1f5ef,0x1f5f3,0x1f5fa,0x1f5fb,0x1f5ff,0x1f600,0x1f601,
   0x1f610,0x1f611,0x1f612,0x1f614,0x1f615,0x1f616,0x1f617,0x1f618,0x1f619,
   0x1f61a,0x1f61b,0x1f61c,0x1f61e,0x1f61f,0x1f620,0x1f625,0x1f626,0x1f627,
   0x1f628,0x1f62b,0x1f62c,0x1f62d,0x1f62e,0x1f62f,0x1f630,0x1f633,0x1f634,
   0x1f635,0x1f640,0x1f641,0x1f642,0x1f643,0x1f644,0x1f645,0x1f64f,0x1f680,
   0x1f6c5,0x1f6cb,0x1f6cf,0x1f6d0,0x1f6d1,0x1f6d2,0x1f6e0,0x1f6e5,0x1f6e9,
   0x1f6eb,0x1f6ec,0x1f6f0,0x1f6f3,0x1f6f4,0x1f6f6,0x1f910,0x1f918,0x1f919,
   0x1f91e,0x1f920,0x1f927,0x1f930,0x1f933,0x1f93a,0x1f93c,0x1f93e,0x1f940,
   0x1f945,0x1f947,0x1f94b,0x1f950,0x1f95e,0x1f980,0x1f984,0x1f985,0x1f991,
   0x1f9c0
];

function main() {
  try { fs.mkdirSync(outdir); } catch (_) {}

  const MaxConcurrency = 16;
  let concurrency = 0;
  let index = 0;

  function DownloadMore() {
    if (concurrency < MaxConcurrency) {
      ++concurrency;
      let cp = codepoints[++index];
      if (cp === undefined) {
        // done
        return;
      }
      DownloadSVG(cp).then(() => {
        --concurrency;
        DownloadMore();
      }).catch(err => {
        console.error(err.stack || String(err));
        --concurrency;
        DownloadMore();
      });
    }
  }

  DownloadMore();
}

main();