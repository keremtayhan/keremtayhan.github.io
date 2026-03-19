const tracks = [
  {
    title: "MACHINA",
    caption: "saint nothing / selected transmission",
    soundcloudPage: "https://soundcloud.com/saint0nothing/machina",
    youtube: "https://www.youtube.com/watch?v=1enq-76VskI",
    embed: `<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2209533290&color=%236984c9&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/saint0nothing" title="Saint Nothing" target="_blank" style="color: #cccccc; text-decoration: none;">Saint Nothing</a> · <a href="https://soundcloud.com/saint0nothing/machina" title="machina" target="_blank" style="color: #cccccc; text-decoration: none;">machina</a></div>`
  },
  {
    title: "trotting better",
    caption: "saint nothing / archive entry",
    soundcloudPage: "https://soundcloud.com/saint0nothing/trotting-better?si=4b6f910ead6048d1be2f1e868ce2bf50&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
    youtube: "",
    embed: `<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2200990379&color=%236984c9&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/saint0nothing" title="Saint Nothing" target="_blank" style="color: #cccccc; text-decoration: none;">Saint Nothing</a> · <a href="https://soundcloud.com/saint0nothing/trotting-better" title="trotting better" target="_blank" style="color: #cccccc; text-decoration: none;">trotting better</a></div>`
  },
  {
    title: "Saint Valentine",
    caption: "saint nothing / archive entry",
    soundcloudPage: "https://soundcloud.com/saint0nothing/saint-valentine?si=e3e4564d18884934b38315e3fb68d623&utm_source=clipboard&utm_medium=text&utm_campaign=social_sharing",
    youtube: "https://www.youtube.com/watch?v=NdL5xrUGPbY",
    embed: `<iframe width="100%" height="300" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/soundcloud%253Atracks%253A2162793312&color=%236984c9&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif;font-weight: 100;"><a href="https://soundcloud.com/saint0nothing" title="Saint Nothing" target="_blank" style="color: #cccccc; text-decoration: none;">Saint Nothing</a> · <a href="https://soundcloud.com/saint0nothing/saint-valentine" title="Saint Valentine" target="_blank" style="color: #cccccc; text-decoration: none;">Saint Valentine</a></div>`
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