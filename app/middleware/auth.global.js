// middleware/auth.global.js
import { useAuthStore } from "@/stores/auth";
import { useUsersApi } from "@/composables/apis/useUsersApi";

const publicPaths = ["/", "/forgotpassword"];

const allowedRoles = ["merchant", "vendor", "aggregator"];

const roleDashboard = {
  merchant: "/merchant/dashboard",
  aggregator: "/aggregator/dashboard",
  vendor: "/vendor/dashboard",
};

const rolePrefix = {
  merchant: "/merchant",
  aggregator: "/aggregator",
  vendor: "/vendor",
};

export default defineNuxtRouteMiddleware(async (to, from) => {
  const token = useCookie("authToken");

  if (!token.value) {
    if (!publicPaths.includes(to.path)) {
      return navigateTo("/");
    }
    return;
  }

  const auth = useAuthStore();
  let role = auth.user?.role;

  if (!role) {
    const { getRole } = useUsersApi();
    const roleData = await getRole();
    role = roleData?.role || null;
  }

  if (!role || !allowedRoles.includes(role)) {
    token.value = null;
    if (to.path !== "/") {
      return navigateTo("/");
    }
    return;
  }

  const targetDashboard = roleDashboard[role];
  const myPrefix = rolePrefix[role];

  if (publicPaths.includes(to.path) && targetDashboard) {
    return navigateTo(targetDashboard);
  }

  if (
    !publicPaths.includes(to.path) &&
    myPrefix &&
    !to.path.startsWith(myPrefix)
  ) {
    return navigateTo(targetDashboard);
  }
});