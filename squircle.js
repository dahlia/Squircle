var firc = document.getElementById('firc');
var server = 'webirc.ozinger.org';
var port = '8080';
var encode = 'UTF-8';
var nickname = defaultNickname();
var channel = '#studio321';
var password = '';
var security = '843';

var serverTab = document.getElementById('server-tab');

var FIRCEventListener = function (type, data) {
    switch (type) {
    case 'debug':
        if (data.substr(0, 8) == 'RECV : :') {
            var splittedData = data.substr(8).split(' ');
            var first = splittedData.shift();
            var second = splittedData.shift();
            var third = splittedData.shift();
            var fourth = splittedData.join(' ').substr(1);
            if (second == 'NOTICE' && third != 'Auth') {
                console.log('notice');
                console.log('from: ' + first.split('!')[0]);
                console.log('message: ' + fourth);
            }
        }
        break;
    case 'onReady':
        console.log('ready');
        firc.setInfo(server, port, encode, nickname,
                     channel, password, security);
        firc.connect();
        break;
    case 'onConnect':
        console.log('connect');
        break;
    case 'onDisconnect':
        console.log('disconnect');
    case 'onError':
        console.log('error');
        console.log('error code: ' + data[0]);
        if (data[0] == 106) { //nickname
            console.log('change nickname and reconnect');
            nickname = defaultNickname();
            firc.setInfo(server, port, encode, nickname,
                         channel, password, security);
            firc.connect();
        }
        break;
    case 'onJoin':
        console.log('join');
        console.log('channel: ' + data);
        break;
    case 'onTopic':
        console.log('topic');
        console.log('channel: ' + data[0]);
        console.log('topic: ' + data[1]);
        break;
    case 'onTopicChange':
        console.log('topic change');
        console.log('channel: ' + data[0]);
        console.log('nickname: ' + data[1]);
        console.log('topic: ' + data[2]);
        break;
    case 'onChannelListStart':
        console.log('channel list start');
        break;
    case 'onChannelList':
        console.log('channel: ' + data[0]);
        console.log('user number: ' + data[1]);
        console.log('topic: ' + data[2]);
        console.log('mode: ' + data[3]);
        break;
    case 'onChannelListEnd':
        console.log('channel list end');
        break;
    case 'onChannelKey':
        console.log('channel key required');
        console.log('channel: ' + data);
        break;
    case 'onChannelMode':
        console.log('channel mode');
        console.log('channel: ' + data[0]);
        console.log('mode: ' + data[1]);
        console.log('key: ' + data[2]);
        console.log('limit: ' + data[3]);
        break;
    case 'onChannelChange':
        console.log('channel change');
        console.log('channel: ' + data[0]);
        console.log('mode: ' + data[1]);
        if (data[1].charAt(1) == 'h') {
            requestUserList(data[0]); //Deal with firc bug
        }
        console.log('nickname: ' + data[2]);
        break;
    case 'onBanList':
        console.log('ban list');
        console.log('channel: ' + data[0]);
        console.log('nickname: ' + data[1]);
        console.log('from: ' + data[2]);
        console.log('time: ' + data[3]);
        break;
    case 'onBanListEnd':
        console.log('ban list end');
        break;
    case 'onUserList':
        console.log('user list');
        console.log('channel: ' + data[0]);
        console.log('users: ' + data[1]);
        for (var i = 0; i < data[1].length; ++i) {
            var user = data[1][i];
            switch (user.charAt(0)) {
            case '~':
                console.log('owner: ' + user.substr(1));
                break;
            case '@':
                console.log('operator: ' + user.substr(1));
                break;
            case '%':
                console.log('half operator: ' + user.substr(1));
                break;
            case '+':
                console.log('voice user: ' + user.substr(1));
                break;
            default:
                console.log('user: ' + user);
                break;
            }
        }
        break;
    case 'onUserJoin':
        console.log('user join');
        console.log('channel: ' + data[0]);
        console.log('nickname: ' + data[1]);
        break;
    case 'onUserNick':
        console.log('user nickname');
        console.log('user: ' + data[0]);
        console.log('nickname: ' + data[1]);
        break;
    case 'onUserMode':
        console.log('user mode');
        console.log('channel: ' + data[0]);
        console.log('raw mode: ' + data[1]);
        switch (data[1].charAt(1)) {
        case 'q':
            console.log('mode: ' + 'Owner');
            break;
        case 'o':
            console.log('mode: ' + 'Operator');
            break;
        case 'v':
            console.log('mode: ' + 'Voice');
            break;
        }
        console.log('nickname: ' + data[2]);
        console.log('from: ' + data[3]);
        break;
    case 'onUserPart':
        console.log('user part');
        console.log('channel: ' + data[0]);
        console.log('nickname: ' + data[1]);
        console.log('message: ' + data[2]);
        break;
    case 'onUserQuit':
        console.log('user quit');
        console.log('nickname: ' + data[0]);
        console.log('message: ' + data[1]);
        break;
    case 'onKick':
        console.log('user kick');
        console.log('channel: ' + data[0]);
        console.log('nickname: ' + data[1]);
        console.log('from: ' + data[2]);
        console.log('message: ' + data[3]);
        console.log('is me: ' + data[4]);
        break;
    case 'onWhoIs':
        console.log('whois');
        console.log('nickname: ' + data[0]);
        console.log('realname: ' + data[1]);
        console.log('ip: ' + data[2]);
        console.log('channel: ' + data[3]);
        console.log('idle: ' + data[4]);
        console.log('connected: ' + data[5]);
        break;
    case 'onMessage':
        console.log('message');
        console.log('channel: ' + data[0]);
        console.log('nickname: ' + data[1]);
        console.log('message: ' + data[2]);
        break;
    case 'onMyMessage':
        console.log('my message');
        console.log('channel: ' + data[0]);
        console.log('nickname: ' + data[1]);
        console.log('message: ' + data[2]);
        break;
    case 'onPrivMessage':
        console.log('private message');
        console.log('nickname: ' + data[0]);
        console.log('message: ' + data[1]);
        break;
    case 'onServerMessage':
        console.log('server message');
        console.log('message: ' + data);
        serverTab.appendChild(createChatElement('', data));
        break;
    }
    console.log('');
}

function sendIrcCommand(message) {
    firc.sendMessage('', message);
}

function sendMessage(channel, message) {
    if (channel != '') {
        firc.sendMessage(channel, message);
    }
}

function changeNickname(nickname) {
    firc.changeNickname(nickname);
}

function joinChannel(channel, password) {
    firc.joinChannel(channel, password);
}

function partChannel(channel, message) {
    sendIrcCommand('PART ' + channel + ' :' + message);
}

function quitIrc(message) {
    sendIrcCommand('QUIT :' + message);
}

function requestUserList(channel) {
    sendIrcCommand('NAMES ' + channel);
}

function requestChannelList() {
    firc.getChannelList();
}

function requestChannelMode(channel) {
    firc.getChannelMode(channel);
}

function defaultNickname() {
    return 'squidward' + parseInt(Math.random() * 10000);
}

function createChatElement(nickname, message) {
    var profileElement = createProfileElement(nickname);
    profileElement.className = 'chat-profile-img';
    var messageElement = document.createElement('span');
    messageElement.textContent = message;
    var chatElement = document.createElement('div');
    chatElement.className = 'chat';
    chatElement.appendChild(profileElement);
    chatElement.appendChild(messageElement);
    return chatElement;
}

function createProfileElement(nickname) {
    var imageElement = new Image();
    imageElement.src = './img/ozinger.png';
    imageElement.style.borderRadius = 'inherit';
    var profileElement = document.createElement('object');
    profileElement.data = './img/profile/' + nickname + '.png';
    profileElement.appendChild(imageElement);
    return profileElement;
}