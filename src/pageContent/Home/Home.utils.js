export function getChartModulesData(
  moduleListWithHighScoresArr,
  moduleListArr,
) {
  let newModuleArr = [];

  if (
    moduleListWithHighScoresArr &&
    moduleListWithHighScoresArr.length > 0 &&
    moduleListArr.length > 0
  ) {
    for (let i = 0; i < moduleListArr.length; i++) {
      let newModuleObj;

      newModuleObj = {
        label: 'M' + (i + 1).toString(),
        value: 0,
      };
      newModuleArr.push(newModuleObj);

      for (let j = 0; j < moduleListWithHighScoresArr.length; j++) {
        if (
          moduleListArr[i]['ModuleName'] ===
          moduleListWithHighScoresArr[j]['ModuleName']
        ) {
          newModuleObj = {
            label: 'M' + (i + 1).toString(),
            value: moduleListWithHighScoresArr[j]['max'],
          };

          newModuleArr[i] = newModuleObj;
        }
      }
    }
    return newModuleArr;
  } else {
    return newModuleArr;
  }
}
