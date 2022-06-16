class DiggerGenerator
{
	/** SMART
	 * 	1: place the digger at a dungeon tile
		2: set helper variables Fr=0 and Fc=0
		3: for all possible room sizes:
		3: if a potential room will not intersect existing rooms:
		4: place the room
		5: Fr=1
		6: break from for loop
		7: for all possible corridors of any direction and length 3 to 7:
		8: if a potential corridor will not intersect existing rooms:
		9: place the corridor
		10: Fc=1
		11: break from for loop
		12:if Fr=1 or Fc=1:
		13: go to 2
	*/

	/*	BLIND
		1: initialize chance of changing direction Pc=5
		2: initialize chance of adding room Pr=5
		3: place the digger at a dungeon tile and randomize its direction
		4: dig along that direction
		5: roll a random number Nc between 0 and 100
		6: if Nc below Pc:
		7: randomize the agent’s direction
		8: set Pc=0
		9: else:
		10: set Pc=Pc+5
		11:roll a random number Nr between 0 and 100
		12:if Nr below Pr:
		13: randomize room width and room length between 3 and 7
		14: place room around current agent position
		14: set Pr=0
		15:else:
		16: set Pr=Pr+5
		17:if the dungeon is not large enough:
		18: go to step 4		*/



	// Initializes a new instance of the DiggerGenerator class
	constructor()
	{
		this.blank = "_";
		this.wall = "X";
	}

	/// Initialize this instance. Creates the map of walls for the digger to dig.
	initialize(mapWidth, mapHeight, dungeonSize)
	{
		this.map = [];
		for (let i = 0; i < mapHeight; i++)
		{
            let row = [];
            for (let j = 0; j < mapWidth; j++) {
                row.push("X");
            }
            this.map.push(row);
		}
		
		this.minDungeonSize = (dungeonSize / 10);
		console.log("target size:" + this.minDungeonSize);
	}

	// Places the agent somewhere randomly in the map.
	placeAgent()
	{
		// Randomly places the agent on the map
		this.agentYPos = Math.floor(Math.random() * this.map.length);
		this.agentXPos = Math.floor(Math.random() * this.map[0].length);

		this.digHere();
	}

	// Digs a hole in the map at the agent's current location.
	digHere()
	{

		if (this.map[this.agentYPos][this.agentXPos] == this.wall)
		{
			this.map[this.agentYPos][this.agentXPos] = this.blank;
		}
	}

	// Generates the map.
	generateMap(mapWidth, mapHeight, dungeonSize)
	{
        this.initialize(mapWidth, mapHeight, dungeonSize);
		this.placeAgent();
		this.generateDungeon();
		this.closeDungeon();
		this.printMap();

	}

	// // Generates the dungeon.
	generateDungeon()
	{
		// first randomize the initial direction
		let currentDirection = Math.floor(Math.random() * 4);
		// Move agent forward in current direction
		switch (currentDirection) 
		{
			case 0:
				// make sure its possible to move Right
				if (this.agentXPos < this.map[0].Length - 1)
				{
					this.agentXPos = this.agentXPos + 1;
				}
				break;
			case 1:
				// make sure its possible to move Left
				if (this.agentXPos > 0)
				{
					this.agentXPos = this.agentXPos - 1;
				}
				break;
			case 2:
				// make sure its possible to move Up
				if (this.agentYPos > 0)
				{
					this.agentYPos = this.agentYPos - 1;
				}
				break;
			case 3:
				// make sure its possible to move Down
				if (this.agentYPos < this.map.Length - 1)
				{
					this.agentYPos = this.agentYPos + 1;
				}
				break;
		}
		
		this.digHere();
		let currentSize = this.calculateDungeonSize();
		// initialize probabilities
		let probDirect = 0.05;
		let repickDirection = false;
		while (currentSize < this.minDungeonSize)
		// for(let i = 0; i < 100; i++)
		{
			// roll to see if we change direction
			let roll = Math.random();
			if (repickDirection)
			{
				currentDirection = Math.floor(Math.random() * 4);
				repickDirection = false;
			}
			else if (roll < probDirect)
			{
				probDirect = 0;
				currentDirection = Math.floor(Math.random() * 4);
			}
			// add 0.05 to the probability of changing direction
			else
			{
				probDirect += 0.05;
			}	

			// Move agent forward in current direction
			if(currentDirection == 0) {
				// make sure its possible to move right
				if (this.agentXPos < this.map[0].length - 1)
				{
					this.agentXPos = this.agentXPos + 1;
				}
				else
				{
					repickDirection = true;
				}
			}
			else if(currentDirection == 1) {
				// make sure its possible to move left
				if (this.agentXPos > 0)
				{
					this.agentXPos = this.agentXPos - 1;
				}
				else
				{
					repickDirection = true;
				}
			}
			else if(currentDirection == 2){
				// make sure its possible to move up
				if (this.agentYPos > 0)
				{
					this.agentYPos = this.agentYPos - 1;
				}
				else
				{
					repickDirection = true;
				}
			}
			else {
				// make sure its possible to move down
				if (this.agentYPos < this.map.length - 1)
				{
					this.agentYPos = this.agentYPos + 1;
				}
				else
				{
					repickDirection = true;
				}
			}
			
			// if we dont have to repick direction, we can dig
			if (!repickDirection)
			{
				// dig right here
				this.digHere();
				// recalculate dungeon size
				currentSize = this.calculateDungeonSize();
			}
		}
		//PlopExit();
	}
	// /// <summary>
	// /// Closes the dungeon up by surrounding with an outside wall.
	// /// </summary>
	closeDungeon()
	{
		let mapCopy = [];
		this.map.unshift([]);
		this.map.push([]);
		for(let j = 0; j < this.map[1].length; j++) {
			this.map[0].unshift(this.wall);
			
			this.map[this.map.length - 1].push(this.wall);
		}

		// fill in the sides
		for (let i = 0; i < this.map.length; i++)
		{
			this.map[i].unshift(this.wall);
			this.map[i].push(this.wall);
		}

		// map = mapCopy;
	}

	// /// <summary>
	// /// Calculates the size of the dungeon.
	// /// </summary>
	// /// <returns>The dungeon size.</returns>
	calculateDungeonSize()
	{
		let size = 0;

		for (let i = 0; i < this.map.length; i++)
		{
			for (let j = 0; j < this.map[0].length; j++)
			{
				if (this.map[i][j] == this.blank)
				{
					size++;
				}
			}
		}
		size = size / (this.map.length * this.map[0].length);
		console.log("current size: " + size)
		return size;
	}


	// getMap()
	// {
	// 	return map;
	// }
	/// <summary>
	/// Prints the map.
	/// </summary>
	printMap()
	{
		for (let i = 0; i < this.map.length; i++)
		{
			let row = ""
			for (let j = 0; j < this.map[i].length; j++)
			{
				row = row.concat("", this.map[i][j]);
			}
			console.log(row);
		}
	}

}

