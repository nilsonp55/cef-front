export const environment = {
  production: false,
  appVersion: require('../../package.json').version,
  //HOST: 'http://localhost:8080/v1.0.1',
  HOST: 'https://ik3r79nr4a.execute-api.us-east-1.amazonaws.com',
  RUTA_AUTHENTICATION: 'https://awue1athcef-pt-admin.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=7lqfnlbaj4afqhq6c6rmbrde1b&redirect_uri=https://cefwebpt.aws.ath.com.co/home&scope=openid'
};
