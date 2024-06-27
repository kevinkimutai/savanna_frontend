import Banner from "@/components/Banner/Banner";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import Products from "@/components/Products/Products";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { getSession } from "@auth0/nextjs-auth0";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home(props: any) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/api/auth/login");
  }

  let products;

  let url;
  if (!props.searchParams.page && !props.searchParams.search) {
    url = "https://savanna.kops.b2msdk.online/api/v1/product";
  } else {
    const baseUrl = "https://savanna.kops.b2msdk.online/api/v1/product?";
    const params = new URLSearchParams();

    if (props.searchParams.page) {
      params.append("page", props.searchParams.page);
    }

    if (props.searchParams.search) {
      params.append("search", props.searchParams.search);
    }

    url = baseUrl + params.toString();
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.idToken}`,
      },
    });

    const data = await res.json();
    products = data;
  } catch (error) {
    console.log(error);
  }

  return (
    // <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>
    <div className="flex flex-col min-h-[100dvh]">
      <Header user={user} />
      <main className="flex-1">
        <Banner />
        <Products products={products} session={session?.idToken} />
      </main>
      <Footer />
    </div>
  );
}
