const tracks = [
  {
    title: "MACHINA",
    caption: "saint nothing / selected transmission",
    soundcloudPage: "https://soundcloud.com/saint0nothing/machina",
    youtube: "",
    embed: `<iframe
      width="100%"
      height="166"
      scrolling="no"
      frameborder="no"
      allow="autoplay"
      src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2209533290&color=%232f5cff&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false&show_playcount=false&show_artwork=true&sharing=false&download=false&buying=false">
    </iframe>`
  },
  {
    title: "CRIMINAL",
    caption: "saint nothing / archive entry",
    soundcloudPage: "https://soundcloud.com/your-link-here",
    youtube: "",
    embed: `PASTE_SOUND_CLOUD_IFRAME_HERE`
  },
  {
    title: "OPEN CASKET",
    caption: "saint nothing / archive entry",
    soundcloudPage: "https://soundcloud.com/your-link-here",
    youtube: "",
    embed: `PASTE_SOUND_CLOUD_IFRAME_HERE`
  }
];

const titleEl = document.getElementById("track-title");
const captionEl = document.getElementById("track-caption");
const playerEl = document.getElementById("track-player");
const soundcloudLinkEl = document.getElementById("soundcloud-link");
const youtubeLinkEl = document.getElementById("youtube-link");
const trackRows = document.querySelectorAll(".track-row");

function selectTrack(index) {
  const track = tracks[index];
  if (!track) return;

  titleEl.textContent = track.title;
  captionEl.textContent = track.caption;
  playerEl.innerHTML = track.embed;
  soundcloudLinkEl.href = track.soundcloudPage;

  if (track.youtube && track.youtube.trim() !== "") {
    youtubeLinkEl.href = track.youtube;
    youtubeLinkEl.style.display = "inline-flex";
  } else {
    youtubeLinkEl.style.display = "none";
  }

  trackRows.forEach((row, i) => {
    row.classList.toggle("active", i === index);
  });
}

trackRows.forEach((row) => {
  row.addEventListener("click", () => {
    const index = Number(row.dataset.track);
    selectTrack(index);
  });
});

selectTrack(0);