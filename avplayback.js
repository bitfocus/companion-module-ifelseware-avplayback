var instance_skel = require('../../instance_skel');
var udp           = require('../../udp');
var debug;
var log;

function instance(system, id, config) {
	var self = this;

	// super-constructor
	instance_skel.apply(this, arguments);

	self.actions(); // export actions

	return self;
}

instance.prototype.init = function() {
	var self = this;

	debug = self.debug;
	log = self.log;

	self.status(self.STATUS_UNKNOWN);

	if (self.config.host !== undefined) {
		self.udp = new udp(self.config.host, 7000);

		self.udp.on('status_change', function (status, message) {
			self.status(status, message);
		});
	}
};

instance.prototype.updateConfig = function(config) {
	var self = this;
	self.config = config;

	if (self.udp !== undefined) {
		self.udp.destroy();
		delete self.udp;
	}

	if (self.config.host !== undefined) {
		self.udp = new udp(self.config.host, 7000);

		self.udp.on('status_change', function (status, message) {
			self.status(status, message);
		});
	}
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			width: 6,
			regex: self.REGEX_IP
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.udp !== undefined) {
		self.udp.destroy();
	}
	debug("destroy", self.id);
};

instance.prototype.actions = function(system) {
	var self = this;

	self.system.emit('instance_actions', self.id, {
		'load': {
			label: 'Load Clip (nr)',
			options: [
				{
					 type: 'textinput',
					 label: 'Clip Nr.',
					 id: 'clip',
					 default: 1,
					 regex: self.REGEX_NUMBER
				}
			]
		},

		'playClip': {
			label: 'Play Clip (nr)',
			options: [
				{
					 type: 'textinput',
					 label: 'Clip Nr.',
					 id: 'clip',
					 default: 1,
					 regex: self.REGEX_NUMBER
				}
			]
		},

		'gotoTc': {
			label: 'Goto (TimeCode)',
			options: [
				{
					 type: 'textinput',
					 label: 'hh:mm:ss:ff',
					 id: 'tc',
					 default: '00:00:00:00',
					 regex: self.REGEX_TIMECODE
				}
			]
		},

		'play':     		{ label: 'Play standby clip' },
		'pause':    		{ label: 'Pause Resume' },
		'stop':     		{ label: 'Stop' },
		'previewStart':     	{ label: 'Play preview clip' },
		'previewPause':    	{ label: 'Preview Pause' },
		'previewStop':     	{ label: 'Preview Stop' },
		'freeze':   		{ label: 'Freeze temp' },
		'loop':     		{ label: 'Loop temp' },
		'nextTag':   		{ label: 'Next Tag' },
		'prevTag':     		{ label: 'Previous Tag' },
		'10':       		{ label: 'Goto 10' },
		'20':       		{ label: 'Goto 20' },
		'30':       		{ label: 'Goto 30' },
		'60':       		{ label: 'Goto 60' }
	});
};


instance.prototype.action = function(action) {
	var self = this;
	var id = action.action;
	var cmd;
	var opt = action.options;

	// avplayback port 7000
	switch (action.action) {

		case 'load':
			cmd = 'AVP|1|LoadClip,' + ('0' + opt.clip).substr(-2);
			break;

		case 'playClip':
			cmd = 'AVP|1|PgmStart,' + ('0' + opt.clip).substr(-2);
			break;

		case 'play':
			cmd = 'AVP|1|PgmStart,-1';
			break;

		case 'pause':
			cmd = 'AVP|1|PgmPause';
			break;

		case 'stop':
			cmd = 'AVP|1|PgmStop';
			break;

		case 'previewStart':
			cmd = 'AVP|1|PrvStart';
			break;

		case 'previewPause':
			cmd = 'AVP|1|PrvPause';
			break;

		case 'previewStop':
			cmd = 'AVP|1|PrvStop';
			break;

		case 'freeze':
			cmd = 'AVP|1|TmpHold';
			break;

		case 'loop':
			cmd = 'AVP|1|TmpLoop';
			break;

		case 'nextTag':
			cmd = 'AVP|1|NextTag';
			break;

		case 'prevTag':
			cmd = 'AVP|1|PrevTag';
			break;

		case 'gotoTc':
			cmd = 'AVP|1|SetPosition,'+ opt.tc;
			break;

		case '10':
			cmd = 'AVP|1|GotoTimeOut,4';
			break;

		case '20':
			cmd = 'AVP|1|GotoTimeOut,3';
			break;

		case '30':
			cmd = 'AVP|1|GotoTimeOut,2';
			break;

		case '60':
			cmd = 'AVP|1|GotoTimeOut,1';
			break;
	}

	if (cmd !== undefined) {

		if (self.udp !== undefined) {

			debug('sending ',cmd,"to",self.udp.host);

			self.udp.send(cmd + " ");
		}
	}



};

instance.module_info = {
	label: 'AV-Playback UDP',
	id: 'avplayback',
	version: '0.0.2'
};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
