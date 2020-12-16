import XLSX from "xlsx";

const DEFAULT_CONFIG = {
  headerErrCallback: function() {
    console.error("excel sheet header is not corrected!");
  },
  itemNumsErrCallback: function() {
    console.error("invalid item nums compared with input!");
  },
};

const DEFAULT_REG_EXP = {
  // exp: 13152081827
  phone: /[]/,
  // exp: 410725202009150001
  id: /[]/,
  // exp: 2020-10-11
  date: /[]/,
  // exp: 20:05
  time: /[]/,
  // exp: 2020-10-11 20:05
  dateTime: /[]/,
};

/**
 * 校验 excel 文件表头是否正确
 *
 * @param {Array<String>} currentHeaders 当前文件表头
 * @param {Array<String>} rightHeaders 正确文件表头
 * @return {Boolean} 正确或错误
 */
function checkExcelHeader(currentHeaders, rightHeaders) {
  return currentHeaders.join("") === rightHeaders.join("");
}

/**
 * 检查 excel 文件行数与输入值是否一致
 *
 * @param {Number} start
 * @param {Number} end
 * @param {Array<Array<String>>} worksheet
 */
function checkExcelItemNums(start, end, worksheet) {
  return end - start + 1 === worksheet.length;
}

/**
 * 将 xlsx 文件转换为 worksheet
 *
 * @param {File} xlsx_file
 * @param {Function} callback
 * @returns {Array<Array<String>>}
 */
function convert(xlsx_file, callback) {
  const reader = new FileReader();
  reader.onload = function(e) {
    const workbook = XLSX.read(e.target.result, { type: "binary" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    callback(data);
  };
  reader.readAsBinaryString(xlsx_file);
}

export default convert;
