```
vercel deploy --target=production
```

#### SSR

app: async
pages: getServerSideProps

#### SSG

app: generateStaticParams
pages: getStaticPaths getStaticProps

#### ISR

app: fetch + revalidate
pages:getStaticProps+revalidate
