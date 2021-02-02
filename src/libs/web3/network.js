import { useEffect, useState, createContext, useContext } from 'react'
import { useWeb3 } from './util'

const networks = {
	1: 'Mainnet',
}

const Context = createContext({});

const useNetwork = () => useContext(Context)

const Provider = ({config={}, children}) => {

	const [network, setNetwork] = useState({})
	const {web3, status} = useWeb3()

	const fetchNetwork = () => {
		web3.eth.getChainId().then(chainId => {
			const networkConfig = config[chainId]

			if(!networks[chainId]){
				setNetwork({
					id: null,
					name: null,
					status: 'UNKNOWN',
				})
			}
			else if(!networkConfig){
				setNetwork({
					id: chainId,
					name: networks[chainId],
					status: 'DISABLED',
				})
			}else{
				setNetwork({
					id: chainId,
					name: networks[chainId],
					status: 'ENABLED',
					...networkConfig,
					web3: web3
				})
			}
		})
	}

	useEffect(() => {
		if(Object.keys(config).length && web3 && status === 'AVAILABLE'){
			fetchNetwork()
			web3.givenProvider.on('chainChanged', fetchNetwork)
		}
	}, [config, web3, status]) // eslint-disable-line

	return <Context.Provider 
		value={{
			...network,
		}}
		>
		{children}
	</Context.Provider>
};

export default {
	Provider,
	useNetwork
}