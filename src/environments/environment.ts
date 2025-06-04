
export const environment = {
  production: false,
  appVersion: require('../../package.json').version,
  HOST: 'http://localhost:8080',
  RUTA_AUTHENTICATION: 'https://awue1athcef-pt-admin.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=7lqfnlbaj4afqhq6c6rmbrde1b&redirect_uri=https://cefwebpt.aws.ath.com.co/home&scope=openid',

  //Configuracion No AAD
  usesADD: true,
  token: "",
  user: "",
  time_token_exp: "",

  //feature-flag
  featureFlag: {
    conciliacionCostos: true, // habilita modulo en menu principal
  }
};

