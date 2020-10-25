const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});
const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  let result = fib(index - 1) + fib(index - 2);
  console.log("fib--------" + result);
  return result;
}

sub.on("message", (channel, message) => {
  console.log("on--------" + keys.redisHost);
  console.log("on--------" + keys.redisPort);
  console.log("message--------" + message);
  console.log("channel--------" + channel);
  redisClient.hset("values", message, fib(parseInt(message)));
});
sub.subscribe("insert");
