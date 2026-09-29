const input = document.querySelector("input");

const decoder = new TextDecoder();
input.addEventListener("change", async () => {
  const file = input.files[0];
  const readStream = file.stream();
  // const reader = readStream.getReader();

  for await (const chunk of readStream) {
    console.log(chunk);
  }

  // while (true) {
  //   const { done, value } = await reader.read();
  //   if (done) break;
  //   console.log(value);
  // }
});
