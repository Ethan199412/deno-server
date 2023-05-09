addEventListener("message", async (event) => {
  const response = "Hello, Deno!";

  // 将响应数据发送给主线程
  postMessage(response);
});