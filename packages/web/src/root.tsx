// @refresh reload
import { Suspense } from 'solid-js'
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title
} from 'solid-start'
import './root.css'

export default function Root() {
  return (
    <Html lang="en" class="dark">
      <Head>
        <Title>SolidStart - With TailwindCSS</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
        <Link rel="icon" href="/favicon.ico" />
        <Link
          rel="preload"
          href="/fonts/Inter-Regular.ttf"
          as="font"
          type="font/ttf"
        />
      </Head>
      <Body class="min-h-screen bg-muted font-sans antialiased">
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
