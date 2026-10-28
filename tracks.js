/* MARK DB track list.
   HOW TO ADD A TRACK:
   1. Drop the mp3 into the music/ folder (e.g. music/acid-tool.mp3)
   2. Copy one line below, change title/type/src/year. type is 'track' or 'mix'.
   3. Optional: put artwork in covers/ and set cover:'covers/acid-tool.jpg'
   Later, when hosted on Cloudflare R2, just change src to the full URL,
   e.g. src:'https://your-bucket.r2.dev/acid-tool.mp3'
   (Or run make-tracklist.ps1 to rebuild this file from the music folder.)
   The two entries below are FAKE examples - replace them. */
window.TRACKS = [
  { title: 'Example Track (replace me)', type: 'track', src: 'music/example-track.mp3', year: 2026, cover: '' },
  { title: 'Example Mix (replace me)',   type: 'mix',   src: 'music/example-mix.mp3',   year: 2026 }
];
