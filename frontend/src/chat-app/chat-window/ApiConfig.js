

const getApiBaseUrl = () => {
    
    
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    const isLocalNetwork = /^192\.168\.\d{1,3}\.\d{1,3}$/.test(window.location.hostname);


    console.log(window.location.hostname)
    
    if (isLocalhost) {
        return 'http://localhost:5000/chatbox';
    } else if (isLocalNetwork) {
        return `http://${window.location.hostname}:5000/chatbox`;
    } else {
        // For requests from outside the local network (e.g., from the internet)
        // Use the public IP address of your server
        // return 'http://51.211.41.46:5000/chatbox';
        return 'http://169.148.110.201:5000/chatbox';
    }
    
    
    
    
    
};

export const apiBaseUrl = getApiBaseUrl();