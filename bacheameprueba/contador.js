// Bacheame · contador de descargas de la Beta.
// Suma 1 en Firestore (stats/public.downloads) cada vez que alguien toca un
// enlace al APK. Las reglas solo permiten sumar de a 1. No guarda datos
// personales. © 2026 Blas Ojeda Chamorro. Todos los derechos reservados.
(() => {
  const PROJECT = "bacheame-a9da6";
  const API_KEY = "AIzaSyCHhgw-huQHpYUC1FBPSLAp1OcX36jP2X0"; // clave pública web
  const URL = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents:commit?key=${API_KEY}`;
  const DOC = `projects/${PROJECT}/databases/(default)/documents/stats/public`;

  function countDownload() {
    const body = JSON.stringify({
      writes: [{
        transform: {
          document: DOC,
          fieldTransforms: [{ fieldPath: "downloads", increment: { integerValue: "1" } }],
        },
      }],
    });
    try {
      // keepalive: el aviso sale aunque el navegador cambie de página.
      fetch(URL, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true })
        .catch(() => {});
    } catch (_) {}
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest && e.target.closest('a[href*="Bacheame-Beta-"][href$=".apk"]');
    if (a) countDownload();
  });
})();
