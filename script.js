/*
  Place your audio files in a folder named "sounds" next to index.html.
  Expected filenames (lowercase, .mp3):
    big_crash.mp3
    small_crash.mp3
    splash.mp3
    ride.mp3
    bell.mp3
    close_hh.mp3
    open_hh.mp3
    tom_small.mp3
    tom_medium.mp3
    tom_large.mp3
    snare.mp3
    kick.mp3
    floor.mp3
*/

(() => {

  // map data-key to sound name
  const keyToSound = {
    Q:"big_crash", W:"small_crash",
    E:"splash", R:"splash",
    T:"big_crash", Y:"small_crash",
    U:"ride", I:"ride",
    O:"bell", P:"kick",

    A:"tom_small", S:"tom_small",
    D:"tom_medium", F:"tom_medium",
    G:"tom_large", H:"tom_large",
    J:"floor", K:"floor",
    L:"kick",

    Z:"open_hh", X:"close_hh",
    C:"kick", V:"snare",
    B:"snare", N:"kick",
    M:"close_hh",
    "<":"open_hh", ">":"open_hh",

    SPACE:"kick"
  };

  // preload unique sounds
  const audioBank = {};
  Object.values(keyToSound).forEach(sound => {
    if (!audioBank[sound]) {
      const a = new Audio(`sounds/${sound}.mp3`);
      a.preload = "auto";
      audioBank[sound] = a;
    }
  });

  // play by cloning (allows overlap)
  function playSound(name) {
    if (!name || !audioBank[name]) return;
    const a = audioBank[name].cloneNode();
    a.currentTime = 0;
    a.play().catch(()=>{ /* play may be blocked until user gesture */ });
  }

  // small UI activations
  function activate(el) {
    if (!el) return;
    el.classList.add("active");
    setTimeout(() => el.classList.remove("active"), 140);
  }

  // Click keyboard boxes
  document.querySelectorAll(".key, .space-key").forEach(el => {
    el.addEventListener("click", () => {
      const k = el.dataset.key;
      const sound = keyToSound[k];
      playSound(sound);
      activate(el);

      // highlight hotspots with same data-key
      const hs = document.querySelectorAll(`.drum-btn[data-key="${k}"]`);
      hs.forEach(h => activate(h));
    });
  });

  // Click hero hotspots
  document.querySelectorAll(".drum-btn").forEach(h => {
    h.addEventListener("click", (ev) => {
      ev.preventDefault();
      const k = h.dataset.key;
      const s = h.dataset.sound || keyToSound[k];
      playSound(s);
      activate(h);

      // highlight keyboard box if present
      const kb = document.querySelector(`.key[data-key="${k}"], .space-key[data-key="${k}"]`);
      if (kb) activate(kb);
    });
  });

  // Keyboard press handling: robust handling for space, comma/period mapping
  document.addEventListener("keydown", (e) => {
    let key = e.key; // 'a', 'A', ' ', ',', '.'

    // normalize
    if (key === " ") key = "SPACE";
    if (key === ",") key = "<";
    if (key === ".") key = ">";

    if (key.length === 1) key = key.toUpperCase();

    // find sound
    const sound = keyToSound[key];
    if (!sound) return;

    // prevent space scrolling
    if (key === "SPACE") e.preventDefault();

    playSound(sound);

    // activate matching keyboard box
    const kb = document.querySelector(`.key[data-key="${key}"], .space-key[data-key="${key}"]`);
    if (kb) activate(kb);

    // activate hotspot(s)
    document.querySelectorAll(`.drum-btn[data-key="${key}"]`).forEach(h => activate(h));
  });

  // make hero image non-draggable
  document.querySelectorAll('.kit').forEach(i => i.setAttribute('draggable','false'));

})();
