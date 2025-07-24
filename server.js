import router from "./src/router.js";
import { spawn } from "node:child_process"; // Node.jsのchild_processをインポート (Denoでは 'node:child_process' が使える)
import { checkPythonServerHealth } from "./src/pythonServerManager.js"; // 新規作成するマネージャーをインポート

const PORT = 8000;
const PYTHON_PORT = 5000; // Pythonサーバーがリッスンするポート

let pythonProcess;

// Pythonサーバーを起動する関数
async function startPythonServer() {
  console.log("Starting Python MeCab server...");
  pythonProcess = Deno.run({
    cmd: ["python3", "mecabServer.py"],
    // stdout: "inherit", // Pythonプロセスの標準出力をDenoのコンソールに出力
    // stderr: "inherit", // Pythonプロセスの標準エラーをDenoのコンソールに出力
    env: {
      "PYTHONUNBUFFERED": "1" // Pythonの出力をバッファリングしないように設定
    },
    // バックグラウンドで実行し、親プロセス終了時に自動的に終了させる
    // detached: true // Node.jsのchild_process.spawnオプションだが、Deno.runにはない概念
  });

  // Pythonサーバーが起動するまで待機
  await checkPythonServerHealth(PYTHON_PORT);
  console.log(`Python MeCab server is running on port ${PYTHON_PORT}`);
}

// サーバー起動とPythonプロセス起動
Deno.serve({ port: PORT }, async (req) => {
  if (!pythonProcess) {
    // サーバー起動時に一度だけPythonプロセスを起動
    await startPythonServer();
  }
  return router(req);
});

console.log(`サーバーが起動しました。 http://localhost:${PORT}/ でアクセスしてください。`);

// Denoプロセス終了時にPythonプロセスも終了させる
globalThis.addEventListener("unload", () => {
  if (pythonProcess) {
    console.log("Terminating Python MeCab server...");
    pythonProcess.kill();
  }
});