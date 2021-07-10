import { useContext } from 'react'
import styled from 'styled-components'
import { Tooltip, Row } from 'antd'
import { LanguageContext } from '../../../contexts/Language'
import Value from '../../../components/Value'
import { useAPY } from '../../../state/internal/hooks'
import phrases from './translations'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import Claim from '../../../components/Claim'
import { CardRow } from '../../../components/ExpandableSidePanel'
import Typography from '../../../components/Typography'
import { InfoCircleOutlined } from '@ant-design/icons'
import APYCalculator from '../../../components/APYCalculator'
import BigNumber from 'bignumber.js'

const { Text } = Typography
type Props = { totalUSDBalance: BigNumber; balanceLoading: boolean }

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

const SavingsOverviewCard: React.FC<Props> = ({
	totalUSDBalance,
	balanceLoading,
}) => {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const t = (s: string) => phrases[s][language]

	const {
		yaxisApyPercent,
		yaxisAprPercent,
		// threeCrvApyPercent,
		// lpApyPercent,
		// totalAPR
	} = useAPY('Yaxis', 0.2)

	return (
		<DetailOverviewCard title={t('Account Overview')}>
			<Claim rewardsContract="Yaxis" />
			<CardRow
				main={
					<Tooltip
						title={
							<>
								<Row style={{ marginBottom: '5px' }}>
									Annual Percentage Rate
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
											Annual Percentage Yield
										</Row>
										<TooltipRow
											main={'YAXIS rewards APY:'}
											value={yaxisApyPercent.toNumber()}
											suffix={'* daily compound'}
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
								value={yaxisApyPercent.toNumber()}
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
				loading={balanceLoading}
				page={'staking'}
			/>
		</DetailOverviewCard>
	)
}
export default SavingsOverviewCard

const StyledInfoIcon = styled(InfoCircleOutlined)`
	margin-left: 5px;
	color: ${(props) => props.theme.secondary.font};
	font-size: 15px;
`
