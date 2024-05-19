import axios from "axios";

const googleAuthApi = axios.create({
    baseURL:"https://accounts.google.com/o/oauth2/auth/oauthchooseaccount?client_id=358553454680-ptcnidp5s8vufv27nr5l0l63cs9db48l.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A80%2Fapi%2Fv1%2Fuser%2Flogin%2Fgoogle&response_type=code&scope=email%20profile&approval_prompt=force&access_type=offline&service=lso&o2v=1&ddm=0&flowName=GeneralOAuthFlow"
})
export default googleAuthApi;