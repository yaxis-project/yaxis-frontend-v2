import { useState, useContext, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { Currencies3Pool } from '../../../constants/currencies'
import DepositAssetRow from './DepositAssetRow'
import { useAllTokenBalances } from '../../../state/wallet/hooks'
import { usePrices } from '../../../state/prices/hooks'
import { useContracts } from '../../../contexts/Contracts'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { reduce } from 'lodash'
import { Row, Col, Grid } from 'antd'
import Typography from '../../../components/Typography'
import { numberToDecimal } from '../../../utils/number'
import useContractWrite from '../../../hooks/useContractWrite'
import Button from '../../../components/Button'
import { ArrowDownOutlined } from '@ant-design/icons'
import {
	CurrencyValues,
	handleFormInputChange,
	computeInsufficientBalance,
	computeTotalDepositing,
} from '../utils'
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
export default function Stable3PoolDeposit({ set3crvValue, value3crv }) {
	const { contracts } = useContracts()
	const { md } = useBreakpoint()
	const { prices } = usePrices()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	const [tokenBalances] = useAllTokenBalances()

	const disabled = useMemo(
		() => computeInsufficientBalance(currencyValues, tokenBalances),
		[currencyValues, tokenBalances],
	)

	const totalDepositing = useMemo(
		() => computeTotalDepositing(Currencies3Pool, currencyValues, prices),
		[currencyValues, prices],
	)

	const { call: handleDeposit3Pool, loading: loadingDeposit3Pool } =
		useContractWrite({
			contractName: 'external.curve3pool',
			method: 'add_liquidity',
			description: `get 3CRV`,
		})

	const handleSubmit = useCallback(async () => {
		try {
			const amounts = Currencies3Pool.map((c) => {
				const _v = currencyValues[c.tokenId]
				if (_v) {
					return numberToDecimal(_v, c.decimals)
				}
				return '0'
			})
			const expected =
				(await contracts?.external.curve3pool.calc_token_amount(
					amounts,
					true,
				)) * 0.99
			await handleDeposit3Pool({
				args: [amounts, new BigNumber(expected).toString()],
			})
			setCurrencyValues(initialCurrencyValues)
			set3crvValue('3CRV', value3crv['3CRV'])
		} catch {}
	}, [currencyValues, handleDeposit3Pool, contracts, value3crv, set3crvValue])

	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	return (
		<>
			{Currencies3Pool.map((currency) => (
				<DepositAssetRow
					key={currency.name}
					currency={currency}
					onChange={handleFormInputChange(setCurrencyValues)}
					value={currencyValues[currency.tokenId]}
					contractName={`currencies.ERC20.${currency.tokenId}.contract`}
					approvee={contracts?.external.curve3pool.address}
				/>
			))}
			<Row
				className="total"
				style={md ? {} : { padding: '0 10%' }}
				align="middle"
			>
				<Col xs={24} sm={24} md={12}>
					<Row justify="center">
						<StyledArrowDownOutlined />
					</Row>
				</Col>
				<Col xs={24} sm={24} md={4}>
					<Text type="secondary">{phrases['Total'][language]}</Text>
					<Title level={3}>${totalDepositing}</Title>
				</Col>
				<Col xs={24} sm={24} md={6}>
					<Button
						disabled={disabled}
						loading={loadingDeposit3Pool}
						onClick={handleSubmit}
					>
						Convert
					</Button>
				</Col>
			</Row>
		</>
	)
}

const StyledArrowDownOutlined = styled(ArrowDownOutlined)`
	color: ${(props) => props.theme.primary.font};
	font-size: 40px;
`
