import { useCallback, useMemo, useState } from 'react'
import { notification } from 'antd'
import { useContracts } from '../contexts/Contracts'
import useWeb3Provider from './useWeb3Provider'
import { Contract } from '@ethersproject/contracts'
import objectPath from 'object-path'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin } from '../utils/number'

interface Params {
	contractName: string
	method: string
	description: string
}

interface CallOptions {
	amount?: string
	cb?: Function
	args?: any[]
	descriptionExtra?: string
}

const useContractWrite = ({ contractName, method, description }: Params) => {
	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(false)

	const { account, library } = useWeb3Provider()
	const { contracts } = useContracts()

	const contract = useMemo(() => {
		if (contracts) {
			const c = objectPath.get(contracts, contractName) as Contract
			if (!c)
				console.error(`Unable to initialize contract: ${contractName}`)
			return c
		}
		return null
	}, [contracts, contractName])

	const addTransaction = useTransactionAdder()

	const call = useCallback(
		async ({ args, amount, cb, descriptionExtra }: CallOptions = {}) => {
			try {
				if (!library || !account) return
				if (!contract) throw new Error('Contract not loaded')
				const c = contract.connect(
					library.getSigner(account).connectUnchecked(),
				)
				setLoading(true)
				notification.info({
					message: `Please confirm ${description}.`,
				})
				const gasCost = await c.estimateGas[method](...(args || []), {})
				const config: any = {
					gasLimit: calculateGasMargin(gasCost),
				}
				if (amount) config.value = amount
				const m = c[method]
				const receipt = await m(...(args || []), config)
				await receipt.wait()
				if (cb) cb()
				addTransaction(receipt, {
					method,
					summary: description,
					contract: contractName,
					amount: descriptionExtra,
				})
				setData(receipt)
				setLoading(false)
				return receipt
			} catch (e) {
				console.error(e)
				notification.error({
					description: e.message,
					message: `Unable to ${description}:`,
				})
				setLoading(false)
				return false
			}
		},
		[
			account,
			library,
			contract,
			description,
			method,
			contractName,
			addTransaction,
		],
	)

	return { loading, data, call }
}

export default useContractWrite
