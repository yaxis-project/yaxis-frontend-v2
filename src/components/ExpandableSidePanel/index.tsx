import React from 'react'
import styled from 'styled-components'
import { Collapse, Row, Col } from 'antd'
import Typography from '../../components/Typography'
import Divider from '../../components/Divider'

const { Text, Title } = Typography

const { Panel } = Collapse

interface CardRowProps {
	main: string | React.ReactNode
	secondary: string | React.ReactNode
	rightContent?: string | React.ReactNode
}

export const CardRow = (props: CardRowProps) => {
	const { main, secondary, rightContent } = props
	return (
		<StyledRow align={'middle'}>
			<Col span={rightContent ? 12 : 24}>
				<Text
					style={{
						margin: 0,
						marginLeft: 22,
						marginTop: 22,
						display: 'block',
					}}
					type="secondary"
				>
					{main}
				</Text>
				<Title
					style={{ margin: 0, marginLeft: 22, marginBottom: 22 }}
					level={5}
				>
					{secondary}
				</Title>
			</Col>
			{rightContent && <Col span={12}>{rightContent}</Col>}
			<Divider plain style={{ margin: 0 }} />
		</StyledRow>
	)
}

interface ExpandableSidePanelProps {
	children: React.ReactNode
	header: string
}

export const ExpandableSidePanel = (props: ExpandableSidePanelProps) => {
	const { header, children } = props
	return (
		<>
			<StyledCollapse
				className="expandable-overview"
				defaultActiveKey={['1']}
				expandIconPosition="right"
			>
				<Panel header={<StyledTitle>{header}</StyledTitle>} key="1">
					{children}
				</Panel>
			</StyledCollapse>
		</>
	)
}

const StyledTitle = styled.span`
	color: ${(props) => props.theme.primary.font};
`

const StyledCollapse = styled(Collapse)`
	&&& {
		background: ${(props) => props.theme.secondary.background};
		border-color: ${(props) => props.theme.secondary.border};
	}

	svg {
		fill: ${(props) => props.theme.primary.font};
	}
`

const StyledRow = styled(Row)`
	&&& {
		background: ${(props) => props.theme.secondary.background};
		border-color: ${(props) => props.theme.secondary.border};
	}
`
