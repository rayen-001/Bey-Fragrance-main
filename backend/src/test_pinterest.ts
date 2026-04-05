async function test() {
  const url = 'https://i.pinimg.com/1200x/b6/0e/59/b60e594833215904d609200427951d7e.jpg';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    console.log(`STATUS: ${res.status}`);
    if (res.ok) {
      const blob = await res.blob();
      console.log(`BLOB size: ${blob.size}`);
    } else {
      console.log(`Error: ${res.statusText}`);
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Fetch failed: ${err.message}`);
    } else {
      console.error(`Fetch failed: ${err}`);
    }
  }
}
test();
