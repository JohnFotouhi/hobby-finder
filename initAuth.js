// https://github.com/gladly-team/next-firebase-auth#get-started
import { init } from 'next-firebase-auth'

const initAuth = () => {
  init({
    authPageURL: '/about',
    appPageURL: '/search',
    loginAPIEndpoint: '/api/login',
    logoutAPIEndpoint: '/api/logout',
    onLoginRequestError: (err) => {
      console.error(err)
    },
    onLogoutRequestError: (err) => {
      console.error(err)
    },
    firebaseClientInitConfig: {
      apiKey: "AIzaSyANQhKbnHwzW2SHI-GTPz3rH0X7InikKDo",
      authDomain: "jamin-9ed6a.firebaseapp.com",
      databaseURL: "https://jamin-9ed6a-default-rtdb.firebaseio.com",
      projectId: "jamin-9ed6a",
      storageBucket: "jamin-9ed6a.appspot.com",
      messagingSenderId: "950884082294",
      appId: "1:950884082294:web:40d61d4452f007c2f07557",
      measurementId: "G-4HTBFDYZ1C"
    },
    cookies: {
      name: 'ExampleApp', // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'strict',
      secure: true, // set this to false in local (non-HTTPS) development
      signed: true
    },
    onVerifyTokenError: (err) => {
      console.error(err)
    },
    onTokenRefreshError: (err) => {
      console.error(err)
    },
  })
}

export default initAuth