import { platformStrings } from './platform';
import { errorStrings } from './error';
import { shellActionsStrings } from './shellActions';
import { alertModalStrings } from './alertModal';
import { metricCardStrings } from './metricCard';
import { queryBoundaryStrings } from './queryBoundary';
import { sheetPanelStrings } from './sheetPanel';
import { statesStrings } from './states';
import { toastStackStrings } from './toastStack';
import { appShellStrings } from './appShell';
import { domainErrorsStrings } from './domainErrors';
import { loginScreenStrings } from './loginScreen';
import { signupScreenStrings } from './signupScreen';
import { dashboardScreenStrings } from './dashboardScreen';
import { experienceScreenStrings } from './experienceScreen';
import { featureRequestDetailScreenStrings } from './featureRequestDetailScreen';
import { featureRequestsScreenStrings } from './featureRequestsScreen';
import { appearanceScreenStrings } from './appearanceScreen';
import { profileScreenStrings } from './profileScreen';
import { userDetailScreenStrings } from './userDetailScreen';
import { usersScreenStrings } from './usersScreen';
import { presentationProviderStrings } from './presentationProvider';
import { demoApiClientStrings } from './demoApiClient';
import { demoFixturesStrings } from './demoFixtures';
import { sessionClientStrings } from './sessionClient';
import { webNotificationServiceStrings } from './webNotificationService';
import { demoStateStrings } from './demoState';
import { errorHandlingStrings } from './errorHandling';
export const strings = {
  ...platformStrings,
  ui: {
    error: errorStrings,
    shellActions: shellActionsStrings,
    alertModal: alertModalStrings,
    metricCard: metricCardStrings,
    queryBoundary: queryBoundaryStrings,
    sheetPanel: sheetPanelStrings,
    states: statesStrings,
    toastStack: toastStackStrings,
    appShell: appShellStrings,
    domainErrors: domainErrorsStrings,
    loginScreen: loginScreenStrings,
    signupScreen: signupScreenStrings,
    dashboardScreen: dashboardScreenStrings,
    experienceScreen: experienceScreenStrings,
    featureRequestDetailScreen: featureRequestDetailScreenStrings,
    featureRequestsScreen: featureRequestsScreenStrings,
    appearanceScreen: appearanceScreenStrings,
    profileScreen: profileScreenStrings,
    userDetailScreen: userDetailScreenStrings,
    usersScreen: usersScreenStrings,
    presentationProvider: presentationProviderStrings,
    demoApiClient: demoApiClientStrings,
    demoFixtures: demoFixturesStrings,
    sessionClient: sessionClientStrings,
    webNotificationService: webNotificationServiceStrings,
    demoState: demoStateStrings,
    errorHandling: errorHandlingStrings,
  },
} as const;
