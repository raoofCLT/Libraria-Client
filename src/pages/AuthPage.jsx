import { useRecoilValue } from "recoil"
import LoginPage from "./LoginPage"
import SignupPage from "./SignupPage";
import authScreenAtom from "../atoms/authScreenAtom"



const AuthPage = () => {
const authScreenState = useRecoilValue(authScreenAtom)

  return <> {authScreenState === "login" ? <LoginPage /> : <SignupPage />}</>
}

export default AuthPage