document.addEventListener('DOMContentLoaded', function() {
    updatePlayerCount();
    setInterval(updatePlayerCount, 30000);
});

async function updatePlayerCount() {
    try {
        const response = await fetch('/api/servers');
        const servers = await response.json();
        
        const counter1 = document.querySelectorAll('.playerCounter1');
        const counter2 = document.querySelectorAll('.playerCounter2');
        
        if (servers[0]) {
            updateCounter(counter1, servers[0]);
        }
        
        if (servers[1]) {
            updateCounter(counter2, servers[1]);
        }
    } catch (error) {
        console.error('Ошибка загрузки онлайна:', error);
        document.querySelectorAll('.playerCounter1, .playerCounter2').forEach(el => {
            el.innerHTML = '<span class="server-status-indicator server-status-offline"></span>—';
        });
    }
}

function updateCounter(elements, serverData) {
    let statusClass = 'server-status-offline';
    let text = 'Оффлайн';
    
    if (serverData.online && serverData.hasPassword) {
        statusClass = 'server-status-password';
        text = `${serverData.players}/${serverData.maxplayers}`;
    } else if (serverData.online) {
        statusClass = 'server-status-online';
        text = `${serverData.players}/${serverData.maxplayers}`;
    }
    
    elements.forEach(el => {
        const indicator = `<span class="server-status-indicator ${statusClass}"></span>`;
        const oldText = el.textContent.trim();
        
        if (oldText === text) {
            el.innerHTML = indicator + text;
            return;
        }
        
        // Fade out + shrink
        el.style.opacity = '0';
        el.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            el.innerHTML = indicator + text;
            // Fade in + grow
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
        }, 300);
    });
}
