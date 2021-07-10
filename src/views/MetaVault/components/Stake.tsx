import { useContext, useState, useMemo, useCallback } from 'react'
import { MVLT } from '../../../constants/currencies'
import { LoadingOutlined } from '@ant-design/icons'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import useContractWrite from '../../../hooks/useContractWrite'
import { useContracts } from '../../../contexts/Contracts'
import { useRewardsBalances } from '../../../state/wallet/hooks'
import Value from '../../../components/Value'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import { LanguageContext } from '../../../contexts/Language'
import phrases from './translations'
import Typography from '../../../components/Typography'
import Card from '../../../components/Card'
import { Row, Col, Form, Result, Spin } from 'antd'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '../../../utils/formatBalance'
import { useApprovals } from '../../../state/wallet/hooks'
import { ethers } from 'ethers'
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

function Stake({ mvlt }) {
	const languages = useContext(LanguageContext)
	const t = useCallback(
		(s: string) => phrases[s][languages?.state?.selected],
		[languages],
	)
	const { call: handleStake, loading: loadingStake } = useContractWrite({
		contractName: `rewards.MetaVault`,
		method: 'stake',
		description: `stake MVLT`,
	})
	const { call: handleUnstake, loading: loadingUnstake } = useContractWrite({
		contractName: `rewards.MetaVault`,
		method: 'withdraw',
		description: `unstake MVLT`,
	})

	const { rawWalletBalance, walletBalance, stakedBalance, rawStakedBalance } =
		useRewardsBalances('mvlt', 'MetaVault')

	const [depositAmount, setDeposit] = useState<string>('')
	const updateDeposit = (value: string) =>
		!isNaN(Number(value)) && setDeposit(value)
	const errorDeposit = useMemo(
		() => new BigNumber(depositAmount).gt(rawWalletBalance.div(1e18)),
		[rawWalletBalance, depositAmount],
	)
	const depositDisabled = useMemo(
		() =>
			depositAmount === '' ||
			new BigNumber(depositAmount).isZero() ||
			errorDeposit,
		[depositAmount, errorDeposit],
	)
	const onMaxDeposit = () => setDeposit(walletBalance.toString() || '0')

	const [withdrawAmount, setWithdraw] = useState<string>('')
	const updateWithdraw = (value: string) =>
		!isNaN(Number(value)) && setWithdraw(value)
	const errorWithdraw = useMemo(
		() => new BigNumber(withdrawAmount).gt(rawStakedBalance),
		[rawStakedBalance, withdrawAmount],
	)
	const withdrawDisabled = useMemo(
		() =>
			withdrawAmount === '' ||
			new BigNumber(withdrawAmount).isZero() ||
			errorWithdraw,
		[withdrawAmount, errorWithdraw],
	)

	const onMaxWithdraw = () => setWithdraw(stakedBalance.toString() || '0')

	return (
		<>
			<Row gutter={24}>
				<TableHeader value={t('Available Balance')} span={12} />
				<TableHeader value={t('Staked Balance')} span={12} />
			</Row>

			<Row gutter={24}>
				<Col span={12} className={'balance'}>
					<img src={MVLT.icon} height="24" alt="logo" />
					<Value
						value={getBalanceNumber(rawWalletBalance)}
						decimals={2}
						numberSuffix={` ${MVLT.name}`}
					/>
				</Col>
				<Col span={12} className={'balance'}>
					<img src={MVLT.icon} height="24" alt="logo" />
					<Value
						value={getBalanceNumber(rawStakedBalance)}
						decimals={2}
						numberSuffix={` ${MVLT.name}`}
					/>
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
							disabled={loadingStake || walletBalance.isZero()}
							onClickMax={onMaxDeposit}
						/>
					</Form.Item>
					<Button
						disabled={depositDisabled}
						onClick={async () =>
							await handleStake({
								args: [
									new BigNumber(depositAmount)
										.multipliedBy(10 ** MVLT.decimals)
										.toString(),
								],
								cb: () => setDeposit('0'),
							})
						}
						loading={loadingStake}
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
							disabled={loadingUnstake || stakedBalance.isZero()}
							onClickMax={onMaxWithdraw}
						/>
					</Form.Item>
					<Button
						disabled={withdrawDisabled}
						onClick={async () =>
							await handleUnstake({
								args: [
									new BigNumber(withdrawAmount)
										.multipliedBy(10 ** MVLT.decimals)
										.toString(),
								],
								cb: () => setWithdraw('0'),
							})
						}
						loading={loadingUnstake}
					>
						{t('Unstake')}
					</Button>
				</Col>
			</Row>
		</>
	)
}

export default function ApprovalWrapper() {
	const { account } = useWeb3Provider()
	const {
		metavault: { loadingStaking: loadingAllowance, staking: allowance },
	} = useApprovals()

	const languages = useContext(LanguageContext)
	const t = useCallback(
		(s: string) => phrases[s][languages?.state?.selected],
		[languages],
	)

	const { contracts } = useContracts()

	const { call: onApprove, loading } = useContractWrite({
		contractName: `internal.yAxisMetaVault`,
		method: 'approve',
		description: `approve MVLT`,
	})

	const body = useMemo(() => {
		if (!account)
			return (
				<Row justify="center">
					<Result
						status="warning"
						title={
							<Text>
								Connect a wallet to start earning rewards.
							</Text>
						}
						style={{ height: '202px' }}
					/>
				</Row>
			)
		if (loadingAllowance)
			return (
				<Row
					justify="center"
					align="middle"
					style={{ height: '202px' }}
				>
					<Spin
						indicator={
							<LoadingOutlined style={{ fontSize: 54 }} spin />
						}
					/>
				</Row>
			)
		if (new BigNumber(allowance).isEqualTo(0))
			return (
				<>
					<Row justify="center" style={{ paddingBottom: '20px' }}>
						<Col>
							<Text>
								To start staking, first approve the Rewards
								contract to use your MVLT.
							</Text>
						</Col>
					</Row>
					<Row justify="center">
						<Col span={4}>
							<Button
								onClick={() =>
									onApprove({
										args: [
											contracts?.rewards.MetaVault
												.address,
											ethers.constants.MaxUint256,
										],
									})
								}
								loading={loading}
							>
								{t('Approve')}
							</Button>
						</Col>
					</Row>
				</>
			)
		return <Stake mvlt={contracts?.internal.yAxisMetaVault.address} />
	}, [account, loadingAllowance, allowance, loading, onApprove, t, contracts])

	return (
		<Card
			className="staking-card"
			title={
				<Text>
					<strong>{t('Staking')}</strong>
				</Text>
			}
		>
			{body}
		</Card>
	)
}
