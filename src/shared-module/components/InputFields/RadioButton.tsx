import { css, cx } from "@emotion/css"
import React from "react"

import { baseTheme, primaryFont } from "../../styles"

interface RadioFieldExtraProps {
  label: string
  checked?: boolean
  value?: string
  name?: string
  /* onBlur?: (name?: string) => void */
  onChange: (value: string, name?: string) => void
  className?: string
}

// eslint-disable-next-line i18next/no-literal-string
const label = css`
  /* font-family: system-ui, sans-serif; */
  font-family: ${primaryFont};
  font-size: 16px;
  margin: 0.5rem 0.5rem 0.5rem 0;
  line-height: 1;
  display: grid;
  grid-template-columns: 1em auto;
  justify-content: center;
  gap: 0.5em;

  input[type="radio"] {
    appearance: none;
    background-color: #fff;
    margin: 0;
    font: inherit;
    width: 1.15em;
    height: 1.15em;
    border: 1.5px solid #787878;
    border-radius: 50%;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
  }

  input[type="radio"]::before {
    content: "";
    width: 0.65em;
    height: 0.65em;
    border-radius: 50%;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    background-color: ${baseTheme.colors.green[600]};
  }

  span {
    font-family: ${primaryFont};
    font-weight: 400;
    font-size: 18px;
  }

  input[type="radio"]:checked::before {
    transform: scale(1);
    background: #1f6964;
  }
`

export type RadioFieldProps = React.HTMLAttributes<HTMLInputElement> & RadioFieldExtraProps

const RadioField = ({ onChange, className, ...rest }: RadioFieldExtraProps) => {
  return (
    <div
      className={cx(
        css`
          margin-bottom: 1rem;
        `,
        className,
      )}
    >
      <label className={cx(label)}>
        <input
          type="radio"
          onChange={({ target: { value, name } }) => onChange(value, name)}
          {...rest}
        />
        <span>{rest.label}</span>
      </label>
    </div>
  )
}

export default RadioField
