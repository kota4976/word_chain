async function serveStaticFile(req) {
  const url = new URL(req.url);
  let filePath;
  let contentType;

  switch (url.pathname) {
    case "/":
      filePath = "./public/index.html";
      contentType = "text/html; charset=utf-8";
      break;
    case "/style.css":
      filePath = "./public/style.css";
      contentType = "text/css; charset=utf-8";
      break;
    case "/script.js":
      filePath = "./public/script.js";
      contentType = "application/javascript; charset=utf-8";
      break;
    // 変更: scriptsディレクトリ内のファイル
    case "/scripts/utils.js":
      filePath = "./public/scripts/utils.js";
      contentType = "application/javascript; charset=utf-8";
      break;
    case "/scripts/gameLogic.js":
      filePath = "./public/scripts/gameLogic.js";
      contentType = "application/javascript; charset=utf-8";
      break;
    case "/scripts/domElements.js":
      filePath = "./public/scripts/domElements.js";
      contentType = "application/javascript; charset=utf-8";
      break;
    case "/scripts/eventListeners.js":
      filePath = "./public/scripts/eventListeners.js";
      contentType = "application/javascript; charset=utf-8";
      break;
    default:
      return new Response("File Not Found", { status: 404 });
  }

  try {
    const fileData = await Deno.readFile(filePath);
    return new Response(fileData, { headers: { "Content-Type": contentType } });
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
export default serveStaticFile;