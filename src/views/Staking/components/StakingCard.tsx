import { useContext, useState, useMemo, useCallback } from 'react'
import { YAXIS } from '../../../constants/currencies'
import { useContracts } from '../../../contexts/Contracts'
import useContractWrite from '../../../hooks/useContractWrite'
import Value from '../../../components/Value'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import Typography from '../../../components/Typography'
import Card from '../../../components/Card'
import { Row, Col, Form } from 'antd'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '../../../utils/formatBalance'
import {
	useStakedBalances,
	useAllTokenBalances,
} from '../../../state/wallet/hooks'
const { Text } = Typography

/**
 * Construct a simple colomn with secondary text for use in a row.
 * @param props any
 */

const TableHeader = (props: any) => (
	<Col span={props.span}>
		<Text style={{ float: props.float || 'none' }} type="secondary">
			{props.value}
		</Text>
	</Col>
)

/**
 * Generate the main YAX staking card for the vault.
 */
export default function StakingCard() {
	const languages = useContext(LanguageContext)
	const { contracts } = useContracts()
	const t = useCallback(
		(s: string) => phrases[s][languages?.state?.selected],
		[languages],
	)

	const [{ yaxis }] = useAllTokenBalances()
	const { Yaxis } = useStakedBalances()
	const yaxisBalance = useMemo(
		() => yaxis?.amount || new BigNumber(0),
		[yaxis],
	)
	const stakedBalance = useMemo(
		() => Yaxis?.amount || new BigNumber(0),
		[Yaxis],
	)
	const walletBalance = useMemo(
		() => yaxis?.value || new BigNumber(0),
		[yaxis],
	)

	const { call: onEnter, loading: loadingEnter } = useContractWrite({
		contractName: 'currencies.ERC677.yaxis.contract',
		method: 'transferAndCall',
		description: `stake YAXIS`,
	})

	const { call: onLeave, loading: loadingLeave } = useContractWrite({
		contractName: 'rewards.Yaxis',
		method: 'withdraw',
		description: `unstake YAXIS`,
	})

	const [depositAmount, setDeposit] = useState<string>('')

	/**
	 * Computes
	 */
	const stakeYAXIS = useCallback(() => {
		const Yaxis = new BigNumber(depositAmount).times(1e18).toString()
		onEnter({
			args: [
				contracts?.rewards.Yaxis.address,
				Yaxis,
				contracts?.rewards.Yaxis.interface.encodeFunctionData('stake', [
					Yaxis,
				]),
			],
			cb: () => setDeposit('0'),
		})
	}, [depositAmount, onEnter, contracts])

	const [withdrawAmount, setWithdraw] = useState<string>('')

	const unstakeYAXIS = useCallback(async () => {
		const sYaxis = new BigNumber(withdrawAmount).times(1e18)
		onLeave({
			args: [sYaxis.toString()],
			cb: () => setWithdraw('0'),
		})
	}, [onLeave, withdrawAmount])

	const updateDeposit = (value: string) =>
		!isNaN(Number(value)) && setDeposit(value)

	const errorDeposit = useMemo(
		() => new BigNumber(depositAmount).gt(walletBalance.div(1e18)),
		[walletBalance, depositAmount],
	)
	const depositDisabled = useMemo(
		() =>
			depositAmount === '' ||
			new BigNumber(depositAmount).eq(new BigNumber(0)) ||
			errorDeposit,
		[depositAmount, errorDeposit],
	)
	const maxDeposit = () => setDeposit(yaxisBalance.toString() || '0')

	const updateWithdraw = (value: string) =>
		!isNaN(Number(value)) && setWithdraw(value)
	const errorWithdraw = useMemo(
		() => new BigNumber(withdrawAmount).gt(stakedBalance),
		[stakedBalance, withdrawAmount],
	)
	const withdrawDisabled = useMemo(
		() =>
			withdrawAmount === '' ||
			new BigNumber(withdrawAmount).eq(new BigNumber(0)) ||
			errorWithdraw,
		[withdrawAmount, errorWithdraw],
	)

	const maxWithdraw = () => setWithdraw(stakedBalance.toString() || '0')

	return (
		<Card
			className="staking-card"
			title={
				<Text>
					<strong>{t('Staking')}</strong>
				</Text>
			}
		>
			<Row gutter={24}>
				<TableHeader value={t('Available Balance')} span={12} />
				<TableHeader value={t('Staked Balance')} span={12} />
			</Row>

			<Row gutter={24}>
				<Col span={12}>
					<Row align="middle" style={{ borderBottom: 'none' }}>
						<img
							src={YAXIS.icon}
							height="24"
							alt="logo"
							style={{ marginRight: '6px' }}
						/>
						<Value
							value={getBalanceNumber(walletBalance)}
							decimals={2}
							numberSuffix=" YAXIS"
						/>
					</Row>
				</Col>
				<Col span={12} className={'balance'}>
					<Row align="middle" style={{ borderBottom: 'none' }}>
						<img
							src={YAXIS.icon}
							height="24"
							alt="logo"
							style={{ marginRight: '6px' }}
						/>
						<Value
							value={stakedBalance.toNumber()}
							decimals={2}
							numberSuffix=" YAXIS"
						/>
					</Row>
				</Col>
			</Row>

			<Row gutter={24}>
				<Col span={12}>
					<Form.Item validateStatus={errorDeposit && 'error'}>
						<Input
							onChange={(e) => updateDeposit(e.target.value)}
							value={depositAmount}
							min={'0'}
							placeholder="0"
							disabled={loadingEnter || walletBalance.isZero()}
							suffix={YAXIS.name}
							onClickMax={maxDeposit}
						/>
					</Form.Item>
					<Button
						disabled={depositDisabled}
						onClick={stakeYAXIS}
						loading={loadingEnter}
					>
						{t('Stake')}
					</Button>
				</Col>
				<Col span={12}>
					<Form.Item validateStatus={errorWithdraw && 'error'}>
						<Input
							onChange={(e) => updateWithdraw(e.target.value)}
							value={withdrawAmount}
							min={'0'}
							placeholder="0"
							disabled={loadingLeave || stakedBalance.isZero()}
							suffix="YAXIS"
							onClickMax={maxWithdraw}
						/>
					</Form.Item>
					<Button
						disabled={withdrawDisabled}
						onClick={unstakeYAXIS}
						loading={loadingLeave}
					>
						{t('Unstake')}
					</Button>
				</Col>
			</Row>
		</Card>
	)
}
