import { useUserInfo } from "../store/userStore";

export default function isLoggedIn() {
    const userInfo = useUserInfo();
    return Object.keys(userInfo).length !== 0;
}
