import { Typography } from 'antd'
import styled from 'styled-components'

const StyledText = styled(Typography.Text)`
	&&& {
		color: ${(props) => props.theme.primary.font};
	}
`
const SecondaryStyledText = styled(Typography.Text)`
	&&& {
		color: ${(props) => props.theme.secondary.font};
	}
`
const StyledLink = styled(Typography.Link)`
	&&& {
		color: ${(props) => props.theme.primary.font};
	}
`
const SecondaryStyledLink = styled(Typography.Link)`
	&&& {
		color: ${(props) => props.theme.secondary.font};
	}
`
const StyledParagraph = styled(Typography.Paragraph)`
	&&& {
		color: ${(props) => props.theme.primary.font};
	}
`
const SecondaryStyledParagraph = styled(Typography.Paragraph)`
	&&& {
		color: ${(props) => props.theme.secondary.font};
	}
`
const StyledTitle = styled(Typography.Title)`
	&&& {
		color: ${(props) => props.theme.primary.font};
	}
`
const SecondaryStyledTitle = styled(Typography.Title)`
	&&& {
		color: ${(props) => props.theme.secondary.font};
	}
`

const StyledTypography = {
	Text: StyledText,
	SecondaryText: SecondaryStyledText,
	Link: StyledLink,
	SecondaryLink: SecondaryStyledLink,
	Paragraph: StyledParagraph,
	SecondaryParagraph: SecondaryStyledParagraph,
	Title: StyledTitle,
	SecondaryTitle: SecondaryStyledTitle,
}

export default StyledTypography
