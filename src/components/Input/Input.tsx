import React from 'react'
import styled from 'styled-components'
import {
	Input as BaseInput,
	InputProps as BaseInputProps,
	Typography,
	Button,
} from 'antd'
const { Text } = Typography

const StyledInput = styled(BaseInput)`
	.ant-input-affix-wrapper .ant-input-affix-wrapper-disabled {
		background: red;
	}
`

export interface InputProps extends BaseInputProps {
	onClickMax?: () => void
}

const Input: React.FC<InputProps> = ({
	children,
	onClickMax,
	suffix,
	disabled,
	...rest
}) => (
	<StyledInput
		suffix={
			onClickMax ? (
				<>
					{suffix && <Text type="secondary">{suffix}</Text>}
					&nbsp;
					<Button
						block
						size="small"
						onClick={onClickMax}
						disabled={disabled}
					>
						MAX
					</Button>
				</>
			) : (
				suffix
			)
		}
		disabled={disabled}
		{...rest}
	/>
)

export default Input
