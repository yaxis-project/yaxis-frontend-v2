import React, { useMemo } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import Page from '../../components/Page/Page'
import Tooltip from '../../components/Tooltip'
import { Table, TableProps, Row, Col } from 'antd'
import Card from '../../components/Card'
import Typography from '../../components/Typography'
import Collapse from '../../components/Collapse'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useContracts } from '../../contexts/Contracts'
const { Panel } = Collapse
const { Text } = Typography
const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name',
	},
]

const Liquidity: React.FC = () => {
	const { contracts } = useContracts()
	const activePools = useMemo(
		() =>
			Object.values(contracts?.pools || {}).filter((pool) => pool.active),
		[contracts],
	)
	const legacyPools = useMemo(
		() =>
			Object.values(contracts?.pools || {}).filter((pool) => pool.legacy),
		[contracts],
	)
	const history = useHistory()
	return (
		<div className="liquidity-view">
			<Page>
				<>
					<Card
						title={
							<Col style={{ fontSize: '18px', fontWeight: 700 }}>
								<Text>Active Liquidity Pools</Text>
							</Col>
						}
						bodyStyle={{ padding: 0 }}
					>
						<StyledTable
							columns={columns}
							dataSource={activePools}
							pagination={false}
							rowKey={'name'}
							rowClassName="LP-Table-Row"
							onRow={(record, rowIndex) => {
								return {
									onClick: (event) =>
										history.push(
											`/liquidity/${record.lpAddress}`,
										),
								}
							}}
						/>
					</Card>

					<Collapse expandIconPosition="right">
						<StyledPanel
							header={
								<Row gutter={10}>
									<Col>
										<Text>Legacy Liquidity Pools</Text>
									</Col>
									<Col>
										<Tooltip
											title={
												'LPs that are no longer supported'
											}
											placement={'right'}
										>
											<StyledInfoIcon alt="Legacy Liquidity Pools info" />
										</Tooltip>
									</Col>
								</Row>
							}
							key="1"
						>
							<StyledTable
								columns={columns}
								dataSource={legacyPools}
								pagination={false}
								rowKey={'name'}
								rowClassName="LP-Table-Row"
								onRow={(record, rowIndex) => {
									return {
										onClick: (event) =>
											history.push(
												`/liquidity/${record.lpAddress}`,
											),
									}
								}}
							/>
						</StyledPanel>
					</Collapse>
				</>
			</Page>
		</div>
	)
}

export default Liquidity

const StyledInfoIcon = styled(InfoCircleOutlined)`
	margin-left: 5px;
	color: ${(props) => props.theme.secondary.font};
	font-size: 15px;
`

const StyledTable = styled(Table)<TableProps<any>>`
	background: ${(props) => props.theme.secondary.background};

	.ant-table-cell {
		background: ${(props) => props.theme.secondary.background};
		color: ${(props) => props.theme.primary.font};
	}

	.LP-Table-Row {
		border: 5px solid red;
		&:hover {
			cursor: pointer;
			background-color: #eff9ff;
		}
	}
`

const StyledPanel = styled(Panel)`
	background: ${(props) => props.theme.secondary.background};
	border-color: ${(props) => props.theme.secondary.border};

	.ant-collapse {
		border: none;
	}
`
