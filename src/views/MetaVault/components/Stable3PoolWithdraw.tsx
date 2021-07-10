import { useState, useContext, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { threeCRV, Currencies3Pool } from '../../../constants/currencies'
import WithdrawAssetRow from './WithdrawAssetRow'
import { useAllTokenBalances } from '../../../state/wallet/hooks'
import { usePrices } from '../../../state/prices/hooks'
import { useContracts } from '../../../contexts/Contracts'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { reduce } from 'lodash'
import Typography from '../../../components/Typography'
import { Row, Col, Grid } from 'antd'
import useContractWrite from '../../../hooks/useContractWrite'
import Button from '../../../components/Button'
import Divider from '../../../components/Divider'
import { CurrencyValues, handleFormInputChange } from '../utils'
import BigNumber from 'bignumber.js'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const initialCurrencyValues: CurrencyValues = reduce(
	Currencies3Pool,
	(prev, curr) => ({
		...prev,
		[curr.tokenId]: '',
	}),
	{},
)

/**
 * Creates a deposit table for the savings account.
 */
export default function Stable3PoolWithdraw() {
	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	const { md } = useBreakpoint()
	const { contracts } = useContracts()
	const { prices } = usePrices()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	const [tokenBalances] = useAllTokenBalances()

	const balance3CRV = useMemo(
		() => tokenBalances['3crv']?.amount || new BigNumber(0),
		[tokenBalances],
	)

	const input3CRV = useMemo(
		() =>
			Object.entries(currencyValues).reduce(
				(acc, [symbol, value]) => acc.plus(value || 0),
				new BigNumber(0),
			),
		[currencyValues],
	)

	const { call: handleWithdraw3Pool, loading: loadingWithdraw3Pool } =
		useContractWrite({
			contractName: 'external.curve3pool',
			method: 'remove_liquidity_imbalance',
			description: `convert 3CRV`,
		})

	const usdBalance3CRV = useMemo(
		() => balance3CRV.multipliedBy(prices?.['3crv']),
		[balance3CRV, prices],
	)

	const error = useMemo(
		() => input3CRV.gt(balance3CRV),
		[input3CRV, balance3CRV],
	)

	const handleSubmit = useCallback(async () => {
		try {
			const conversions = Object.fromEntries(
				await Promise.all(
					Currencies3Pool.map(async (c, i) => {
						const conversion = await contracts?.external.curve3pool[
							'calc_withdraw_one_coin'
						](
							new BigNumber(1)
								.multipliedBy(10 ** threeCRV.decimals)
								.toString(),
							`${i}`,
							{},
						)
						return [c?.tokenId, conversion]
					}),
				),
			)
			const amounts = Currencies3Pool.map((c) => {
				const _v = currencyValues[c.tokenId]
				if (_v)
					return new BigNumber(_v)
						.multipliedBy(conversions[c.tokenId].toString())
						.toFixed(0)
						.toString()
				return '0'
			})
			const reciept = await handleWithdraw3Pool({
				args: [
					amounts,
					input3CRV.multipliedBy(10 ** threeCRV.decimals).toString(),
				],
			})

			if (reciept) setCurrencyValues(initialCurrencyValues)
		} catch (e) {
			console.log(e)
		}
	}, [currencyValues, input3CRV, handleWithdraw3Pool, contracts])

	return (
		<>
			<Row gutter={20} align="middle" style={{ marginBottom: '10px' }}>
				<Col xs={4} sm={6}>
					<Text>{phrases['You have'][language]}</Text>
				</Col>
				<Col span={3}>
					<img src={threeCRV.icon} height="36" alt="logo" />
				</Col>
				<Col>
					<Title
						level={4}
						style={{
							margin: 0,
						}}
					>
						{balance3CRV.toFixed(2)} 3CRV
					</Title>
					<Title level={5} type="secondary" style={{ margin: 0 }}>
						${usdBalance3CRV.toFixed(2)}
					</Title>
				</Col>
			</Row>
			<Divider style={{ marginTop: '0' }}>
				<Text>TO</Text>
			</Divider>
			{Currencies3Pool.map((currency) => (
				<PaddedRow key={currency.name}>
					<WithdrawAssetRow
						currency={currency}
						onChange={handleFormInputChange(setCurrencyValues)}
						value={currencyValues[currency.tokenId]}
						error={error}
						balance={balance3CRV}
						inputBalance={input3CRV}
						approvee={contracts?.external.curve3pool.address}
					/>
				</PaddedRow>
			))}
			<Row style={md ? {} : { padding: '0 10%' }} align="middle">
				<Col xs={24} sm={24} md={24} style={{ marginTop: '10px' }}>
					<Button
						disabled={balance3CRV.eq(0) || error || input3CRV.eq(0)}
						loading={loadingWithdraw3Pool}
						onClick={handleSubmit}
					>
						Convert
					</Button>
				</Col>
			</Row>
		</>
	)
}

const PaddedRow = styled.div`
	margin-bottom: 10px;
`
