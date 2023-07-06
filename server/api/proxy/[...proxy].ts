export default defineEventHandler((event) => {
  // event.node.req.headers = {
  //     'authorization': "Bearer tokensaya",
  //     "X-Forwarded-For": ""
  // }

  // console.log(event.context.params?.proxy);

  return proxyRequest(
    event,
    `https://freeimage.host/api/1/${event.context.params?.proxy || ""}`
  );
});
