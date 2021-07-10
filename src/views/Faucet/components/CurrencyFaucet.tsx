import { useMemo } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import Card from '../../../components/Card'
import Button from '../../../components/Button'
import { Currencies } from '../../../constants/currencies'
import useContractWrite from '../../../hooks/useContractWrite'
import BN from 'bignumber.js'
import icon from '../../../assets/img/faucet.svg'

const StyledCol = styled(Col)`
	@media only screen and (max-width: 991px) {
		margin-top: 16px;
	}
`

export default function CurrencyFaucet({ currency, contractName }) {
	const { call: handleFaucet, loading: loadingFaucet } = useContractWrite({
		contractName,
		method: 'faucet',
		description: `drip ${currency} from faucet`,
	})

	const Currency = useMemo(
		() => Currencies[currency.toUpperCase()],
		[currency],
	)

	return (
		<StyledCol xs={24} sm={24} md={24} lg={8}>
			<Card
				title={
					<Row
						justify="space-between"
						style={{
							width: '100%',
						}}
						align="middle"
					>
						<Col>
							<Row>
								<img
									src={Currency.icon}
									height="36"
									alt="logo"
								/>
								<div style={{ paddingLeft: '14px' }}>
									{currency.toUpperCase()}
								</div>
							</Row>
						</Col>
						<Col>
							<Button
								block={false}
								onClick={async () =>
									handleFaucet({
										args: [
											new BN(1)
												.multipliedBy(
													10 ** Currency.decimals,
												)
												.toString(),
										],
									})
								}
								loading={loadingFaucet}
							>
								<img src={icon} height="36" alt="logo" />
							</Button>
						</Col>
					</Row>
				}
				bordered={false}
			/>
		</StyledCol>
	)
}
