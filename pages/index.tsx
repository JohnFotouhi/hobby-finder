import Head from 'next/head'

export default function Home() {
  fetch("/api/search", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({data: "Some Data"})
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
  });

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        
      </main>
    </>
  )
}
