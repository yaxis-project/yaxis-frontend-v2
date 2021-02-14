import { useCallback, useEffect, useState } from 'react'
import { getXSushiStakingContract } from '../yaxis/utils'
import { useWallet } from 'use-wallet'
import useYaxis from './useYaxis'

const useStaking = () => {
	const { account } = useWallet()
	const yaxis = useYaxis()
	const stakingContract = getXSushiStakingContract(yaxis)

	const [stakingData, setStakingData] = useState<any>({})
	const [isClaiming, setClaiming] = useState<boolean>(false)
	const [isExiting, setExiting] = useState<boolean>(false)

	const fetchStakingData = useCallback(async () => {
		try {
			const data: any = {}
			const [incentiveApy] = await Promise.all([
				stakingContract.methods.incentive_apy().call(),
			])
			data.incentiveApy = incentiveApy
			data.initialized = true
			setStakingData(data)
		} catch (e) {}
	}, [stakingContract, setStakingData])

	useEffect(() => {
		if (yaxis && yaxis.web3) {
			fetchStakingData()
		}
	}, [yaxis, fetchStakingData])

	const onClaimReward = useCallback(async () => {
		setClaiming(true)
		try {
			await stakingContract.methods
				.leave('0')
				.send({ from: account })
				.on('transactionHash', (tx: any) => {
					console.log(tx)
					return tx.transactionHash
				})
		} catch (e) {
			console.error(e)
		}
		setClaiming(false)
	}, [account, yaxis])

	const onExit = useCallback(async () => {
		setExiting(true)
		try {
			await stakingContract.methods
				.exit()
				.send({ from: account })
				.on('transactionHash', (tx: any) => {
					console.log(tx)
					return tx.transactionHash
				})
		} catch (e) {
			console.error(e)
		}
		setExiting(false)
	}, [account, yaxis])

	return {
		stakingData,
		isClaiming,
		onClaimReward,
		isExiting,
		onExit,
	}
}

export default useStaking
