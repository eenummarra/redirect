const dev = {
    APP_NAME: "redirect",
  s3: {
    REGION: "eu-central-1",
    BUCKET: ""
  },
  apiGateway: {
    REGION: "eu-central-1",
    URL: "https://reuhllf1z0.execute-api.eu-central-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "eu-central-1",
    USER_POOL_ID: "eu-central-1_se2pXxZEO",
    APP_CLIENT_ID: "7kd94sni9v3cfd3lv86pku1cm0",
    IDENTITY_POOL_ID: "eu-central-1:e847405e-2c7b-4232-b5af-b4c162d05674"
  }
};
export default {
  // Add common config values here
  ...dev
};
