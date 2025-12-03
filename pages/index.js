import Head from 'next/head';
import CutColorAI from '../components/CutColorAI';

export default function Home() {
  return (
    <>
      <Head>
        <title>CutColor.AI - Pro Hair Transformation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <CutColorAI />
    </>
  );
}