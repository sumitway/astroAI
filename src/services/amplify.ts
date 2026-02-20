/**
 * AWS Amplify Configuration
 * Connects the React Native app to AWS Cognito and API Gateway.
 */

import { Amplify } from 'aws-amplify';
import Constants from 'expo-constants';

const {
  apiUrl,
  cognitoUserPoolId,
  cognitoClientId,
  awsRegion,
} = Constants.expoConfig?.extra ?? {};

export function configureAmplify() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: cognitoUserPoolId ?? '',
        userPoolClientId: cognitoClientId ?? '',
        loginWith: {
          email: true,
        },
        signUpVerificationMethod: 'code',
        userAttributes: {
          email: { required: true },
          name: { required: true },
        },
        allowGuestAccess: false,
        passwordFormat: {
          minLength: 8,
          requireLowercase: true,
          requireUppercase: true,
          requireNumbers: true,
          requireSpecialCharacters: false,
        },
      },
    },
    API: {
      REST: {
        JyotishAPI: {
          endpoint: apiUrl ?? 'http://localhost:8000',
          region: awsRegion ?? 'us-east-1',
        },
      },
    },
  });
}
