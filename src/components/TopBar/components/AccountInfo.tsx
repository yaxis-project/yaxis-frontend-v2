import styled from 'styled-components'
import { Menu, Row, Col } from 'antd'
import Divider from '../../Divider'
import Typography from '../../Typography'
import {
	CopyOutlined,
	BlockOutlined,
	CheckCircleTwoTone,
} from '@ant-design/icons'
import { etherscanUrl } from '../../../utils'

const { Text } = Typography

const StyledRow = styled(Row)<any>`
	display: flex;
	align-items: center;
	margin-bottom: ${(props) => (props.mobile ? '10' : '10')}px;
	margin-right: 10px;
`
const StyledText = styled.div<any>`
	color: ${(props) => props.theme.secondary.font};
	text-align: center;
	font-size: ${(props) => (props.mobile ? '1.1' : '1')}em;
	margin-left: 10px;
`

const StyledCol = styled(Col)<any>`
	margin-bottom: 5px;
	padding-left: 15px;
	padding-right: 5px;
`

const AccountText = styled.div`
	color: ${(props) => props.theme.secondary.font};
	font-weight: bold;
	font-size: 1.2em;
	margin-left: -8px;
`

const AccountIdText = styled.div<any>`
	color: ${(props) => props.theme.secondary.font};
	font-weight: bold;
	font-size: 1em;
	color: #016eac;
	border: 1.5px solid #016eac;
	border-radius: 20px;
	padding: 2px 10px;
	margin-left: 10px;
`

interface AccountInfoProps {
	account: string
	networkName: string
	friendlyNetworkName: string
	mobile: boolean
}

const AccountInfo: React.FC<AccountInfoProps> = ({
	account,
	networkName,
	friendlyNetworkName,
	mobile,
}) => {
	return (
		<>
			<Menu.ItemGroup
				title={
					<StyledCol mobile={mobile}>
						<StyledRow
							mobile={mobile}
							style={{
								margin: '5px 10px 12px 10px',
							}}
						>
							<AccountText>Account:</AccountText>
							<AccountIdText>
								{account.slice(0, 4)} ... {account.slice(-2)}
							</AccountIdText>
						</StyledRow>
						<StyledRow>
							<Text
								style={{
									marginLeft: '-2px',
								}}
								copyable={{
									icon: [
										<Row>
											<Col>
												<CopyOutlined key="copy-icon" />
											</Col>
											<Col>
												<StyledText mobile={mobile}>
													Copy Address
												</StyledText>
											</Col>
										</Row>,
										<Row>
											<Col>
												<CheckCircleTwoTone
													key="copied-icon"
													twoToneColor="#52c41a"
												/>
											</Col>
											<Col>
												<StyledText mobile={mobile}>
													Address Copied!
												</StyledText>
											</Col>
										</Row>,
									],
									text: `${account}`,
									tooltips: false,
								}}
							></Text>
						</StyledRow>
						<StyledRow>
							<BlockOutlined />
							<StyledText mobile={mobile}>
								<a
									href={etherscanUrl(
										`/address/${account}`,
										networkName,
									)}
									rel="noopener noreferrer"
									target="_blank"
								>
									View on Etherscan
								</a>
							</StyledText>
						</StyledRow>
						<StyledRow>
							<CheckCircleTwoTone twoToneColor="#52c41a" />{' '}
							<StyledText mobile={mobile}>
								{friendlyNetworkName}
							</StyledText>
						</StyledRow>
						<Divider
							orientation="left"
							style={{
								margin: '10px 0px 5px 0px',
							}}
						/>
					</StyledCol>
				}
			/>
		</>
	)
}

export default AccountInfo
