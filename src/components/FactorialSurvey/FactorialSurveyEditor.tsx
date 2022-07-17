import { State } from "../../pages/iframe"
import { Factor, FactorialSurvey, Question } from "../../util/stateInterfaces"

import styled from "@emotion/styled"
import { v4 } from "uuid"
import QuestionEditor from "./QuestionEditor"
import MatrixEditor from "./MatrixEditor"
import ListInputEditor from "./ListInputEditor"
import LabelEditor from "../LabelEditor"
import { css } from "@emotion/css"
import BreedList from "../BreedList"


interface Props {
  state: FactorialSurvey
  setState: (newState: State) => void
}

const ButtonWrapper = styled.div`
  padding: 1rem 0;
`

const NewButton = styled.button`
  margin: 0 auto;
  margin-bottom: 1rem;
  width: 100%;
  display: block;
  padding: 0.5rem;
  background-color: white;
  border: 1px solid black;
  transition: all 0.3s;

  &:hover {
    background-color: #f1f1f1;
  }
`

const Input = styled.input`
  padding: 0.5rem;
  width: 100%;
  margin: 0 auto;
  margin-right: 0.5rem;
`

const FactorialSurveyEditor: React.FC<Props> = ({ state, setState }) => {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
      `}>

      <BreedList onClick={value => console.log(value)} />
      {state &&
        <fieldset>
          <legend>Factors</legend>
          <div>
            <input
              value={state?.factorAmount?.toString() ?? 0}
              type="number"
              onChange={(e) => {
                const parsedNumber = parseInt(e.target.value)
                if (isNaN(parsedNumber)) {
                  return
                }
                const newState: FactorialSurvey = { ...(state as FactorialSurvey), factors: [], factorAmount: parsedNumber }
                for (let i = 0; i < parsedNumber; i++) {
                  newState.factors.push({ id: v4(), name: "", score: 99999 });
                }
                setState({ view_type: "exercise-editor", private_spec: newState })
              }}
            />
            <ol>
              {state?.factors?.map(e => {
                return (
                  <li key={e.id}>
                    <Input
                      value={e.name}
                      type="text"
                      onChange={(event) => {
                        const factor: Factor = { ...e, name: event.target.value }
                        const newFactors = state.factors.map((f) => {
                          if (f.id !== e.id) {
                            return f
                          }
                          return factor
                        })
                        // eslint-disable-next-line i18next/no-literal-string
                        setState({
                          view_type: "exercise-editor",
                          private_spec: { ...state, factors: newFactors }
                        })
                      }}
                    />
                  </li>
                )
              })}
            </ol>
          </div>
        </fieldset>
      }

      <fieldset>
        <legend>Options</legend>
        <ButtonWrapper>
          <ol>
            {state?.optionLabels?.map((o) => (
              <li key={o.id}>
                <LabelEditor
                  key={o.id}
                  item={o}
                  onDelete={() => {
                    const newState: FactorialSurvey = { ...(state as FactorialSurvey) }

                    const newLabels = newState.optionLabels.filter((e) => e.id !== o.id)
                    // eslint-disable-next-line i18next/no-literal-string
                    setState({
                      view_type: "exercise-editor",
                      private_spec: { ...state, optionLabels: newLabels }
                    })
                  }}
                  onChange={(task) => {
                    const newLabels = state.optionLabels.map((e) => {
                      if (e.id !== o.id) {
                        return e
                      }
                      return task
                    })
                    // eslint-disable-next-line i18next/no-literal-string
                    setState({
                      view_type: "exercise-editor",
                      private_spec: { ...state, optionLabels: newLabels }
                    })
                  }}
                />
              </li>
            ))}
          </ol>

          <NewButton
            onClick={() => {
              const newState: FactorialSurvey = { ...(state as FactorialSurvey) }
              if (typeof newState.optionLabels === 'undefined') {
                newState.optionLabels = []
              }
              newState.optionLabels.push({ label: "", value: null, id: v4() })
              // eslint-disable-next-line i18next/no-literal-string
              setState({ view_type: "exercise-editor", private_spec: newState })
            }}
          >
            Add Option
          </NewButton>
        </ButtonWrapper>
      </fieldset>

      <fieldset>
        <legend>Questions</legend>

        <ButtonWrapper>
          <ol>
            {state?.questions?.map((q) => (
              <li key={q.id}>
                <QuestionEditor
                  key={q.id}
                  item={q}
                  onDelete={() => {
                    const newState: FactorialSurvey = { ...(state as FactorialSurvey) }

                    const newQuestions = newState.questions.filter((e) => e.id !== q.id)
                    // eslint-disable-next-line i18next/no-literal-string
                    setState({
                      view_type: "exercise-editor",
                      private_spec: { ...state, questions: newQuestions }
                    })
                  }}
                  onChangeQuestion={(task) => {
                    const newQuestions = state.questions.map((e) => {
                      if (e.id !== q.id) {
                        return e
                      }
                      return task
                    })
                    // eslint-disable-next-line i18next/no-literal-string
                    setState({
                      view_type: "exercise-editor",
                      private_spec: { ...state, questions: newQuestions }
                    })
                  }}
                />
              </li>
            ))}
          </ol>

          <NewButton
            onClick={() => {
              const newState: FactorialSurvey = { ...(state as FactorialSurvey) }
              if (typeof newState.questions === 'undefined') {
                newState.questions = []
              }
              const questionIndex = newState.questions.length + 1
              newState.questions.push({ question: "", id: v4(), questionNr: questionIndex })
              // eslint-disable-next-line i18next/no-literal-string
              setState({ view_type: "exercise-editor", private_spec: newState })
            }}
          >
            Add Question
          </NewButton>
        </ButtonWrapper>
        OR
        <ButtonWrapper>
          <ListInputEditor
            topic="question"
            item={state}
            onChange={(value) => {
              const newQuestions: Question[] = []
              value.map((e) => {
                newQuestions.push({ id: v4(), questionNr: Number(e[0]), question: (e[1] as string) })
              })
              const newState: FactorialSurvey = { ...(state as FactorialSurvey), questions: newQuestions }
              setState({ view_type: "exercise-editor", private_spec: newState })
            }}
          />
        </ButtonWrapper>
      </fieldset>
      <ButtonWrapper>
        <MatrixEditor
          item={state}
          onChange={(value: number[][]) => {
            setState({
              view_type: "exercise-editor",
              private_spec: { ...state, matrix: value }
            })
          }}
        />
      </ButtonWrapper>
    </div>
  )
}

export default FactorialSurveyEditor