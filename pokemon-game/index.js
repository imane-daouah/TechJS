import axios from "axios"; // Pour faire des requêtes HTTP à l’API Pokémon
import inquirer from "inquirer"; // Pour poser des questions interactives au joueur
import chalk from "chalk"; // Pour colorer le texte affiché dans le terminal

const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const MAX_HP = 300;

//Calculer si une attaque est forte, faible ou neutre selon les types (feu, eau, plante, électrique).
function getTypeMultiplier(attackType, defenderType) {
  const effectiveness = {
    fire: { grass: 2, water: 0.5, electric: 1 },
    water: { fire: 2, grass: 0.5, electric: 1 },
    grass: { water: 2, fire: 0.5, electric: 1 },
    electric: { water: 2, grass: 0.5, fire: 1 },
  };
  return effectiveness[attackType]?.[defenderType] || 1;
}


//Créer une barre de vie visuelle (comme dans les vrais jeux).
function renderHealthBar(currentHP) {
  const totalBars = 20; 
  const filledBars = Math.max(0, Math.floor((currentHP / MAX_HP) * totalBars));
  const emptyBars = totalBars - filledBars;
  const bar = "█".repeat(filledBars) + "░".repeat(emptyBars);

  const percent = (currentHP / MAX_HP) * 100;
  if (percent > 60) return chalk.green(bar);
  if (percent > 30) return chalk.yellow(bar);
  return chalk.red(bar);
}


//Aller chercher les informations d’un Pokémon dans la PokeAPI.
async function getPokemon(name) {
  try {
    const res = await axios.get(`${API_URL}${name.toLowerCase()}`);
    const data = res.data;

    const type = data.types[0].type.name;

    const moves = [];
    while (moves.length < 5) {
      const random = Math.floor(Math.random() * data.moves.length);
      const moveData = data.moves[random].move;
      const moveRes = await axios.get(moveData.url);
      const move = moveRes.data;

      if (move.power && move.accuracy && move.pp && move.type) {
        moves.push({
          name: move.name,
          power: move.power,
          accuracy: move.accuracy,
          pp: move.pp,
          type: move.type.name
        });
      }
    }

    return { name: data.name, type, moves };
  } catch (error) {
    console.error(chalk.red("Erreur: Pokémon introuvable !"));
    process.exit(1);
  }
}



//Faire en sorte qu’un Pokémon attaque l’autre et que les HP diminuent.
function attack(attacker, defender, move) {
  if (move.pp <= 0) {
    console.log(chalk.gray(`${attacker.name} n’a plus de PP pour ${move.name}`));
    return defender.hp;
  }

  move.pp--;
  const hitChance = Math.random() * 100;
  if (hitChance > move.accuracy) {
    console.log(chalk.yellow(`${attacker.name} rate son attaque ${move.name}`));
    return defender.hp;
  }

  const multiplier = getTypeMultiplier(move.type, defender.type);
  const damage = move.power * multiplier;
  defender.hp -= damage;

  let msg = `${attacker.name} utilise ${move.name} (${move.type}) et inflige ${damage.toFixed(0)} dégâts `;
  if (multiplier > 1) msg += chalk.green(" C’est super efficace ");
  else if (multiplier < 1) msg += chalk.yellow(" Ce n’est pas très efficace…");

  console.log(chalk.cyan(msg));
  return Math.max(defender.hp, 0);
}


//C’est la fonction principale — elle orchestre tout le jeu.
async function main() {
  console.log(chalk.blue("Bienvenue dans le jeu Pokémon "));

  const answer = await inquirer.prompt({
    name: "pokemon",
    message: "Choisis ton Pokémon :",
    type: "input"
  });

  const player = await getPokemon(answer.pokemon);
  player.hp = MAX_HP;

  const botList = ["charmander", "bulbasaur", "squirtle", "pikachu"];
  const botName = botList[Math.floor(Math.random() * botList.length)];
  const bot = await getPokemon(botName);
  bot.hp = MAX_HP;

  console.log(chalk.magenta(`Ton adversaire est ${bot.name} (type ${bot.type}) !`));
  console.log(chalk.green(`Ton Pokémon est de type ${player.type}.`));

  while (player.hp > 0 && bot.hp > 0) {
    console.log("\n==================== COMBAT ====================");
    console.log(
      chalk.cyan(
        `${player.name.toUpperCase()} [${renderHealthBar(player.hp)}] ${player.hp.toFixed(0)} / ${MAX_HP} HP`
      )
    );
    console.log(
      chalk.magenta(
        `${bot.name.toUpperCase()} [${renderHealthBar(bot.hp)}] ${bot.hp.toFixed(0)} / ${MAX_HP} HP`
      )
    );
    console.log("================================================");

    const moveAnswer = await inquirer.prompt({
      name: "move",
      message: "Choisis une attaque :",
      type: "list",
      choices: player.moves.map(m => `${m.name} (type:${m.type}, PP:${m.pp})`)
    });

    const moveName = moveAnswer.move.split(" ")[0];
    const move = player.moves.find(m => m.name === moveName);

    bot.hp = attack(player, bot, move);
    if (bot.hp <= 0) break;

    const botMove = bot.moves[Math.floor(Math.random() * bot.moves.length)];
    player.hp = attack(bot, player, botMove);
  }

  if (player.hp <= 0) {
    console.log(chalk.red("\n💀 Ton Pokémon est K.O. ! Tu as perdu 😢"));
  } else {
    console.log(chalk.green("\n🏆 Félicitations , Tu as gagné 🎉"));
  }
}

main();
