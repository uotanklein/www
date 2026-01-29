var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let playerPromo;
let playerPromoMobile;
let playerGarrys;
let playerDayz;
var playerReady = false;

function onYouTubeIframeAPIReady() {
    // Обновляем videoId на 'SIEQW_GNKrY' и добавляем start
    playerPromo = new YT.Player('playerPromo', {
        height: '720',
        width: '1200',
        videoId: 'X3jcz4t0ROA', // Новый videoId
        playerVars: { start: 1 }, // Начать с 695 секунд
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

    playerPromoMobile = new YT.Player('playerPromoMobile', {
        height: '194',
        width: '343',
        videoId: 'X3jcz4t0ROA', // Новый videoId
        playerVars: { start: 1 }, // Начать с 695 секунд
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

    playerGarrys = new YT.Player('playerGarrys', {
        height: '720',
        width: '1200',
        videoId: 'X3jcz4t0ROA', // Новый videoId
        playerVars: { start: 1 }, // Начать с 695 секунд
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

    playerGarrysMobile = new YT.Player('playerGarrysMobile', {
        height: '194',
        width: '343',
        videoId: 'X3jcz4t0ROA', // Новый videoId
        playerVars: { start: 1 }, // Начать с 695 секунд
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

    playerDayz = new YT.Player('playerDayz', {
        height: '720',
        width: '1200',
        videoId: 'X3jcz4t0ROA', // Новый videoId
        playerVars: { start: 1 }, // Начать с 695 секунд
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });

    playerDayzMobile = new YT.Player('playerDayzMobile', {
        height: '194',
        width: '343',
        videoId: 'X3jcz4t0ROA', // Новый videoId
        playerVars: { start: 1 }, // Начать с 695 секунд
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    playerReady = true;
}

function onPlayerStateChange(event) {}

function playVideo() {
    if (playerReady) {
        playerPromo.playVideo();
        playerPromo.setVolume(70);
    }
}

function pauseVideo() {
    if (playerReady) {
        playerPromo.pauseVideo();
    }
}

var promoElement = document.getElementById('promo');
promoElement.addEventListener('mouseover', playVideo);
promoElement.addEventListener('mouseout', pauseVideo);
