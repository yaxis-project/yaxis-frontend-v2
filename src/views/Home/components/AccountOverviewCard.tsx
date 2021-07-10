import logo from '../../../assets/img/logo-ui.svg'
import { Row, Col } from 'antd'
import styled from 'styled-components'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'

const { SecondaryText, Title } = Typography

interface AccountOverviewCardProps {
	loading: boolean
	mainTitle: string
	secondaryText: string
	value: string
}

const StyledImage = styled.img`
	@media only screen and (max-width: 575px) {
		margin-left: 50px;
	}
`

const StyledCard = styled(Card)`
	margin-top: 10px;
`

const StyledTitle = styled.div`
	display: inline-block;
	font-size: 22px;
	font-style: normal;
	font-weight: 600;
	line-height: 29px;
	letter-spacing: 0em;
	color: ${(props) => props.theme.primary.font};
`

/**
 * Generates a generic card for overview data.
 * @param props AccountOverviewCardProps
 */
export default function AccountOverviewCard(props: AccountOverviewCardProps) {
	const { mainTitle, secondaryText, value } = props
	return (
		<StyledCard>
			<Row gutter={16}>
				<Col xs={6} sm={2} md={2} lg={3}>
					<StyledImage src={logo} height="36" alt="logo" />
				</Col>

				<Col xs={24} sm={21} md={14}>
					<Row style={{ display: 'flex', alignItems: 'center' }}>
						<Col>
							<StyledTitle style={{ margin: 0 }}>
								{mainTitle}
							</StyledTitle>
						</Col>
					</Row>
					<Row>
						<SecondaryText type="secondary">
							{secondaryText}
						</SecondaryText>
					</Row>
				</Col>
				<Col xs={24} sm={24} md={7}>
					<Row>
						<Title
							style={{
								margin: 0,
								marginLeft: 'auto',
								fontSize: '22px',
							}}
							level={5}
						>
							{value}
						</Title>
					</Row>
				</Col>
			</Row>
		</StyledCard>
	)
}
