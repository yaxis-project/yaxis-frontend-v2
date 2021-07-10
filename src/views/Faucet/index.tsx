import React, { useMemo } from 'react'
import Page from '../../components/Page/Page'
import { Row, Col } from 'antd'
import Card from '../../components/Card'
import useWeb3Provider from '../../hooks/useWeb3Provider'
import { Redirect } from 'react-router-dom'
import { DetailOverviewCard } from '../../components/DetailOverviewCard'
import Button from '../../components/Button'
import { Currencies } from '../../constants/currencies'
import { useContracts } from '../../contexts/Contracts'
import icon from '../../assets/img/faucet.svg'
import CurrencyFaucet from './components/CurrencyFaucet'

const Faucet: React.FC = () => {
	const { chainId } = useWeb3Provider()
	const { contracts } = useContracts()

	const body = useMemo(() => {
		if (!chainId) return <Row gutter={16}>Connect to a wallet</Row>

		if (chainId !== 42) return <Redirect to="/" />

		if (!contracts) return null

		return (
			<div style={{ padding: '20px' }}>
				<Row gutter={16} align="middle">
					<Col xs={24} sm={24} md={24} lg={8}>
						<Card
							title={
								<Row
									justify="space-between"
									style={{
										width: '100%',
									}}
								>
									<Col>
										<Row>
											<img
												src={Currencies.ETH.icon}
												height="36"
												alt="logo"
											/>
											<div
												style={{ paddingLeft: '14px' }}
											>
												Kovan Ethereum
											</div>
										</Row>
									</Col>
									<Col>
										<Button block={false}>
											<a
												href="https://faucet.kovan.network/"
												target="_blank"
												rel="noopener noreferrer"
											>
												<img
													src={icon}
													height="36"
													alt="logo"
												/>
											</a>
										</Button>
									</Col>
								</Row>
							}
							bordered={false}
						>
							<Row justify="center">
								(GitHub sign in required)
							</Row>
						</Card>
					</Col>
					{Object.keys(contracts.currencies.ERC20)
						.filter((name) => name !== 'mvlt') // MVLT has no facuet
						.map((name) => (
							<CurrencyFaucet
								currency={name}
								contractName={`currencies.ERC20.${name}.contract`}
							/>
						))}
				</Row>
			</div>
		)
	}, [contracts, chainId])

	return (
		<div className="savings-view">
			<Page>
				<DetailOverviewCard title={'Faucets'}>
					{body}
				</DetailOverviewCard>
			</Page>
		</div>
	)
}

export default Faucet
