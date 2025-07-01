import Cookies from 'js-cookie';

export const checkRoles = (roles = []) => {
  try {
    const userRolesRaw = Cookies.get("userRoles");
    if (!userRolesRaw) return false;

    const userRoles = JSON.parse(userRolesRaw);
    if (!Array.isArray(userRoles)) return false;

    return userRoles.some(role => roles.includes(role));
  } catch (error) {
    console.error("checkRoles() failed to parse userRoles:", error);
    return false;
  }
};
