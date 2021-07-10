import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'
import store from './state'
import { Provider } from 'react-redux'
import App from './App'
import { getLibrary } from './connectors'
import { StatefulThemeProvider } from './theme'
import './index.less'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import { BrowserRouter as Router } from 'react-router-dom'
import { updater as ApplicationUpdater } from './state/application'
import { updater as TransactionUpdater } from './state/transactions'
import { updater as UserUpdater } from './state/user'
import { updater as OnChainUpdater } from './state/onchain'
import { updater as PricesUpdater } from './state/prices'
import ModalsProvider from './contexts/Modals'
import LanguageProvider from './contexts/Language'
import ContractsProvider from './contexts/Contracts'

if (!!(window as any).ethereum) {
	;(window as any).ethereum.autoRefreshOnNetworkChange = false
}

const Updaters: React.FC = ({ children }) => {
	UserUpdater()
	ApplicationUpdater()
	TransactionUpdater()
	OnChainUpdater()
	PricesUpdater()
	return <>{children}</>
}

const Web3ReactProviderFallback = createWeb3ReactRoot('fallback')

ReactDOM.render(
	<StrictMode>
		<Web3ReactProvider getLibrary={getLibrary}>
			<Web3ReactProviderFallback getLibrary={getLibrary}>
				<Provider store={store}>
					<ContractsProvider>
						<Updaters>
							<LanguageProvider>
								<StatefulThemeProvider>
									<ModalsProvider>
										<Router>
											<App />
										</Router>
									</ModalsProvider>
								</StatefulThemeProvider>
							</LanguageProvider>
						</Updaters>
					</ContractsProvider>
				</Provider>
			</Web3ReactProviderFallback>
		</Web3ReactProvider>
	</StrictMode>,
	document.getElementById('root'),
)
