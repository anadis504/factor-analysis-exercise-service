/* eslint-disable i18next/no-literal-string */
import React from "react"

import { Survey, SurveyItem, SurveyItemCondition } from "../../util/stateInterfaces"

interface Props {
  item: SurveyItem
  onChangeSurveyItem: (item: SurveyItem) => void
  state: Survey
}

const SelectConditionForItem: React.FC<React.PropsWithChildren<Props>> = ({
  item,
  onChangeSurveyItem,
  state,
}) => {
  return (
    <>
      <legend>
        This question will be shown based on chosen answer:{" "}
        <p>
          Question: {item.dependsOn?.questionLabel} <br />
          chosen option: {item.dependsOn?.triggeringOption}
        </p>
      </legend>
      <select
        onChange={(e) => {
          const triggeringItemArray: string[] = e.target.value.split(",")
          const triggeringItem: SurveyItemCondition = {
            id: triggeringItemArray[0],
            questionLabel: triggeringItemArray[1],
            triggeringOption: triggeringItemArray[2],
          }
          onChangeSurveyItem({ ...item, dependsOn: triggeringItem })
        }}
        defaultValue={
          item.dependsOn?.id +
          "," +
          item.dependsOn?.questionLabel +
          "," +
          item.dependsOn?.triggeringOption
        }
      >
        {state.content.map((sItem) => {
          if (sItem.id === item.id) {
            return
          }
          return (
            <optgroup
              key={sItem.id}
              label={"question_label: " + sItem.question.questionLabel}
              disabled={sItem.answer.options.length === 0}
            >
              {sItem.answer.options.map((option) => {
                const triggeringItem: string[] = [sItem.id, sItem.question.questionLabel, option]
                return <option key={option} value={triggeringItem as string[]} label={option} />
              })}
            </optgroup>
          )
        })}
      </select>
    </>
  )
}

export default SelectConditionForItem
