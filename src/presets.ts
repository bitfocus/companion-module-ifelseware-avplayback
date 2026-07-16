import { combineRgb, type CompanionPresetDefinitions } from '@companion-module/base'

const WHITE = combineRgb(255, 255, 255)
const BLACK = combineRgb(0, 0, 0)

type PresetAction = {
	id: string
	name: string
	category: string
	text?: string
	options?: Record<string, string | number | boolean>
}

const PRESET_ACTIONS: PresetAction[] = [
	{ id: 'load', name: 'Load Clip (ID)', category: 'Clips', text: 'Load\nClip', options: { clip: '03' } },
	{ id: 'playClip', name: 'Load & Play Clip (ID)', category: 'Clips', text: 'Play\nClip', options: { clip: '03' } },
	{ id: 'nextClip', name: 'Next Clip', category: 'Clips', text: 'Next\nClip' },
	{ id: 'prevClip', name: 'Previous Clip', category: 'Clips', text: 'Prev\nClip' },

	{ id: 'play', name: 'Program Play Selected Clip', category: 'Transport', text: 'Play Selected' },
	{ id: 'pause', name: 'Program Play / Pause Toggle', category: 'Transport', text: 'Play / Pause' },
	{ id: 'stop', name: 'Program Stop', category: 'Transport', text: 'Stop' },
	{ id: 'fastForward', name: 'Fast Forward', category: 'Transport', text: 'FF', options: { speed: 3500 } },
	{ id: 'rewind', name: 'Rewind', category: 'Transport', text: 'Rewind', options: { state: '1' } },
	{ id: 'gotoTc', name: 'Goto (TimeCode)', category: 'Transport', text: 'Goto\nTC', options: { tc: '00:00:00:00' } },
	{ id: '10', name: 'Goto 10', category: 'Transport', text: 'Goto\n10' },
	{ id: '20', name: 'Goto 20', category: 'Transport', text: 'Goto\n20' },
	{ id: '30', name: 'Goto 30', category: 'Transport', text: 'Goto\n30' },
	{ id: '60', name: 'Goto 60', category: 'Transport', text: 'Goto\n60' },

	/* 	{ id: 'previewStart', name: 'Preview Play', category: 'Preview', text: 'Prv\nPlay' },
	{ id: 'previewPause', name: 'Preview Pause', category: 'Preview', text: 'Prv\nPause' },
	{ id: 'previewStop', name: 'Preview Stop', category: 'Preview', text: 'Prv\nStop' },
 */
	{ id: 'nextTag', name: 'Next Tag', category: 'Tags', text: 'Next\nTag' },
	{ id: 'prevTag', name: 'Previous Tag', category: 'Tags', text: 'Prev\nTag' },

	{ id: 'freeze', name: 'Freeze temp', category: 'Options', text: 'Freeze' },
	{ id: 'loop', name: 'Loop temp', category: 'Options', text: 'Loop' },
	{ id: 'clear', name: 'Clear All Selected', category: 'Options', text: 'Clear' },
	{ id: 'hidePgm', name: 'Hide Program Output', category: 'Options', text: 'Hide\nPGM' },
	{ id: 'autoStart', name: 'Auto Start', category: 'Options', text: 'Auto\nStart' },
]

export function getPresetDefinitions(): CompanionPresetDefinitions {
	const presets: CompanionPresetDefinitions = {}

	for (const action of PRESET_ACTIONS) {
		presets[action.id] = {
			type: 'button',
			category: action.category,
			name: action.name,
			style: {
				text: action.text ?? action.name,
				size: '18',
				color: WHITE,
				bgcolor: BLACK,
			},
			steps: [
				{
					down: [
						{
							actionId: action.id,
							options: action.options ?? {},
						},
					],
					up: [],
				},
			],
			feedbacks: [],
		}
	}

	return presets
}
