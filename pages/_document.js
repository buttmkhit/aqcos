import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content="AQCOS — AI Quarantine Content Operating System. Platform AI untuk membuat konten karantina yang menarik, ilmiah, dan siap publish." />
        <meta property="og:title" content="AQCOS — AI Quarantine Content OS" />
        <meta property="og:description" content="Generate script video karantina dengan AI. Untuk Humas, Laboratorium, dan Pejabat Karantina Indonesia." />
        <meta property="og:type" content="website" />
        <meta name="theme-color" content="#14B8A6" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
