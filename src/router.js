// src/router.js

import serveStaticFile from "./fileHandler.js";
import checkWordHandler from "./wordChecker.js";

async function router(req) {
  const url = new URL(req.url);
  const pathname = url.pathname;
  console.log(`Routing request for: ${pathname}`);

  switch (pathname) {
    case "/check-word":
      return await checkWordHandler(req); // Pythonサーバーへのプロキシ処理
    case "/":
    case "/style.css":
    case "/script.js":
    case "/scripts/utils.js":
    case "/scripts/gameLogic.js":
    case "/scripts/domElements.js":
    case "/scripts/eventListeners.js":
      return await serveStaticFile(req);
    default:
      return new Response("404 Not Found", { status: 404 });
  }
}
export default router;