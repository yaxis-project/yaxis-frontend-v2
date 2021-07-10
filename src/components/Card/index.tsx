import { Card } from 'antd'
import styled from 'styled-components'

const StyledCard = styled(Card)`
	background: ${(props) => props.theme.secondary.background};
	border-color: ${(props) => props.theme.secondary.border};
`
export default StyledCard
