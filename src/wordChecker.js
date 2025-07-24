// src/wordChecker.js

// PythonサーバーがDenoと同じローカルホストの別のポートで動く
const PYTHON_API_URL = "http://localhost:5000/check"; // DenoプロセスからアクセスするPythonサーバーのポート

async function checkWordHandler(req) {
  try {
    const url = new URL(req.url);
    const wordToCheck = url.searchParams.get("word");

    if (!wordToCheck) {
      return new Response(JSON.stringify({ error: "Word parameter is missing" }), { status: 400 });
    }

    // DenoサーバーからPythonサーバーへリクエストを転送
    const apiResponse = await fetch(`${PYTHON_API_URL}?word=${encodeURIComponent(wordToCheck)}`);

    if (!apiResponse.ok) {
        throw new Error(`Python API server returned an error: ${apiResponse.statusText}`);
    }

    const data = await apiResponse.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error connecting to Python API or Python API returned an error:', error);
    return new Response(JSON.stringify({ error: "Failed to connect to Python server or Python server error" }), { status: 500 });
  }
}

export default checkWordHandler;