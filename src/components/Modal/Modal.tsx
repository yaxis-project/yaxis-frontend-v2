import React from 'react'
import styled, { keyframes } from 'styled-components'
import Card from '../Card'

export interface ModalProps {
	onDismiss?: () => void
}

const Modal: React.FC = ({ children }) => {
	return (
		<StyledResponsiveWrapper>
			<StyledModal>{children}</StyledModal>
		</StyledResponsiveWrapper>
	)
}

const mobileKeyframes = keyframes`
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(-100%);
  }
`

const StyledResponsiveWrapper = styled.div`
	align-items: center;
	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	position: relative;
	width: 100%;
	max-width: 512px;
	z-index: 2;
	@media (max-width: ${(props) => props.theme.breakpoints.mobile}px) {
		flex: 1;
		position: absolute;
		top: 100%;
		right: 0;
		left: 0;
		max-height: calc(100% - ${(props) => props.theme.spacing[4]}px);
		animation: ${mobileKeyframes} 0.3s forwards ease-out;
	}
`

const StyledModal = styled(Card)`
	position: relative;
`

export default Modal
