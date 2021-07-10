import { Switch } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
import { useDarkModeManager } from '../../state/user/hooks'


export default function App() {
	const [isDarkMode, toggleSetDarkMode] = useDarkModeManager()

	return (
		<Switch
		checked={isDarkMode}
			checkedChildren={<CheckOutlined />}
			unCheckedChildren={<CloseOutlined />}
			defaultChecked
			onChange={() => toggleSetDarkMode()}
		/>
	)
}
