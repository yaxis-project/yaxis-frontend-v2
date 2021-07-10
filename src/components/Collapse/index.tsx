import { Collapse } from 'antd'
import styled from 'styled-components'

const StyledCollapse = styled(Collapse)`
	${(props) =>
		props.theme.type === 'dark'
			? `
			border: none;
			background-color: ${(props) => props.theme.secondary.background};
			
			&&& {
				border-top-color: ${props.theme.secondary.font};
			}


			.ant-collapse {
				background-color: red;
			}
			`
			: ''}
`
export default StyledCollapse
