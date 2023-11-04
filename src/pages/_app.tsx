import { type AppType } from "next/app";
import { Toaster } from "sonner";

import { api } from "@/utils/api";
import "@/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Toaster />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
