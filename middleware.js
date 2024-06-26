// import { getSession } from "@auth0/nextjs-auth0";

// export async function middleware(request) {
//   const session = await getSession();
//   console.log(session);
//   const user = session?.user;

//   if (user && !request.nextUrl.pathname.startsWith("/dashboard")) {
//     return Response.redirect(new URL("/dashboard", request.url));
//   }

//   if (!user && !request.nextUrl.pathname.startsWith("/login")) {
//     return Response.redirect(new URL("/login", request.url));
//   }
// }

// export const config = {
//   matcher: ["/"],
// };

export function middleware(request) {}
