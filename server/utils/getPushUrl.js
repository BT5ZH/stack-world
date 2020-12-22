/**
      * 获取推流地址
      * 如果不传key和过期时间，将返回不含防盗链的url
      * @param domain 您用来推流的域名
      *        streamName 您用来区别不同推流地址的唯一流名称
      *        key 安全密钥,
      *        time 过期时间 sample 2016-11-12 12:00:00
      * @return String url
*/

const md5 = require("md5");
function getPushUrl(domain, streamName, key = null, time = null) {
  var ext_str = "";
  if (key && time) {
    // 将结束时间转换为时间戳，在把10进制转为16进制，在把字母转为大写
    var d = new Date(time).valueOf() / 1000;
    var txTime = d.toString(16).toUpperCase();
    var txSecret = md5(key + streamName + txTime);
    ext_str = `?txSecret=${txSecret}&txTime=${txTime}`;
  }
  return "rtmp://" + domain + "/live/" + streamName + (ext_str ? ext_str : "");
}

var pushUrl=getPushUrl(
  "push.w-click.cn",
  "teacherfour",
  "6d182cad18e1927cb4a11bad5ba7798a",
  "2020-12-23 20:00:00"
);
console.log(pushUrl)
