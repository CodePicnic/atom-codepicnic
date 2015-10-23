var $ = require('atom-space-pen-views').$,
    AtomCodePicnicView = require('./atom-codepicnic-view'),
    CompositeDisposable = require('atom').CompositeDisposable,
    AtomCodePicnic = {
      modalPanel: null,
      subscriptions: null,
      config: {
        clientId: {
          type: 'string',
          default: ''
        },
        clientSecret: {
          type: 'string',
          default: ''
        }
      }
    };

AtomCodePicnic.activate = function(state) {
  this.clientId = atom.config.get('atom-codepicnic.clientId');
  this.clientSecret = atom.config.get('atom-codepicnic.clientSecret');
  this.subscriptions = new CompositeDisposable();

  this.remoteConsolesRequest = this.createAccessToken().then(this.loadRemoteConsoles);

  this.subscriptions.add(atom.commands.add('atom-workspace', {
    'CodePicnic:open-remote': this.openRemote
  }));
};

AtomCodePicnic.deactivate = function() {
  this.subscriptions.dispose();

  if (this.accessTokenTimeout) {
    clearTimeout(this.accessTokenTimeout);
  }
};

// AtomCodePicnic.serialize = function() {};

AtomCodePicnic.openRemote = function() {
  this.modalPanel = new AtomCodePicnicView();
  this.modalPanel.show();

  AtomCodePicnic.remoteConsolesRequest.then(this.modalPanel.setItems.bind(this.modalPanel));
};

AtomCodePicnic.createAccessToken = function() {
  var request = $.post('https://codepicnic.com/oauth/token', {
    grant_type: 'client_credentials',
    client_id: this.clientId,
    client_secret: this.clientSecret
  });

  console.log(this);

  request.then(this.setAccessToken);

  return request;
};

AtomCodePicnic.setAccessToken = function(data) {
  AtomCodePicnic.accessToken = data.access_token;

  AtomCodePicnic.accessTokenTimeout = setTimeout(AtomCodePicnic.createAccessToken, data.expires_in * 1000);
};

AtomCodePicnic.loadRemoteConsoles = function() {
  var request = $.ajax({
    url: 'https://codepicnic.com/api/consoles/all',
    headers: {
      'Authorization': 'Bearer ' + AtomCodePicnic.accessToken
    }
  })

  return request.then(function(data) { return data.consoles; });
};

module.exports = AtomCodePicnic;