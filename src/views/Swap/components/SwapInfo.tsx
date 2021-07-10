import { useState } from 'react'
import { Row, Col, Collapse, Typography } from 'antd'
import { DetailOverviewCard } from '../../../components/DetailOverviewCard'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'
const { Panel } = Collapse
const { Title } = Typography

const StyledCollapse = styled(Collapse)<any>`
	${(props) =>
		props.active
			? `
			border: 1px solid ${props.theme.primary.main};
	.ant-collapse-item {
		color: white;
		background: ${props.theme.primary.main};
		transition: background 0.5s;
	}
	.ant-collapse-header.ant-collapse-header {
		color: white;
	}
	`
			: ``}
`

export default function SwapInfo() {
	const [active, setActive] = useState(['0'])
	return (
		<DetailOverviewCard title={'Token Swap Migration'}>
			<BodyMain>
				<Paragraph>
					Starting April 17th 2021, the governance token YAX is
					migrating to YAXIS.
					<br /> <br /> The{' '}
					<TextLink
						target={'_blank'}
						rel="noopener noreferrer"
						href="https://gov.yaxis.io/#/yaxis/proposal/QmRCQFAS58fzbVZR4RSzQZv5JMsnmqGbYk9qN4CVhrUqWb"
					>
						YIP-08
					</TextLink>{' '}
					governance proposal passed with an overwhelming 97.18%
					approval rating! <br /> <br /> It will be distributed fairly
					without a{' '}
					<TextLink
						target={'_blank'}
						rel="noopener noreferrer"
						href="https://www.investopedia.com/terms/p/premining.asp"
					>
						pre-mine
					</TextLink>{' '}
					through at least 1 year of staking rewards emissions. This
					involves locking up your tokens in a smart contract to
					receive extra YAXIS token on every block. They can be
					removed at any time. The token will have a maximum supply of
					11 million YAXIS tokens - with 1 million of those coming
					from the token swap. The full proposal is detailed{' '}
					<TextLink
						target={'_blank'}
						rel="noopener noreferrer"
						href="https://docs.google.com/document/d/1CpLUUjH6PBKQxh4_NGKZdJH8smktdfgGgZX_HkMijMw/edit"
					>
						here
					</TextLink>
					.
				</Paragraph>
				<Row style={{ padding: '10px' }}>
					<Col span={20} push={2}>
						<Title level={5}>Frequently Asked Questions</Title>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('0') ? ['0'] : [])
							}
							active={active.includes('0')}
						>
							<Panel header={'What do I need to do?'} key="0">
								<Body>
									It's as easy as following the Steps section
									on this page.
									<br />
									<br />
									The first step is to claim any unclaimed
									rewards that are pending on MetaVault or a
									Liquidity Pool and unstake and exit any
									Liquidity Pools that you are funding.
									<br />
									<br />
									Next click the SWAP button!
									<br />
									<br />
									No need to unstake your staked YAX. This
									all-in-one action will swap your account
									balance and swap your staking balance.
									<br />
									<br />
									Finally re-stake your tokens for some juicy
									emissions.
								</Body>
							</Panel>
						</StyledCollapse>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('5') ? ['5'] : [])
							}
							active={active.includes('5')}
						>
							<Panel
								header={"What's changing about MetaVault?"}
								key="5"
							>
								<Body>
									To receive emissions for being a MetaVault
									user you will now have to stake. The
									MetaVault has a form of "IOU" token, called
									MVLT, to represent funds that are deposited.
									These must be locked up in the rewards smart
									contract to receive APY.
									<br />
									<br />
									If you have already completed all of the
									steps in the Steps section, then you are
									already moved over.
									<br />
									<br />
									For future deposits there is a new Staking
									section at the bottom left of the{' '}
									<StyledNavLink to="/vault">
										MetaVault
									</StyledNavLink>{' '}
									page.
								</Body>
							</Panel>
						</StyledCollapse>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('3') ? ['3'] : [])
							}
							active={active.includes('3')}
						>
							<Panel header={'What are the benefits?'} key="3">
								<Body>
									There are 2 main benefits from this token
									swap:
									<ul>
										<li>
											A faster experience with our
											upgraded token from ERC20 to ERC677.
										</li>
										<li>
											Higher returns due to boosted APY of
											the pools and vaults, plus increased
											usage to fuel stakeholder revenue.
										</li>
									</ul>
								</Body>
							</Panel>
						</StyledCollapse>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('1') ? ['1'] : [])
							}
							active={active.includes('1')}
						>
							<Panel
								header={'What about the Liquidity Pools?'}
								key="1"
							>
								<Body>
									If you have already completed all of the
									steps in the Steps section, then you are
									already moved over.
									<br />
									<br />
									If not, the following steps are handled on
									the Stake tab of the Steps section:
									<br />
									<ol>
										<li>
											Unstake the LP tokens from yAxis
										</li>
										<li>Withdraw your funds from the LP</li>
										<li>Swap your YAX for YAXIS</li>
										<li>
											Add your funds to the new
											corresponding YAXIS LP
										</li>
										<li>Stake your new LP tokens</li>
									</ol>
									The extra rewards will be well worth it!
								</Body>
							</Panel>
						</StyledCollapse>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('2') ? ['2'] : [])
							}
							active={active.includes('2')}
						>
							<Panel
								header={'Why switch to an ERC677 token?'}
								key="2"
							>
								<Body>
									An{' '}
									<TextLink
										target={'_blank'}
										rel="noopener noreferrer"
										href="https://github.com/ethereum/EIPs/issues/677"
									>
										ERC677
									</TextLink>{' '}
									token comes with the same properties of an
									ERC20 token, only with added features.{' '}
									<br />
									<br />
									The main one being: you can “transfer and
									call” in one transaction. This means you
									don’t need to first approve, before actually
									staking. You can both approve and send
									tokens in the same transaction. <br />
									<br />
									This function will lower fees for entering
									yAxis, and is a key competitive advantage
									over other platforms. There are no conflicts
									with trading, using wallets, etc. as normal.
								</Body>
							</Panel>
						</StyledCollapse>
						<StyledCollapse
							activeKey={active}
							expandIconPosition="right"
							onChange={(key) =>
								setActive(key.includes('4') ? ['4'] : [])
							}
							active={active.includes('4')}
						>
							<Panel
								header={'How will the tokens be distributed?'}
								key="4"
							>
								<Body>
									There are already 1 million tokens in
									circulation that will be swapped to the new
									YAXIS token.
									<br />
									<br />
									The{' '}
									<TextLink
										target={'_blank'}
										rel="noopener noreferrer"
										href="https://gov.yaxis.io/#/yaxis/proposal/QmaroDcokRWpmWjfNrjoywAmyeBkJqxqjn55VPYkh4joEw"
									>
										YIP-09
									</TextLink>{' '}
									governance proposal established the
									following fair mining allocations for the
									remainder:
									<br />
									<br />
									<ul>
										<b>Growth for users - 8.8 million:</b>
										<li>
											4 million (36.4%) tokens towards
											YAXIS staking and Liquidity Pools.
										</li>
										<li>
											4 million (36.4%) tokens towards
											MetaVault staking.
										</li>
										<li>
											800k (7.3%) tokens flexibly to be
											allocated for maximum yAxis growth.
										</li>
										<br />
										<b>
											Treasuries for the yAxis Team - 1.2
											million:
										</b>
										<li>
											500k (4.5%) tokens to support the
											Champions Bounty Programme who lead
											marketing, partnerships,
											initiatives, exchanges, and content.
										</li>
										<li>
											300k (2.7%) tokens to the current
											development team who maintain and
											build yAxis.
										</li>
										<li>
											400k (3.6%) tokens towards future
											development to expand and improve
											yAxis.
										</li>
									</ul>
									For more details see the full proposal{' '}
									<TextLink
										target={'_blank'}
										rel="noopener noreferrer"
										href="https://docs.google.com/document/d/1jikTxfk7qqgiXvd_RMQzTQwKG9xVbF3PMBK9-nIRtMU"
									>
										here
									</TextLink>
									.
								</Body>
							</Panel>
						</StyledCollapse>
					</Col>
				</Row>
			</BodyMain>
		</DetailOverviewCard>
	)
}

const Paragraph = styled(Typography.Paragraph)`
	font-size: 16px;
`

const BodyMain = styled.div`
	margin: 5%;
`

const Body = styled(Paragraph)`
	margin: 5% 10%;
`

const TextLink = styled.a`
	color: ${(props) => props.theme.primary.main};
	font-weight: 600;
`

const StyledNavLink = styled(NavLink)`
	color: ${(props) => props.theme.primary.main};
	font-weight: 600;
`
