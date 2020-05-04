const chicagoCrime = "dev-chiCrime-site-v3"
const assets = [
  "./",
  "./index.html",
  "./css/format.css",
  "./js/info.js",
  "./favicon.ico",
  "https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.css",
  "https://unpkg.com/material-components-web@v4.0.0/dist/material-components-web.min.js",
  "https://fonts.googleapis.com/icon?family=Material+Icons",
  "https://unpkg.com/dexie@latest/dist/dexie.js"
]

self.addEventListener("install", installEvent => {
  installEvent.waitUntil(
    caches.open(chicagoCrime).then(cache => {
      cache.addAll(assets)
    })
  )
})

self.addEventListener("fetch", fetchEvent => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then(res => {
      return res || fetch(fetchEvent.request)
    })
  )
})