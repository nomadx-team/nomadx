export default function prettyprint(tableData: (string | number | boolean)[][]) {
  console.group('Pretty Print');
  let longestItems = [];
  tableData.forEach((row) => {
    row.map((col, colIndex) => {
      col = col.toString();
      if (longestItems[colIndex] === undefined) longestItems[colIndex] = 0;
      if (col.length > longestItems[colIndex]) {
        longestItems[colIndex] = col.length;
      }
      return col;
    });
  });
  console.log(longestItems)
  console.groupEnd();

  return tableData.map(row => {
    return row.map((col, colIndex) => {
      return col.toString().padEnd(longestItems[colIndex]);
    }).join('  ');
  }).join('\n')
}
