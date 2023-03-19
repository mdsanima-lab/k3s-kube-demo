/* Copyright © 2023 Marcin Różewski MDSANIMA */

import type { NextApiRequest, NextApiResponse } from "next"
import os from "os"

type Data = {
  message: string
  hostname: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ message: "Hello from the K3s Cluster POD", hostname: os.hostname() })
}
