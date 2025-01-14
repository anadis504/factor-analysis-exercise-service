import styled from "@emotion/styled"
import React from "react"

import { baseTheme, fontWeights, headingFont, theme } from "../styles"
import { defaultFontSizePx } from "../styles/constants"
import { respondToOrLarger } from "../styles/respond"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary" | "tertiary" | "outlined" | "blue"
  size: "small" | "medium" | "large"
  transform?: "capitalize" | "uppercase" | "none" | "lowercase"
  children?: React.ReactNode
}

// BaseButtonStyles is the primary button
export const BASE_BUTTON_STYLES = `
  position: relative;
  display: inline-block;
  padding: ${theme.buttonSizes["large"].padding};
  font-family: ${headingFont};
  font-weight: ${fontWeights.normal};
  font-size: ${defaultFontSizePx}px;
  line-height: normal;
  vertical-align: baseline;
  cursor: pointer;
  user-select: none;
  text-decoration: none;
  text-align: center;
  justify-content: center;
  word-break: break-word;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  transition: all 150ms linear;
  border: 2.5px solid transparent;
  z-index: 1;
  white-space: nowrap;

  color: ${theme.primary.text};
  background-color: ${theme.primary.bg};
  border-color: ${theme.primary.border};

  &:hover {
    color: ${theme.primary.hoverBorder};
    background-color: ${theme.primary.hoverBg};
    border-color: ${theme.primary.hoverBorder};
    text-decoration: none;
  }

  &:active {
    color: ${theme.primary.hoverText};
    background-color: ${theme.primary.activeBg};
    border-color: ${theme.primary.hoverBorder};
  }

  &:disabled {
    color: ${theme.primary.disabledText};
    background-color: ${theme.primary.disabledBg};
    border-color: ${theme.primary.disabledBorder};
    cursor: not-allowed;
  }

  &:focus {
    text-decoration: none;
  }

  ${respondToOrLarger.xs} {
    word-break: unset;
  }
  ${respondToOrLarger.sm} {
    white-space: nowrap;
  }
`

export const PrimaryButtonStyles = (props: ButtonProps) => {
  const PRIMARY_BUTTON_STYLES = `
    text-transform: ${props.transform};
    padding: ${theme.buttonSizes[props.size].padding};
  `
  return PRIMARY_BUTTON_STYLES
}

export const SecondaryButtonStyles = (props: ButtonProps) => {
  const SECONDARY_BUTTON_STYLES = `
    text-transform: ${props.transform};
    padding: ${theme.buttonSizes[props.size].padding};

    color: ${theme.secondary.text};
    background: ${theme.secondary.bg};
    border: 1.5px solid ${theme.secondary.border};

    &:hover,
    &:focus {
      color: ${theme.secondary.hoverText};
      box-shadow: 0 0 0 1px ${theme.secondary.text};
      border: 1.5px solid ${theme.secondary.text};
    }

    &:active {
      color: ${theme.secondary.hoverText};
      background-color: ${theme.secondary.activeBg};
    }

    &:disabled {
      color: ${theme.secondary.disabledText};
      background-color: ${theme.secondary.disabledBg};
      border-color: ${theme.secondary.disabledBorder};
    }
  `
  return SECONDARY_BUTTON_STYLES
}

export const TertiaryButtonStyles = (props: ButtonProps) => {
  const TERTIARY_BUTTON_STYLES = `
    text-transform: ${props.transform};
    padding: ${theme.buttonSizes[props.size].padding};

    color: ${theme.tertiary.text};
    background-color: ${theme.tertiary.bg};
    border: unset;

    &:hover {
      color: ${theme.tertiary.hoverText};
      background-color: ${theme.tertiary.hoverBg};
    }

    &:active {
      color: ${theme.tertiary.hoverText};
      background-color: ${theme.tertiary.activeBg};
    }

    &:disabled {
      color: ${theme.tertiary.disabledText};
      background-color: ${theme.tertiary.disabledBg};
      border-color: ${theme.tertiary.disabledBorder};
    }
  `
  return TERTIARY_BUTTON_STYLES
}

export const BlueButtonStyles = (props: ButtonProps) => {
  const BLUE_BUTTON_STYLES = `
    text-transform: ${props.transform};
    padding: ${theme.buttonSizes[props.size].padding};

    color: ${theme.tertiary.text};
    background-color: ${baseTheme.colors.blue[500]};
    border: unset;
    border: 2px solid ${theme.secondary.border};

    &:hover {
      border: 2px solid ${baseTheme.colors.blue[600]};
      color: ${baseTheme.colors.blue[700]};
    }

    &:active {
      border: 2px solid ${baseTheme.colors.blue[400]};
    }

    &:disabled {
      color: ${theme.secondary.disabledText};
      background-color: ${theme.secondary.disabledBg};
      border-color: ${theme.secondary.disabledBorder};
    }
  `
  return BLUE_BUTTON_STYLES
}

const PrimaryButton = styled.button`
  ${BASE_BUTTON_STYLES}
  ${PrimaryButtonStyles}
`

const SecondaryButton = styled.button`
  ${BASE_BUTTON_STYLES}
  ${SecondaryButtonStyles}
`

const TertiaryButton = styled.button`
  ${BASE_BUTTON_STYLES}
  ${TertiaryButtonStyles}
`

const BlueButton = styled.button`
  ${BASE_BUTTON_STYLES}
  ${BlueButtonStyles}
`

export const LabelButton = styled.label`
  ${BASE_BUTTON_STYLES}
`

/* BUTTON VARIANT
PrimaryButton
SecondaryButton
GhostButton
TertiaryButton
IconButton
Link */

const Button: React.FC<React.PropsWithChildren<React.PropsWithChildren<ButtonProps>>> = (
  props: ButtonProps,
) => {
  switch (props.variant) {
    case "primary":
      return <PrimaryButton {...props} />
    case "secondary":
      return <SecondaryButton {...props} />
    case "tertiary":
      return <TertiaryButton {...props} />
    case "outlined":
      return <SecondaryButton {...props} />
    case "blue":
      return <BlueButton {...props} />
    default:
      return <PrimaryButton {...props} />
  }
}

export default Button
