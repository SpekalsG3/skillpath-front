import Head from 'next/head'

const useHeader = (title, description) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              '@context': 'http://schema.org',
              '@type': 'WebPage',
              headline: title,
              name: title,
              description: description,
              about: description,
            },
          ),
        }}
      />

    </Head>
  )
}

export default useHeader
