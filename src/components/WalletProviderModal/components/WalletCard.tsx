import React from 'react'
import { Row } from 'antd'
import { useWeb3React } from '@web3-react/core'
import Button from '../../Button'
import { WalletInfo } from '../../../connectors'
import { setRecentProvider } from '../../../connectors/utils'
import styled from 'styled-components'

interface WalletCardProps {
	config: WalletInfo
}

const WalletCard: React.FC<WalletCardProps> = ({ config }) => {
	const { activate } = useWeb3React()
	return (
		<>
			<CardIcon>
				<img
					src={require('../../../assets/img/' + config.icon).default}
					style={{ height: 32 }}
					alt={`${config.name} logo`}
				/>
			</CardIcon>
			<Row justify={'center'}>
				<StyledCardTitle>{config.name}</StyledCardTitle>
			</Row>
			<Button
				height={'50px'}
				onClick={async () => {
					if (!config.connector)
						return window.open(config.href, '_blank')
					localStorage.removeItem('signOut')
					await activate(config.connector)
					setRecentProvider(config.name.toUpperCase())
				}}
			>
				{config.connector ? 'Connect' : 'Install'}
			</Button>
		</>
	)
}

export default WalletCard

const StyledCardTitle = styled.div`
	color: ${(props) => props.theme.colors.grey[600]};
	font-size: 14px;
	font-weight: 700;
	text-align: center;
	padding: ${(props) => props.theme.spacing[2]}px 0;
`

const CardIcon = styled.div`
	background-color: ${(props) => props.theme.colors.grey[200]};
	font-size: 36px;
	height: 80px;
	width: 80px;
	border-radius: 40px;
	align-items: center;
	display: flex;
	justify-content: center;
	box-shadow: inset 4px 4px 8px ${(props) => props.theme.colors.grey[300]},
		inset -6px -6px 12px ${(props) => props.theme.colors.grey[100]};
	margin: 0 auto ${(props) => props.theme.spacing[1]}px;
`
