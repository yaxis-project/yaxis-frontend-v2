import React, { useMemo, useCallback } from 'react'
import styled from 'styled-components'
import useWeb3Provider from '../../../hooks/useWeb3Provider'
import { NavLink } from 'react-router-dom'
import { currentConfig } from '../../../constants/configs'
import AccountInfo from './AccountInfo'
import { Menu, Dropdown, Button, Typography } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import WalletProviderModal from '../../WalletProviderModal'
import useModal from '../../../hooks/useModal'
import {
	network,
	NETWORK_NAMES,
	FRIENDLY_NETWORK_NAMES,
} from '../../../connectors'
import { useWeb3React } from '@web3-react/core'

const StyledMenu = styled(Menu)`
	background: ${(props) => props.theme.secondary.background};
	padding: 10px;
`
const StyledLink = styled(NavLink)`
	font-weight: 400;
	text-decoration: none;
`
const MenuItem = styled(Menu.Item)`
	color: ${(props) => props.theme.primary.font};
	height: 38px;
	font-size: 18px;
`
const StyledSpan = styled.span`
	font-size: 18px;
`

const StyledSubMenu = styled(Menu.SubMenu)`
	height: 38px;
`

const MenuText = styled(Typography.Text)`
	display: block;
`

const ItemGroup = styled(Menu.ItemGroup)`
	height: 30px;
`

const Connect = styled(Menu.Item)`
	font-weight: bold;
	font-size: 1.3em;
	color: #016eac;
	display: flex;
	background-color: #f5f5f5;
	border-radius: 5px;
	&:hover {
		color: rgb(67, 210, 255);
	}
`
interface NavTabletProps {}

const NavTablet: React.FC<NavTabletProps> = () => {
	const { account, chainId, deactivate } = useWeb3Provider()
	const { activate } = useWeb3React('fallback')

	const networkName: string = useMemo(
		() => NETWORK_NAMES[chainId] || '',
		[chainId],
	)
	const friendlyNetworkName: string = useMemo(
		() => FRIENDLY_NETWORK_NAMES[chainId] || '',
		[chainId],
	)

	const [onPresentWalletProviderModal] = useModal(
		<WalletProviderModal />,
		'provider',
	)

	const handleUnlockClick = useCallback(() => {
		onPresentWalletProviderModal()
	}, [onPresentWalletProviderModal])

	const handleSignOutClick = useCallback(() => {
		localStorage.setItem('signOut', account)
		deactivate()
		activate(network)
	}, [activate, deactivate, account])

	const currentPools = Object.values(currentConfig(chainId).pools).filter(
		(pool) => pool.active && !pool.legacy,
	)

	const menu = useMemo(
		() => (
			<StyledMenu>
				{!account ? (
					<Connect onClick={handleUnlockClick}>Connect</Connect>
				) : (
					<AccountInfo
						account={account}
						networkName={networkName}
						friendlyNetworkName={friendlyNetworkName}
						mobile={true}
					/>
				)}
				<MenuItem key={'/'}>
					<StyledLink exact activeClassName="active" to="/">
						Overview
					</StyledLink>
				</MenuItem>

				<MenuItem key={'/vault'}>
					<StyledLink activeClassName="active" to="/vault">
						MetaVault
					</StyledLink>
				</MenuItem>

				<MenuItem key={'/staking'}>
					<StyledLink activeClassName="active" to="/staking">
						Staking
					</StyledLink>
				</MenuItem>

				<StyledSubMenu
					key={'/liquidity'}
					title={<StyledSpan>Liquidity</StyledSpan>}
				>
					<ItemGroup title="Provide Liquidity" />
					{currentPools.map((farm) => (
						<MenuItem key={`/liquidity/${farm.lpAddress}`}>
							<StyledLink
								activeClassName="active"
								to={`/liquidity/${farm.lpAddress}`}
							>
								<MenuText>{farm.name}</MenuText>
							</StyledLink>
						</MenuItem>
					))}
				</StyledSubMenu>

				<Menu.Divider />
				<MenuItem>
					<a
						href="https://resources.yaxis.io/"
						rel="noopener noreferrer"
						target="_blank"
					>
						Help Center
					</a>
				</MenuItem>
				{!account ? (
					<></>
				) : (
					<MenuItem key="logout" onClick={handleSignOutClick}>
						Logout
					</MenuItem>
				)}
			</StyledMenu>
		),
		[
			account,
			handleUnlockClick,
			networkName,
			friendlyNetworkName,
			currentPools,
			handleSignOutClick,
		],
	)
	return (
		<Dropdown overlay={menu} trigger={['click']}>
			<Button
				size="large"
				type="default"
				ghost
				style={{ border: 'none' }}
				icon={<MenuOutlined style={{ fontSize: '30px' }} />}
			/>
		</Dropdown>
	)
}

export default NavTablet
