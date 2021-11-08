var SQLite = require('react-native-sqlite-storage');
import DefaultPreference from 'react-native-default-preference';
import {
  purchasedOldStr,
  purchasedNewStr,
  purchaseUserDeafultStr,
} from '../../constants/app.constants';

export function errorCB(err) {
  // console.log("SQL Error: " + err);
}

export function successCB() {
  // console.log("SQL executed fine");
}

export function openCB() {
  // console.log("Database OPENED .. check");
}

// let db = SQLite.openDatabase(
//   {
//     name: 'FM_Quizilla_NewLatest',
//     createFromLocation: '~FM_Quizilla_NewLatest.sqlite',
//   },
//   openCB,
//   errorCB,
// );

let dbLatest = SQLite.openDatabase(
  {
    name: 'FM_Quizilla_update18',
    createFromLocation: '~FM_Quizilla_update18.sqlite',
  },
  openCB,
  errorCB,
);

export function executeSql(sqlQuery) {
  return DefaultPreference.get(purchaseUserDeafultStr).then((dataBaseName) => {
    if (dataBaseName === purchasedNewStr) {
      return executeDb(dbLatest, sqlQuery);
    } else if (dataBaseName === purchasedOldStr) {
      // return executeDb(db, sqlQuery);        // Note : for dual database
    } else {
      return executeDb(dbLatest, sqlQuery);
    }
  });
}
export function executeSql1(sqlQuery) {
  return executeDb(dbLatest, sqlQuery);
}

function executeDb(dataBase, sqlQuery) {
  return new Promise((resolve, reject) => {
    dataBase.transaction((tx) => {
      tx.executeSql(
        sqlQuery,
        [],
        (tx, response) => {
          let results = response;
          // console.log("response :-", results.rowsAffected, "tx :-", tx);
          response = null;
          if (
            results.rows.length === 0 &&
            !results.insertId &&
            results.rowsAffected === 0
          ) {
            resolve(null);
          } else if (results.rowsAffected > 0) {
            resolve(results);
          } else if (results.insertId) {
            resolve(results);
          } else if (results.rows.length > 0) {
            resolve(results);
          }
        },
        null,
      );
    });
  });
}

export function getPracticeTestScore() {
  let sqlQuery =
    "select score from History WHERE HeadingTitle = 'Practice Test' ORDER by PK_HistoryID DESC LIMIT 1;";
  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return 0;
      } else {
        return response.rows.raw()[0].Score;
      }
    })
    .catch(function () {
      // console.log("Promise Rejected score");
      return 0;
    });
}

export function getPracticeTestCount() {
  let sqlQuery =
    "select count(HeadingTitle) as totalcount from History where HeadingTitle = 'Practice Test';";
  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return 0;
      } else {
        return response.rows.raw()[0].totalcount;
      }
    })
    .catch(function () {
      // console.log("Promise Rejected count");
      return 0;
    });
}

export function getModuleList() {
  let sqlQuery = 'select * from Modules;';
  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return null;
      } else {
        return response.rows.raw();
      }
    })
    .catch(function () {
      // console.log('Promise Rejected getModuleList');
    });
}

export function getTips(moduleId) {
  let sqlQuery =
    "select TipsID, FK_Moduleid, TipsDescription from Tips where FK_Moduleid='" +
    moduleId +
    "';";
  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return null;
      } else {
        return response.rows.raw();
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function getQuestionsByModule(moduleId, isTrial) {
  let sqlQuery =
    "select PK_QuestionID, Question, FK_ModuleID, SelectOptions, CorrectAnswersList, ExhibitExist, HelpLink from Questions where FK_ModuleID = '" +
    moduleId +
    "';"; //ORDER BY RANDOM()

  if (isTrial === true) {
    sqlQuery =
      "select PK_QuestionID, Question, FK_ModuleID, SelectOptions, CorrectAnswersList, ExhibitExist, HelpLink from Questions where FK_ModuleID = '" +
      moduleId +
      "' LIMIT 5;"; // ORDER BY RANDOM()
  }

  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return null;
      } else {
        return response.rows.raw();
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function getOptionsByQuestion(questionId) {
  let sqlQuery =
    "select PK_AnswerID, Answer, CorrectAnswer from Answers where FK_QuestionID =  '" +
    questionId +
    "';";
  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return null;
      } else {
        return response.rows.raw();
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function getAllCategories() {
  let sqlQuery = 'select  * from Category;';
  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return null;
      } else {
        return response.rows.raw();
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function getQuestionByModAndCategory(sqlQuery) {
  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return null;
      } else {
        return response.rows.raw();
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function getAllQuestionByPercentage() {
  const min = 1;
  const max = 3;
  const rand = min + Math.random() * (max - min);
  let randomNumber = Math.round(rand);
  return getAllCategories()
    .then((response) => {
      const allFunctionArray = [];
      for (let i = 0; i < response.length; i++) {
        let moduleId = i + 1;
        let fieldName = 'NoOfQuestion' + randomNumber;
        let fildTFetch = response[i][fieldName];
        let sqlQuery =
          'select PK_QuestionID, Question, FK_ModuleID, SelectOptions, CorrectAnswersList, ExhibitExist from Questions where FK_ModuleID = ' +
          moduleId +
          ' ORDER BY RANDOM() LIMIT ' +
          fildTFetch;
        const fetchData = getQuestionByModAndCategory(sqlQuery);
        allFunctionArray.push(fetchData);
      }
      return Promise.all(allFunctionArray).then((responses) => {
        finalQuestionArray = responses;
        return responses;
      });
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}
export function addRecordToResumeDb(
  moduleName,
  SelectOptions,
  isCorrectStr,
  currentIndex,
) {
  let sqlQuery =
    "REPLACE into ResumeList (Module_name,Selected_Options,isCorrect, attemptQuestion) Values('" +
    moduleName +
    "','" +
    SelectOptions +
    "','" +
    isCorrectStr +
    "','" +
    currentIndex +
    "');";
  // console.log("sqlQuery :-", sqlQuery);
  return executeSql(sqlQuery)
    .then((response) => {
      // response.insertId = null
      if (response) {
        return 'added';
      } else {
        return 'failToAdd';
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function deleteResumeRecord(moduleToDelete) {
  let sqlQuery =
    "delete from ResumeList where Module_name = '" + moduleToDelete + "' ";

  // console.log("sqlQuery :-", sqlQuery);
  return executeSql(sqlQuery)
    .then((response) => {
      if (response) {
        return 'deleted';
      } else {
        return 'failtodelete';
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function getAllResumeList() {
  let sqlQuery = 'select  * from ResumeList;';
  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return null;
      } else {
        return response.rows.raw();
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function addHistory(
  AttemptedQuestions,
  CorrectAnswers,
  TotalQuestions,
  HeadingTitle,
  TimeTaken,
  Score,
  HistoryDate,
) {
  let sqlQuery =
    "insert into History (AttemptedQuestions,CorrectAnswers,TotalQuestions,HeadingTitle,TimeTaken,Score,HistoryDate) Values('" +
    AttemptedQuestions +
    "','" +
    CorrectAnswers +
    "','" +
    TotalQuestions +
    "','" +
    HeadingTitle +
    "','" +
    TimeTaken +
    "','" +
    Score +
    "','" +
    HistoryDate +
    "');";
  return executeSql(sqlQuery)
    .then((response) => {
      // response.insertId = null
      if (response) {
        return 'added';
      } else {
        return 'failToAdd';
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function getHistory(sortHistory) {
  let sqlQuery;

  if (sortHistory == 0) {
    sqlQuery =
      'select PK_HistoryID, AttemptedQuestions, CorrectAnswers, TotalQuestions, HeadingTitle, TimeTaken, Score, HistoryDate from History ORDER by HistoryDate DESC;';
  } else if (sortHistory == 1) {
    sqlQuery =
      'select PK_HistoryID, AttemptedQuestions, CorrectAnswers, TotalQuestions, HeadingTitle, TimeTaken, Score, HistoryDate from History ORDER by HistoryDate ASC;';
  } else if (sortHistory == 2) {
    sqlQuery =
      "select PK_HistoryID, AttemptedQuestions, CorrectAnswers, TotalQuestions, HeadingTitle, TimeTaken, Score, HistoryDate from History where HeadingTitle != 'Practice Test' ORDER by HeadingTitle ASC;";
  } else if (sortHistory == 3) {
    sqlQuery =
      "select PK_HistoryID, AttemptedQuestions, CorrectAnswers, TotalQuestions, HeadingTitle, TimeTaken, Score, HistoryDate from History where HeadingTitle != 'Practice Test' ORDER by HeadingTitle DESC;";
  } else if (sortHistory == 4) {
    sqlQuery =
      "select PK_HistoryID, AttemptedQuestions, CorrectAnswers, TotalQuestions, HeadingTitle, TimeTaken, Score, HistoryDate from History where HeadingTitle = 'Practice Test' ORDER by PK_HistoryID DESC;";
  } else if (sortHistory == 5) {
    sqlQuery =
      'select PK_HistoryID, AttemptedQuestions, CorrectAnswers, TotalQuestions, HeadingTitle, TimeTaken, Score, HistoryDate from History ORDER by PK_HistoryID DESC;';
  }

  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return null;
      } else {
        return response.rows.raw();
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function deleteAllHistory(idtoDelete) {
  let sqlQuery = 'delete from History';
  if (idtoDelete !== '') {
    sqlQuery = 'delete from History where PK_HistoryID = ' + idtoDelete + ' ';
  }

  return executeSql(sqlQuery)
    .then((response) => {
      if (response) {
        return 'deleted';
      } else {
        return 'failtodelete';
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function getModuleHighScores() {
  let sqlQuery =
    "SELECT HeadingTitle as ModuleName, MAX(Score) as max FROM History WHERE HeadingTitle != 'Practice Test' GROUP BY HeadingTitle;";

  // let sqlQuery =
  //   "insert into History values (11,5,3,'Publishing FileMaker Data on the Web','2018-12-01',73,10,70)";

  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return null;
      } else {
        return response.rows.raw();
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function deleteExamRecords() {
  db.transaction((tx) => {
    let sqlQuery = 'delete from StartTest';
    tx.executeSql(sqlQuery, [], (tx, results) => {
      // console.log("Query completed deleteExamRecords");
      // console.log("results = ", results);
      // console.log("tx = ", tx);
    });
  });
}

export function getModuleWiseProgress() {
  let sqlQuery =
    "SELECT HeadingTitle as ModuleName,Avg(Score) as average FROM History WHERE HeadingTitle != 'Practice Test' GROUP BY HeadingTitle;";

  //  "SELECT HeadingTitle as ModuleName, MAX(Score) as max FROM History WHERE HeadingTitle != 'Practice Test' GROUP BY HeadingTitle;";

  // let sqlQuery =
  //   "insert into History values (11,5,3,'Publishing FileMaker Data on the Web','2018-12-01',73,10,70)";

  return executeSql(sqlQuery)
    .then((response) => {
      if (response.rows.length === 0) {
        return null;
      } else {
        return response.rows.raw();
      }
    })
    .catch(function () {
      // console.log("Promise Rejected");
    });
}

export function getDbData(query) {
  console.log('getDbData', query);
  return executeSql(query)
    .then((response) => {
      console.log('getDbData responce', response);
      if (response && response.rows.length > 0) {
        console.log('getDbData not deleted ');
        return 'not deleted';
      } else if (response == null) {
        console.log('getDbData not deleted ');
        return 'not deleted';
      } else {
        console.log('deleted');
        return 'deleted';
      }
    })
    .catch(function () {
      return false;
      // console.log("Promise Rejected");
    });
}

export function deleteTableData(query) {
  console.log('deleteTableData', query);
  return executeSql(query)
    .then(() => {
      return 'deleted';
    })
    .catch(function () {
      return false;
      // console.log("Promise Rejected");
    });
}

export async function updateTableData(sqlquery, data) {
  let query = sqlquery + ' ' + data + ';';
  console.log('updateTableData query', query);
  return executeSql(query)
    .then((response) => {
      console.log('updateTableData responce', response);
      return true;
    })
    .catch(function (error) {
      console.log('error 123', error);
      // console.log('Promise Rejected');
      return false;
    });
}
