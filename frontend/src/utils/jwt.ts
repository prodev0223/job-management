// import jwtDecode from "jwt-decode";
// import { verify, sign } from "jsonwebtoken";
// import axios from "./axios";

// const isValidToken = (accessToken: string) => {
//   if (!accessToken) {
//     return false;
//   }
//   const decoded = jwtDecode<{ exp: number }>(accessToken);
//   const currentTime = Date.now() / 1000;

//   return decoded.exp > currentTime;
// };

// //  const handleTokenExpired = (exp) => {
// //   let expiredTimer;

// //   window.clearTimeout(expiredTimer);
// //   const currentTime = Date.now();
// //   const timeLeft = exp * 1000 - currentTime;
// //   console.log(timeLeft);
// //   expiredTimer = window.setTimeout(() => {
// //     console.log('expired');
// //   }, timeLeft);
// // };

// const setSession = (accessToken: string | null, refreshToken: string | null) => {
//   if (accessToken && refreshToken) {
//     localStorage.setItem("accessToken", accessToken);
//     localStorage.setItem("refreshToken", refreshToken);
//     axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
//     axios.defaults.headers.common['x-refresh'] = refreshToken;
//     // This function below will handle when token is expired
//     // const { exp } = jwtDecode(accessToken);
//     // handleTokenExpired(exp);
//   } else {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     delete axios.defaults.headers.common.Authorization;
//     delete axios.defaults.headers.common['x-refresh'];
//   }
// };

// export { verify, sign, isValidToken, setSession };
export { }