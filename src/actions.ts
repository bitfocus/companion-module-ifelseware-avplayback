import { Regex, type CompanionActionDefinitions } from '@companion-module/base'
import type { AvPlaybackInstance } from './main.js'

export function getActionDefinitions(self: AvPlaybackInstance): CompanionActionDefinitions {
	const sendCommand = async (cmd: string): Promise<void> => {
		if (!self.udp) {
			return
		}

		self.log('debug', `sending ${cmd} to ${self.config.host}`)

		try {
			await self.udp.send(cmd)
		} catch (error) {
			self.log('error', `UDP send failed: ${error instanceof Error ? error.message : String(error)}`)
		}
	}

	const padClip = (clip: string | number): string => ('0' + clip).substr(-2)

	return {
		load: {
			name: 'Load Clip (ID)',
			options: [
				{
					type: 'textinput',
					label: 'Clip ID',
					id: 'clip',
					default: '1',
					regex: Regex.NUMBER,
				},
			],
			callback: async (action) => {
				await sendCommand('AVP|1|LoadClip,' + padClip(String(action.options.clip)))
			},
		},

		playClip: {
			name: 'Load & Play Clip (ID)',
			options: [
				{
					type: 'textinput',
					label: 'Clip ID',
					id: 'clip',
					default: '1',
					regex: Regex.NUMBER,
				},
			],
			callback: async (action) => {
				await sendCommand('AVP|1|PgmStart,' + padClip(String(action.options.clip)))
			},
		},

		play: {
			name: 'Program Play',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|PgmStart,-1')
			},
		},

		pause: {
			name: 'Program Pause',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|PgmPause')
			},
		},

		stop: {
			name: 'Program Stop',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|PgmStop')
			},
		},

		previewStart: {
			name: 'Preview Play',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|PrvStart')
			},
		},

		previewPause: {
			name: 'Preview Pause',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|PrvPause')
			},
		},

		previewStop: {
			name: 'Preview Stop',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|PrvStop')
			},
		},

		nextClip: {
			name: 'Next Clip',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|NextClip')
			},
		},

		prevClip: {
			name: 'Previous Clip',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|PrevClip')
			},
		},

		freeze: {
			name: 'Freeze temp',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|TmpHold')
			},
		},

		loop: {
			name: 'Loop temp',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|TmpLoop')
			},
		},

		nextTag: {
			name: 'Next Tag',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|NextTag')
			},
		},

		prevTag: {
			name: 'Previous Tag',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|PrevTag')
			},
		},

		'10': {
			name: 'Goto 10',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|GotoTimeOut,4')
			},
		},

		'20': {
			name: 'Goto 20',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|GotoTimeOut,3')
			},
		},

		'30': {
			name: 'Goto 30',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|GotoTimeOut,2')
			},
		},

		'60': {
			name: 'Goto 60',
			options: [],
			callback: async () => {
				await sendCommand('AVP|1|GotoTimeOut,1')
			},
		},

		gotoTc: {
			name: 'Goto (TimeCode)',
			options: [
				{
					type: 'textinput',
					label: 'hh:mm:ss:ff',
					id: 'tc',
					default: '00:00:00:00',
					regex: Regex.TIMECODE,
				},
			],
			callback: async (action) => {
				await sendCommand('AVP|1|SetPosition,' + String(action.options.tc))
			},
		},
	}
}
