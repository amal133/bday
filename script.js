const openButton = document.querySelector("#open-button");
const welcome = document.querySelector("#welcome");
const birthday = document.querySelector("#birthday");
const micButton = document.querySelector("#mic-button");
const tapButton = document.querySelector("#tap-button");
const prompt = document.querySelector("#prompt");
const blowActions = document.querySelector("#blow-actions");
const micNote = document.querySelector("#mic-note");
const wishLetter = document.querySelector("#wish-letter");
const flameScene = document.querySelector("#night-scene");
const secretCount = document.querySelector("#secret-count");
const notePop = document.querySelector("#note-pop");
const giftButton = document.querySelector("#gift-button");
const giftNote = document.querySelector("#gift-note");

let candleOut = false;
let stream;
let audioContext;
let frame;
const foundNotes = new Set();

// A few quiet stars make the welcome feel alive without distracting from the message.
const starField = document.querySelector("#starscape");
for (let i = 0; i < 95; i++) {
  const star = document.createElement("i");
  star.className = "tiny-star";
  star.style.left = `${Math.random() * 100}%`;
  star.style.top = `${Math.random() * 100}%`;
  star.style.setProperty("--duration", `${1.8 + Math.random() * 3.8}s`);
  star.style.animationDelay = `${Math.random() * 4}s`;
  starField.append(star);
}

openButton.addEventListener("click", () => {
  welcome.hidden = true;
  birthday.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll(".secret-star").forEach((star, index) => {
  star.addEventListener("click", () => {
    foundNotes.add(index);
    star.classList.add("found");
    notePop.textContent = star.dataset.note;
    notePop.hidden = false;
    secretCount.textContent = foundNotes.size === 3
      ? "All three little notes found — your birthday luck is officially activated ✧"
      : `${3 - foundNotes.size} little ${foundNotes.size === 2 ? "star is" : "stars are"} still hiding in the night`;
    window.clearTimeout(notePop.hideTimer);
    notePop.hideTimer = window.setTimeout(() => { notePop.hidden = true; }, 5200);
  });
});

function finishBirthday() {
  if (candleOut) return;
  candleOut = true;
  if (frame) cancelAnimationFrame(frame);
  if (stream) stream.getTracks().forEach(track => track.stop());
  if (audioContext && audioContext.state !== "closed") audioContext.close();
  flameScene.classList.add("blown");
  prompt.textContent = "And now, your birthday wish.";
  blowActions.hidden = true;
  micNote.hidden = true;
  wishLetter.hidden = false;
  sprinkleConfetti();
}

function sprinkleConfetti() {
  const colors = ["#e6a4b5", "#e5c58f", "#cdb7dc", "#f2c0a5", "#c5c9d8"];
  for (let i = 0; i < 64; i++) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty("--drift", `${(Math.random() - 0.5) * 190}px`);
    piece.style.animationDelay = `${Math.random() * .8}s`;
    piece.style.borderRadius = Math.random() > .5 ? "50%" : "1px";
    document.body.append(piece);
    window.setTimeout(() => piece.remove(), 3900);
  }
}

tapButton.addEventListener("click", finishBirthday);

micButton.addEventListener("click", async () => {
  if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
    micNote.textContent = "Microphone blowing isn't available here. Use the tap option to make your wish.";
    return;
  }
  micButton.disabled = true;
  micButton.querySelector("span:first-child").textContent = "Listening… blow gently";
  micNote.textContent = "Allow microphone access, then blow toward your device.";
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512;
    source.connect(analyser);
    const samples = new Uint8Array(analyser.fftSize);
    let loudSince = 0;
    const listen = () => {
      if (candleOut) return;
      analyser.getByteTimeDomainData(samples);
      let sum = 0;
      for (const sample of samples) {
        const value = (sample - 128) / 128;
        sum += value * value;
      }
      const volume = Math.sqrt(sum / samples.length);
      if (volume > .17) {
        if (!loudSince) loudSince = Date.now();
        if (Date.now() - loudSince > 320) return finishBirthday();
      } else loudSince = 0;
      frame = requestAnimationFrame(listen);
    };
    listen();
  } catch {
    micButton.disabled = false;
    micButton.querySelector("span:first-child").textContent = "Try microphone again";
    micNote.textContent = "Couldn't start the microphone. You can still tap to blow out the candle.";
  }
});

giftButton.addEventListener("click", () => {
  const opening = giftNote.hidden;
  giftNote.hidden = !opening;
  giftButton.setAttribute("aria-expanded", String(opening));
  giftButton.innerHTML = opening
    ? 'Tuck this note away <span aria-hidden="true">−</span>'
    : 'There’s one more little thing <span aria-hidden="true">＋</span>';
});
