import { Divider } from 'antd'
import styled from 'styled-components'

const StyledDivider = styled(Divider)`
${(props) =>
		props.theme.type === 'dark'
			? `
			border-color: ${props.theme.secondary.font};

			&&& {
				border-top-color: ${props.theme.secondary.font};
			}
			`
			: ''}
`
export default StyledDivider
