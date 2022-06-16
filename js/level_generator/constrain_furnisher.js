using System;
using System.Collections;
using System.Collections.Generic;

public class Pairing
{
	public int X { get; set; }
	public int Y { get; set; }

	public Pairing(int x, int y)
	{
		X = x;
		Y = y;
	}
}
class ConstrainFurnisher
{

	/// <summary>
	/// The rng.
	/// </summary>
	Random rng;

	/// <summary>
	/// Gets or sets the map.
	/// </summary>
	/// <value>The map.</value>
	public string[][] Map { get; set;}

	/// <summary>
	/// Gets or sets the entrance point.
	/// </summary>
	/// <value>The entrance point.</value>
	public Pairing EntrancePoint { get; set; }

	/// <summary>
	/// Gets or sets the exit point.
	/// </summary>
	/// <value>The exit point.</value>
	public Pairing ExitPoint { get; set; }

	/// <summary>
	/// Gets or sets the minitaur max.
	/// </summary>
	/// <value>The minitaur max.</value>
	public int MinitaurMax { get; set; }

	/// <summary>
	/// Gets or sets the minitaur count.
	/// </summary>
	/// <value>The minitaur count.</value>
	public int MinitaurCount { get; set; }

	/// <summary>
	/// Gets or sets the minitaur prob.
	/// </summary>
	/// <value>The minitaur prob.</value>
	public double MinitaurProb { get; set; }

	/// <summary>
	/// Gets or sets the melee monster max.
	/// </summary>
	/// <value>The melee monster max.</value>
	public int MeleeMonsterMax { get; set; }

	/// <summary>
	/// Gets or sets the melee monster count.
	/// </summary>
	/// <value>The melee monster count.</value>
	public int MeleeMonsterCount { get; set; }

	/// <summary>
	/// Gets or sets the melee monster prob.
	/// </summary>
	/// <value>The melee monster prob.</value>
	public double MeleeMonsterProb { get; set; }

	/// <summary>
	/// Gets or sets the ranged monster max.
	/// </summary>
	/// <value>The ranged monster max.</value>
	public int RangedMonsterMax { get; set; }

	/// <summary>
	/// Gets or sets the ranged monster count.
	/// </summary>
	/// <value>The ranged monster count.</value>
	public int RangedMonsterCount { get; set; }

	/// <summary>
	/// Gets or sets the ranged monster prob.
	/// </summary>
	/// <value>The ranged monster prob.</value>
	public double RangedMonsterProb { get; set; }

	/// <summary>
	/// Gets or sets the ogre max.
	/// </summary>
	/// <value>The ogre max.</value>
	public int OgreMax { get; set; }

	/// <summary>
	/// Gets or sets the ogre count.
	/// </summary>
	/// <value>The ogre count.</value>
	public int OgreCount { get; set; }

	/// <summary>
	/// Gets or sets the ogre prob.
	/// </summary>
	/// <value>The ogre prob.</value>
	public double OgreProb { get; set; }

	/// <summary>
	/// Gets or sets the blob max.
	/// </summary>
	/// <value>The blob max.</value>
	public int BlobMax { get; set; }

	/// <summary>
	/// Gets or sets the BLOB count.
	/// </summary>
	/// <value>The BLOB count.</value>
	public int BlobCount { get; set; }

	/// <summary>
	/// Gets or sets the blop prob.
	/// </summary>
	/// <value>The blop prob.</value>
	public double BlobProb { get; set; }

	/// <summary>
	/// Gets or sets the potion max.
	/// </summary>
	/// <value>The potion max.</value>
	public int PotionMax { get; set; }

	/// <summary>
	/// Gets or sets the potion count.
	/// </summary>
	/// <value>The potion count.</value>
	public int PotionCount { get; set; }

	/// <summary>
	/// Gets or sets the potion prob.
	/// </summary>
	/// <value>The potion prob.</value>
	public double PotionProb { get; set; }

	/// <summary>
	/// Gets or sets the poition pairings list.
	/// </summary>
	/// <value>The poition pairings list.</value>
	public List<Pairing> PotionPairings { get; set; }

	/// <summary>
	/// Gets or sets the treasure max.
	/// </summary>
	/// <value>The treasure max.</value>
	public int TreasureMax { get; set; }

	/// <summary>
	/// Gets or sets the treasure count.
	/// </summary>
	/// <value>The treasure count.</value>
	public int TreasureCount { get; set; }

	/// <summary>
	/// Gets or sets the treasure prob.
	/// </summary>
	/// <value>The treasure prob.</value>
	public double TreasureProb { get; set; }

	/// <summary>
	/// Gets or sets the treasure pairings list.
	/// </summary>
	/// <value>The treasure pairings list.</value>
	public List<Pairing> TreasurePairings { get; set; }

	/// <summary>
	/// Gets or sets the trap max.
	/// </summary>
	/// <value>The trap max.</value>
	public int TrapMax { get; set; }

	/// <summary>
	/// Gets or sets the trap count.
	/// </summary>
	/// <value>The trap count.</value>
	public int TrapCount { get; set; }

	/// <summary>
	/// Gets or sets the trap prob.
	/// </summary>
	/// <value>The trap prob.</value>
	public double TrapProb { get; set; }

	/// <summary>
	/// Gets or sets the path to exit.
	/// </summary>
	/// <value>The path to exit.</value>
	public SimPoint[] PathToExit { get; set; }

	/// <summary>
	/// Gets or sets the level.
	/// </summary>
	/// <value>The level.</value>
	public SimLevel Level { get; set; }

	/// <summary>
	/// The index of the entrance.
	/// </summary>
	private int entranceIndex;
	/// <summary>
	/// The index of the exit.
	/// </summary>
	private int exitIndex;

	public ConstrainFurnisher(string[][] m)
	{
		Map = m;
		//Init();
	}

	public ConstrainFurnisher()
	{

	}

	public void Init()
	{
		rng = new Random();
		PotionPairings = new List<Pairing>();
		TreasurePairings = new List<Pairing>();

		MinitaurCount = 0;
		MeleeMonsterCount = 0;
		RangedMonsterCount = 0;
		OgreCount = 0;
		BlobCount = 0;

		TreasureCount = 0;
		PotionCount = 0;
		TrapCount = 0;

		MeleeMonsterMax = rng.Next(2, 4);
		RangedMonsterMax = rng.Next(1,3);
		MinitaurMax = rng.Next(1, 2);
		BlobMax = 3;
		OgreMax = 2;

		TreasureMax = rng.Next(2, 6);
		PotionMax = rng.Next(4, 8);
		TrapMax = 2;
	}
	public override void GenerateMap()
	{
		Init();

		//Console.WriteLine("");
		//PrintMap();
		//Console.WriteLine("");

		FindPathToExit();
		PlaceEntrance();
		PlaceExit();

		//PrintMap();
		//Console.WriteLine("");

		PlaceTreasures();
        PlaceOgre();
		PlaceMelee();
		PlaceRanged();

		//PrintMap();
		//Console.WriteLine("");

		PlaceTrap();
		PlacePotions();
		PlaceBlobs();
		PlaceMinitaur();
		PlacePortals();

		//PrintMap();
		//Console.WriteLine("");
	}

	public override void GenerateMap(string[][] map)
	{	
		Init();
		Map = map;

		//Console.WriteLine("");
  //      PrintMap();
		//Console.WriteLine("");

		FindPathToExit();
		PlaceEntrance();
		PlaceExit();

		//PrintMap();
		//Console.WriteLine("");

		PlaceTreasures();

		PlaceOgre();
		PlaceMelee();
		PlaceRanged();

		//PrintMap();
		//Console.WriteLine("");

		PlaceTrap();
		PlacePotions();
		PlaceBlobs();
		PlaceMinitaur();
		PlacePortals();

		//PrintMap();
		//Console.WriteLine("");
	}

	/// <summary>
	/// Puts the map in string format.
	/// </summary>
	/// <returns>The to string.</returns>
	public string MapToString()
	{
		string mapString = "";

		for (int i = 0; i < Map.Length; i++)
		{
			for (int j = 0; j < Map[i].Length; j++)
			{
				mapString += Map[i][j];
			}
			mapString += "\n";
		}
		return mapString;
	}

		

	/// <summary>
	/// Places the treasures. 
	/// HEURISTIC: Treasures like to be in places with 3 walls
	/// </summary>
	public void PlaceTreasures()
	{
		// lists for x and y coordinates Pairings
		List<Pairing> XY = new List<Pairing>();
		List<Pairing> Backup = new List<Pairing>();
		// look around the map for dead-ends and place treasures there
		for (int i = 1; i < Map.Length-1; i++)
		{
			for (int j = 1; j < Map[i].Length-1; j++)
			{
				int count = 0;
				// check if space is empty
				if (Map[i][j].Equals(" "))
				{
					// check if at least 3 neighbors are walls
					if (Map[i - 1][j].Equals("X"))
					{
						count++;
					}
					if (Map[i + 1][j].Equals("X"))
					{
						count++;
					}
					if (Map[i][j - 1].Equals("X"))
					{
						count++;
					}
					if (Map[i][j + 1].Equals("X"))
					{
						count++;
					}
				}
				if (count > 2)
				{
					// since the spot has >3 walls, mark as a potential treasure spot

					XY.Add(new Pairing(j, i));
				}
				// add to backuplist
				else if (count > 1)
				{
					Backup.Add(new Pairing(j, i));
				}
			}
		}

		// make sure we had >1 potential spot for treasure
		if (XY.Count > 0)
		{
			for (int i = 0; i < XY.Count; i++)
			{
				// make sure we are under the treasure threashold and we still have potential spots
				if (TreasureCount < TreasureMax && XY.Count > 0)
				{
					// pick a random spot
					int index = rng.Next(0, XY.Count);
					Map[XY[index].Y][XY[index].X] = "T";
					TreasureCount++;
					TreasurePairings.Add(XY[index]);
				}
			}
		}
		// if we exhausted all 3 wall treasure spots, do some 2 wall ones
		if (TreasureCount < TreasureMax)
		{
			foreach (Pairing point in Backup)
			{
				XY.Add(point);
			}
		}
		// make sure we had >1 potential spot for treasure
		if (XY.Count > 0)
		{
			for (int i = 0; i<XY.Count; i++)
			{
				// make sure we are under the treasure threashold and we still have potential spots
				if (TreasureCount<TreasureMax && XY.Count> 0)
				{
					// pick a random spot
					int index = rng.Next(0, XY.Count);
					Map[XY[index].Y][XY[index].X] = "T";
					TreasureCount++;
					TreasurePairings.Add(XY[index]);
				}
			}
		}
	}

	/// <summary>
	/// Places the potions
	/// HEURISTIC: Potions don't care where they live, they will scatter themselves across the map
	/// </summary>
	public void PlacePotions()
	{
		// lists for x and y coordinates, mapped by index
		List<Pairing> XY = new List<Pairing>();


		// get all the points that are blank
		for (int i = 0; i < Map.Length; i++)
		{
			for (int j = 0; j < Map[i].Length; j++)
			{
				if (Map[i][j].Equals(" ")) 
				{
					XY.Add(new Pairing(j, i));
				}
			}
		}

		if (XY.Count > 0)
		{
			for (int i = 0; i < PotionMax && XY.Count > 0; i++)
			{
				int index = rng.Next(0, XY.Count);
				Map[XY[index].Y][XY[index].X] = "P";
				PotionCount++;
				PotionPairings.Add(new Pairing(XY[index].X, XY[index].Y));
				XY.RemoveAt(index);
			}
		}

	}

	/// <summary>
	/// Places the portals.
	/// HEURISTIC: Portals like to be somewhere around the entrance and exit (5 to 10 tiles)
	/// but they also have to be a minimal distance of 10 tiles away to make any sense
	/// </summary>
	public void PlacePortals()
	{
		List<Pairing> XY = new List<Pairing>();
		Pairing entrancePortal = null;
		for (int i = 1; i < Map.Length-1; i++)
		{
			for (int j = 1; j < Map[i].Length - 1; j++)
			{
				if (Map[i][j].Equals(" "))
				{
					// make it between 5 to 15 tiles from the entrance
					Pairing point = new Pairing(j, i);
					int distance = DistanceBetween(point, EntrancePoint);
					if (distance > 5 && distance < 10)
					{
						XY.Add(point);
					}
				}
			}
		}

		// place the first portal
		if (XY.Count > 1)
		{
			int index = rng.Next(0, XY.Count);
			Map[XY[index].Y][XY[index].X] = "p";
			entrancePortal = XY[index];
			XY.RemoveAt(index);
		}
		XY.Clear();
		// do again for second portal, this time towards the exit, if the first portal was placed
		if (entrancePortal != null)
		{
			for (int i = 1; i < Map.Length - 1; i++)
			{
				for (int j = 1; j < Map[i].Length - 1; j++)
				{
					if (Map[i][j].Equals(" "))
					{
						// make sure this is 5 - 10 tiles from the exit and 10 tiles from the other portal
						Pairing point = new Pairing(j, i);
						int distanceExit = DistanceBetween(point, ExitPoint);
						int distancePortal = DistanceBetween(point, entrancePortal);
						if (distanceExit > 5 && distanceExit < 10 && distancePortal > 10)
						{
							XY.Add(point);
						}
					}
				}
			}
			// place the first portal
			if (XY.Count > 1)
			{
				int index = rng.Next(0, XY.Count);
				Map[XY[index].Y][XY[index].X] = "p";
				XY.RemoveAt(index);
			}
			// if there is no place for the second portal, remove the first portal
			else
			{
				Map[entrancePortal.Y][entrancePortal.X] = " ";
			}
		}
	}

	/// <summary>
	/// Places the melee monsters.
	/// HEURISTIC: Melee monsters like to be with their back to a wall,
	/// AND not around each other (within 3 tiles)
	/// </summary>
	public void PlaceMelee()
	{
		// lists for x and y coordinates, mapped by index
		List<Pairing> XY = new List<Pairing>();
		// look around the map for walled places. These are the potential initial spots for melee monsters
		for (int i = 1; i<Map.Length-1; i++)
		{
			for (int j = 1; j<Map[i].Length-1; j++)
			{

				bool walled = false;
				// check if space is empty
				if (Map[i][j].Equals(" "))
				{
					// check if one neighbor is a wall
					if (Map[i - 1][j].Equals("X") || Map[i + 1][j].Equals("X") 
					    || Map[i][j - 1].Equals("X") || Map[i][j + 1].Equals("X"))
					{
						walled = true;
					}

				}
				if (walled && Map[i][j].Equals(" "))
				{
					// since the spot has a wall and no monsters around
					// mark as a potential monster spot
					XY.Add(new Pairing(j, i));
				}
			}
		}

		// make sure we had >1 potential spot for monsters
		if (XY.Count > 0)
		{
			for (int i = 0; i < MeleeMonsterMax && XY.Count > 0; i++)
			{
				// loop through the mapping and make sure any places that have melee monsters around it are removed
				List<int> removeUs = new List<int>();
				for (int k = 0; k < XY.Count; k++)
				{
					
					if (Map[XY[k].Y-1][XY[k].X].Equals("M") || Map[XY[k].Y + 1][XY[k].X].Equals("M")
					    || Map[XY[k].Y][XY[k].X - 1].Equals("M") || Map[XY[k].Y][XY[k].X + 1].Equals("M"))
					{
						// put this in the list to remove from the mapping, since it has monsters around
						removeUs.Add(k);
					}
				}
				for (int k = removeUs.Count - 1; k > 0; k--)
				{
					XY.RemoveAt(removeUs[k]);
				}
				// pick a random spot
				int rand = rng.Next(0, XY.Count);
				Map[XY[rand].Y][XY[rand].X] = "M";
				MeleeMonsterCount++;
				XY.RemoveAt(rand);
			}
		}
	}


	/// <summary>
	/// Places the ranged.
	/// HEURISTIC: Ranged monsters like to be around a melee monster for protection,
	/// </summary>
	public void PlaceRanged()
	{
		// lists for x and y coordinates, mapped by index
		List<Pairing> XY = new List<Pairing>();
		// look around the map for places near melee monsters
		for (int i = 1; i<Map.Length-1; i++)
		{
			for (int j = 1; j<Map[i].Length-1; j++)
			{
				bool clear = false;
				// check if space is empty
				if (Map[i][j].Equals(" "))
				{
					// check that there is a melee monster around
					if (Map[i - 1][j].Equals("M") || Map[i + 1][j].Equals("M")
					    || Map[i][j - 1].Equals("M") || Map[i][j + 1].Equals("M"))
					{
						clear = true;
					}
				}
				if (clear)
				{
					// since the spot has a wall and no monsters around
					// mark as a potential monster spot
					XY.Add(new Pairing(j, i));
				}
			}
		}

		// make sure we had >1 potential spot for treasure
		if (XY.Count > 0)
		{
			for (int i = 0; i<RangedMonsterMax && XY.Count> 0; i++)
			{
				// pick a random spot
				int rand = rng.Next(0, XY.Count);
				Map[XY[rand].Y][XY[rand].X] = "R";
				RangedMonsterCount++;
				XY.RemoveAt(rand);
			}
		}
	}

	/// <summary>
	/// Places the blobs.
	/// HEURISTIC: Blops like to be within 8 tiles of potions, but not nearer than 4 tiles
	/// </summary>
	public void PlaceBlobs()
	{
		// lists for x and y coordinates, mapped by index
		List<Pairing> XY = new List<Pairing>();


		foreach(Pairing potion in PotionPairings)
		{
			for (int i = 0; i < Map.Length; i++)
			{
				for (int j = 0; j < Map[i].Length; j++)
				{
					if (Map[i][j].Equals(" "))
					{
						Pairing point = new Pairing(j, i);
						bool canSee = LineOfSight(point, potion);
						int distance = DistanceBetween(point, potion);
						if (distance > 4 && distance < 8 && canSee)
						{
							XY.Add(point);
						}
					}
				}
			}
		}
		// one last loop through XY to make sure all points in there follow the "too close" rule for all potions
		List<Pairing> removeUs = new List<Pairing>();
		foreach (Pairing potion in PotionPairings)
		{
			foreach (Pairing point in XY)
			{
				int distance = DistanceBetween(point, potion);
				if (distance < 4)
				{
					removeUs.Add(point);
				}
			}
		}

		foreach (Pairing rem in removeUs)
		{
			XY.Remove(rem);
		}
		if (XY.Count > 0)
		{
			for (int m = 0; m<BlobMax && XY.Count> 0; m++)
			{
				int index = rng.Next(XY.Count);
				Map[XY[index].Y][XY[index].X] = "b";
				BlobCount++;
				XY.RemoveAt(index);
			}
		}
	}

	/// <summary>
	/// Places the ogres.
	/// HEURISTIC: Ogres like being within eyesight of treasure within 8 tiles, but at least 4 tiles away
	/// but they don't want to see each other at all within 8 tiles
	/// </summary>
	public void PlaceOgre()
	{
		List<Pairing> XY = new List<Pairing>();
		foreach(Pairing treasure in TreasurePairings)
		{
			for (int i = 0; i<Map.Length; i++)
			{
				for (int j = 0; j<Map[i].Length; j++)
				{
					if (Map[i][j].Equals(" "))
					{
						Pairing point = new Pairing(j, i);
						int distance = DistanceBetween(point, treasure);
						bool canSee = LineOfSight(point, treasure);
						if (distance > 4 && distance < 9 && canSee)
						{
							XY.Add(point);
						}
					}
				}
			}
		}

		if (XY.Count > 0)
		{
			for (int i = 0; i < OgreMax && XY.Count > 0; i++)
			{
				if (XY.Count > 0)
				{
					int index = rng.Next(XY.Count);
					Map[XY[index].Y][XY[index].X] = "o";
					OgreCount++;
					XY.RemoveAt(index);
				}
			}
		}
	}

	/// <summary>
	/// Places the minitaurs.
	/// HEURISTIC: A minitaur wants to be somewhere within 8 tiles of the entrance, but at least 4 tiles away
	/// </summary>
	public void PlaceMinitaur()
	{
		List<Pairing> XY = new List<Pairing>();
		for (int i = 1; i<Map.Length - 1; i++)
		{
			for (int j = 1; j<Map[i].Length - 1; j++)
			{
				if (Map[i][j].Equals(" "))
				{
					for (int k = 4; k< 9; k++)
					{
						try
						{
							if (Map[i - k][j].Equals("H"))
							{
								XY.Add(new Pairing(j, i));
							}
						}
						catch (System.IndexOutOfRangeException e)
						{
							continue;
						}
					}
					for (int k = 4; k < 9; k++)
					{	try
						{
							if (Map[i + k][j].Equals("H") || Map[i][j - k].Equals("H") || Map[i][j + k].Equals("H"))
							{
								XY.Add(new Pairing(j, i));
							}
						}
						catch (System.IndexOutOfRangeException e)
						{
							continue;
						}
					}
					for (int k = 4; k< 9; k++)
					{	try
						{
							if (Map[i][j - k].Equals("H"))
							{
								XY.Add(new Pairing(j, i));
							}
						}
						catch (System.IndexOutOfRangeException e)
						{
							continue;
						}
					}
					for (int k = 4; k< 9; k++)
					{	try
						{
							if (Map[i][j + k].Equals("H"))
							{
								XY.Add(new Pairing(j, i));
							}
						}
						catch (System.IndexOutOfRangeException e)
						{
							continue;
						}
					}
				}
			}
		}

		if (XY.Count > 0)
		{
			for (int i = 0; i<MinitaurMax && XY.Count> 0; i++)
			{
				
				if (XY.Count > 0)
				{
					int index = rng.Next(XY.Count);
					Map[XY[index].Y][XY[index].X] = "m";
					MinitaurCount++;
					XY.RemoveAt(index);
				}
			}
		}
	}

	/// <summary>
	/// Places the traps.
	/// HEURISTIC: Traps like to be somewhere along the shortest path, or very close to it
	/// </summary>
	public void PlaceTrap()
	{
		// lists for x and y coordinates, mapped by index
		List<Pairing> XY = new List<Pairing>();
		// get a list of the points in the shortest path
		for (int i = entranceIndex + 1; i<exitIndex - 1; i++)
		{
			if (Map[PathToExit[i].Y][PathToExit[i].X].Equals(" "))
			{
				XY.Add(new Pairing(PathToExit[i].X, PathToExit[i].Y));
			}
			// also add potions just along the shortest path on the sides
			if (Map[PathToExit[i].Y - 1][PathToExit[i].X].Equals(" "))
			{
				XY.Add(new Pairing(PathToExit[i].X, PathToExit[i].Y-1));
			}
			if (Map[PathToExit[i].Y][PathToExit[i].X - 1].Equals(" "))
			{
				XY.Add(new Pairing(PathToExit[i].X-1, PathToExit[i].Y));
			}

			if (Map[PathToExit[i].Y + 1][PathToExit[i].X].Equals(" "))
			{
				XY.Add(new Pairing(PathToExit[i].X, PathToExit[i].Y+1));
			}

			if (Map[PathToExit[i].Y][PathToExit[i].X + 1].Equals(" "))
			{
				XY.Add(new Pairing(PathToExit[i].X+1, PathToExit[i].Y));
			}

			// also add diagonals

			if (Map[PathToExit[i].Y - 1][PathToExit[i].X - 1].Equals(" "))
			{
				XY.Add(new Pairing(PathToExit[i].X-1, PathToExit[i].Y-1));
			}

			if (Map[PathToExit[i].Y - 1][PathToExit[i].X + 1].Equals(" "))
			{
				XY.Add(new Pairing(PathToExit[i].X+1, PathToExit[i].Y-1));
			}

			if (Map[PathToExit[i].Y + 1][PathToExit[i].X + 1].Equals(" ")) 
			{
				XY.Add(new Pairing(PathToExit[i].X+1, PathToExit[i].Y+1));
			}

			if (Map[PathToExit[i].Y + 1][PathToExit[i].X - 1].Equals(" "))
			{
				XY.Add(new Pairing(PathToExit[i].X-1, PathToExit[i].Y+1));
			}
		}

		if (XY.Count > 0)
		{
			for (int i = 0; i<TrapMax && XY.Count> 0; i++)
			{
				int index = rng.Next(0, XY.Count);
				Map[XY[index].Y][XY[index].X] = "t";
				TrapCount++;
				XY.RemoveAt(index);
			}
		}
	}

	/// <summary>
	/// Places the exit.
	/// HEURISTIC: The exit likes to be as far as possible from the Entrance
	/// </summary>
	public void PlaceExit()
	{
		exitIndex = rng.Next(PathToExit.Length - 6, PathToExit.Length - 1);
		SimPoint Exit = PathToExit[exitIndex];
		Map[Exit.Y][Exit.X] = "e";
		ExitPoint = new Pairing(Exit.X, Exit.Y);
	}

	/// <summary>
	/// Finds the path to exit.
	/// </summary>
	/// <returns>The path to exit.</returns>
	public int FindPathToExit()
	{
		string mapString = "";
		// get the full level string
		for (int i = 0; i<Map.Length; i++)
		{
			for (int j = 0; j<Map[i].Length; j++)
			{
				mapString += Map[i][j];
			}
			if (i != Map.Length - 1)
			{
				mapString += "\n";
			}
		}
		// make a simlevel out of this

		SimLevel level = new SimLevel(mapString);
		if (level == null)
		{
			return 0;
		}
		PathDatabase.GameType = 1;
		PathDatabase.BigDatabase = new List<Dictionary<string, SimPoint[]>>();
		PathDatabase.levels = new ArrayList();
		PathDatabase.Farthest = new Dictionary<SimLevel, Pair>();

		PathDatabase.BuildDB(level);

		PathToExit = PathDatabase.GetLongestPath(level);
		if (PathToExit == null)
		{
			return 1;
		}
		return 2;
	}
	/// <summary>
	/// Places the entrance.
	/// HEURISTIC: Any possible empty tile can be the Entrance.
	/// </summary>
	public void PlaceEntrance()
	{
		entranceIndex = rng.Next(0, 8);
		SimPoint Entrance = PathToExit[entranceIndex];
		Map[Entrance.Y][Entrance.X] = "H";
		EntrancePoint = new Pairing(Entrance.X, Entrance.Y);
	}
	/// <summary>
	/// Prints the map.
	/// </summary>
	public override void PrintMap()
	{
		for (int i = 0; i < Map.Length; i++)
		{
			for (int j = 0; j < Map[i].Length; j++)
			{
				Console.Write(Map[i][j]);
			}
			Console.WriteLine("");
		}
		Console.WriteLine("");
		Console.WriteLine("");	
	}
	/// <summary>
	/// Gets the map.
	/// </summary>
	/// <returns>The map.</returns>
	public override string[][] GetMap()
	{
		return Map;
	}

	/// <summary>
	/// Raycast the specified p1 and p2.
	/// </summary>
	/// <returns>The raycast.</returns>
	/// <param name="p1">P1.</param>
	/// <param name="p2">P2.</param>
	public Pairing[] RayTrace(Pairing p1, Pairing p2)
	{
		int x0 = p1.X;
		int y0 = p1.Y;
		int x1 = p2.X;
		int y1 = p2.Y;

		List<Pairing> trace = new List<Pairing>();

		int dx = Math.Abs(x1 - x0);
		int dy = Math.Abs(y1 - y0);
		int x = x0;
		int y = y0;
		int n = 1 + dx + dy;
		int x_inc = (x1 > x0) ? 1 : -1;
		int y_inc = (y1 > y0) ? 1 : -1;
		int error = dx - dy;
		dx *= 2;
		dy *= 2;

		for (int tiles = n; tiles > 0; tiles--) {
			trace.Add(new Pairing(x, y));
			if(error > 0){
				x += x_inc;
				error -= dy;
			} else {
				y += y_inc;
				error += dx;
			}
		}

		Pairing[] result = trace.ToArray();
		return result;
	}
	public bool LineOfSight(Pairing start, Pairing end)
	{
		bool result = true;
		Pairing[] rayTrace = RayTrace(start, end);
		for (int point = 0; point < rayTrace.Length; point++)
		{
			if (Map[rayTrace[point].Y][rayTrace[point].X].Equals("X"))
			{
				result = false;
				break;
			}
		}
		return result;
	}

	public int DistanceBetween(Pairing start, Pairing end)
	{
		Pairing[] rayTrace = RayTrace(start, end);
		return rayTrace.Length;
	}
}

