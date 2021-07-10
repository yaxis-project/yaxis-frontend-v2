import React from 'react'
import { Layout } from 'antd'

import styled from 'styled-components'

import Nav from './components/Nav'

const Footer: React.FC = () => (
	<StyledFooter>
		<StyledFooterInner>
			<Nav />
		</StyledFooterInner>
	</StyledFooter>
)

const StyledFooter = styled(Layout.Footer)`
	padding: 0 0 0;
	width: 100%;
	background: ${(props) => props.theme.primary.footer};
	margin-top: 36px;
`
const StyledFooterInner = styled.div`
	padding: 38px;
`

export default Footer
