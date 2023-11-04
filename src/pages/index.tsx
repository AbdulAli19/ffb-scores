import dynamic from "next/dynamic";
import Head from "next/head";

const App = dynamic(() => import("../components/app"), { ssr: false });

export default function Home() {
  return (
    <>
      <Head>
        <title>FFB Scores</title>
      </Head>
      <App />
    </>
  );
}
