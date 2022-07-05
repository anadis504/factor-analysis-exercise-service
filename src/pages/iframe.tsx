import { css } from "@emotion/css"
import { useRouter } from "next/router"
import React, { useState } from "react"
import ReactDOM from "react-dom"
import { v4 } from "uuid"

import { Renderer } from "../components/Renderer"
import { ExerciseTaskGrading } from "../shared-module/bindings"
import HeightTrackingContainer from "../shared-module/components/HeightTrackingContainer"
import useExerciseServiceParentConnection from "../shared-module/hooks/useExerciseServiceParentConnection"
import { isSetStateMessage } from "../shared-module/iframe-protocol-types.guard"
import { Answer, FactorialSurvey, ModelSolutionApi, PublicSurvey } from "../util/stateInterfaces"

import { ExerciseFeedback } from "./api/grade"

export interface SubmissionData {
  grading: ExerciseTaskGrading
  user_answer: Answer
  public_spec: PublicSurvey
}

export type State =
  | {
    view_type: "exercise"
    public_spec: PublicSurvey
  }
  | {
    view_type: "view-submission"
    public_spec: PublicSurvey
    answer: Answer
    feedback_json: ExerciseFeedback | null
    model_solution_spec: ModelSolutionApi | null
    grading: ExerciseTaskGrading | null
  }
  | {
    view_type: "exercise-editor"
    private_spec: FactorialSurvey 
  }

const Iframe: React.FC = () => {
  const [state, setState] = useState<State | null>(null)
  const router = useRouter()
  const rawMaxWidth = router?.query?.width
  let maxWidth: number | null = 500
  if (rawMaxWidth) {
    maxWidth = Number(rawMaxWidth)
  }

  const port = useExerciseServiceParentConnection((messageData) => {
    if (isSetStateMessage(messageData)) {
      ReactDOM.flushSync(() => {
        if (messageData.view_type === "exercise") {
          setState({
            view_type: messageData.view_type,
            public_spec: messageData.data.public_spec as PublicSurvey,
          })
        } else if (messageData.view_type === "exercise-editor") {
          if (messageData.data.private_spec === null) {
            console.log("does this happen?")
            setState({
              view_type: messageData.view_type,
              private_spec: EmptyForm,
            })
          } else { 
            setState({
              view_type: messageData.view_type,
              private_spec:
                (JSON.parse(messageData.data.private_spec as string) as FactorialSurvey),
            })
          }
        } else if (messageData.view_type === "view-submission") {
          const userAnswer = messageData.data.user_answer as Answer
          setState({
            view_type: messageData.view_type,
            public_spec: messageData.data.public_spec as PublicSurvey,
            answer: userAnswer,
            feedback_json: messageData.data.grading?.feedback_json as ExerciseFeedback | null,
            model_solution_spec: messageData.data.model_solution_spec as ModelSolutionApi | null,
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
  })

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

const EmptyForm: FactorialSurvey = {
  id: v4(),
  labelAmount: 0,
  questionAmount: 0,
  isFactorial: false,
  factorAmount: 0,
  optionLabels: [],
  questions: [],
}

export default Iframe
