/* eslint-disable i18next/no-literal-string */
import { NextApiRequest, NextApiResponse } from "next"
import { cors, runMiddleware } from "../../util/cors"

import { Alternative, ClientErrorResponse, PublicAlternative } from "../../util/stateInterfaces"

export default async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  await runMiddleware(req, res, cors)

  if (req.method !== "POST") {
    return res.status(404).json({ message: "Not found" })
  }

  return handlePost(req, res)
}

function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<PublicAlternative[] | ClientErrorResponse>,
) {
  const uncheckedAlternatives: unknown = req.body
  if (!Array.isArray(uncheckedAlternatives)) {
    return res
      .status(400)
      .json({ message: "Malformed data:" + JSON.stringify(uncheckedAlternatives) })
  }

  const publicAlternatives = uncheckedAlternatives.map<PublicAlternative>((x: Alternative) => ({
    id: x.id,
    name: x.name,
  }))
  return res.status(200).json(publicAlternatives)
}
