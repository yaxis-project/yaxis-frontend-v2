import { useContext } from 'react'
import styled from 'styled-components'
import { Col, Tooltip } from 'antd'
import Typography from '../../../components/Typography'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import {
	DetailOverviewCard,
	DetailOverviewCardRow,
} from '../../../components/DetailOverviewCard'
import Value from '../../../components/Value'
import { useReturns } from '../../../state/wallet/hooks'
import { InfoCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

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
 * Creates a loadable detail overview for users on the home page, showing financial returns and account balances.
 */
export default function HomeOverviewCard() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const t = (s: string) => phrases[s][language]

	const {
		rewardsUSD,
		rewards: { governance, lp, metaVault },
	} = useReturns()

	return (
		<DetailOverviewCard title={t('Your Lifetime Earnings')}>
			{/* <DetailOverviewCardRow inline>
				<Text>
					<strong>Total</strong>
				</Text>
				<Col>
					<Value
						numberPrefix="$"
						value={totalUSD.toNumber()}
						decimals={2}
					/>
				</Col>
			</DetailOverviewCardRow>
			<DetailOverviewCardRow inline>
				<StyledText>MetaVault Account</StyledText>
				<Col>
					<Value
						numberPrefix="$"
						value={metaVaultUSD.toNumber()}
						decimals={2}
					/>
				</Col>
			</DetailOverviewCardRow> */}
			<DetailOverviewCardRow inline>
				<StyledText>
					Rewards Earned
					<Tooltip
						title={
							<>
								<div
									style={{
										fontSize: '16px',
										fontWeight: 700,
									}}
								>
									Your YAXIS rewards:
								</div>
								<TooltipRow
									main="MetaVault staking"
									value={metaVault.toNumber()}
								/>
								<TooltipRow
									main="Governance (YAXIS) staking"
									value={governance.toNumber()}
								/>
								<TooltipRow
									main="Liquidity Pool token staking"
									value={lp.toNumber()}
								/>
							</>
						}
					>
						<StyledInfoIcon alt="YAXIS Rewards" />
					</Tooltip>
				</StyledText>
				<Col>
					<Value
						numberPrefix="$"
						value={rewardsUSD.toNumber()}
						decimals={2}
					/>
				</Col>
			</DetailOverviewCardRow>
		</DetailOverviewCard>
	)
}

const StyledText = styled(Text)`
	@media only screen and (max-width: 600px) {
		margin-right: 55px;
	}
`

const StyledInfoIcon = styled(InfoCircleOutlined)`
	margin-left: 5px;
	color: ${(props) => props.theme.secondary.font};
	font-size: 15px;
`
