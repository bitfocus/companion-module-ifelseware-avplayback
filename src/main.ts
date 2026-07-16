import {
	InstanceBase,
	InstanceStatus,
	runEntrypoint,
	UDPHelper,
	type SomeCompanionConfigField,
} from '@companion-module/base'
import { getActionDefinitions } from './actions.js'
import { GetConfigFields, type ModuleConfig } from './config.js'

export class AvPlaybackInstance extends InstanceBase<ModuleConfig> {
	config!: ModuleConfig
	udp?: UDPHelper

	constructor(internal: unknown) {
		super(internal)
	}

	async init(config: ModuleConfig): Promise<void> {
		this.config = config

		this.setActionDefinitions(getActionDefinitions(this))
		await this.configUpdated(config)
	}

	async configUpdated(config: ModuleConfig): Promise<void> {
		this.config = config
		this.initUdp()
	}

	async destroy(): Promise<void> {
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}

		this.log('debug', 'destroy')
	}

	getConfigFields(): SomeCompanionConfigField[] {
		return GetConfigFields()
	}

	initUdp(): void {
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}

		if (!this.config.host) {
			this.updateStatus(InstanceStatus.BadConfig)
			return
		}

		const port = Number(this.config.port)
		if (!Number.isFinite(port) || port <= 0) {
			this.updateStatus(InstanceStatus.BadConfig, 'Invalid port')
			return
		}

		this.updateStatus(InstanceStatus.Connecting)

		this.udp = new UDPHelper(this.config.host, port)

		this.udp.on('error', (err) => {
			this.updateStatus(InstanceStatus.ConnectionFailure, err.message)
			this.log('error', 'Network error: ' + err.message)
		})

		this.udp.on('listening', () => {
			this.log('debug', 'UDP listener initialized')
			this.updateStatus(InstanceStatus.Ok)
		})

		this.udp.on('status_change', (status, message) => {
			this.log('debug', 'UDP status changed to ' + status)
			this.updateStatus(status, message)
		})
	}
}

runEntrypoint(AvPlaybackInstance, [])
