import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface ModuleConfig {
	host: string
	port: string
}

export function GetConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			label: 'Information',
			width: 12,
			value:
				'AV-Playback is cost effective Windows based media play-out solution that offers a full list of robust features any professional playback operator will find indispensable.</br></br><a href="https://www.ifelseware.com" target="_new">Learn more about AV-Playback and our other pro audio visual solutions.</a>',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: Regex.IP,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 6,
			default: '7000',
			regex: Regex.PORT,
		},
	]
}
