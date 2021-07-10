import styled from 'styled-components'
import logo from '../../assets/img/logo-ui.svg'
import { LeftOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import { baseTheme } from '../../theme'
import { Row, Col, Typography, Divider, Grid } from 'antd'
import { LinkOutlined } from '@ant-design/icons'
const { Title, Text } = Typography
const { useBreakpoint } = Grid

const StyledMain = styled.div<any>`
	padding: 40px 10%;
	width: 100%;
	margin: auto;
	height: 100%;
	background: ${(props) => {
		if (props.background) return props.background
		if (props.theme.primary.lead) return props.theme.primary.lead
		return '#eff9ff'
	}};

	font-size: 1rem;

	@media only screen and (max-width: 600px) {
		padding: 20px 3%;
	}
`

const StyledTitle = styled(Title)`
	&&& {
		color: ${(props) => props.theme.primary.font};
		margin: 0;
		font-weight: 700;
		font-size: 1.7em;
	}
`

const StyledTitle2 = styled(StyledTitle)`
	&&& {
		padding-left: 15px;
	}
`

const StyledSecondaryText = styled(Text)`
	&&& {
		color: ${(props) => props.theme.secondary.font};
		font-size: 0.8em;
	}
`

const StyledSecondaryText2 = styled(StyledSecondaryText)`
	&&& {
		padding: 0 6px;
	}
`

const StyledSecondaryText3 = styled(StyledSecondaryText)`
	&&& {
		padding-left: 15px;
	}
`

const StyledLink = styled.a`
	color: ${(props) => props.theme.secondary.font};
	padding-left: 15px;
`
const StyledBackArrow = styled(LeftOutlined)`
	margin: 6px 0 0 0;
	color: ${(props) => props.theme.primary.font};
	font-size: 30px;
`

const StyledDivider = styled(Divider)`
	height: 80px;
	${(props) =>
		props.theme.type === 'dark'
			? `border-color: ${props.theme.secondary.font};`
			: ''}
`

interface PageLeadBarProps {
	loading?: boolean
	mainTitle?: string
	secondaryText?: string
	secondaryTextLink?: string
	value?: string
	valueInfo?: string
	background?: string
}

/**
 * Generates a lead banner for page components.
 * @param props PageLeadBarProps
 */
const PageLeadBar = (props: PageLeadBarProps) => {
	const { md, lg } = useBreakpoint()
	const {
		mainTitle,
		secondaryText,
		secondaryTextLink,
		value,
		valueInfo,
		background,
	} = props
	if (
		!mainTitle &&
		!secondaryText &&
		!secondaryTextLink &&
		!value &&
		!valueInfo
	)
		return null

	return (
		<StyledMain background={background}>
			<Row
				style={{
					maxWidth: baseTheme.siteWidth,
					margin: 'auto',
					alignItems: 'center',
				}}
				justify="space-between"
			>
				<Col xs={3} sm={2} md={2}>
					<Row>
						<NavLink to="/">
							<StyledBackArrow />
						</NavLink>
					</Row>
				</Col>
				<Col xs={6} sm={4} md={2}>
					<img src={logo} height="51" alt="logo" />
				</Col>
				<Col xs={15} sm={18} md={7}>
					<StyledTitle2 level={5}>{mainTitle}</StyledTitle2>

					{secondaryTextLink ? (
						<StyledLink
							href={secondaryTextLink}
							target="_blank"
							rel="noopener noreferrer"
						>
							<LinkOutlined />
							<StyledSecondaryText2 type="secondary">
								{secondaryText}
							</StyledSecondaryText2>
						</StyledLink>
					) : (
						<StyledSecondaryText3 type="secondary">
							{secondaryText}
						</StyledSecondaryText3>
					)}
				</Col>
				{md || lg ? (
					<Col md={1} style={{ marginTop: '8px' }}>
						<StyledDivider type={'vertical'} />
					</Col>
				) : (
					<></>
				)}
				<Col xs={22} sm={22} md={12} style={{ marginTop: '8px' }}>
					<StyledTitle
						style={{
							margin: 0,
							fontWeight: 700,
							fontSize: '1.7em',
						}}
						level={5}
					>
						{value}
					</StyledTitle>
					<StyledSecondaryText type="secondary">
						{valueInfo}
					</StyledSecondaryText>
				</Col>
			</Row>
		</StyledMain>
	)
}

export default PageLeadBar
