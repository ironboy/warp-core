import openSocket from 'socket.io-client';
export default openSocket('', {path: '/api/socket'});