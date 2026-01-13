const https = require('https');

const API_KEY = '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';

const data = JSON.stringify({
    model: 'google/gemini-2.0-flash-exp:free',
    messages: [{ role: 'user', content: 'Hello' }]
});

const options = {
    hostname: 'openrouter.ai',
    path: '/api/v1/chat/completions',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Lava Test'
    }
};

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Response:', responseBody);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
