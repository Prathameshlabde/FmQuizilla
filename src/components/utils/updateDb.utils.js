import {
  APIUrl,
  deleteAllAnswers,
  deleteAllModules,
  deleteAllQuestions,
  deleteAllTips,
  getAllAnswers,
  getAllQuestions,
  insertQuestion,
  insertAnswer,
  getAllTips,
  getModuleList,
  insertModules,
  insertTips,
} from '../../constants/app.constants';
import {callAPI} from './api.utils';
import {deleteTableData, updateTableData} from './db.utils';

export async function updateDb() {
  let modifiedData = '';
  let isSuccess = true;
  let count = 0;

  await callAPI(APIUrl + getModuleList).then(async (apiData) => {
    console.log('api data', apiData);
    if (apiData !== 'error') {
      await deleteTableData(deleteAllModules).then(async (re) => {
        if (re == 'deleted' && isSuccess == true) {
          await apiData.map(
            async ({FM_ID_Exam_Module, ModuleName, NumberOfQuestions}) => {
              modifiedData =
                modifiedData +
                `(${FM_ID_Exam_Module},'${ModuleName}',${NumberOfQuestions}),`;
            },
          );
          await updateTableData(
            insertModules,
            modifiedData.substr(0, modifiedData.length - 1),
          )
            .then(() => {
              isSuccess = true;
            })
            .catch(() => {
              isSuccess = false;
            });

          count = count + 1;
        } else {
          isSuccess = false;
          count = count - 1;
        }
      });
    } else if (apiData == 'error') {
      isSuccess = false;
      count = count - 1;
    }
  });

  await callAPI(APIUrl + getAllQuestions).then(async (apiData) => {
    modifiedDta = '';
    if (apiData !== 'error') {
      await deleteTableData(deleteAllQuestions).then(async (res) => {
        console.log('getDbData not deleted');
        if (res == 'deleted' && isSuccess == true) {
          await apiData.map(
            async ({
              FM_ID_Question,
              d__Question,
              FK_ExamModuleID,
              d__SelectOptions,
              d__CorrectAnswers,
            }) => {
              modifiedDta = `(${FM_ID_Question},'${d__Question}',${FK_ExamModuleID},${d__SelectOptions},'${d__CorrectAnswers}')`;
              await updateTableData(insertQuestion, modifiedDta)
                .then(() => {
                  isSuccess = true;
                })
                .catch(() => {
                  isSuccess = false;
                });
            },
          );
          count = count + 1;
        } else {
          isSuccess = false;
          count = count - 1;
        }
      });
    } else if (apiData == 'error') {
      isSuccess = false;
      count = count - 1;
      // alert('Not found server data');
    }
  });

  await callAPI(APIUrl + getAllAnswers).then(async (apiData) => {
    modifiedDta = '';
    if (apiData !== 'error') {
      await deleteTableData(deleteAllAnswers).then(async (re) => {
        console.log('getDbData not deleted');
        if (re == 'deleted' && isSuccess == true) {
          console.log('getDbData responce deleted');
          await apiData.map(
            async ({
              FM_ID_Answer,
              FK_ID_Question,
              d__Answer,
              d__CorrectAnswer,
            }) => {
              let correctAnswer = d__CorrectAnswer == 1 ? 1 : 0;
              modifiedDta = `(${FM_ID_Answer},${FK_ID_Question},"${d__Answer}",${correctAnswer})`;

              await updateTableData(insertAnswer, modifiedDta)
                .then(() => {
                  isSuccess = true;
                })
                .catch(() => {
                  isSuccess = false;
                });
            },
          );
          count = count + 1;
        } else {
          isSuccess = false;
          count = count - 1;
        }
      });
    } else if (apiData == 'error') {
      isSuccess = false;
      count = count - 1;
    }
  });

  await callAPI(APIUrl + getAllTips).then(async (apiData) => {
    let modifiedData = '';
    if (apiData !== 'error') {
      await deleteTableData(deleteAllTips).then(async (re) => {
        console.log('getDbData not deleted');
        if (re == 'deleted' && isSuccess == true) {
          console.log('getDbData responce deleted');
          await apiData.map(
            async ({FM_ID_Tip, FK_ModuleID, d__TipDescription}) => {
              modifiedData = `(${FM_ID_Tip},${FK_ModuleID},"${d__TipDescription}")`;
              await updateTableData(insertTips, modifiedData)
                .then(() => {
                  isSuccess = true;
                })
                .catch(() => {
                  isSuccess = false;
                });
            },
          );
          count = count + 1;
        } else {
          isSuccess = false;
          count = count - 1;
        }
      });
    } else if (apiData == 'error') {
      isSuccess = false;
      count = count - 1;
    }
  });

  console.log(
    'isSuccess == true && count == 4',
    isSuccess == true && count == 4,
  );
  if (isSuccess == true && count == 4) {
    return isSuccess;
  } else {
    return false;
  }
}

// await updateTableData(
//   insertTips,
//   modifiedData.substr(0, modifiedData.length - 1),
// ).then(()=>{isSuccess = true;})
// console.log();
