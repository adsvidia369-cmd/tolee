import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/auth/signin",
  },
});

export const config = {
  matcher: [
    "/feed", "/feed/:path*",
    "/reels", "/reels/:path*",
    "/chat", "/chat/:path*",
    "/notifications", "/notifications/:path*",
    "/marketplace", "/marketplace/:path*",
    "/create-tolee", "/create-tolee/:path*",
    "/settings", "/settings/:path*"
  ],
};
