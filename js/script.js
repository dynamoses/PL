import { Player } from './player.js';

let chosenPlayer,
name,
position,
appearances,
goals,
assists,
minsPlayed,
goalsPerMatch,
passesPerMin,
players;

const nameEl = document.querySelector('.player-name');
const positionEl = document.querySelector('.player-position');
const appearancesEl = document.querySelector('.appearancesVal');
const goalsEl = document.querySelector('.goalsVal');
const assistsEl = document.querySelector('.assistsVal');
const goalsPerMatchEl = document.querySelector('.goalsPerMatchVal');
const passesPerMinEl = document.querySelector('.passesPerMinVal');
const playerImgEl = document.querySelector('.player-image');
const teamImgEl = document.querySelector('.team-logo');

const playerList = document.querySelector('.select-player-list');

const getPlayers = function() {
    axios.get('/json/player-stats.json').then( (data) => {
        players = data.data.players;
        loadNewPlayer(players[0].player.id)
        let listHtml = [];
        players.forEach((player) => {
            listHtml.push(`<option value="${player.player.id}">${player.player.name.first} ${player.player.name.last}</option>`)
        })
        playerList.innerHTML = listHtml.toString().replaceAll(',', '');
    })
}

const loadNewPlayer = function(playerId) {
    let player;
    let rawStats = []
    let stats = {};
    axios.get('/json/player-stats.json').then( (data) => {
        players = data.data.players;
        player = players.filter(player => player.player.id == playerId)[0];
        rawStats = player.stats;
        rawStats.forEach((stat) => {
            stats[stat.name] = stat.value
        })
        name = player.player.name.first + ' ' + player.player.name.last;
        position = player.player.info.positionInfo;
        appearances = stats.appearances;
        goals = stats.goals;
        assists = stats.goal_assist || 0;
        minsPlayed = stats.mins_played;
        goalsPerMatch = parseFloat(goals / appearances).toFixed(2);
        passesPerMin = parseFloat((stats.fwd_pass + stats.backward_pass) / stats.mins_played).toFixed(2);
        
        // Create player info
        chosenPlayer = new Player(name, position, appearances, goals, assists, goalsPerMatch, passesPerMin);

        // Assign values from chosen player class
        nameEl.innerText = chosenPlayer.name;
        positionEl.innerText = chosenPlayer.position;
        appearancesEl.innerText = chosenPlayer.appearances;
        goalsEl.innerText = chosenPlayer.goals;
        assistsEl.innerText = chosenPlayer.assists;
        goalsPerMatchEl.innerText = chosenPlayer.goalsPerMatch;
        passesPerMinEl.innerText = chosenPlayer.passesPerMin;
        playerImgEl.src = `img/p${player.player.id}.png`;
        teamImgEl.dataset.teamId = player.player.currentTeam.id
    })
}

playerList.addEventListener('change', () => {
    loadNewPlayer(playerList.value)
})

getPlayers();
