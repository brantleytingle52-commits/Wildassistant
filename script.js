const ACCESS_HASH =
  "502fab203525731a5b8917c0af61dbf84df7fa0cfb1ad1524acac9b1d5841b59";


function el(id) {
  return document.getElementById(id);
}


async function sha256(text) {

  const bytes =
    new TextEncoder()
      .encode(text);

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      bytes
    );

  return Array
    .from(
      new Uint8Array(hash)
    )
    .map(
      byte =>
        byte
          .toString(16)
          .padStart(2, "0")
    )
    .join("");
}


/* EARLY ACCESS */

async function unlockDemo() {

  const code =
    el("accessCode")
      .value
      .trim();


  if (!code) {

    el("accessMessage")
      .textContent =
      "Enter your early access code.";

    return;
  }


  const hash =
    await sha256(code);


  if (hash === ACCESS_HASH) {

    el("accessMessage")
      .style.color =
      "#85f1a4";

    el("accessMessage")
      .textContent =
      "ACCESS GRANTED";


    sessionStorage.setItem(
      "wildDemoAccess",
      "true"
    );


    setTimeout(
      openDemo,
      500
    );

  }

  else {

    el("accessMessage")
      .style.color =
      "#ff799b";

    el("accessMessage")
      .textContent =
      "Incorrect early access code.";

  }

}


el("unlockButton")
  .addEventListener(
    "click",
    unlockDemo
  );


el("accessCode")
  .addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        unlockDemo();
      }

    }
  );


function openDemo() {

  el("maintenance")
    .style.display =
    "none";

  el("demoPage")
    .style.display =
    "flex";
}


function closeDemo() {

  el("demoPage")
    .style.display =
    "none";

  el("maintenance")
    .style.display =
    "flex";

  sessionStorage.removeItem(
    "wildDemoAccess"
  );
}


el("lockButton")
  .addEventListener(
    "click",
    closeDemo
  );


/* PUBLIC TRACKLIST */

const PUBLIC_TRACKLIST = `
WILD

01 — OUT THE CAGE
02 — TRACK 2
03 — TRACK 3
04 — TRACK 4
05 — TRACK 5
06 — TRACK 6
07 — TRACK 7

CD BONUS TRACK — LION
`;


/* WILD ASSISTANT */

function clean(text) {

  return text
    .toLowerCase()
    .replace(/[?!.,']/g, "")
    .trim();
}


function hiddenTrackQuestion(text) {

  return [
    "track 2",
    "track two",
    "track 3",
    "track three",
    "track 4",
    "track four",
    "track 5",
    "track five",
    "track 6",
    "track six",
    "track 7",
    "track seven",
    "hidden track",
    "secret track",
    "unrevealed track",
    "real track names",
    "real song names"
  ]
  .some(
    phrase =>
      text.includes(phrase)
  );
}


function getResponse(message) {

  const text =
    clean(message);


  if (
    text === "hi" ||
    text === "hello" ||
    text === "hey"
  ) {

    return (
      "Hey! Welcome to the WILD Assistant early access demo."
    );

  }


  if (
    text.includes("tracklist") ||
    text.includes("track list")
  ) {

    return PUBLIC_TRACKLIST;

  }


  if (
    hiddenTrackQuestion(text)
  ) {

    return (
      "That track hasn't been officially revealed yet."
    );

  }


  if (
    text.includes("documentary") ||
    text.includes("becoming wild")
  ) {

    return (
      "BECOMING WILD is the WILD documentary and is coming in 2027."
    );

  }


  if (
    text.includes("wild") &&
    (
      text.includes("when") ||
      text.includes("release") ||
      text.includes("drop")
    )
  ) {

    return (
      "WILD is coming in 2027."
    );

  }


  if (
    text.includes("out the cage")
  ) {

    return (
      "OUT THE CAGE is Track 1 from WILD."
    );

  }


  if (
    text.includes("lion")
  ) {

    return (
      "LION is the CD bonus track from WILD."
    );

  }


  return (
    "I don't have an official answer for that yet. More WILD information will be revealed later."
  );
}


/* CHAT */

function addMessage(
  text,
  sender
) {

  const message =
    document.createElement("div");

  message.className =
    "message " + sender;


  const wrap =
    document.createElement("div");

  wrap.className =
    "message-wrap";


  if (sender === "assistant") {

    const senderName =
      document.createElement("div");

    senderName.className =
      "sender";

    senderName.textContent =
      "WILD ASSISTANT";

    wrap.appendChild(
      senderName
    );
  }


  const bubble =
    document.createElement("div");

  bubble.className =
    "bubble";

  bubble.textContent =
    text;


  wrap.appendChild(bubble);

  message.appendChild(wrap);

  el("messages")
    .appendChild(message);


  el("messages").scrollTop =
    el("messages").scrollHeight;
}


function sendMessage() {

  const input =
    el("messageInput");

  const text =
    input.value.trim();

  if (!text) return;


  addMessage(
    text,
    "user"
  );


  input.value = "";


  setTimeout(
    () => {

      addMessage(
        getResponse(text),
        "assistant"
      );

    },
    400
  );
}


el("sendButton")
  .addEventListener(
    "click",
    sendMessage
  );


el("messageInput")
  .addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        sendMessage();
      }

    }
  );


/* KEEP ACCESS DURING REFRESH */

if (
  sessionStorage.getItem(
    "wildDemoAccess"
  ) === "true"
) {

  openDemo();
}