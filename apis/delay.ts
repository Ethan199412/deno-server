addEventListener("message", async (event) => {
    const response = "Delay";

    // 将响应数据发送给主线程

    for (let i = 0; i < 5000000000; i++) {

    }

    postMessage(response);
});