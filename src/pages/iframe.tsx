import { css } from "@emotion/css"
import { useRouter } from "next/router"
import React, { useCallback, useState } from "react"
import ReactDOM from "react-dom"

import Renderer from "../components/Renderer"
import { ExerciseTaskGradingResult } from "../shared-module/bindings"
import HeightTrackingContainer from "../shared-module/components/HeightTrackingContainer"
import { isSetStateMessage } from "../shared-module/exercise-service-protocol-types.guard"
import useExerciseServiceParentConnection from "../shared-module/hooks/useExerciseServiceParentConnection"
import { PrivateSpec, PublicSpec, RatedQuestion, SubmittedForm } from "../util/stateInterfaces"

import { ExerciseFeedback } from "./api/grade"

export interface SubmissionData {
  grading: ExerciseTaskGradingResult
  user_answer: RatedQuestion[]
  public_spec: PublicSpec
}

export type State =
  | {
      view_type: "exercise"
      public_spec: PublicSpec
    }
  | {
      view_type: "view-submission"
      public_spec: PublicSpec
      answer: SubmittedForm
      feedback_json: ExerciseFeedback | null
      grading: ExerciseTaskGradingResult | null
    }
  | {
      view_type: "exercise-editor"
      private_spec: PrivateSpec
    }

const Iframe: React.FC<React.PropsWithChildren<unknown>> = () => {
  const [state, setState] = useState<State | null>(null)
  const router = useRouter()
  const rawMaxWidth = router?.query?.width
  let maxWidth: number | null = 500
  if (rawMaxWidth) {
    maxWidth = Number(rawMaxWidth)
  }

  const callback = useCallback((messageData: unknown) => {
    if (isSetStateMessage(messageData)) {
      ReactDOM.flushSync(() => {
        if (messageData.view_type === "exercise") {
          setState({
            view_type: messageData.view_type,
            public_spec: messageData.data.public_spec as PublicSpec,
          })
        } else if (messageData.view_type === "exercise-editor") {
          setState({
            view_type: messageData.view_type,
            private_spec: JSON.parse(messageData.data.private_spec as string) as PrivateSpec,
          })
        } else if (messageData.view_type === "view-submission") {
          const userAnswer = messageData.data.user_answer as SubmittedForm
          setState({
            view_type: messageData.view_type,
            public_spec: messageData.data.public_spec as PublicSpec,
            answer: userAnswer,
            feedback_json: messageData.data.grading?.feedback_json as ExerciseFeedback | null,
            grading: messageData.data.grading,
          })
        } else {
          // eslint-disable-next-line i18next/no-literal-string
          console.error("Unknown view type received from parent")
        }
      })
    } else {
      // eslint-disable-next-line i18next/no-literal-string
      console.error("Frame received an unknown message from message port")
    }
  }, [])

  const port = useExerciseServiceParentConnection(callback)

  return (
    <HeightTrackingContainer port={port}>
      <div
        className={css`
          width: 100%;
          ${maxWidth && `max-width: ${maxWidth}px;`}
          margin: 0 auto;
        `}
      >
        <Renderer port={port} setState={setState} state={state} />
      </div>
    </HeightTrackingContainer>
  )
}

export default Iframe
