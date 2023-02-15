// Define a class to represent a starship
class Starship {
    constructor(name, numTorpedoes, torpedoEnergy, phaserEnergy, shieldEnergy) {
      this.name = name;
      this.numTorpedoes = numTorpedoes;
      this.torpedoEnergy = torpedoEnergy;
      this.phaserEnergy = phaserEnergy;
      this.shieldEnergy = {
        bow: shieldEnergy,
        stern: shieldEnergy,
        port: shieldEnergy,
        starboard: shieldEnergy,
      };
    }
  
    // Fire a photon torpedo at a target
    fireTorpedo(target) {
      if (this.numTorpedoes > 0) {
        console.log(`${this.name} fires a photon torpedo at ${target.name}.`);
        this.numTorpedoes--;
        if (target.takeDamage(this.torpedoEnergy)) {
          console.log(`${target.name} has been destroyed.`);
        }
      }
    }
  
    // Fire a phaser bank at a target
    firePhaser(target) {
      if (this.phaserEnergy > 0) {
        console.log(`${this.name} fires a phaser bank at ${target.name}.`);
        this.phaserEnergy--;
        if (target.takeDamage(100)) {
          console.log(`${target.name} has been destroyed.`);
        }
      }
    }
  
    // Take damage to a particular shield generator
    takeShieldDamage(generator) {
      if (this.shieldEnergy[generator] > 0) {
        console.log(`${this.name} takes damage to ${generator} shield generator.`);
        this.shieldEnergy[generator] -= 100;
        if (this.shieldEnergy[generator] <= 0) {
          console.log(`${this.name}'s ${generator} shield generator has collapsed.`);
          return true;
        }
      }
      return false;
    }
  
    // Take damage to the ship's hull
    takeHullDamage() {
      console.log(`${this.name} takes damage to its hull.`);
      return true;
    }
  
    // Take damage from an attack
    takeDamage(energy) {
      let remainingEnergy = energy;
      while (remainingEnergy > 0) {
        if (this.takeShieldDamage('bow')) {
          return true;
        }
        remainingEnergy -= 100;
        if (this.takeShieldDamage('stern')) {
          return true;
        }
        remainingEnergy -= 100;
        if (this.takeShieldDamage('port')) {
          return true;
        }
        remainingEnergy -= 100;
        if (this.takeShieldDamage('starboard')) {
          return true;
        }
        remainingEnergy -= 100;
        if (remainingEnergy <= 0) {
          return false;
        }
      }
      return this.takeHullDamage();
    }
  
    // Check if the ship has any shields remaining
    hasShields() {
      return Object.values(this.shieldEnergy).some((energy) => energy > 0);
    }
  }
  
  // Define a function to randomly select a ship from a formation
  function selectRandomShip(formation) {
    var aliveShips = formation.filter((ship) => ship.hasShields());
    if (aliveShips.length === 0) {
      return null;
    }
    return aliveShips[Math.floor(Math.random() * aliveShips.length)];
  }
  
  // Define the battle management algorithm
  function runBattle(fleet1, fleet2) {
    let winner = null;
    let round = 0;
    while (fleet1.some((ship) => ship.hasShields()) && fleet2.some((ship) => ship.hasShields())) {
      round++;
      console.log(`Round ${round}`);
      var attackingFleet = round % 2 === 1 ? fleet1 : fleet2;
      var defendingFleet = round % 2 === 1 ? fleet2 : fleet1;
      var attackingShip = selectRandomShip(attackingFleet);
      var defendingShip = selectRandomShip(defendingFleet);
      if (!attackingShip || !defendingShip) {
        console.log('No ships remaining!');
        break;
      }
      console.log(`The ${attackingShip.name} attacks the ${defendingShip.name}.`);
      attackingShip.fireTorpedo(defendingShip);
      if (!defendingShip.hasShields()) {
        console.log(`${defendingShip.name}'s shields have failed!`);
      } else {
        attackingShip.firePhaser(defendingShip);
      }
      if (!defendingShip.hasShields()) {
        console.log(`${defendingShip.name} has been destroyed!`);
      }
      [attackingFleet, defendingFleet] = [defendingFleet, attackingFleet];
    }
    if (!fleet1.some((ship) => ship.hasShields())) {
      console.log('Romulan fleet wins! fedra destroyed yeah!');
      winner = fleet2;
    } else if (!fleet2.some((ship) => ship.hasShields())) {
      console.log('fedration fleet wins!');
      winner = fleet1;
    }
    if (winner) {
      console.log('The following ships survived:');
      winner.forEach((ship) => {
        if (ship.hasShields()) {
          console.log(`- ${ship.name}`);
        }
      });
    }
  }

  
  // Create two fleets of ships
  var fleet1 = [];
  var fleet2 = [];
  
  for (let i = 1; i <= 20; i++) {
    fleet1.push(new Starship(`USS Enterprise ${i}`, 5, 500, 500, 1000));
    fleet1.push(new Starship(`USS Voyager ${i}`, 3, 700, 300, 800));
    fleet1.push(new Starship(`USS Defiant ${i}`, 2, 900, 200, 600));
    
    fleet2.push(new Starship(`Klingon Bird of Prey ${i}`, 4, 400, 600, 1200));
    fleet2.push(new Starship(`Romulan Warbird ${i}`, 3, 500, 500, 1000));
    fleet2.push(new Starship(`Borg Cube ${i}`, 1, 1000, 1000, 1500));
  }
  
  // Simulate the battle between the two fleets
  var winner = runBattle(fleet1, fleet2);
  
  // Print the winner of the battle
  
  