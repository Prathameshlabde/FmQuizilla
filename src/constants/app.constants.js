export const TEST_ID = 'TEST_ID';
export const TEST_DATA = 'TEST_DATA';

export const USER_SCORE_ID = 'USER_SCORE_ID';
export const PRACTICE_TEST = 'PRACTICE_TEST';
export const LAST_SCORE = 'LAST_SCORE';

export const MODULES_ID = 'MODULES_ID';
export const MODULES_DATA = 'MODULES_DATA';
export const RESUME_DATA = 'RESUME_DATA';

export const DELETE_HiSTORY_ALERT_WARNING_TITLE =
  'Are you sure you want to delete?';
export const DELETE_HiSTORY_ALERT_WARNING_MESSAGE =
  'Do you really want to delete history?';

export const TIMER_IN_SECOND = 3600; //Default 3600 seconds

export const ABOUT_WEBSITE = 'For more information on FM Quizilla visit – ';
export const QUIZILLAA_WEBSITE = 'https://www.metasyssoftware.com/fm-quizilla';
export const PRIVACY_POLICY_URL =
  'https://www.metasyssoftware.com/privacy-policy';
export const SUGGESTION_TEXT =
  'If you would like to suggest or give us feedback  the application reach us at,';
export const COMPANY_EMAIL_TEXT = 'iphone@metasyssoftware.com';
export const COMPANY_EMAIL = 'mailto:iphone@metasyssoftware.com?subject=&body=';
export const ABOUT_COMPANY = 'FM Quizilla designed and developed by';
export const COMPANY_NAME = 'MetaSys Software Pvt. Ltd.';
export const COMPANY_WEBSITE = 'http://www.metasyssoftware.com';

export const END_TEST_ALERT_WARNING = 'Are you sure you want to end the test?';

export const MODULE_TEST_STR = 'Module Test';
export const PRACTICE_TEST_STR = 'Practice Test';
export const HISTORICAL_ANALYSIS_STR = 'Historical Analysis';

export const RIGHT_ANSWER_TOAST = 'Great!! Right Answer!';
export const WRONG_ANSWER_TOAST = 'Oops!! Wrong Answer!';
export const NO_RECORDS_FOUND = 'No records found';

export const discountedProducted17Ios = [
  'com.metasys.fmquizillaaDiscount_upgrade',
];
// export const productNewIos = ['com.fmquizilla19']; //Need to change    //ajay21
// export const productOldIos = ['com.metasys.fmquizillaainapp']; //old Product id will be used in futire if more then one product is used.
// export const productIosRestoreList = [
//   'com.fmquizilla19',
//   // 'com.metasys.fmquizillaaDiscount_upgrade',
// ];ajay21

export const productOldIos = ['com.auto.year.subs.fmquizilla']; //Need to change
export const productNewIos = ['com.auto.year.subs.fmquizilla']; //Need to change
export const productIosRestoreList = ['com.auto.year.subs.fmquizilla'];

// export const productNewAndroid = ['com.fmquizillaaandoird']; //Need to change ajay21
export const productNewAndroid = ['com.auto.year.subs.fmquizilla.android'];

export const purchaseUserDeafultStr = 'purchasedstatus';
export const purchasedOldStr = 'Purchased';

export const dbVersionStr = 'dbVersion';
export const dbVersion = '0';
// export const purchasedNewStr = 'Purchased18'; ajay21

export const purchasedNewStr = 'Purchased';

export const purchaseRestoreNew = 'purchaseRestoreNew';
export const purchaseRestoreOld = 'purchaseRestoreOld';

export const purchaseAlterTextBoth = {
  title: 'Upgrade to FM Quizilla 17/16',
  subtitle:
    'Please select restore purchase on click of any upgrade options, if you have already purchased it.',
};

export const purchaseAlterTextNewDiscounted = {
  title: 'Upgrade to FM Quizilla 17',
  subtitle:
    'If you have already purchased FileMaker 16 then Buy an upgrade to FileMaker 17 at discounted price.\n\n* If you have already purchsed this update, please choose restore purchase.',
};

// export const purchaseAlterTextNew = {
//   title: 'Upgrade to FM Quizilla 19',
//   subtitle:
//     'Buy the FULL version of FileMaker 19 by selecting Upgrade below.\n\n* If you have already purchsed this update, please choose restore purchase.',
// };

//ajay21
export const purchaseAlterTextNew = {
  title: 'Subscribe to FM Quizilla',
  subtitle:
    'Buy the Full version of FM Quizilla by selecting Subscribe below.\n\n* If you have already purchsed this update, please choose restore purchase.',
};

export const expiredSubStr = 'Your subscription has expired.';
export const expiredStatusCode = 21006;

export const purchaseAlterTextOld = {
  title: 'Subscribe to FM Quizilla 16',
  subtitle:
    'Please select restore purchase on click of any upgrade options, if you have already purchased it.',
};

export const trialAlertMsgModule =
  'In free version, you will get 5 questions in each module. Please upgrade to get more questions.';

export const trialAlertModuleListTips =
  'Please upgrade to view module wise tips.';

export const EXHIBIT_QUESTION_NUMBERS = [4, 5, 21, 22, 23, 24, 283, 650];
export const CERTIFICATE_ALERT_TITLE = 'Congratulations!!!';
export const CERTIFICATE_ALERT_MESSAGE =
  'You have scored more than 75% in the test and are eligible to get a certificate. Please enter your full name for the certificate.\n\n*30 Characters only.';
export const EXIT_TEST_MSG = 'Please choose';

export const MODULE_AVG_DATA = 'MODULE_AVG_DATA';
export const CHART_CAPTION = {
  title: 'Module Test High Scores',
  subtitle: '(by Module)',
};

export const databaseUpdatedStr = 'Database updated successfully';
export const closeAppStr =
  'Please close the application and restart to continue.';
export const purchasedSuccessfullyStr = 'Purchased Successfully.';
export const wentWrongStr = 'Something went wrong,please try again later.';
export const noInternetStr =
  'Please check your internet connection or try again later.';
export const errorServerConnectionStr = 'Could not connect to server.';

export const iosSharedKeyStr = 'ffceec0025bd4b7ab8a405d86fd916e7';

// export const APIUrl = 'http://103.59.203.210:8080/FmQuizilla_api/emp/read/';// external metasys test
export const APIUrl =
  'https://fmq.metasyssoftware.com/FmQuizilla_api/emp/read/'; // live

// export const APIUrl = 'http://192.168.2.19:8080/FmQuizilla_api/emp/read/'; /// internal metasys test
export const getDbVersion = 'getDbVersion';
export const getAllQuestions = 'getAllQuestions';
export const getAllAnswers = 'getAllAnswers';
export const getAllTips = 'getAllTips';
export const getModuleList = 'getModuleList';
export const getNotifications = 'getNotifications';
export const getAboutUs = 'getAboutUs';
export const getInstructions = 'getInstructions';

export const deleteAllAnswers = 'delete from Answers;';
export const deleteAllQuestions = 'delete from Questions;';
export const deleteAllTips = 'delete from Tips;';
export const deleteAllModules = 'delete from Modules;';

export const selectAllAnswers = 'select * from Answers;';
export const selectAllQuestions = 'select * from Questions;';
export const selectAllTips = 'select * from Tips;';
export const selectAllModules = 'select * from Modules;';

export const insertQuestion =
  'insert into Questions (PK_QuestionID,Question,FK_ModuleID,SelectOptions,CorrectAnswersList) values';
export const insertAnswer =
  'insert into Answers (PK_AnswerID,FK_QuestionID,Answer,CorrectAnswer) values';

export const insertTips =
  'insert into Tips (TipsID,FK_Moduleid,TipsDescription) values';
export const insertModules =
  'insert into Modules (PK_ModuleID,ModuleName,NoOfQuestions) values';
