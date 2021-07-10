import { useState, useContext, useCallback, useMemo } from 'react'
import { Row, Col, Form, Tooltip } from 'antd'
import { threeCRV, MVLT } from '../../../constants/currencies'
import { numberToDecimal } from '../../../utils/number'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import BigNumber from 'bignumber.js'
import useContractWrite from '../../../hooks/useContractWrite'
import Value from '../../../components/Value'
import Typography from '../../../components/Typography'
import Divider from '../../../components/Divider'
import Button from '../../../components/Button'
import { ArrowDownOutlined } from '@ant-design/icons'
import info from '../../../assets/img/info.svg'
import { usePrices } from '../../../state/prices/hooks'
import Input from '../../../components/Input'
import Stable3PoolWithdraw from './Stable3PoolWithdraw'
import styled from 'styled-components'
import { useAccountMetaVaultData } from '../../../state/wallet/hooks'
import { useMetaVaultData } from '../../../state/internal/hooks'
import { useContracts } from '../../../contexts/Contracts'
const { Title, Text } = Typography

/**
 * Generates the withdraw component, allowing a user to select investment currency to withdraw from.
 */
export default function WithdrawTable() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected
	const t = useCallback((s: string) => phrases[s][language], [language])

	const { contracts } = useContracts()
	const { mvltPrice } = useMetaVaultData()
	const { deposited } = useAccountMetaVaultData()

	const [withdrawValueUSD, setWithdrawValueUSD] = useState('')

	const totalAvailableInUSD = useMemo(
		() => new BigNumber(deposited || '0').multipliedBy(mvltPrice || '0'),
		[deposited, mvltPrice],
	)

	const withdrawValueShares = useMemo(
		() => new BigNumber(withdrawValueUSD).div(mvltPrice),
		[withdrawValueUSD, mvltPrice],
	)

	const updateWithdraw = (value: string) => setWithdrawValueUSD(value)
	const withdrawalError = new BigNumber(withdrawValueUSD).gt(
		totalAvailableInUSD,
	)
	const withdrawDisabled =
		withdrawValueUSD === '' ||
		new BigNumber(withdrawValueUSD).isLessThanOrEqualTo(new BigNumber(0)) ||
		withdrawalError

	const { call: handleWithdraw, loading: submitting } = useContractWrite({
		contractName: 'internal.yAxisMetaVault',
		method: 'withdraw',
		description: `MetaVault withdraw`,
	})

	const onWithdraw = useCallback(
		async (
			sharesAmount: string,
			currencyAddress: string,
			usdValue: string,
		) => {
			const args = [
				new BigNumber(sharesAmount).toFixed(0),
				currencyAddress,
			]
			await handleWithdraw({ args, descriptionExtra: usdValue })
		},
		[handleWithdraw],
	)

	const handleSubmit = useCallback(async () => {
		const sharesAmount = numberToDecimal(withdrawValueShares, 18)
		await onWithdraw(
			sharesAmount,
			contracts?.currencies.ERC20['3crv'].contract.address,
			withdrawValueUSD,
		)
		setWithdrawValueUSD('')
	}, [contracts, onWithdraw, withdrawValueShares, withdrawValueUSD])

	const { prices } = usePrices()

	const withdrawTokenAmount = useMemo(() => {
		const price = prices['3crv']
		if (price)
			return new BigNumber(withdrawValueUSD || 0)
				.multipliedBy(0.999)
				.div(price)
		return new BigNumber(0)
	}, [withdrawValueUSD, prices])

	return (
		<>
			<WithdrawRow>
				<Col xs={24} sm={8}>
					<Title level={5}>{phrases['From'][language]}</Title>
				</Col>
				<Col xs={24} sm={16}>
					<Row align="middle" gutter={14}>
						<Col>
							<img src={MVLT.icon} height="36" alt="logo" />
						</Col>
						<Col>
							<Text>
								{phrases['Investment Account'][language]}
							</Text>
						</Col>
					</Row>
					<Row style={{ padding: '6px 0' }}>
						<Text type="secondary">
							{phrases['Available'][language]}:
							<Tooltip
								title={
									<>
										{new BigNumber(deposited || 0).toFixed(
											2,
										) + ' MVLT'}
									</>
								}
							>
								{' $' + totalAvailableInUSD.toFixed(2)}{' '}
								<img
									src={info}
									style={{ position: 'relative', top: -2 }}
									height="15"
									alt="Withdraw Token Breakdown"
								/>
							</Tooltip>
						</Text>
					</Row>
					<Form.Item validateStatus={withdrawalError && 'error'}>
						<Input
							onChange={(e) =>
								!isNaN(Number(e.target.value)) &&
								updateWithdraw(e.target.value)
							}
							value={withdrawValueUSD}
							min={'0'}
							placeholder="0"
							disabled={
								submitting || totalAvailableInUSD.isZero()
							}
							suffix={'USD'}
							onClickMax={() =>
								updateWithdraw(totalAvailableInUSD.toString())
							}
						/>
					</Form.Item>
				</Col>
			</WithdrawRow>

			<Divider>
				<DividerArrow />
			</Divider>

			<WithdrawRow>
				<Col xs={24} sm={8}>
					<Title level={5}>{phrases['To Wallet'][language]}</Title>
				</Col>
				<Col xs={24} sm={16}>
					<Row align="middle">
						<Col span={3}>
							<Row>
								<img
									src={threeCRV.icon}
									height="36"
									alt="logo"
								/>
							</Row>
						</Col>
						<Col span={14}>
							<Row>
								<Text type="secondary">
									{t("You'll receive an estimate of")}
								</Text>
							</Row>
							<Row>
								<Value
									value={withdrawTokenAmount.toFixed(2)}
									numberSuffix={` 3CRV`}
									extra={
										'$' +
										new BigNumber(withdrawValueUSD || 0)
											.times(0.999)
											.toFixed(2)
									}
								/>
							</Row>
						</Col>
					</Row>
					<Row style={{ margin: '10px 0' }}>
						<Button
							disabled={withdrawDisabled}
							loading={submitting}
							onClick={handleSubmit}
						>
							{t('Withdraw')}
						</Button>
					</Row>
					<Text type="secondary">{t('Withdraw Fee')}: 0.1%</Text>
				</Col>
			</WithdrawRow>

			<Divider>
				<DividerArrow />
			</Divider>

			<WithdrawRow>
				<Col xs={24} sm={8}>
					<Title level={5}>{t('Convert')}</Title>
				</Col>
				<Col xs={24} sm={16}>
					<Stable3PoolWithdraw />
				</Col>
			</WithdrawRow>
		</>
	)
}

const WithdrawRow = styled(Row)`
	margin: 28px 22px;
	position: relative;
`

const DividerArrow = styled(ArrowDownOutlined)`
	font-size: 24px;
	background: ${(props) => props.theme.secondary.background};
	border: 8px solid ${(props) => props.theme.secondary.background};
	color: ${(props) => props.theme.primary.font};
	svg {
		opacity: 0.3;
	}
`
