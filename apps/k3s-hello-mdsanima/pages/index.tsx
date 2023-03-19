/* Copyright © 2023 Marcin Różewski MDSANIMA */

import { Press_Start_2P } from "next/font/google"
import Head from "next/head"
import Image from "next/image"

import styles from "@mdsanima-lab/styles/Home.module.css"

const fontPressStart2P = Press_Start_2P({ subsets: ["latin"], weight: "400" })

type Props = {
  message: string
  hostname: string
}

export default function Home({ message, hostname }: Props) {
  return (
    <>
      <Head>
        <title>MDSANIMA</title>
        <meta name="description" content="MDSANIMA App for testing Lightweight Kubernetes K3s Cluster" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/mdsanima_logo_rc1_default_10_red.svg" />
      </Head>
      <main className={styles.main}>
        <div className={styles.column}>
          <div className={styles.center}>
            <Image
              className={styles.logo}
              src="/mdsanima_inline_rc3_flat_32_light.svg"
              alt="MDSANIMA Inline Logo"
              width={247}
              height={24}
              priority
            />
            <div className={styles.mdsanima}>
              <Image src="/mdsanima_logo_rc1_default_10_red.svg" alt="MDSANIMA Logo" width={50} height={50} priority />
            </div>
          </div>
          <div className={styles.message}>
            <h5 className={fontPressStart2P.className}>{message}</h5>
          </div>
          <div className={styles.hostname}>
            <h5 className={fontPressStart2P.className}>{hostname}</h5>
          </div>
        </div>
      </main>
    </>
  )
}

export async function getServerSideProps(): Promise<{ props: Props }> {
  const res = await fetch("http://localhost:3000/api/hello")
  const data = await res.json()
  const message = data.message
  const hostname = data.hostname
  return { props: { message, hostname } }
}
