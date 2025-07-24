// src/pythonServerManager.js

// Pythonサーバーの起動を待機するためのヘルスチェック
export async function checkPythonServerHealth(port, retries = 10, interval = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/check?word=test`); // 適当なエンドポイントでヘルスチェック
      if (response.ok) {
        console.log("Python MeCab server is healthy.");
        return true;
      }
    } catch (error) {
      // console.error(`Attempt ${i + 1}: Python server not ready, retrying...`, error.message);
    }
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  throw new Error("Python MeCab server did not start in time.");
}