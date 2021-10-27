let player;
let trv;

/* --- youtube player */

/* load youtube js api */
!(function () {
  const script = document.createElement('script');
  script.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(script);
})();

/* this function is called automatically when the iframe_api is ready */
function onYouTubeIframeAPIReady () {
  player = new YT.Player("player", {
    videoId: "N_ATbQLVQjE",
    playerVars: {
      loop: 1,
      autoplay: 1,
      playsinline: 1,
      enablejsapi: 1,
    },
    events: {
      onReady: function () {
        document.getElementById("videoStatus").innerHTML = "LOADED";
        player.setVolume(0);
        player.setLoop(true);
        player.seekTo(6);
        player.playVideo();
      },
    },
  });
}

/* --- trance vibrator */

async function sendTrv (value) {
  if (trv) {
    await trv.controlTransferOut({
      requestType: "vendor",
      recipient: "interface",
      request: 1,
      value: value,
      index: 0,
    });
  }
  navigator.vibrate(value > 128 ? 50 : 0);
}

async function connectTrv () {
  if (!navigator.usb) {
    alert("WebUSB unsupported in your browser");
    return;
  }
  trv = await navigator.usb.requestDevice({
    filters: [
      { vendorId: 0x0b49, productId: 0x064f },
    ],
  });
  await trv.open();
  await trv.selectConfiguration(1);
  await trv.claimInterface(0);
  await sendTrv(128);
  setTimeout(function () { sendTrv(0); }, 250);
  document.getElementById("trvStatus").innerHTML = "CONNECTED";
}

/* --- built-in vibrator  */

let vibEnabled = false;

function enableVib () {
  if (!navigator.vibrate) {
    alert("Vibration API unsupported in your browser");
    return;
  }
  vibEnabled = true;
  navigator.vibrate(250);
  document.getElementById("vibStatus").innerHTML = "ENABLED";
}

let vibratingState = false;
function sendVib (value) {
  const newVibratingState = value > 128 ? true : false;
  if (vibEnabled && vibratingState != newVibratingState) {
    navigator.vibrate(newVibratingState ? 1000 : 0);
    vibratingState = newVibratingState;
  }
}

/* --- songs */

function withBPM (bpm, arr) {
  return (time) => arr[Math.floor(time * bpm * 4 / 60)] || 0;
}

const track1 = withBPM(140, [
  /* base kick pattern: 0xff 0xbf 0x7f 0x3f */
  /* 1                    2                       3                       4                   */
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x80, 0x88, 0x90, 0x98, 0xa0, 0xa8, 0xb0, 0xb8, 0xc0, 0xc8, 0xd0, 0xd8, 0xe0, 0xe8, 0xf0, 0xf8,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0xff,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0xff, 0xff, 0xbf, 0xff, 0xbf, 0xff, 0xff, 0xff, 0xff,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xbf, 0x7f, 0x3f, 0x00, 0x7f, 0x3f, 0x00, 0x00,
]);

const track2 = withBPM(142, [
  /* base kick pattern: 0xff 0xbf 0x7f */
  /* 1                    2                       3                       4                   */
  0x7f, 0x3f, 0x0f, 0x00, 0xbf, 0x7f, 0x3f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00,
  0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00,
  0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00,
  0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00,
  0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00,
  0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00,
  0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00,
  0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00,
  0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00, 0xff, 0xbf, 0x7f, 0x00,
  0xbf, 0x7f, 0x3f, 0x00, 0x7f, 0x3f, 0x00, 0x00,
]);

const track3 = withBPM(138, [
  /* base kick pattern: 0xff */
  /* 1                    2                       3                       4                   */
  0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00,
  0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0xbf, 0xff, 0x00, 0xbf, 0x00,
  0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00,
  0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0xbf, 0xff, 0x00, 0xbf, 0x00,
  0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00,
  0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0xbf, 0xff, 0x00, 0xbf, 0x00,
  0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00,
  0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0x00, 0xff, 0x00, 0x00, 0xbf, 0xff, 0x00, 0xbf, 0x00,
]);

const track4 = withBPM(140, [
  /* base kick pattern: 0xff 0xbf 0x7f 0x3f */
  /* 1                    2                       3                       4                   */
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0x7f, 0xff, 0x7f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0x7f, 0xff, 0x7f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f, 0xff, 0xbf, 0x7f, 0x3f,
  0xff, 0x7f, 0xff, 0x7f, 0x3f, 0x00, 0x00, 0x00,
]);

const track5 = withBPM(90, [
  /* intro */
  /* 1                    2                       3                       4                   */
  0xff, 0xff, 0xaf, 0xaf, 0x9f, 0x9f, 0x9f, 0x9f, 0x8f, 0x8f, 0x8f, 0x8f, 0x7f, 0x7f, 0x7f, 0x7f,
  0x6f, 0x6f, 0x6f, 0x6f, 0x5f, 0x5f, 0x5f, 0x5f, 0x4f, 0x4f, 0x4f, 0x4f, 0x3f, 0x3f, 0x3f, 0x3f,
  0xaf, 0xaf, 0xaf, 0xaf, 0x9f, 0x9f, 0x9f, 0x9f, 0x8f, 0x8f, 0x8f, 0x8f, 0x7f, 0x7f, 0x7f, 0x7f,
  0x6f, 0x6f, 0x6f, 0x6f, 0x5f, 0x5f, 0x5f, 0x5f, 0x4f, 0x4f, 0x4f, 0x4f, 0x3f, 0x3f, 0x3f, 0x3f,
  0xaf, 0xaf, 0xaf, 0xaf, 0x9f, 0x9f, 0x9f, 0x9f, 0x8f, 0x8f, 0x8f, 0x8f, 0x7f, 0x7f, 0x7f, 0x7f,
  0x6f, 0x6f, 0x6f, 0x6f, 0x5f, 0x5f, 0x5f, 0x5f, 0x4f, 0x4f, 0x4f, 0x4f, 0x3f, 0x3f, 0x3f, 0x3f,
  0xaf, 0xaf, 0xaf, 0xaf, 0x9f, 0x9f, 0x9f, 0x9f, 0x8f, 0x8f, 0x8f, 0x8f, 0x7f, 0x7f, 0x7f, 0x7f,
  0x9f, 0x00, 0x9f, 0x00, 0x5f, 0x6f, 0x7f, 0x8f, 0x9f, 0x6f, 0x00, 0x00, 0x9f, 0x6f, 0x00, 0x00,
  /* base kick pattern: 0xff 0xbf 0x7f */
  /* 1                    2                       3                       4                   */
  0x9f, 0x6f, 0x9f, 0x6f, 0xff, 0xbf, 0x7f, 0x00, 0x9f, 0x6f, 0x00, 0x9f, 0xff, 0xbf, 0x7f, 0x6f,
  0x9f, 0x6f, 0x9f, 0x6f, 0xff, 0xbf, 0x7f, 0x00, 0x9f, 0x6f, 0x00, 0x9f, 0xff, 0xbf, 0x7f, 0x6f,
  0x9f, 0x6f, 0x9f, 0x6f, 0xff, 0xbf, 0x7f, 0x00, 0x9f, 0x6f, 0x00, 0x9f, 0xff, 0xbf, 0x7f, 0x6f,
  0x9f, 0x6f, 0x9f, 0x6f, 0xff, 0xbf, 0x7f, 0x8f, 0x9f, 0x8f, 0x70, 0x6f, 0xff, 0xbf, 0x7f, 0x6f,
  0x9f, 0x6f, 0x9f, 0x6f, 0xff, 0xbf, 0x7f, 0x00, 0x9f, 0x6f, 0x00, 0x9f, 0x6f, 0x00, 0x00, 0x6f,
  0x9f, 0x6f, 0x9f, 0x6f, 0xff, 0xbf, 0x7f, 0x00, 0x9f, 0x6f, 0x00, 0x9f, 0xff, 0xbf, 0x7f, 0x6f,
  0x9f, 0x6f, 0x9f, 0x6f, 0xff, 0xbf, 0x7f, 0x00, 0x9f, 0x6f, 0x00, 0x9f, 0xbf, 0x7f, 0x3f, 0x6f,
]);

function vibrationValue (time) {
  return track1(time -  0.30) +
         track2(time - 22.35) +
         track3(time - 38.40) +
         track4(time - 52.30) +
         track5(time - 73.80);
}

/* --- entrypoint */

const timeEl = document.getElementById("time");
const vibrationEl = document.getElementById("vibration");
function monitorPlayerStatus () {
  switch (player.getPlayerState()) {
    case 1:
      const time = player.getCurrentTime();
      const value = vibrationValue(time);
      sendTrv(value);
      sendVib(value);
      timeEl.innerHTML = time;
      vibrationEl.innerHTML = value;
      break;
    default:
      sendTrv(0);
      sendVib(0);
      timeEl.innerHTML = "(paused)";
      vibrationEl.innerHTML = "(paused)";
  }
}

function play () {
  if (!player) {
    alert("Video is not loaded. Please reload this page if it does not load.");
    return;
  }
  player.seekTo(0);
  player.unMute();
  player.setVolume(100);
  player.setPlaybackRate(1);
  setInterval(monitorPlayerStatus, 60);
  document.getElementById("setup").remove();
  document.getElementById("control").style.display = "block";
}
