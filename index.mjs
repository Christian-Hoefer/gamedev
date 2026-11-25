import express from 'express';
import fetch from 'node-fetch';
import { faker } from '@faker-js/faker';

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));


const categories = ['shooter', 'mmorpg', 'strategy', 'moba', 'racing', 'sports', 'social', 'card', 'fighting', 'fantasy', 'battle-royale'];


app.get('/', (req, res) => {
    res.render('index', { page: 'home', title: 'Video Game Development | Christian Hoefer' });
});

app.get('/engines', (req, res) => {
    res.render('engines', { page: 'engines', title: 'Game Engines | Video Game Development' });
});

app.get('/languages', (req, res) => {
    res.render('languages', { page: 'languages', title: 'Programming Languages | Video Game Development' });
});

app.get('/stages', (req, res) => {
    res.render('stages', { page: 'stages', title: 'Stages of Development | Video Game Development' });
});


app.get('/games', async (req, res) => {
    let category = categories.includes(req.query.category) ? req.query.category : '';
    let url = 'https://www.freetogame.com/api/games?sort-by=popularity';
    if (category) {
        url += `&category=${category}`;
    }

    let games = [];
    let error = null;
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`FreeToGame returned status ${response.status}`);
        }
        let data = await response.json();
        games = data.slice(0, 12);
    } catch (err) {
        console.error(err);
        error = 'Could not load games from FreeToGame right now. Please try again later.';
    }

    res.render('games', { page: 'games', title: 'Free-to-Play Games | Video Game Development', games, categories, category, error });
});


app.get('/team', (req, res) => {
    let roles = ['Programmer', 'Artist', 'Designer', 'Tester', 'Sound Engineer'];
    let engines = ['Unity', 'Unreal Engine', 'Godot'];

    let studio = {
        name: faker.company.name(),
        city: faker.location.city(),
        founded: faker.date.past({ years: 15 }).getFullYear()
    };

    let team = roles.map(role => ({
        role,
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        years: faker.number.int({ min: 1, max: 20 }),
        engine: faker.helpers.arrayElement(engines)
    }));

    res.render('team', { page: 'team', title: 'Sample Studio Team | Video Game Development', studio, team });
});

app.listen(3000, () => {
    console.log(`server started on port ${PORT}`);
});
