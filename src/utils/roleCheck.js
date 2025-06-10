
import Cookies from 'js-cookie'
export const checkRoles=(roles)=>{
    const userRoles = Cookies.get("userRoles");
   return JSON.parse(userRoles || []).some((role) => roles.includes(role));
}
