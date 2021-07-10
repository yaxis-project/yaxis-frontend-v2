import { useContext } from 'react'
import styled from 'styled-components'
import { Col } from 'antd'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { useContracts } from '../../../contexts/Contracts'
import { useTVL } from '../../../state/internal/hooks'
import { useYaxisSupply } from '../../../state/internal/hooks'
import { usePrices } from '../../../state/prices/hooks'
import Value from '../../../components/Value'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { InfoCircleOutlined } from '@ant-design/icons'
import {
	ExpandableSidePanel,
	CardRow,
} from '../../../components/ExpandableSidePanel'
import { Tooltip } from 'antd'
import Button from '../../../components/Button'
import Typography from '../../../components/Typography'

const { SecondaryText } = Typography

interface TooltipRowProps {
	main: string
	value: any
}

const TooltipRow = ({ main, value }: TooltipRowProps) => (
	<>
		<div
			style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
		>
			{main}
		</div>
		<div>
			<Value
				value={value}
				numberPrefix="$"
				decimals={2}
				color={'white'}
			/>
		</div>
	</>
)

/**
 * Generates an expandable side panel that shows basic overview data for the home page.
 */
export default function HomeExpandableOverview() {
	const { contracts } = useContracts()
	const { prices } = usePrices()
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const { tvl, stakingTvl, metavaultTvl, liquidityTvl } = useTVL()
	const { totalSupply } = useYaxisSupply()

	return (
		<>
			<ExpandableSidePanel
				header={phrases['yAxis Overview'][language]}
				key="1"
			>
				<CardRow
					main={
						<Tooltip
							title={
								<>
									<TooltipRow
										main="Total MetaVault 2.0 value"
										value={metavaultTvl.toNumber()}
									/>
									<TooltipRow
										main="Total YAXIS Staking value"
										value={stakingTvl.toNumber()}
									/>
									<TooltipRow
										main="Total Liquidity Pool value"
										value={liquidityTvl.toNumber()}
									/>
								</>
							}
						>
							<SecondaryText>Total Value Locked </SecondaryText>
							<StyledInfoIcon />
						</Tooltip>
					}
					secondary={
						<Value
							value={tvl.toNumber()}
							numberPrefix="$"
							decimals={2}
						/>
					}
				/>
				<CardRow
					main={<SecondaryText>Price of YAXIS</SecondaryText>}
					secondary={
						<Value
							value={prices.yaxis}
							numberPrefix="$"
							decimals={2}
						/>
					}
					rightContent={
						<Col lg={18} md={12} sm={12} xs={12}>
							<a
								href={`https://app.uniswap.org/#/swap?outputCurrency=${contracts?.currencies.ERC677.yaxis?.contract.address}`}
								target="_blank"
								rel="noopener noreferrer"
							>
								<Button height={'40px'}>Get YAXIS</Button>
							</a>
						</Col>
					}
				/>

				<CardRow
					main={<SecondaryText>Max YAXIS Supply</SecondaryText>}
					secondary={
						<Value
							value={
								totalSupply ? getBalanceNumber(totalSupply) : ''
							}
							decimals={2}
						/>
					}
				/>
			</ExpandableSidePanel>
		</>
	)
}

const StyledInfoIcon = styled(InfoCircleOutlined)`
	position: relative;
	top: 1px;
	margin-left: 2px;
	svg {
		fill: ${(props) => props.theme.secondary.font};
	}
`
