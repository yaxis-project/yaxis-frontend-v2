import styled from 'styled-components'
import { currentConfig } from '../../../constants/configs'
import { LiquidityPool } from '../../../constants/type'
import { Row, Col, Collapse } from 'antd'
import { Currencies } from '../../../constants/currencies'
import { brandBlue } from '../../../theme/colors'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { NavLink } from 'react-router-dom'
import Typography from '../../../components/Typography'

const { SecondaryText } = Typography

const { Panel } = Collapse

interface AdvancedNavigationRowProps {
	contextType: string
	data: LiquidityPool
	to: string
}

const StyledCollapse = styled(Collapse)`
	background: ${(props) => props.theme.secondary.background};
	border-color: ${(props) => props.theme.secondary.border};

	svg {
		fill: ${(props) => props.theme.primary.font};
	}
`

const StyledPanelTitle = styled.span`
	color: ${(props) => props.theme.primary.font};
`

const StyledRow = styled(Row)`
	background: ${(props) => props.theme.secondary.background};
	padding: 18px 22px;
	align-items: center;
`

const StyledNavLink = styled(NavLink)`
	font-size: 18px;
`

const StyledImage = styled.img`
	position: absolute;
	left: 15px;
`

/**
 * Generates a row component styled with icons and a given linke.
 * @param props AdvancedNavigationRowProps
 */

function AdvancedNavigationRow(props: AdvancedNavigationRowProps) {
	const { contextType, data, to } = props
	const [token1, token2] = data.lpTokens
	return (
		<StyledRow justify="center">
			<Col xs={24} sm={3} style={{ margin: '8px' }}>
				<img
					src={Currencies[token1.tokenId.toUpperCase()]?.icon}
					height="24"
					alt="logo"
				/>
				<StyledImage
					src={Currencies[token2.tokenId.toUpperCase()]?.icon}
					height="24"
					alt="logo"
				/>
			</Col>
			<Col xs={24} sm={20}>
				<Row>
					<SecondaryText type="secondary">
						{contextType}
					</SecondaryText>
					{/* <StyledRiskBadge>HIGHER RISK</StyledRiskBadge> */}
				</Row>
				<Row>
					<StyledNavLink to={to} style={{ color: brandBlue }}>
						{data.name} →
					</StyledNavLink>
				</Row>
			</Col>
		</StyledRow>
	)
}

/**
 * Styled component to contain a collapsable navigation segment.
 * @see AdvancedNavigationRow
 */
export default function AdvancedNavigation() {
	const { chainId } = useWeb3Provider()

	const currentPools = Object.values(currentConfig(chainId).pools).filter(
		(pool) => pool.active && !pool.legacy,
	)

	return currentPools.length > 0 ? (
		<StyledCollapse expandIconPosition="right">
			<Panel
				header={<StyledPanelTitle>Liquidity Pools</StyledPanelTitle>}
				key="1"
			>
				{currentPools.map((pool) => (
					<AdvancedNavigationRow
						key={pool.name}
						contextType="Provide Liquidity"
						data={pool}
						to={`/liquidity/${pool.lpAddress}`}
					/>
				))}
			</Panel>
		</StyledCollapse>
	) : null
}
