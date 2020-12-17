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
  phone: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
  // exp: 410725202009150001
  id: /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
  // exp: 2020-10-11
  date: /^[1-2][0-9][0-9][0-9]-[0-1]{0,1}[0-9]-[0-3]{0,1}[0-9]$/,
  // exp: 20:05
  time: /^[0-2][0-9]:[0-5][0-9]$/,
  // exp: 2020-10-11 20:05
  // dateTime: /[]/,
  // exp: henrenx@outlook.com
  email: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
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
 * 自动去除 excel 单元格空白
 *
 * @param {Array<String>} rowData  当前行数据
 * @param {Array<Number>} cols  需要检测的列
 */
function checkExcelCeilSpace(rowData, cols) {
  for (let i = 0; i < cols.length; i++) {
    const ceilData = rowData[cols[i]];
    ceilData = ceilData.replace(/\s+/g, "");
  }
}

/**
 * 检测单元格邮箱格式
 *
 * @param {Array<String>} rowData 当前行数据
 * @param {Number} rowIndex  当前行在数据行中的位置
 * @param {Array<Number>} cols 需要检测的列
 * @param {Function} errCb 格式不对时的回调函数
 * @param {Number} errCb.rowIndex 问题所在行
 * @param {Number} errCb.colIndex 问题所在列
 */
function checkExcelEmailFormat(rowData, rowIndex, cols, errCb) {
  for (let i = 0; i < cols.length; i++) {
    const ceilData = rowData[cols[i]];
    if (!DEFAULT_REG_EXP.email.test(ceilData)) {
      errCb(rowIndex + 1, i + 1);
      break;
    }
  }
}

// TODO 补充其他格式检测

/**
 * 将 xlsx 文件转换为二维数组
 *
 * @param {File} xlsx_file excel 文件
 * @param {Object} cbConfig 各种格式错误回调函数
 * @param {Function} cbConfig.emailErrCb email 格式错误回调函数
 * @param {Function} cbConfig.dataCb 解析完成后的回调函数
 * @param {Object} params
 * @param {Array<String>} params.rightHeaders 正确的 Excel 表头
 * @param {Number} params.start 数据开始行
 * @param {Number} params.end 数据结束行
 * @param {Object} params.email 关于对邮箱的检测
 *  - check Boolean 类型，是否检测
 *  - cols Array 类型，需进行 email 检测的列
 * @returns {Array<Array<String>>}
 */
function convert(xlsx_file, cbConfig, params) {
  DEFAULT_REG_EXP = { DEFAULT_CONFIG, ...cbConfig };
  const reader = new FileReader();
  reader.onload = function(e) {
    const workbook = XLSX.read(e.target.result, { type: "binary" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    // for (let i = 0; i < data.length; i++) {

    // }
    // TODO 进行类型检查
    callback(data);
  };
  reader.readAsBinaryString(xlsx_file);
}

export default convert;
