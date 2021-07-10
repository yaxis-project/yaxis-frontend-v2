import { useState, useContext, useMemo, useCallback } from 'react'
import { InvestingDepositCurrencies } from '../../../constants/currencies'
import DepositAssetRow from './DepositAssetRow'
import Stable3PoolDeposit from './Stable3PoolDeposit'
import { useAllTokenBalances, useApprovals } from '../../../state/wallet/hooks'
import { usePrices } from '../../../state/prices/hooks'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import { reduce } from 'lodash'
import { Row, Col, Grid } from 'antd'
import styled from 'styled-components'
import { numberToDecimal } from '../../../utils/number'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import Button from '../../../components/Button'
import Typography from '../../../components/Typography'
import {
	CurrencyValues,
	handleFormInputChange,
	computeInsufficientBalance,
	computeTotalDepositing,
} from '../utils'
import { MAX_UINT } from '../../../utils/number'
import { BigNumber } from 'bignumber.js'

const { Title, Text } = Typography
const { useBreakpoint } = Grid

const initialCurrencyValues: CurrencyValues = reduce(
	InvestingDepositCurrencies,
	(prev, curr) => ({
		...prev,
		[curr.tokenId]: '',
	}),
	{},
)

/**
 * Creates a deposit table for the savings account.
 */
export default function DepositTable() {
	const { contracts } = useContracts()
	const { md } = useBreakpoint()

	const { call: handleDepositAll, loading: isSubmitting } = useContractWrite({
		contractName: 'internal.yAxisMetaVault',
		method: 'depositAll',
		description: `MetaVault deposit`,
	})

	const contract = useMemo(
		() => contracts?.internal.yAxisMetaVault,
		[contracts],
	)

	const calcMinTokenAmount = useCallback(
		async (amounts: string[]) => {
			const threeCrvIndex = 3 // Index from InvestingDepositCurrencies that DepositAll expects
			const defaultSlippage = 0.001 // 0.1%

			try {
				if (contract) {
					const params = [...amounts]
					params.splice(threeCrvIndex, 1)
					const tokensDeposit = await contract.methods
						.calc_token_amount_deposit(params)
						.call()
					const threeCrvDeposit = amounts[threeCrvIndex] || '0'
					return new BigNumber(tokensDeposit)
						.plus(threeCrvDeposit)
						.times(1 - defaultSlippage)
						.integerValue(BigNumber.ROUND_DOWN)
						.toFixed()
				}
			} catch (e) {}
			return '0'
		},
		[contract],
	)

	const onDepositAll = useCallback(
		async (amounts: string[], usdValue: string) => {
			const minMintAmount = await calcMinTokenAmount(amounts)
			const args = [amounts, minMintAmount, false]
			handleDepositAll({ args, descriptionExtra: usdValue })
		},
		[calcMinTokenAmount, handleDepositAll],
	)

	const { prices } = usePrices()
	const [currencyValues, setCurrencyValues] = useState<CurrencyValues>(
		initialCurrencyValues,
	)

	const [tokenBalances] = useAllTokenBalances()

	const {
		metavault: {
			deposit: allowance3crv,
			loadingDeposit: loading3crvAllowance,
		},
	} = useApprovals()

	const disabled = useMemo(
		() =>
			loading3crvAllowance ||
			allowance3crv.lt(MAX_UINT) ||
			computeInsufficientBalance(currencyValues, tokenBalances),
		[currencyValues, tokenBalances, allowance3crv, loading3crvAllowance],
	)

	const totalDepositing = useMemo(
		() =>
			computeTotalDepositing(
				InvestingDepositCurrencies,
				currencyValues,
				prices,
			),
		[currencyValues, prices],
	)

	const handleSubmit = useCallback(async () => {
		const amounts = InvestingDepositCurrencies.map((c) => {
			const _v = currencyValues[c.tokenId]
			if (_v) {
				return numberToDecimal(_v, c.decimals)
			}
			return '0'
		})
		await onDepositAll(amounts, totalDepositing)
		setCurrencyValues(initialCurrencyValues)
	}, [currencyValues, onDepositAll, totalDepositing])

	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	return (
		<div className="deposit-table">
			<HeaderRow className="deposit-asset-header-row">
				<Col xs={6} sm={6} md={5}>
					<Text type="secondary">{phrases['Asset'][language]}</Text>
				</Col>
				<Col xs={8} sm={8} md={7}>
					<Text type="secondary">
						{phrases['Wallet Balance'][language]}
					</Text>
				</Col>
				<StyledCol xs={10} sm={10} md={12}>
					<Text type="secondary">{phrases['Amount'][language]}</Text>
				</StyledCol>
			</HeaderRow>
			<Stable3PoolDeposit
				set3crvValue={handleFormInputChange(setCurrencyValues)}
				value3crv={currencyValues}
			/>
			{[InvestingDepositCurrencies[3]].map((currency) => (
				<DepositAssetRow
					key={currency.name}
					currency={currency}
					onChange={handleFormInputChange(setCurrencyValues)}
					value={currencyValues[currency.tokenId]}
					containerStyle={{ borderTop: '1px solid #eceff1' }}
					contractName={`currencies.ERC20.3crv.contract`}
					approvee={contracts?.internal.yAxisMetaVault.address}
				/>
			))}
			<Row className="total" style={md ? {} : { padding: '0 10%' }}>
				<Col offset={md ? 12 : 0} xs={24} sm={24} md={11}>
					<Text type="secondary">{phrases['Total'][language]}</Text>
					<Title level={3}>${totalDepositing}</Title>
					<Button
						disabled={disabled}
						loading={isSubmitting}
						onClick={handleSubmit}
						style={{ fontSize: '18px' }}
					>
						{phrases['Deposit'][language]}
					</Button>
					<Text
						type="secondary"
						style={{ marginTop: '10px', display: 'block' }}
					>
						{phrases['Withdraw Fee'][language]}: 0.1%
					</Text>
				</Col>
			</Row>
		</div>
	)
}

const HeaderRow = styled(Row)`
	margin-top: 10px;
`

const StyledCol = styled(Col)`
	@media only screen and (max-width: 400px) {
		padding-left: 16px;
	}
`
