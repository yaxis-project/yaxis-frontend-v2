import React, { useState, useCallback, useEffect } from 'react'
import { Row, Col, Slider, Tooltip, Radio } from 'antd'
import { CardRow } from '../../components/ExpandableSidePanel'
import Typography from '../Typography'
import Value from '../../components/Value'
import { InfoCircleOutlined } from '@ant-design/icons'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { CalcPages } from '../../state/user/reducer'
import {
	useFutureBalanceCalc,
	useFutureBalanceCalcUpdate,
} from '../../state/user/hooks'

const { Text } = Typography
type Props = {
	balance: BigNumber
	APR: number
	page: CalcPages
	loading?: boolean
}

const StyledRadio = styled(Radio.Group)`
	span {
		color: white;
	}
	margin-bottom: 15px;
`

const StyledRow = styled(Row)`
	font-weight: 700;
	margin-top: 10px;
`

const StyledInfoIcon = styled(InfoCircleOutlined)`
	margin-left: 5px;
	color: ${(props) => props.theme.secondary.font};
	font-size: 15px;
`

const options = [
	{ label: 'Daily', value: '365' },
	{ label: 'Weekly', value: '52' },
	{ label: 'Monthly', value: '12' },
]

const sliderMarks = {
	1: {
		style: {
			color: 'white',
		},
		label: <strong>1 mo</strong>,
	},
	6: {
		style: {
			color: 'white',
		},
		label: <strong>6 mo</strong>,
	},
	12: {
		style: {
			color: 'white',
			width: '50px',
			overflow: 'visible',
		},
		label: <strong>12 mo</strong>,
	},
}

const APYCalculator: React.FC<Props> = ({
	balance: walletBalance,
	APR,
	page,
}) => {
	const { duration, yearlyCompounds } = useFutureBalanceCalc(page)
	const update = useFutureBalanceCalcUpdate(page)

	const handleOnDurationChange = useCallback(
		(duration) => {
			update({ field: 'duration', value: duration })
			const monthlyAPR = new BigNumber(APR).div(12)
			const displayAPR = monthlyAPR.multipliedBy(duration)
			const adjustedCompounds = Math.round(
				(duration / 12) * yearlyCompounds,
			)
			const displayAPY = displayAPR
				.div(100)
				.dividedBy(adjustedCompounds)
				.plus(1)
				.pow(adjustedCompounds)
				.minus(1)
			const earnings = walletBalance.multipliedBy(displayAPY)
			const futureBalance = walletBalance.plus(earnings)
			setBalance(futureBalance)
		},
		[walletBalance, APR, yearlyCompounds, update],
	)
	const [balance, setBalance] = useState(() => {
		const monthlyAPR = new BigNumber(APR).div(100).div(12)
		const displayAPR = monthlyAPR.multipliedBy(duration)
		const adjustedCompounds = Math.round((duration / 12) * yearlyCompounds)
		const displayAPY = displayAPR
			.div(100)
			.dividedBy(adjustedCompounds)
			.plus(1)
			.pow(adjustedCompounds)
			.minus(1)
			.multipliedBy(100)
		const earnings = walletBalance.multipliedBy(displayAPY)
		const futureBalance = walletBalance.plus(earnings)
		return futureBalance
	})

	useEffect(() => {
		handleOnDurationChange(duration)
	}, [handleOnDurationChange, duration])

	return (
		<>
			<CardRow
				main={
					<Tooltip
						style={{ minWidth: '350px' }}
						placement="topLeft"
						title={
							<Col style={{ margin: '10px 20px' }}>
								<StyledRow
									style={{
										marginBottom: '10px',
									}}
								>
									Annual Percentage Rate: {APR.toFixed(2)}%
								</StyledRow>
								<StyledRow
									style={{
										marginBottom: '8px',
									}}
								>
									Compounding Frequency:
								</StyledRow>
								<StyledRadio
									options={options}
									defaultValue={`${yearlyCompounds}`}
									onChange={({ target: { value } }) => {
										update({
											field: 'yearlyCompounds',
											value: Number(value),
										})
									}}
									size="small"
									style={{ color: 'white' }}
								/>
								<StyledRow>See Your Balance In:</StyledRow>

								<Slider
									style={{ width: '90%' }}
									value={duration}
									marks={sliderMarks}
									defaultValue={12}
									min={1}
									max={12}
									tipFormatter={(value) =>
										value > 1
											? `${value} months`
											: `${value} month`
									}
									onChange={handleOnDurationChange}
								/>
							</Col>
						}
					>
						<Text type="secondary">Future Balance</Text>
						<StyledInfoIcon alt="YAXIS Rewards" />
					</Tooltip>
				}
				secondary={
					<Value
						value={balance.toNumber()}
						numberPrefix="$"
						decimals={2}
					/>
				}
			/>
		</>
	)
}

export default APYCalculator
