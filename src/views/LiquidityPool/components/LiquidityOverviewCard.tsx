import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import styled from 'styled-components'
import { CardRow } from '../../../components/ExpandableSidePanel'
import { Tooltip, Row } from 'antd'
import Value from '../../../components/Value'
import Typography from '../../../components/Typography'
import { useAPY } from '../../../state/internal/hooks'
import { useAccountLP } from '../../../state/wallet/hooks'
import { LiquidityPool } from '../../../constants/type'
import Claim from '../../../components/Claim'
import LegacyClaim from './LegacyClaim'
import APYCalculator from '../../../components/APYCalculator'
import BigNumber from 'bignumber.js'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

interface LiquidityOverviewCardProps {
	pool: LiquidityPool
	totalUSDBalance: BigNumber
}

interface TooltipRowProps {
	main: string
	value: any
	suffix?: string
}

const TooltipRow = ({ main, value, suffix }: TooltipRowProps) => (
	<>
		<div
			style={{ textDecoration: 'underline', textUnderlineOffset: '4px' }}
		>
			{main}
		</div>
		<Row>
			<Value
				value={value}
				numberSuffix="%"
				decimals={2}
				color={'white'}
			/>
			<span style={{ fontSize: '10px' }}>{suffix}</span>
		</Row>
	</>
)

/**
 * Shows details of the liquidity pools locked in the system.
 */
const LiquidityOverviewCard: React.FC<LiquidityOverviewCardProps> = ({
	pool,
	totalUSDBalance,
}) => {
	const { yaxisAprPercent } = useAPY(pool?.rewards)

	const { poolShare } = useAccountLP(pool)

	return (
		<DetailOverviewCard title="Overview">
			{pool?.legacy ? (
				<LegacyClaim pool={pool} />
			) : (
				<Claim rewardsContract={pool.rewards} />
			)}
			<CardRow
				main="Share of Pool"
				secondary={
					<Value
						value={poolShare.times(100).toNumber()}
						numberSuffix="%"
						decimals={2}
					/>
				}
			/>
			<CardRow
				main={
					<Tooltip
						title={
							<>
								<Row style={{ marginBottom: '5px' }}>
									<Text>Annual Percentage Rate</Text>
								</Row>
								<TooltipRow
									main={'YAXIS rewards APR:'}
									value={yaxisAprPercent.toNumber()}
								/>
							</>
						}
					>
						<Text type="secondary">Total APR </Text>
						<StyledInfoIcon alt="YAXIS Rewards" />
					</Tooltip>
				}
				secondary={
					<Value
						value={yaxisAprPercent.toNumber()}
						numberSuffix="%"
						decimals={2}
					/>
				}
				rightContent={
					<>
						<Row>
							<Tooltip
								title={
									<>
										<Row style={{ marginBottom: '5px' }}>
											<Text>Annual Percentage Yield</Text>
										</Row>
										<TooltipRow
											main={'YAXIS rewards APY:'}
											value={yaxisAprPercent
												.div(100)
												.dividedBy(12)
												.plus(1)
												.pow(12)
												.minus(1)
												.multipliedBy(100)
												.toNumber()}
											suffix={'* monthly compound'}
										/>
									</>
								}
							>
								<Text type="secondary">Total APY </Text>
								<StyledInfoIcon alt="YAXIS Rewards" />
							</Tooltip>
						</Row>
						<Row>
							<Value
								value={yaxisAprPercent
									.div(100)
									.dividedBy(12)
									.plus(1)
									.pow(12)
									.minus(1)
									.multipliedBy(100)
									.toNumber()}
								numberSuffix={'%'}
								decimals={2}
							/>
						</Row>
					</>
				}
			/>
			<APYCalculator
				APR={yaxisAprPercent.toNumber()}
				balance={totalUSDBalance}
				loading={false}
				page={'lp'}
			/>
		</DetailOverviewCard>
	)
}

export default LiquidityOverviewCard

const StyledInfoIcon = styled(InfoCircleOutlined)`
	margin-left: 5px;
	color: ${(props) => props.theme.secondary.font};
	font-size: 15px;
`
