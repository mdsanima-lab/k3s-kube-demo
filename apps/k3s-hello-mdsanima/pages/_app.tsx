/* Copyright © 2023 Marcin Różewski MDSANIMA */

import type { AppProps } from "next/app"

import "@mdsanima-lab/styles/colors.css"
import "@mdsanima-lab/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
