export const environment = {
  production: true,
  appVersion: require('../../package.json').version,
  HOST: 'https://z9h2mm2kwc.execute-api.us-east-1.amazonaws.com',
  RUTA_AUTHENTICATION: 'https://awue1athcef-qa-admin.auth.us-east-1.amazoncognito.com/oauth2/authorize?response_type=token&client_id=6gm8bjpvvajuqhi2fiiqegckkv&redirect_uri=https://cefwebqa.aws.ath.com.co/home&scope=openid',

  //Configuracion No AAD
  usesADD: true,
  token: "",
  user: "prv_nparra@ath.com.co",
  time_token_exp: "",

  //feature-flag
  featureFlag: {
    conciliacionCostos: true, // habilita modulo en menu principal
  }
};
