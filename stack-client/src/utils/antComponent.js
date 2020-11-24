/**
 * AntDesign Tree 组件中 key 结构为 "1"，"1-1"，返回所在层级数。
 *
 * @param {String} treeNodeKey 结点的 key
 * @returns {number}
 */
function treeNodeTiles(treeNodeKey) {
  if (typeof treeNodeKey !== "string") return -1;
  return treeNodeKey.split("-").length;
}

export { treeNodeTiles };
