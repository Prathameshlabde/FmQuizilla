import {Colors} from '../../components/utils/Colors';
import moment from 'moment';
import {StyleSheet} from 'react-native';
import {resetNavigationAndPush} from '../../Routes/navigationComponent';
import {
  addHistory,
  addRecordToResumeDb,
  getAllResumeList,
  deleteResumeRecord,
} from '../../components/utils/db.utils';
import {
  PRACTICE_TEST_STR,
  TIMER_IN_SECOND,
} from '../../constants/app.constants';
import {timeFormat, isEmpty} from '../../components/utils/utils';
import {addOneToindex} from '../ReviewAnswers/ReviewAnswers.utils';

export function getAllQuestionWithParams(allQuestions) {
  // console.log("allQuestions utils:-", allQuestions)
  let allquestionObj = [];

  for (let i = 0; i < allQuestions.length; i++) {
    let singleQuestion = allQuestions[i];

    let singleObj = {
      question: singleQuestion.Question,
      correctAnswersList: singleQuestion.CorrectAnswersList,
      fkModuleID: singleQuestion.FK_ModuleID,
      pkQuestionID: singleQuestion.PK_QuestionID,
      selectOptions: singleQuestion.SelectOptions,
      ExhibitExist: singleQuestion.ExhibitExist,
      helpLink: singleQuestion.HelpLink,
      isMarked: '',
      options: [],
      selectedOption: [],
      isCorrect: '',
      skipped: 0,
    };
    // console.log("singleObj :-", singleObj)
    allquestionObj.push(singleObj);
  }

  return allquestionObj;
}

export function deleteElementFromArray(item, dataArray) {
  var index = dataArray.indexOf(item);
  if (index !== -1) {
    dataArray.splice(index, 1);
    return dataArray;
  } else {
    return [];
  }
}

export const toastStyleCorrect = {
  backgroundColor: Colors.Green,
  width: 300,
  // height: 50,
  color: Colors.White,
  fontSize: 20,
  borderRadius: 10,
  fontWeight: 'bold',
};

export const toastStyleInCorrect = {
  backgroundColor: Colors.Red,
  width: 300,
  // height: 50,
  color: Colors.White,
  fontSize: 20,
  borderRadius: 10,
  fontWeight: 'bold',
};

export function getObjForModuleTest(allQuestionObj) {
  let correntAnswerCount = 0;
  let inCorrectAnswerCount = 0;
  let totalPercentage = 0;
  let totalQuestions = allQuestionObj.length;
  let markedIndex = [];
  let attamptedIndex = [];
  for (let i = 0; i < totalQuestions; i++) {
    if (allQuestionObj[i].isCorrect === 1) {
      correntAnswerCount += 1;
    } else if (allQuestionObj[i].isCorrect === 0) {
      inCorrectAnswerCount += 1;
    }
    if (allQuestionObj[i].isMarked === 1) {
      markedIndex.push(i);
    }
    if (allQuestionObj[i].selectedOption.length !== 0) {
      attamptedIndex.push(i);
    }
  }
  if (correntAnswerCount !== 0) {
    let percentTotal = (correntAnswerCount / totalQuestions) * 100;
    totalPercentage = percentTotal.toFixed(2);
  } else {
    totalPercentage = '0';
  }
  let finalResult = {
    AttemptedQuestions: correntAnswerCount + inCorrectAnswerCount,
    CorrectAnswers: correntAnswerCount,
    TotalQuestions: totalQuestions,
    Score: totalPercentage,
    markedIndex: markedIndex,
    attamptedIndex: attamptedIndex,
  };
  return finalResult;
}

// function convertSkippedToWrong(allQuestionObj) {
//   console.log('allQuestionObj 1111:-', allQuestionObj);
// }

export function addRecordToHistory(
  allQuestionObj,
  moduleName,
  navigation,
  timeTaken = '',
) {
  // console.log(" timeTaken :-", timeTaken);
  let redirectTo = '';
  if (moduleName === PRACTICE_TEST_STR) {
    redirectTo = 'ResultSummary';
  } else {
    redirectTo = 'ResultViewModule';
  }
  let todaysdate = moment().format('MM-DD-YYYY');

  // const updatedScore = convertSkippedToWrong(allQuestionObj);

  let objTestModule = getObjForModuleTest(allQuestionObj);
  // console.log("objTestModule :-", objTestModule);
  let totalTimeSpent = timeTaken;
  if (timeTaken !== '') {
    totalTimeSpent = timeFormat(TIMER_IN_SECOND - timeTaken);
  }

  addHistory(
    objTestModule.AttemptedQuestions,
    objTestModule.CorrectAnswers,
    objTestModule.TotalQuestions,
    moduleName,
    totalTimeSpent,
    objTestModule.Score,
    todaysdate,
  ).then(response => {
    // console.log("allQuestionObj :-", allQuestionObj);
    deleteResumeRecord(moduleName);
    // .then(response => {
    //   console.log("in resume delete :-", response);
    // });
    if (response === 'added') {
      navigation.dispatch(
        resetNavigationAndPush(redirectTo, {
          allQuestionObj,
          objTestModule,
          moduleName,
          timeTaken,
        }),
      );
    } else {
      Alert.alert('Something went wrong.');
    }
  });
}

export function compareSelectedAnswer(correctArray, selectedArray) {
  let strSelectedArray = selectedArray.map(function(e) {
    return e.toString();
  });
  let sortedCorrectArray = correctArray.sort();
  let sortedSelectedArray = strSelectedArray.sort();
  if (sortedCorrectArray.toString() === sortedSelectedArray.toString()) {
    return 'correct';
  } else {
    return 'wrong';
  }
}

export function getQuestionStyle(isQuestionNumber = false, isFullView = false) {
  const questionNumberCss = StyleSheet.create({
    p: {
      fontSize: isFullView ? 18 : 15,
      padding: 2,
      flexDirection: 'row',
      flexWrap: 'wrap',
      textAlign: 'right',
    },
  });

  const questionCss = StyleSheet.create({
    p: {
      fontSize: isFullView ? 18 : 15,
      padding: 2,
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
  });

  return isQuestionNumber ? questionNumberCss : questionCss;
}

export function filterCarriageReturn(data) {
  let result = data.replace(/##/g, '\n');
  return result;
}

export function addRecordToResume(allQuestions, modulenName, currentIndex) {
  let allSelectedAnsArr = [];
  let isCorrectArr = [];
  for (let i = 0; i < allQuestions.length; i++) {
    let selectedOptionsStrSingle = allQuestions[i].selectedOption.join(',');
    allSelectedAnsArr.push(selectedOptionsStrSingle);
    isCorrectArr.push(allQuestions[i].isCorrect);
  }

  let selectedOptionsStr = allSelectedAnsArr.join('#');
  let isCorrectArrStr = isCorrectArr.join('#');

  if (selectedOptionsStr.length != 0 && isCorrectArrStr.length != 0) {
    addRecordToResumeDb(
      modulenName,
      selectedOptionsStr,
      isCorrectArrStr,
      currentIndex,
    ).then(response => {
      // getAllResumeList().then(response => {});
    });
  }
}

export function viewAnswer(viewAnswerProps) {
  const {navigation, allQuestions, currentIndex, exhiBitID} = viewAnswerProps;

  const questionDetails = allQuestions[currentIndex];
  if (isEmpty(questionDetails.isCorrect)) {
    return;
  }

  navigation.navigate('ReviewAnswerDetails', {
    navigation: navigation,
    currentQuestionIndex: addOneToindex(currentIndex),
    currentQuestion: questionDetails.question,
    currentOptions: questionDetails.options,
    currentcorrectedOptions: questionDetails.correctAnswersList,
    currentQuestionId: questionDetails.pkQuestionID,
    selectedOption: questionDetails.selectedOption,
    exhiBitID,
  });
}
