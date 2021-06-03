'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "f59e2dd9b23dc21a7b4a2e42911359a2",
"assets/assets/DKB_CV.pdf": "efc1b8be175f68fd194a673c77847691",
"assets/assets/fonts/MySocialIcons.ttf": "345787fe6cbe5bf827f3a84436278f6f",
"assets/assets/fonts/Ubuntu-Bold.ttf": "e00e2a77dd88a8fe75573a5d993af76a",
"assets/assets/fonts/Ubuntu-Medium.ttf": "8e22c2a6e3a3c679787e763a97fa11f7",
"assets/assets/fonts/Ubuntu-Regular.ttf": "2505bfbd9bde14a7829cc8c242a0d25c",
"assets/assets/images/man.png": "6459a78b8d655079c08d4249cbcc0db5",
"assets/assets/images/me.png": "7dfda56bc933da3fa9b9aba4e009dbf4",
"assets/FontManifest.json": "927f2f13a2d04e1dbe1ab15efbdb72fa",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "777ff1946a251562f1b47e4166beda6a",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "b14fcf3ee94e3ace300b192e9e7c8c5d",
"icons/android-icon-144x144.png": "ec88ab5519fde92087b65e748cfb4d82",
"icons/android-icon-192x192.png": "1b3d9c638d2b69cd2bc633f741081d30",
"icons/android-icon-36x36.png": "caccf32a501251bdf5bebb7998d527c2",
"icons/android-icon-48x48.png": "f18c33e4c3a799669f6ac2cf33bef08c",
"icons/android-icon-72x72.png": "7fb21e803e547da87be10f97ba01225c",
"icons/android-icon-96x96.png": "1e68441d7d9eb63d86e044c53ecb04dd",
"icons/apple-icon-114x114.png": "5b6c90e3d1acc36e84c653aec2dd8375",
"icons/apple-icon-120x120.png": "b633d292679a4ae2ed917c8d2f5c3c73",
"icons/apple-icon-144x144.png": "ec88ab5519fde92087b65e748cfb4d82",
"icons/apple-icon-152x152.png": "e8e86d4edac553396c52653a570a21ee",
"icons/apple-icon-180x180.png": "dd3467610b6df93f81361c42c84e270e",
"icons/apple-icon-57x57.png": "057152b250a42ef4cf73114b712e2f2d",
"icons/apple-icon-60x60.png": "f54f086dcb1d0052c28085ed88d21543",
"icons/apple-icon-72x72.png": "7fb21e803e547da87be10f97ba01225c",
"icons/apple-icon-76x76.png": "481fa987d0fc00d945f4ee73e7de918e",
"icons/apple-icon-precomposed.png": "10cb952863c2195fcc78866b93ae00bf",
"icons/apple-icon.png": "10cb952863c2195fcc78866b93ae00bf",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/favicon-16x16.png": "65e5160152399045e74fe019aeb9dacb",
"icons/favicon-32x32.png": "bc6d1a8d25a3feb07df6d79a9dccb603",
"icons/favicon-96x96.png": "1e68441d7d9eb63d86e044c53ecb04dd",
"icons/favicon.ico": "f000b3b4540a5a72709c634e30be3619",
"icons/ms-icon-144x144.png": "ec88ab5519fde92087b65e748cfb4d82",
"icons/ms-icon-150x150.png": "a398f9f0efacd1045c6ea02474906396",
"icons/ms-icon-310x310.png": "76060656faeec82476359663738925aa",
"icons/ms-icon-70x70.png": "9c0305e2515b3ed47287368ffa7037c2",
"index.html": "bdc6ccdebc0bd3b9c0a8b315c53ca7d4",
"/": "bdc6ccdebc0bd3b9c0a8b315c53ca7d4",
"main.dart.js": "59fcd2ad9abe093e6e4a3858afbc2f5f",
"manifest.json": "0a3804d022d0d12bea031c64719fbbd5",
"version.json": "ae6ec7e100fa218a70c1a7006c2c1b64"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
