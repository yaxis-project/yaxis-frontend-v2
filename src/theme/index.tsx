import { ThemeProvider } from 'styled-components'
import { useDarkModeManager } from '../state/user/hooks'
import { dark } from './dark'
import { light } from './light'
import * as colors from './colors'

export const baseTheme = {
	borderRadius: 12,
	radiusBase: 10,
	breakpoints: {
		mobile: 400,
	},
	siteWidth: 1116,
	spacing: {
		1: 4,
		2: 8,
		3: 16,
		4: 24,
		5: 32,
		6: 48,
		7: 64,
	},
	topBarSize: 72,
	colors,
}

export const darkTheme = { ...baseTheme, ...dark }

export const lightTheme = { ...baseTheme, ...light }

export const StatefulThemeProvider: React.FC = ({ children }) => {
	const [useDarkMode] = useDarkModeManager()
	return (
		<ThemeProvider theme={useDarkMode ? darkTheme : lightTheme}>
			{children}
		</ThemeProvider>
	)
}
