import styled from 'styled-components'
import Tabs from '../../../components/Tabs'
import DepositTable from './DepositTable'
import WithdrawTable from './WithdrawTable'
import Card from '../../../components/Card'

const { TabPane } = Tabs

/**
 * Generates the component that contains tabs for deposit and withdrawal investment tokens.
 */
export default function InvestmentAccountActionCard() {
	return (
		<StyledCard>
			<Tabs defaultActiveKey="1">
				<TabPane tab="Deposit" key="1">
					<DepositTable />
				</TabPane>
				<TabPane tab="Withdraw" key="2">
					<WithdrawTable />
				</TabPane>
			</Tabs>
		</StyledCard>
	)
}

const StyledCard = styled(Card)`
	.ant-card-body {
		padding: 0;
	}
`
