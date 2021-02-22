export function idCreator(len, radix) {
  var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(
    ""
  );
  var temp = [],
    i;
  radix = radix || chars.length;
  if (len) {
    for (i = 0; i < len; i++) temp[i] = chars[0 | (Math.random() * radix)];
  } else {
    var r;
    temp[8] = temp[13] = temp[18] = temp[23] = "-";
    temp[14] = "4";
    for (i = 0; i < 36; i++) {
      if (!temp[i]) {
        r = 0 | (Math.random() * 16);
        temp[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return temp.join("");
}

export function formatDate(time) {
  var date = new Date(time);

  var year = date.getFullYear(),
    month = date.getMonth() + 1, //月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds();
  // var newTime = hour + ":" + min + ":" + sec;
  var newTime =
    year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
  return newTime;
}
