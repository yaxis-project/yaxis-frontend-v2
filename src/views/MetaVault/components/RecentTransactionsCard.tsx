import { useContext, useMemo, useState } from 'react'
import { Button, Row, Col, Pagination } from 'antd'
import Card from '../../../components/Card'
import Typography from '../../../components/Typography'
import { CloseOutlined } from '@ant-design/icons'
import transactionIn from '../../../assets/img/icons/transaction-in.svg'
import transactionOut from '../../../assets/img/icons/transaction-out.svg'
import { LanguageContext } from '../../../contexts/Language'
import { Languages } from '../../../utils/languages'
import phrases from './translations'
import { TransactionDetails } from '../../../state/transactions/reducer'
import { useAllTransactions } from '../../../state/transactions/hooks'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { NETWORK_NAMES } from '../../../connectors'
import { etherscanUrl } from '../../../utils'
import styled from 'styled-components'
import moment from 'moment'

const { Text, Title } = Typography

const ClearTransactionsButton = styled(Button)`
	color: #016eac;
	button-radius: none;
	border: none;
	position: relative;
	//top: -2.5px;
	//left: 10px;
	padding: 0;
	line-height: 1em;
	box-shadow: none;
`

interface CardTitleProps {
	language: Languages
	onClearTransactions: Function
	showClear: boolean
}

const CardTitle = (props: CardTitleProps) => {
	const { language, onClearTransactions, showClear } = props
	return (
		<>
			<Title level={4}>{phrases['Recent Transactions'][language]}</Title>
			{showClear ? (
				<ClearTransactionsButton
					onClick={() => onClearTransactions()}
					style={{ float: 'right' }}
				>
					{phrases['Clear all'][language]} <CloseOutlined />
				</ClearTransactionsButton>
			) : (
				''
			)}
		</>
	)
}

interface RecentTransactionRowProps {
	main: string
	secondary: string
	transaction: TransactionDetails
	chainId: number
}

const RecentTransactionRow = ({
	main,
	secondary,
	chainId,
	transaction,
}: RecentTransactionRowProps) => {
	const transactionImg = main === 'Deposit' ? transactionIn : transactionOut
	const networkName = useMemo(() => NETWORK_NAMES[chainId] || '', [chainId])

	return (
		<a
			href={etherscanUrl(`/tx/${transaction.hash}`, networkName)}
			target="_blank"
			rel="noopener noreferrer"
		>
			<Card.Grid
				hoverable={true}
				style={{
					width: '100%',
				}}
			>
				<Row align="middle">
					<Col xs={3} sm={3} md={2} lg={6}>
						<img src={transactionImg} height="32" alt="logo" />
					</Col>
					<Col>
						<Text
							style={{
								fontSize: '10px',
							}}
							type="secondary"
						>
							{moment(transaction.confirmedTime).fromNow()}
						</Text>
						<Title style={{ margin: 0 }} level={5}>
							{main}
						</Title>
						<Text
							style={{
								margin: 0,
							}}
							type="secondary"
						>
							{secondary}
						</Text>
					</Col>
				</Row>
			</Card.Grid>
		</a>
	)
}

export default function RecentTransactionsCard() {
	const [page, setPage] = useState(1)
	const { chainId } = useWeb3Provider()

	const transactions = useAllTransactions()
	const mvTxs = useMemo(
		() =>
			Object.entries(transactions || {})
				.filter(
					([_, t]) =>
						t.contract === 'internal.yAxisMetaVault' &&
						(t.method === 'depositAll' || t.method === 'withdraw'),
				)
				.reverse(),
		[transactions],
	)
	const txRows = useMemo(
		() =>
			mvTxs.map(([hash, val]) => (
				<Col span={24}>
					<RecentTransactionRow
						key={hash}
						main={val.summary}
						secondary={'$' + val.amount}
						transaction={val}
						chainId={chainId}
					/>
				</Col>
			)),
		[mvTxs, chainId],
	)

	const languages = useContext(LanguageContext)
	const language = languages.state.selected

	if (!(mvTxs.length > 0)) return null

	return (
		<Card
			title={
				<CardTitle
					showClear={false}
					onClearTransactions={() => {}} // TODO: clear selected
					language={language}
				/>
			}
			bodyStyle={{ marginTop: 10, padding: 0 }}
		>
			<Row justify="center" style={{ width: '100%' }}>
				{txRows.slice((page - 1) * 5, (page - 1) * 5 + 5)}
			</Row>
			{mvTxs.length > 5 && (
				<Row justify="center" style={{ margin: '20px 0' }}>
					<Pagination
						defaultCurrent={1}
						pageSize={5}
						total={mvTxs.length}
						current={page}
						onChange={(page) => setPage(page)}
					/>
				</Row>
			)}
		</Card>
	)
}
