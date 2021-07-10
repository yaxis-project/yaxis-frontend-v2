import React from 'react'
import styled from 'styled-components'
import { Layout } from 'antd'
import TopBar from '../TopBar'
import Footer from '../Footer'
import PageLeadBar from './PageLeadBar'
import NetworkCheck from '../NetworkCheck'

const { Content } = Layout

export const HomePage: React.FC = ({ children }) => (
	<StyledLayout>
		<NetworkCheck>
			<BGHomeUnderlay />
			<TopBar home />
			<StyledContent>
				<StyledMain>{children}</StyledMain>
			</StyledContent>
			<Footer />
		</NetworkCheck>
	</StyledLayout>
)

const StyledMain = styled.div`
	max-width: ${(props) => props.theme.siteWidth}px;
	margin: auto;
`

const StyledLayout = styled(Layout)`
	min-height: 100vh;
	background: ${(props) => props.theme.primary.background};
`

const StyledContent = styled(Content)`
	padding: 0 100px;
	@media only screen and (max-width: 725px) {
		padding: 0;
	}
`

const BGUnderlay = styled.div`
	width: 100%;
	height: 80px;
	background: linear-gradient(
		180deg,
		${(props) => props.theme.primary.main} 50.17%,
		${(props) => props.theme.secondary.main} 100%
	);
	position: absolute;
`

const BGHomeUnderlay = styled(BGUnderlay)`
	height: 400px;
	background: linear-gradient(
		180deg,
		${(props) => props.theme.primary.main} 20.17%,
		${(props) => props.theme.secondary.main} 100%
	);
`

interface PageProps {
	loading?: boolean
	mainTitle?: string
	secondaryText?: string
	secondaryTextLink?: string
	value?: string
	valueInfo?: string
	children: React.ReactElement
	background?: string
}

const Page = ({ children, ...props }: PageProps) => (
	<StyledLayout>
		<NetworkCheck>
			<BGUnderlay />
			<TopBar />
			<PageLeadBar {...props} />
			<StyledContent>
				<StyledMain>{children}</StyledMain>
			</StyledContent>
			<Footer />
		</NetworkCheck>
	</StyledLayout>
)

export default Page
